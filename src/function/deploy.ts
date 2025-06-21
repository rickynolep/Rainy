import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';
import type { APIApplicationCommand } from 'discord-api-types/v10';

export async function deploySlash() {
    const commands = [];
    const disabledFiles = [];
    const foldersPath = path.join(__dirname, '../commands');
    const commandsFolders = fs.readdirSync(foldersPath);

    for (const folder of commandsFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'))
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            if (fileContent.includes('@disabled')) {
                disabledFiles.push(file);
                continue;
            }
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
    (async () => {
        try {
            console.log(`\x1b[32mStarted refreshing ${commands.length} application (/) commands.\x1b[0m`);
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            ) as APIApplicationCommand[];
            if (disabledFiles.length > 0) {
                console.log(`\x1b[33m[I] Ignoring ${disabledFiles.length} disabled files.`);
            }
            console.log(`\x1b[32mSuccessfully reloaded ${data.length} application (/) commands.\x1b[0m`);
        } catch (error) {
            console.error(error);
        }
    })();
}

deploySlash();