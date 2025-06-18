import { getModuleName, setWatchdog } from '@/watchdog';
import { access, mkdir, readFile, writeFile } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';

export default async function writeMemory(message: any, role: 'user' | 'model' ) {
    let messageContent: string = message.content;
    if (message.mentions.members && message.mentions.members.size > 0) {
        message.mentions.members.forEach((member: any) => {
            const mentionPattern = new RegExp(`<@!?${member.id}>`, 'g');
            messageContent = messageContent.replace(mentionPattern, `${member.displayName} (<@${member.id})`);
        });
    };

    let messageData: Object;
    const date = new Date(message.createdAt);
    const currentDate = date.toLocaleString('id-ID', {timeZone: 'Asia/Makassar'});
    if (role === 'user') {
        messageData = {
            role: role,
            parts: [
                {
                    text:
                    `Server ID: ${message.guildId}\n` +
                    `Server Name: ${message.guild?.name}\n` +
                    `Channel ID: ${message.channel.id}\n` +
                    `Channel Name: ${'name' in message.channel ? message.channel.name : 'Unknown'}\n` +
                    `Display Name: ${message.member?.displayName ?? 'Unknown'}\n` +
                    `Username: ${message.author.username}\n` +
                    `Date: ${currentDate} WITA\n` +
                    `Content: ${messageContent}`
                }
            ]
        }
    } else {
            messageData = {
            role: role,
            parts: [
                {
                    text: messageContent
                }
            ]
        }
    }

    const rootPath = path.resolve(__dirname, '..', '..', '..');
    const cachePath = path.join(rootPath, 'cache');
    const historyFile = path.join(cachePath, `${message.guildId}.json`);
    let existingData: any [] = [];

    try {
        await access(cachePath, constants.F_OK);
    } catch { 
        await mkdir(cachePath, { recursive: true });
        console.log('\x1b[2m%s\x1b[0m', '[I] Creating cache folder...');
    }

    try {
        const raw = await readFile(historyFile, 'utf-8');
        if (raw.trim().startsWith('[')) { existingData = JSON.parse(raw) }
        else {
            console.warn('\x1b[33m%s\x1b[0m', '[W] File malformed or corrupted, starting fresh.');
            existingData = [];
        }
    } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
    }

    existingData.push(messageData);
    await writeFile(historyFile, JSON.stringify(existingData, null, 2), 'utf-8');
    setWatchdog(getModuleName(__filename), true);
};