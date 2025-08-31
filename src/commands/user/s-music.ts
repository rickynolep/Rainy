import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getAverageColor } from 'fast-average-color-node';


export default { 
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Commands related to music')
        .addSubcommand(subcommand =>
        subcommand
            .setName('recommendations')
            .setDescription('Recommend you a random song from other user recommendations')
    ),
	async execute(interaction: ChatInputCommandInteraction) {
        const dev = Math.floor((Date.now() - new Date("2024-03-01T00:00:00+08:00").getTime()) / 86400000)
        
        const color: any = (await getAverageColor(interaction.client.user.displayAvatarURL())).hex
        const embed = new EmbedBuilder()
            .setTitle(`Fitur ini masih BETA dan saat ini exclusive untuk Rikomunity`)
            .setImage('https://files.catbox.moe/ohda9b.jpg')
            .setFooter({ text: `${dev} hari perkembangan dan terus berlanjut!`, iconURL: `https://files.catbox.moe/n9h30p.png`})
            .setColor(color)

        await interaction.reply({ embeds: [embed] }); 
	}
};