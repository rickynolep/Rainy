import { formatError, getModuleName, setWatchdog, watchdog } from '@/watchdog';
import { Events } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: any, client: any) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            await interaction.reply({ content: 'Command not found', ephemeral: true });
            return;
        }

        try {
            await command.execute(interaction);
            setWatchdog(getModuleName(__filename), true);
        } catch (error) {
            console.error('[E]', error);
            await interaction.reply({
                content: 'Error! Console has been logged',
                ephemeral: true,
            });
            setWatchdog(getModuleName(__filename), false, formatError(error));
            console.log(watchdog())
        }
    },
};
