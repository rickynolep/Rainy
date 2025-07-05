import { Events, Message } from 'discord.js';
import { handleChat } from '../function/chat.js';
import { getConfig } from '../function/config.js';
import writeMemory from '../function/writeMemory.js';
const autoRespondCooldown: Record<string, number> = {};
let autoRespondList: Array<string>;
let autoRespondCatcher: string[];

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        try {
            const { client } = message;
            if (!message.content || message.content.trim() === '') return;
            if (message.author.id === client.user?.id) return;
            
            const msgLower = message.content.toLowerCase();
            const channelId = message.channel.id;
            await writeMemory(message, 'user');
            if(getConfig().autoRespond !== false) {
                autoRespondCatcher = msgLower.trim().split(/\s+/).slice(0, 2);
                autoRespondList = getConfig().autoRespond.map((w: string) => w.toLowerCase());
            }
            
            function decrementCooldown() {
                if (typeof autoRespondCooldown[channelId] !== 'undefined' && autoRespondCooldown[channelId] > 0 && !Number.isNaN(autoRespondCooldown[channelId])) {
                    autoRespondCooldown[channelId]--
                }
            }

            if (getConfig().autoRespond !== false && 
                autoRespondCatcher.some(word => autoRespondList.includes(word)) && 
                !message.content.trim().startsWith(getConfig().alwaysIgnoreSymbol)
            ) {
                decrementCooldown();
                if (
                    typeof autoRespondCooldown[channelId] == 'undefined' || 
                    Number.isNaN(autoRespondCooldown[channelId]) || 
                    autoRespondCooldown[channelId] < 1) {
                    handleChat(message);
                    autoRespondCooldown[channelId] = getConfig().autoRespondCooldown;
                }
            } else if (
                (getConfig().alwaysRespond !== false && getConfig().alwaysRespond.includes(channelId) && !message.content.trim().startsWith(getConfig().alwaysIgnoreSymbol)) ||
                (message.mentions.has(message.author) && !message.mentions.everyone) ||
                message.mentions.users.has(client.user!.id)
            ) {
                decrementCooldown();
                handleChat(message);
            } else {
                decrementCooldown();
            }
        } catch (error) {
            console.error('messageCreate handler:', error);
        }
    },
};