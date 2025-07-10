import fs from 'fs';
import path from 'path';
import { ext, getFileMeta } from '../bootstrap.js';
import { getConfig, reloadConfig } from './config.js';
import { REST, Routes } from 'discord.js';
import { pathToFileURL } from 'url';
const { __dirname } = getFileMeta(import.meta);
export async function deploySlash() {
    await reloadConfig();
    const commands = [];
    const disabledFiles = [];
    const foldersPath = path.join(__dirname, '../commands');
    const commandsFolders = fs.readdirSync(foldersPath);
    for (const folder of commandsFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => (file.endsWith(`.${ext}`)) && !file.endsWith(`.${ext}.disabled`));
        for (const file of fs.readdirSync(commandsPath)) {
            if (file.endsWith(`.${ext}.disabled`)) {
                disabledFiles.push(file);
                continue;
            }
            if (!commandFiles.includes(file))
                continue;
            const filePath = path.join(commandsPath, file);
            const fileUrl = pathToFileURL(filePath).href;
            const rawCommand = await import(fileUrl);
            const command = rawCommand.default || rawCommand;
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            }
            else {
                console.warn(yellow(`[W] ${filePath} is missing data and(or) execute property`));
            }
        }
    }
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
    try {
        if (getConfig().verbose) {
            console.log(dim(`[I] Reloading application (/) commands...`));
        }
        ;
        const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        if (disabledFiles.length > 0) {
            const disabledNames = disabledFiles.map(f => f.replace(/\.(ts|js)\.disabled$/, '')).join(', ');
            if (getConfig().verbose) {
                console.log(dim(`[I] ${disabledFiles.length} command is disabled: ${disabledNames}`));
            }
            ;
        }
        if (getConfig().verbose) {
            console.log(dim(`[I] ${data.length} application (/) commands reloaded`));
        }
        ;
    }
    catch (e) {
        console.error('[E] Slash Command Deploy Failed');
        console.error(e);
    }
}
