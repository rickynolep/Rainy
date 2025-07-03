import { Events, Message } from 'discord.js';
import { handleChat } from '../function/chat.js';
import writeMemory from '../function/writeMemory.js';
import { getConfig } from '../function/config.js';

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        try {
            const { client } = message;
            if (!message.content || message.content.trim() === '') return;
            if (message.author.id === client.user?.id) return;

            await writeMemory(message, 'user');
            if (
            getConfig().alwaysRespond.includes(message.channel.id) && !message.content.trim().startsWith(getConfig().alwaysIgnoreSymbol) || 
            (message.mentions.has(message.author) && !message.mentions.everyone) ||
            message.mentions.users.has(client.user!.id)
            ) {
                handleChat(message);
            }
        } catch (error) {
            console.error('messageCreate handler:', error);
        }
    },
};