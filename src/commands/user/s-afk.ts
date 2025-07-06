import { SlashCommandBuilder } from 'discord.js';

export default { 
	data: new SlashCommandBuilder()
		.setName('afk')
		.setDescription('Set your afk that will remind anyone that try to notify you'),
	async execute(interaction: any) {
        await interaction.reply(`Tunggu update berikutnya ya!!`); 
	},
};
