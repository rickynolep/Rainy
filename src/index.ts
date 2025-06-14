import { Client, GatewayIntentBits, ActivityType, Collection } from 'discord.js';
import path from 'path';
import fs from 'fs';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ], 
    presence: {
        activities: [
            {
                name: 'Code Terminal',
                type: ActivityType.Streaming
            },
        ], status: 'idle'
    }
});

export {client};

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath).filter(f => fs.statSync(path.join(foldersPath, f)).isDirectory());
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(filePath).then(mod => mod.default || mod);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn('\x1b[33m%s\x1b[0m', `[W] ${filePath} is missing data and(or) execute property`);
        }
    }
}

const eventsPath = path.join(__dirname, 'modules');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
    const event = await import(filePath).then(mod => mod.default || mod);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
client.login(process.env.DISCORD_TOKEN);
client.once('ready', () => {
    console.log('\x1b[32m%s\x1b[0m', `[I] Connected as ${client.user!.tag}`)
    client.user?.setActivity({
        name: 'Code Terminal',
        type: ActivityType.Streaming,
        url: 'https://www.twitch.tv/lofigirl',
    });
});
