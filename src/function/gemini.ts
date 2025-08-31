import fs from 'fs';
import { getConfig } from './config.js';
import { GoogleGenAI } from '@google/genai'
import { GeminiConfig } from '../types/global.js';

let config = getConfig()

export default async function gemini(data: Object, type: 'chat' | 'afk' | 'afkSet',  SubData: SubData, tries = 1): Promise<string> {
    try {
        let result: string = '';
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        const model = config.chatModel;
        const personality = fs.readFileSync('./personality.txt', 'utf8');
        let contents: Object = '', geminiConf: GeminiConfig;

        // Define function is deleted, but will be replaced, TO DO!
        geminiConf = {
            responseMimeType: 'text/plain',
            thinkingConfig: { thinkingBudget: 0 }
        }

        // AFK Response - Not Used for Now
        if (SubData.type === 'afkChat') {
            geminiConf.systemInstruction = [{ text: 'nullified'}]
        }

        // Server Chat
        else if (SubData.type === 'serverChat' || 'directChat') {
            geminiConf.systemInstruction = [{ text: personality }]
            contents = data
        }
        
        // Bump Notifier - Not Used for Now
        else if (SubData.type === 'bump') {
            const instruction = 'test '
            geminiConf.systemInstruction = [{ text: instruction + personality }]
        }

        else {
            console.log(data)
            console.error('[E] INVALID DATA RECIEVED');
            process.exit(1);
        }

        const response = await ai.models.generateContentStream({ model, config: geminiConf, contents });
        for await (const chunk of response) { if (chunk.text) { result += chunk.text } }
        return result;


        // `\n\n This user was afk since ${afkTime}, greet him with a welcome message!`
        // `\n\n This user is going to AFK for reason: ${afkReason}, say that you going to remind anyone that trying to call him and also a goodbye message!` + personality
        
        

        
    } catch (e) { 
        console.error('[E] Gemini Failed');
        if (typeof e === 'object' && e !== null && 'message' in e && typeof (e as any).message === 'string' && (e as any).message.includes('Too Many Request')) {
                console.error('[E] Too Many Request')
        } else {
            console.error(e);
        }
        if (tries < 3) {
            return await gemini(data, type, SubData, tries++);
        }
        return `-# an error occured, retried ${tries} times`;
    }
}