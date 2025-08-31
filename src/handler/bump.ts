import { Events, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { getConfig } from '../function/config';
// import ai = from ai;
// const history = []
const countdown =  1000;
let lastUser: string
export default {
    name: Events.MessageCreate,
    async execute(message: any) {
        const config = getConfig()
        if (config.enableBump !== 'Static') {return}
        try {
            
            
            if (message.author.id === '302050872383242240' && message.embeds.length > 0 /*&& message.embeds[0].data.description.includes("Bump done!")*/ ) {
                await message.channel.sendTyping();
                /* message.content = `${message.interaction.user.globalName} Baru saja ngebump server ini, Ucapkan terima kasih (tanpa mention {member}) dan katakan bahwa kamu akan mengingatkan dia untuk ngebump 2 jam lagi, dan sarankan dia untuk vote di Discadia juga`
                message.displayName = `SYSRAINPROTOCOL`
                const airemember = await ai (message, history); */

                /* const discadia = new ButtonBuilder()
                    .setLabel('Discadia')
                    .setURL('https://discadia.com/vote/rikomunity')
                    .setStyle(ButtonStyle.Link);
                const row = new ActionRowBuilder()
                    .addComponents(discadia);*/
                
                lastUser = message.interaction.user.id
                const reminderMsg = config.bumpReminderMsg.replace('${user}', `<@${lastUser}>`);
                const triggeredMsg = config.bumpTriggeredMsg.replace('${user}', `<@${lastUser}>`);
                await message.channel.send({ content: triggeredMsg, /*components: [row]*/});

                setTimeout(async () => {
                    await message.channel.sendTyping();
                    /* message.content = `(SYSRAINPROTOCOL) 2 jam sudah berlalu, ingatkan ${message.interaction.user.globalName} untuk ngebump server ini lagi! Gunakan {member} untuk memanggilnya`
                    let airemind = await ai(message, history);
                    airemind = airemind.replace(`{member}`, `<@${message.interaction.user.id}>`); */
                    await message.channel.send(reminderMsg);
                }, countdown);
            }
        } catch (err) {
            console.error('[E] Bump:', err)
        }
    },
};