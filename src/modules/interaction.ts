import { Events, MessageFlags } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: any, client: any) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                await interaction.reply({
                    content: 'Command not found',
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('[E]', error);
                await interaction.reply({
                    content: 'Error! Console has been logged',
                    ephemeral: true,
                });
            }
        }
    },
};
