import fs, { access, constants, mkdir } from 'fs/promises';
import gemini from './gemini.js';
import { getConfig } from './config.js';
import writeMemory from './writeMemory.js';
import path from 'path';

export async function handleChat(message: any) {
    try {
        message.channel.sendTyping();
        let history: any;
        let subdata: SubData;
        if (message.channel.type === 1) {
            history = JSON.parse(await fs.readFile(`./cache/chats/${message.author.id}/chats.json`, 'utf8'));
            subdata = {
                type: "directChat",
            };
        } else {
            history = JSON.parse(await fs.readFile(`./cache/servers/${message.guildId}/chats.json`, 'utf8'));
            subdata = {
                type: "serverChat",
            };
        };
       
        if (Array.isArray(history)) {
            if (getConfig().contextLimit > 0) {
                history = history.slice(-getConfig().contextLimit);
            }
        }

        const result = await gemini(history, 'chat', subdata);
        const reply = await message.reply({ content: result, allowedMentions: { repliedUser: false } });
        await writeMemory(reply, 'model');
        /*
        if (currentChunk.trim() !== '') chunks.push(currentChunk);
        if (chunks.length > 0) {
            const reply = await message.reply({ content: chunks[0], allowedMentions: { repliedUser: false } });
            await writeMemory(reply, 'model');
            for (let i = 1; i < chunks.length; i++) {
                const reply = await message.channel.send({ content: chunks[i] });
                await writeMemory(reply, 'model');
            }
        } */
    } catch (error) {
        console.error('[E] Chat Handler Failed');
        console.log(error);
    }
}