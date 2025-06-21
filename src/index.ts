import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import dotenv from 'dotenv';
import type { Config } from './types/config.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { Client, GatewayIntentBits, Collection } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const colorlog = {
    dim: '\x1b[2m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m'
}

dotenv.config({ path: path.join(process.cwd(), '.env') }) 

try {
    const confPath = path.join(process.cwd(), 'config.yaml')
    const raw = fs.readFileSync(confPath, 'utf-8');
    globalThis.config = YAML.parse(raw) as Config;
    globalThis.colorLog = colorlog
} catch {
    console.error('Failed to load Config file (YAML), Is it missing?');
    process.exit();
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ],
}); 

export { client };
async function main() {
    client.commands = new Collection();
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath)
    .filter(f => fs.statSync(path.join(foldersPath, f)).isDirectory());

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = await import(pathToFileURL(filePath).href).then(mod => mod.default || mod);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.warn(colorLog.yellow, `[W] ${filePath} is missing data and/or execute`);
            }
        }
    }
    
    const eventsPath = path.join(__dirname, 'modules');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = await import(pathToFileURL(filePath).href).then(mod => mod.default || mod);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    if (process.env.DISCORD_TOKEN) {
        await client.login(process.env.DISCORD_TOKEN);
    } else {
        console.log('Environment Key(s) is missing (Discord Token) \nCreate new ".env" or import your env with these variable:\n', `  
        DISCORD_TOKEN = "Mxxxxxxxxxxxxxxxxxxx"  - [Your Discord Token]
        GEMINI_KEY = "AIxxxxxxxx"               - [Your Gemini Key]
        CLIENT_ID = "13xxxxxxxx"                - [Your Discord Client ID]
        OSU_CLIENT = "xxxxx"                    - [Your Osu Client ID] (optional)
        OSU_SECRET = "1xxxxxxxxxx"              - [Your Osu Secret] (optional)\n`
        ); return;
    }
}

main()