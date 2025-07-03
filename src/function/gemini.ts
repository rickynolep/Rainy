import fs from 'fs';
import { GoogleGenAI } from '@google/genai'
import { GeminiConfig } from '../types/config.js';
import { getConfig } from './config.js';
let chatModel = getConfig().chatModel

export default async function gemini(data: Object, type: string, tries = 1): Promise<string> {
    try {
        let result: string = '';
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        const model = chatModel;
        const contents = data;
        let config: GeminiConfig = { responseMimeType: 'text/plain', systemInstruction: [{ text: `` }]};
        const personality = fs.readFileSync('./personality.txt', 'utf8');
        if (type === 'define') {
            config.systemInstruction = [
                {
                    text: `You are a girl in a Discord server, your name is Rainy. Define whether you should use Google Search or not. Your answer should be like this:
                    Kamu adalah seorang cewe di Discord server, namamu Rainy. Tentukan apakah kamu harus make Google Search ato engga. Jawabanmu harusnya kaya gini: 

                    Search: Yes / No
                    Language: English / Indonesia,`
                }
            ];
        } else if (type === 'chat') {
            config.thinkingConfig = { thinkingBudget: 0 };
            config.systemInstruction = [{ text: personality }];
        } else {
            config.systemInstruction = [{ text: 'Throw UNKNOWN Response'}];
            console.log('unknown type function!' + type);
        }

        const response = await ai.models.generateContentStream({ model, config, contents });
        for await (const chunk of response) { if (chunk.text) { result += chunk.text } }
        return result;
    } catch (e) { 
        console.error('[E] Gemini Failed');
        if (typeof e === 'object' && e !== null && 'message' in e && typeof (e as any).message === 'string' && (e as any).message.includes('Too Many Request')) {
                console.error('[E] Too Many Request')
        } else {
            console.error(e);
        }
        if (tries < 3) {
            return await gemini(data, type, tries + 1);
        }
        return `-# an error occured, retried ${tries} times`;
    }
}