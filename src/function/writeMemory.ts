import path from 'path';
import { constants } from 'fs';
import { access, mkdir, readFile, writeFile } from 'fs/promises';
import convertMention from './tools/convertMention';

export default async function writeMemory(message: any, role: 'user' | 'model' ) {
    try {
        const messageContent = convertMention(message);
        const messageData = {
            role: role,
            parts: [
                {
                    text: messageContent
                }
            ]
        }

        const cachePath = path.join(process.cwd(), 'cache', 'servers', `${message.guildId}`);
        const historyFile = path.join(cachePath, 'chats.json');
        let existingData: any [] = [];

        try {
            await access(cachePath, constants.F_OK);
        } catch { 
            await mkdir(cachePath, { recursive: true });
            console.log('\x1b[2m%s\x1b[0m', '[I] Creating cache folder...');
        }

        try {
            const raw = await readFile(historyFile, 'utf-8');
            if (raw.trim().startsWith('[')) { 
                existingData = JSON.parse(raw);
            } else {
                console.warn(yellow('[W] File malformed or corrupted, starting fresh.'));
                existingData = [];
            }
        } catch (e) {
            if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
        }

        existingData.push(messageData);
        await writeFile(historyFile, JSON.stringify(existingData, null, 2), 'utf-8');
    } catch (e) {
        console.error('[E] Write Memory Failed', e);
    }
};