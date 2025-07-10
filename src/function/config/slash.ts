import fs from 'fs';
import path from 'path';
import { reloadOsu } from './osu.js';
import { ext, getFileMeta } from '../../bootstrap.js';
import { getConfig, reloadConfig } from '../config.js';
import { deploySlash } from "../deploy.js";

const { __dirname } = getFileMeta(import.meta);
let lastAdminDisabled: string[] = [];
let lastUserDisabled: string[] = [];
let firstCheck: boolean;

function setSlash(hierarchy: 'user' | 'admin', filepath: string, set: boolean) {
    const disablePath = `${path.resolve(__dirname, `../../commands/${hierarchy}/${filepath}.${ext}`)}.disabled`
    const enablePath = path.resolve(__dirname, `../../commands/${hierarchy}/${filepath}.${ext}`);

    if(fs.existsSync(enablePath) && set == true) {
    } else if (set == true) {
        fs.renameSync(disablePath, enablePath);
    } else if (fs.existsSync(disablePath) && set == false) {
    } else {
        fs.renameSync(enablePath, disablePath);
    }
}

function getDisabledCommands(commandsDir: string): string[] {
    const result: string[] = [];
    const folders = fs.readdirSync(commandsDir);
    for (const folder of folders) {
        const folderPath = path.join(commandsDir, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            if (file.endsWith('.disabled.ts') || file.endsWith(`.${ext}.disabled`)) {
                result.push(file.replace(/\.(ts|js)\.disabled$/, ''));
            }
        }
    }
    return result.sort();
}

export async function reloadSlash() {
    await reloadOsu();
    const adminCommand = path.resolve(__dirname, '../', '../', 'commands');
    const userCommand = path.resolve(__dirname, '../', '../', 'commands');
    const currentAdminDisabled = getDisabledCommands(adminCommand);
    const currentUserDisabled = getDisabledCommands(userCommand);
    
    if (getConfig().enableAfk === false) {setSlash("user", 's-afk', false)} else {setSlash("user", 's-afk', true)};
    // if (getConfig().enableCatbox === false) {setSlash("user", 's-catbox', false)} else {setSlash("user", 's-catbox', true)};
    if (getConfig().enableNeko === false) {setSlash("user", 's-neko', false)} else {setSlash("user", 's-neko', true)};
    if (getConfig().enableOsu === false) {setSlash("user", 's-osu', false)} else {setSlash("user", 's-osu', true)};
    if (getConfig().enablePing === false) {setSlash("user", 's-ping', false)} else {setSlash("user", 's-ping', true)};
    
    if (JSON.stringify(currentAdminDisabled) !== JSON.stringify(lastAdminDisabled) || 
    JSON.stringify(currentUserDisabled) !== JSON.stringify(lastUserDisabled) || typeof firstCheck! === 'undefined') {
        if (getConfig().verbose) {console.log(dim('[I] Checking application (/) commands...'))};
        lastAdminDisabled = currentAdminDisabled;
        lastUserDisabled = currentUserDisabled;
        await reloadConfig();
        await deploySlash();
        firstCheck = false
    }
}