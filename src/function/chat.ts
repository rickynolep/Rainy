import { formatError, getModuleName, setWatchdog } from '@/watchdog';
import gemini from './gemini';
import fs from 'fs/promises';
import writeMemory from './writeMemory';

export async function handleChat(message: any) {
  try {
    const rawHistory = await fs.readFile(`./cache/${message.guildId}.json`, 'utf8');
    const history = JSON.parse(rawHistory);
    const result = await gemini(history, 'chat');
    const maxLength = 2000;

    const cleanResult = result
        .replace(/\r/g, '\n')
        .replace(/\u2028|\u2029/g, '\n')
        .replace(/\u200b/g, '')
        .replace(/\n{2,}/g, '\n\n');

    const sentences = cleanResult.split(/(?<=[.!?])\s+|\n+/g);
    let currentChunk = '';
    const chunks = [];

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxLength) {
                chunks.push(currentChunk);
                currentChunk = sentence;
        } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
    }

    if (currentChunk.trim() !== '') chunks.push(currentChunk);
    if (chunks.length > 0) {
        const reply = await message.reply({ content: chunks[0], allowedMentions: { repliedUser: false } });
        await writeMemory(reply, 'model');
        for (let i = 1; i < chunks.length; i++) {
            const reply = await message.channel.send({ content: chunks[i] });
            await writeMemory(reply, 'model');
        }
    }

    setWatchdog(getModuleName(__filename), true);
  } catch (error) {
    setWatchdog(getModuleName(__filename), false, formatError(error));
  }
}