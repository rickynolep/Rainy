import path from 'path';
import chokidar from 'chokidar';
import { Events } from 'discord.js';
import { reloadConfig } from '../function/config.js';
import { newStatus } from '../function/config/status.js';
async function watch() {
    const confPath = path.join(process.cwd(), 'config.yaml');
    chokidar.watch(confPath, {
        persistent: true,
        ignoreInitial: true
    }).on('change', async () => {
        try {
            await reloadConfig();
            await newStatus();
        }
        catch (err) {
            console.error('[E] Failed to reload configurations\n', err);
        }
    });
}
export default {
    name: Events.ClientReady,
    async execute(client) {
        await reloadConfig();
        await newStatus();
        await watch();
        console.log(green(`[I] Connected as ${client.user.tag}`));
    }
};
