import fs from 'fs/promises';
import gemini from './gemini.js';
import writeMemory from './writeMemory.js';

export async function handleChat(message: any) {
  try {
    message.channel.sendTyping();
    const rawHistory = await fs.readFile(`./cache/${message.guildId}.json`, 'utf8');
    const history = JSON.parse(rawHistory);
    const result = await gemini(history, 'chat');
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
    console.log(error);
  }
}