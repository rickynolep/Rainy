import { Events, Message } from 'discord.js';
import { handleChat } from '../function/core/chat';
import { formatError, getModuleName, setWatchdog } from '../watchdog';
import writeMemory from '../function/core/writeMemory';

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

            setWatchdog(getModuleName(__filename), true);
        } catch (error) {
            console.error('messageCreate handler:', error);
            setWatchdog(getModuleName(__filename), false, formatError(error));
        }
    },
};