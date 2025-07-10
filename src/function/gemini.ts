import fs from 'fs';
import { getConfig } from './config.js';
import { GoogleGenAI } from '@google/genai'
import { GeminiConfig } from '../types/global.js';

let chatModel = getConfig().chatModel

export default async function gemini(data: Object, type: 'chat' | 'afk' | 'afkSet',  afkTime?: string, afkReason?: string, tries = 1): Promise<string> {
    try {
        let result: string = '';
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        const model = chatModel;
        let contents = data;
        let config: GeminiConfig = { responseMimeType: 'text/plain', systemInstruction: [{ text: `` }]};
        const personality = fs.readFileSync('./personality.txt', 'utf8');

        // Define function is deleted, but will be replaced, TO DO!
        
        config.thinkingConfig = { thinkingBudget: 0 };
        if (type === 'chat') {
            config.systemInstruction = [{ text: personality }];
        } else if (type === 'afk') {
            config.systemInstruction = [{ text: `\n\n This user was afk since ${afkTime}, greet him with a welcome message!` + personality}];
        } else if (type === 'afkSet') {
            config.systemInstruction = [{ text: `\n\n This user is going to AFK for reason: ${afkReason}, say that you going to remind anyone that trying to call him and also a goodbye message!` + personality}];
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
            return await gemini(data, type, afkTime, afkReason, tries++);
        }
        return `-# an error occured, retried ${tries} times`;
    }
}