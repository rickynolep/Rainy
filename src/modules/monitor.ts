import { Events, Message } from 'discord.js';
import { handleChat } from '../function/chat.js';
import writeMemory from '../function/writeMemory.js';

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        try {
            const { client } = message;
            if (!message.content || message.content.trim() === '') return;
            if (message.author.id === client.user?.id) return;

            await writeMemory(message, 'user');
            if (message.mentions.users.has(client.user!.id)) {
                handleChat(message);
            }
        } catch (error) {
            console.error('messageCreate handler:', error);
        }
    },
};