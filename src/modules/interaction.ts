import clickRace from '@/commands/admin/clickRace';
import { formatError, getModuleName, setWatchdog, watchdog } from '@/watchdog';
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
                setWatchdog(getModuleName(__filename), true);
            } catch (error) {
                console.error('[E]', error);
                await interaction.reply({
                    content: 'Error! Console has been logged',
                    ephemeral: true,
                });
                setWatchdog(getModuleName(__filename), false, formatError(error));
                console.log(watchdog());
            }
        }

        else if (interaction.isButton()) {
            if (interaction.customId === 'click') {
                const clickrace = client.commands.get('clickrace');
                if (clickrace && typeof clickRace.onClick === 'function') {
                    try {
                        await clickRace.onClick(interaction);
                    } catch (err) {
                        console.error(err);
                        await interaction.reply({
                            content: 'Gagal ngeclick. Ada error, coba lagi nanti!',
                            flags: MessageFlags.Ephemeral,
                        });
                    }
                } else {
                    await interaction.reply({
                        content: 'Tombol tidak valid atau perlombaan belum dimulai.',
                        flags: MessageFlags.Ephemeral,
                    });
                }
            }
        }
    },
};
