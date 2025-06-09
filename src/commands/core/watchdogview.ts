import { watchdog } from '@/watchdog';
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import capitalize from '@/function/markup'

export default {
  data: new SlashCommandBuilder()
    .setName('watchdog')
    .setDescription('Show current module status'),

  async execute(interaction: CommandInteraction) {
    try {
        const watchData = watchdog();
        const displayedWatchdog: string[] = [];
        const allModules = ['watchdog', 'monitor', 'interaction', 'readline']; // <-- nama modul yang ingin ditampilkan urut

        allModules.forEach((moduleName) => {
        const status = watchData[moduleName];

        if (!status) {
            displayedWatchdog.push(`${capitalize(moduleName)} - No Data`);
        } else if (status.ok) {
            displayedWatchdog.push(`${capitalize(moduleName)} - ✅ Online`);
        } else {
            displayedWatchdog.push(`${capitalize(moduleName)} - ❌ ERROR\n\`\`\`${status.error}\`\`\``);
        }
        });

        const resultText = displayedWatchdog.length > 0 ? displayedWatchdog.join('\n') : '`NO DATA`';
        const embed = new EmbedBuilder()
            .setTitle('🧿 Watchdog // Information')
            .setDescription(resultText)
            .setFooter({ text: 'Running Rainy v2.25.6.08' });

        await interaction.reply({ embeds: [embed] });

        } catch (error) {
        console.error('[E]', error);
        await interaction.reply({
            content: `<a:KyaruSparkle:1378876790847836242> Error Catched! Test Passed with error:\n\`\`\`${String(error)}\`\`\``
        });
    }
  },
};
