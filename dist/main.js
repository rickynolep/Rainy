import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { ext, getFileMeta } from './bootstrap.js';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ],
});
const { __dirname } = getFileMeta(import.meta);
export { client };
export async function main() {
    try {
        client.commands = new Collection();
        const foldersPath = path.join(__dirname, 'commands');
        const commandFolders = fs.readdirSync(foldersPath)
            .filter(f => fs.statSync(path.join(foldersPath, f)).isDirectory());
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(`.${ext}`));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = await import(pathToFileURL(filePath).href).then(mod => mod.default || mod);
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                }
                else {
                    console.warn(yellow(`[W] ${filePath} is missing data and/or execute`));
                }
                ;
            }
            ;
        }
        ;
        const eventsPath = path.join(__dirname, 'handler');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(`.${ext}`));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = await import(pathToFileURL(filePath).href).then(mod => mod.default || mod);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            }
            else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
        ;
        await client.login(process.env.DISCORD_TOKEN);
    }
    catch (e) {
        console.error(`error occured: ${e}`);
    }
    ;
}
;
