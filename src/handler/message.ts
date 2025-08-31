import { Events, Message, time, TimestampStyles } from 'discord.js';
import { handleChat } from '../function/chat.js';
import { getConfig } from '../function/config.js';
import writeMemory from '../function/writeMemory.js';
import { access, constants, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { randomInt } from 'crypto';

const autoRespondCooldown: Record<string, number> = {};
let autoRespondList: Array<string>;
let autoRespondCatcher: string[];

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        try {  
            // Direct Pre Handler
            const config = getConfig();
            const date = new Date(message.createdAt);
            const currentDate = date.toLocaleString('id-ID', {timeZone: 'Asia/Makassar'});
            if (message.author.id === message.client.user?.id) return;
            if (!message.content || message.content.trim() === '') return;

            // Direct Handler
            if (message.channel.type === 1) {
                const messageContent = (
                    `Channel Name: Direct Message\n` +
                    `Display Name: ${message.member?.displayName ?? 'Unknown'}\n` +
                    `Username: ${message.author.username}\n` +
                    `User ID: ${message.author.id}` +
                    `Date: ${currentDate} WITA\n` +
                    `Content: ${message.content}`
                );
                
                message.content = messageContent
                await writeMemory(message, 'user');
                handleChat(message);
                return;
            }

            // Server Pre handler
            let afkData: any;
            const channelId = message.channel.id;
            const shouldIgnore = message.content.trim().startsWith(config.alwaysIgnoreSymbol);
            const messageContent = (
                `Server ID: ${message.guildId}\n` +
                `Server Name: ${message.guild?.name}\n` +
                `Channel ID: ${channelId}\n` +
                `Channel Name: ${'name' in message.channel ? message.channel.name : 'Unknown'}\n` +
                `Display Name: ${message.member?.displayName ?? 'Unknown'}\n` +
                `Username: ${message.author.username}\n` +
                `Date: ${currentDate} WITA\n` +
                `Content: ${message.content}`
            );
            
            message.content = messageContent
            await writeMemory(message, 'user');
            let afkFile: any;
            try {
                const cachePath = path.join(process.cwd(), 'cache', 'servers', `${message.guildId}`);
                await access(cachePath, constants.F_OK);
                afkFile = path.join(cachePath, 'afk.json');
                afkData = JSON.parse(await readFile(afkFile, 'utf-8'));
            } catch { afkData === null };

            // AFK Handler
            if (typeof afkData === 'object') {
                let answer: any;
                const mentioned = [...message.mentions.members!.keys()];
                const afkMentions = mentioned.filter(id => afkData.hasOwnProperty(id));

                // Welcome Back Handler
                if (afkData[message.member!.id]) {
                    if (randomInt(100) === 69) answer = `Okaerinasai, ${message.member?.displayName}-san! Gohan ni suru? Ofuro ni suru? Soretomo...`
                    else answer = `Selamat datang kembali, ${message.member?.displayName}!`;
                    const reply = await message.reply({ content: answer, allowedMentions: { repliedUser: false } });
                    await writeMemory(reply, 'model');
                    delete afkData[message.member!.id];
                    await writeFile(afkFile, JSON.stringify(afkData, null, 2), 'utf-8');
                }

                // Mentioned Handler (Single)
                if (afkMentions.length == 1) {
                    const afkState = afkData[afkMentions[0]]
                    const date = new Date(afkState.afkDate)
                    const timeString = time(date);
                    const relative = time(date, TimestampStyles.RelativeTime);
                    const mentionedUser = message.client.users.cache.get(afkMentions[0]);

                    if (afkState.afkReason === null) {
                        message.reply(`AFK: ${relative} (${timeString})`)
                    } else {
                        message.reply(`${afkState.afkReason}\n-# ~ ${mentionedUser?.displayName}`)
                    }
                }

                // Mentioned Handler (Multiple)
                else if (afkMentions.length > 1) {
                    let reply: string;
                    afkMentions.forEach(user => {
                        const afkState = afkData[user]
                        const date = new Date(afkState.afkDate)
                        const timeString = time(date);
                        const relative = time(date, TimestampStyles.RelativeTime);
                        const mentionedUser = message.client.users.cache.get(user);

                        if (reply) { reply = `${reply}\n${mentionedUser?.displayName} AFK: ${relative} (${timeString})`}
                        else {reply = `${mentionedUser?.displayName} AFK: ${relative} (${timeString})`}
                    });
                    message.reply(reply!);
                }
            }

            // Auto Respond handler
            if (config.autoRespond !== false) {
                const autoRespond: string[] = Array.isArray(config.autoRespond) ? config.autoRespond : [];;
                autoRespondCatcher = message.content.toLowerCase().trim().split(/\s+/).slice(0, 2);
                autoRespondList = autoRespond.map((w: string) => w.toLowerCase());

                if (autoRespondCatcher.some(word => autoRespondList.includes(word)) && !shouldIgnore) {
                    if (typeof autoRespondCooldown[channelId] == 'undefined' || autoRespondCooldown[channelId] < 1) {
                        handleChat(message);
                        autoRespondCooldown[channelId] = config.autoRespondCooldown
                        return;
                    }
                }

                if (autoRespondCooldown[channelId] > 0) autoRespondCooldown[channelId]--;
            }
            
            // AI Conversation handler
            const isMentionedDirectly = message.mentions.users.has(message.client.user.id);
            const isRolePing = message.mentions.roles.size > 0 || message.mentions.everyone;
            const isAlwaysRespond = Array.isArray(config.alwaysRespond) && config.alwaysRespond.includes(channelId)

            if (isAlwaysRespond && !shouldIgnore || isMentionedDirectly && !isRolePing) {
                handleChat(message);
                return;
            }
        } catch (error) {
            console.error('[E] Error on message.ts: ', error);
        }
    },
}; 