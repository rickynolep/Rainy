import path from 'path';
import { constants } from 'fs';
import { Events, Message } from 'discord.js';
import { access, mkdir, readFile, writeFile } from 'fs/promises';
import { handleChat } from './chat';
import { formatError, getModuleName, setWatchdog } from '@/watchdog';

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        try {
            const { client } = message;
            if (!message.content || message.content.trim() === '') return;
            if (message.author.id === client.user?.id) return;

            let messageContent: string = message.content;
            if (message.mentions.members && message.mentions.members.size > 0) {
                message.mentions.members.forEach((member) => {
                const mentionPattern = new RegExp(`<@!?${member.id}>`, 'g');
                messageContent = messageContent.replace(mentionPattern, `@${member.displayName} (<@${member.id}>)`);
                });
            }

            const date = new Date(message.createdAt);
            const currentDate = date.toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });

            const messageData = {
                role: 'user',
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
                    },
                ],
            };

            console.log(messageData);

            if (message.mentions.users.has(client.user!.id)) {
                handleChat(messageData);
            }

            const rootPath = path.resolve(__dirname, '..', '..');
            const cachePath = path.join(rootPath, 'cache');
            const historyFile = path.join(cachePath, `${message.guildId}.json`);

            try {
                await access(cachePath, constants.F_OK);
            } catch {
                await mkdir(cachePath, { recursive: true });
                console.log('\x1b[2m%s\x1b[0m', '[I] Creating cache folder...');
            }
            let existingData: any [] = [];
            try {
                const raw = await readFile(historyFile, 'utf-8');
                if (raw.trim().startsWith('[')) {
                    existingData = JSON.parse(raw);
                } else {
                    console.warn("\x1b[33m%s\x1b[0m", '[W] File malformed or corrupted, starting fresh.');
                    existingData = [];
                }
            } catch (e) {
                if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
            }

            existingData.push(messageData);
            await writeFile(historyFile, JSON.stringify(existingData, null, 2), 'utf-8');
            setWatchdog(getModuleName(__filename), true);
        } catch (error) {
            console.error('messageCreate handler:', error);
            setWatchdog(getModuleName(__filename), false, formatError(error));
        }
    },
};