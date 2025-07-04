import fs from 'fs';
import path from 'path';
import { deploySlash } from "../deploy.js";
import { getConfig } from '../config.js';
let lastAdminDisabled: string[] = [];
let lastUserDisabled: string[] = [];
let firstCheck: boolean;

function setSlash(hierarchy: 'user' | 'admin', filepath: string, set: boolean) {
    const disablePath = `${path.resolve(__dirname, `../../commands/${hierarchy}/${filepath}.ts`)}.disabled`
    const enablePath = path.resolve(__dirname, `../../commands/${hierarchy}/${filepath}.ts`);

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
            if (file.endsWith('.disabled.ts') || file.endsWith('.disabled.js')) {
                result.push(file.replace(/\.(ts|js)\.disabled$/, ''));
            }
        }
    }
    return result.sort();
}

export async function refreshSlash() {
    if (getConfig().verbose) {console.log(colorLog.dim, '[I] Checking slash...')};
    const adminCommand = path.join(process.cwd(), 'src', 'commands');
    const userCommand = path.join(process.cwd(), 'src', 'commands');
    const currentAdminDisabled = getDisabledCommands(adminCommand);
    const currentUserDisabled = getDisabledCommands(userCommand);

    if (getConfig().enablePing === false) {setSlash("user", 's-ping', false)} else {setSlash("user", 's-ping', true)};
    if (getConfig().enableOsu === false) {setSlash("user", 's-osu', false)} else {setSlash("user", 's-osu', true)};
    if (getConfig().enableAfk === false) {setSlash("user", 's-afk', false)} else {setSlash("user", 's-afk', true)};

    if (JSON.stringify(currentAdminDisabled) !== JSON.stringify(lastAdminDisabled) || 
    JSON.stringify(currentUserDisabled) !== JSON.stringify(lastUserDisabled) || typeof firstCheck! === 'undefined') {
        lastAdminDisabled = currentAdminDisabled;
        lastUserDisabled = currentUserDisabled;
        await deploySlash();
        firstCheck = false
    }
}