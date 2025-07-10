import { Events } from 'discord.js';
import { handleChat } from '../function/chat.js';
import { getConfig } from '../function/config.js';
import writeMemory from '../function/writeMemory.js';
import { access, constants, readFile } from 'fs/promises';
import path from 'path';
import gemini from '../function/gemini.js';
import timeConvert from '../function/tools/convertTime.js';
const autoRespondCooldown = {};
let autoRespondList;
let autoRespondCatcher;
export default {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            // Pre handler
            const date = new Date(message.createdAt);
            const currentDate = date.toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });
            const messageContent = (`Server ID: ${message.guildId}\n` +
                `Server Name: ${message.guild?.name}\n` +
                `Channel ID: ${message.channel.id}\n` +
                `Channel Name: ${'name' in message.channel ? message.channel.name : 'Unknown'}\n` +
                `Display Name: ${message.member?.displayName ?? 'Unknown'}\n` +
                `Username: ${message.author.username}\n` +
                `Date: ${currentDate} WITA\n` +
                `Content: ${message.content}`);
            const { client } = message;
            const config = getConfig();
            const msgLower = message.content.toLowerCase();
            const channelId = message.channel.id;
            const shouldIgnore = message.content.trim().startsWith(config.alwaysIgnoreSymbol);
            if (!message.content || message.content.trim() === '')
                return;
            if (message.author.id === client.user?.id)
                return;
            let editMessage = message;
            editMessage.content = messageContent;
            await writeMemory(editMessage, 'user');
            // Auto Respond handler
            if (config.autoRespond !== false) {
                const autoRespond = Array.isArray(config.autoRespond) ? config.autoRespond : [];
                ;
                autoRespondCatcher = msgLower.trim().split(/\s+/).slice(0, 2);
                autoRespondList = autoRespond.map((w) => w.toLowerCase());
                if (autoRespondCatcher.some(word => autoRespondList.includes(word)) && !shouldIgnore) {
                    if (typeof autoRespondCooldown[channelId] == 'undefined' || autoRespondCooldown[channelId] < 1) {
                        handleChat(editMessage);
                        autoRespondCooldown[channelId] = config.autoRespondCooldown + 1;
                    }
                }
                if (autoRespondCooldown[channelId] > 0)
                    autoRespondCooldown[channelId]--;
            }
            // AI Conversation handler
            const isMentionedDirectly = message.mentions.users.has(client.user.id);
            const isRolePing = message.mentions.roles.size > 0 || message.mentions.everyone;
            const isAlwaysRespond = Array.isArray(config.alwaysRespond) && config.alwaysRespond.includes(channelId);
            if (isAlwaysRespond && !shouldIgnore || isMentionedDirectly && !isRolePing) {
                handleChat(editMessage);
                return;
            }
            // AFK Handler (Welcome back)
            let afkData;
            try {
                const cachePath = path.join(process.cwd(), 'cache', 'servers', `${message.guildId}`);
                await access(cachePath, constants.F_OK);
                const afkFile = path.join(cachePath, 'afk.json');
                afkData = JSON.parse(await readFile(afkFile, 'utf-8'));
            }
            catch {
                return;
            }
            ;
            let response;
            if (afkData[message.id] === message.member.id) {
                const afkTime = timeConvert(afkData[message.member.id].afkDate, 'date');
                if (config.slashAI === true) {
                    response = await gemini(date, 'afk', afkTime);
                }
                else {
                    response = `Selamat datang kembali, ${message.member?.displayName}`;
                }
                const reply = await message.reply({ content: response, allowedMentions: { repliedUser: false } });
                await writeMemory(reply, 'model');
            }
        }
        catch (error) {
            console.error('[E] Error on message.ts: ', error);
        }
    },
};
