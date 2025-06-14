import {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ChatInputCommandInteraction,
    InteractionContextType,
    EmbedBuilder
} from 'discord.js';

const clickData: {
    [messageId: string]: {
        claimed: { userId: string; time: number }[];
        startTime: number;
        timeout: NodeJS.Timeout;
    };
} = {};

export default {
    data: new SlashCommandBuilder()
        .setName('clickrace')
        .setDescription('Start click racing!')
        .setContexts(InteractionContextType.Guild),

    async execute(interaction: ChatInputCommandInteraction) {
        const button = new ButtonBuilder()
            .setCustomId('click')
            .setLabel('Click!')
            .setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
        const msg = await interaction.reply({
            content: `0 player memasuki perlombaan...\n`,
            components: [row]
        });
        const startTime = Date.now();
        clickData[msg.id] = { claimed: [], startTime, timeout: null! };
        clickData[msg.id].timeout = setTimeout(async () => {
            const data = clickData[msg.id];
            data.claimed.sort((a, b) => a.time - b.time);
            const leaderboard = data.claimed
                .map((entry, i) => {
                    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
                    return `${medal} <@${entry.userId}> (${entry.time.toFixed(3)} detik)`;
                })
                .join('\n') || 'Ga ada yang ngeclick 😢';

            const winner = data.claimed[0]?.userId ? `<@${data.claimed[0].userId}>` : 'Tidak ada';
            const embed = new EmbedBuilder()
                .setTitle('🎉 Lomba Selesai!')
                .setDescription(`Pemenangnya adalah: ${winner}!\n\n**Leaderboard:**\n${leaderboard}`)
                .setColor('Green');
            await interaction.editReply({ embeds: [embed] });
            delete clickData[msg.id];
        }, 10000);
    },

    onClick(interaction: any) {
        const msgId = interaction.message.id;
        const data = clickData[msgId];
        if (!data) {
            return interaction.reply({ content: 'Lomba sudah selesai atau tidak valid.', ephemeral: true });
        }
        const existing = data.claimed.find(c => c.userId === interaction.user.id);
        if (existing) {
            return interaction.reply({ content: 'Ih curang, kamu udah ngeclaim tau!', ephemeral: true });
        }
        const claimTime = (Date.now() - data.startTime) / 1000;
        data.claimed.push({ userId: interaction.user.id, time: claimTime });
        interaction.reply({ content: `Kamu mencoba berpartisipasi lomba! (waktu: ${claimTime.toFixed(3)} detik)`, ephemeral: true });
        const count = data.claimed.length;
        interaction.message.edit({ content: `${count} player memasuki perlombaan...` });
    }
};
