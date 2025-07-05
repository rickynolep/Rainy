import path from 'path';
import chokidar from 'chokidar';
import { Events } from 'discord.js';
import { reloadStatus } from '../function/config/status';
import { reloadConfig, getConfig } from '../function/config';
import { osuCheck } from '../function/config/osu';
import { reloadSlash } from '../function/config/slash';
import { AICheck } from '../function/config/aimode';

async function reloadOsu() {
    if (!process.env.OSU_CLIENT && getConfig().enableOsu === true || !process.env.OSU_SECRET && getConfig().enableOsu === true) {
            if (getConfig().compatibilityMode === true) {console.log(colorLog.yellow, "[W] osu! Client/Secret is marked as missing but compatibility mode is enabled!")} 
            else {await osuCheck()};   
    };
}

async function reload() {
    await AICheck();
    await reloadSlash();
    await reloadOsu();
    await reloadStatus();
}

async function watch() {
    const confPath = path.join(process.cwd(), 'config.yaml');
    chokidar.watch(confPath, {
        persistent: true,
        ignoreInitial: true
    }).on('change', async () => {
        try {
            await reloadConfig();
            await reload();
        } catch (err) {
            console.error('[E] Failed to reload configurations\n', err);
        }
    });
}

export default {
    name: Events.ClientReady,
    async execute(client: any) {
        await reload();
        await watch();
        console.log(colorLog.green, `[I] Connected as ${client.user!.tag}`);
    }
}