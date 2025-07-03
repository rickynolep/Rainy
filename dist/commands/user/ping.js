import { SlashCommandBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Menguji kecepatan respon bot Rainy'),
    async execute(interaction) {
        console.log("pass");
        const latencyraw = Date.now() - interaction.createdTimestamp;
        const latency = (latencyraw / 1000).toFixed(1);
        console.log(`Latency Raw: ${latencyraw} ms`);
        console.log(`Latency: ${latency} seconds`);
        await interaction.reply(`Pong! Kecepatan respon bot saat ini ${latency} detik dengan Ping ${Math.round(interaction.client.ws.ping)} ms`);
    },
};
