require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { generationConfig, safetySettings, ChannelId, systemInstruction } = require('./config');
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], 
    presence: { 
        activities: [{ name: "You (ㅇㅅㅇ❀)", type: ActivityType.Listening }], 
        status: 'idle' 
    }
}); 

let history = []; let reply;
const genAI = new GoogleGenerativeAI(process.env.APIKEY);
client.once('ready', () => { console.log("\x1b[33m%s\x1b[0m", `Logged in sebagai ${client.user.tag}, Menunggu Prompt @Rainy...`) });
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (ChannelId.includes(message.channel.id) || message.mentions.has(client.user) && !message.mentions.everyone) {
        channelId = message.channel.id;
        try {
            await message.channel.sendTyping();
            let prompt = `${message.member.displayName}: ${message.content}`;
            message.mentions.members.forEach(member => {
                const mentionPattern = new RegExp(`<@!?${member.id}>`, 'g');
                prompt = prompt.replace(mentionPattern, `@${member.displayName}`);
            });

            try {
                let reference = await message.fetchReference();
                prompt = `(Membalas pesan ${reference.author.username}: ${reference.content}) ${message.member.displayName}: ${prompt}`;
            } catch (error) {
                if (error.message.includes('MessageReferenceMissing')) {
                    prompt = `(Membalas pesan: ${reference.content}) ${message.member.displayName}: ${prompt}`;
                }
            }
            console.log(`\x1b[32m[P]\x1b[0m ${prompt}`);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: systemInstruction,
            });
            const chatSession = model.startChat({
                generationConfig,
                safetySettings,
                history
            });
            const result = await chatSession.sendMessage(prompt);
            console.log(`\x1b[32m[R]\x1b[0m ${result.response.text().trim()}`);
            history.push({ role: "user", parts: [{ text: prompt }] });
            reply = await message.reply({ content: result.response.text().trim(), allowedMentions: { repliedUser: false }});
            history.push({ role: "model", parts: [{ text: result.response.text().trim() }] });
        } catch (error) {
            message.react('❌');
            if (error.message.includes('blocked due to SAFETY')) {
                await message.reply('Filtered');
            } else if (error.message.includes('Bad Request') || error.message.includes('blocked due to Other')) {
                await message.reply('Jawaban untuk respon ini tidak tersedia, coba lagi nanti');
                console.error('Error:', error);
            } else {
                await message.reply('Duh, ada masalah pada sistemku coba aku panggil <@814386183169769512>');
                console.error('Error:', error);
            }
        }
    }
});

client.login(process.env.DSCTOKEN);
