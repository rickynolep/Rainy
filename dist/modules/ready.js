import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Events } from 'discord.js';
import { refreshStatus } from '../function/config/status';
let confPath, lastHash;
function getHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}
function refresh() {
    try {
        confPath = path.join(process.cwd(), 'config.yaml');
        const raw = fs.readFileSync(confPath, 'utf8');
        const hashed = getHash(raw);
        if (hashed === lastHash)
            return;
        refreshStatus();
        lastHash = hashed;
    }
    catch (err) {
        console.error('[E] Failed to refresh status\n', err);
    }
}
export default {
    name: Events.ClientReady,
    async execute(client) {
        refresh();
        fs.watchFile(confPath, (curr, prev) => {
            if (curr.mtime !== prev.mtime) {
                refresh();
            }
        });
        console.log(colorLog.green, `[I] Connected as ${client.user.tag}`);
    }
};
