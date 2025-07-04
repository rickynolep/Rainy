import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';
import type { APIApplicationCommand } from 'discord-api-types/v10';
import { getConfig } from './config';

export async function deploySlash() {
    const commands = [];
    const disabledFiles = [];
    const foldersPath = path.join(__dirname, '../commands');
    const commandsFolders = fs.readdirSync(foldersPath);

    for (const folder of commandsFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file =>
            (file.endsWith('.ts') || file.endsWith('.js'))
            && !file.endsWith('.ts.disabled') && !file.endsWith('.js.disabled')
        );
        for (const file of fs.readdirSync(commandsPath)) {
            if (file.endsWith('.ts.disabled') || file.endsWith('.js.disabled')) {
                disabledFiles.push(file);
                continue;
            }
            if (!commandFiles.includes(file)) continue;
            const filePath = path.join(commandsPath, file);
            const rawCommand = await import(filePath);
            const command = rawCommand.default || rawCommand;
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON())
            } else {
                console.warn(colorLog.yellow, `[W] ${filePath} is missing data and(or) execute property`);
            }
        }
    }

    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
    try {
        if (getConfig().verbose) {console.log(colorLog.dim, `[I] Refreshing ${commands.length} application (/) commands...`)};
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        ) as APIApplicationCommand[];
        if (disabledFiles.length > 0) {
            const disabledNames = disabledFiles.map(f => f.replace(/\.(ts|js)\.disabled$/, '')).join(', ');
            if (getConfig().verbose) {console.log(colorLog.dim, `[I] ${disabledFiles.length} command is disabled: ${disabledNames}`)};
        }
        if (getConfig().verbose) {console.log(colorLog.dim, `[I] Reloaded ${data.length} application (/) commands`)};
    } catch (e) {
        console.error('[E] Slash Command Deploy Failed');
        console.error(e);
    }
}