import { Events, ActivityType } from 'discord.js';
export default {
    name: Events.ClientReady,
    async execute(client) {
        console.log('\x1b[32m%s\x1b[0m', `[I] Connected as ${client.user.tag}`);
        if (config.status === false) {
            return;
        }
        client.user?.setActivity({
            name: config.statusName,
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/lofigirl',
        });
    }
};
