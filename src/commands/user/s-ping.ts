import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import convertTime from '../../function/tools/convertTime.js';
import medianColor from '../../function/tools/medianColor.js';

export default { 
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Fetch bot latency and other status'),
	async execute(interaction: ChatInputCommandInteraction) {
        const { performance } = require('perf_hooks');
        const start = performance.now();
        await interaction.deferReply();
        const end = performance.now();
        const latency = (end - start).toFixed(0);
        const uptime: number = Math.floor(process.uptime());
        const dev = Math.floor((Date.now() - new Date("2024-03-01T00:00:00+08:00").getTime()) / 86400000)
        const reply = (
            `Kecepatan respon bot saat ini: ${latency} ms\n` +
            `Bot berjalan selama: ${convertTime(uptime, 'time')}\n`
        );
        const color: any = await medianColor(interaction.client.user.displayAvatarURL(), 'hex')
        const embed = new EmbedBuilder()
            .setTitle(`Pong!`)
            .setDescription(reply)
            .setImage('https://files.catbox.moe/ohda9b.jpg')
            .setFooter({ text: `${dev} hari perkembangan dan terus berlanjut!`, iconURL: `https://files.catbox.moe/n9h30p.png`})
            .setColor(color)

        await interaction.editReply({ embeds: [embed] }); 
	}
};