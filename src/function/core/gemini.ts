import { GoogleGenAI } from '@google/genai'
import fs from 'fs';

export default async function gemini (data: Object, type: string) {
    let result: string = ''
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
    const model = 'gemini-2.5-flash-preview-05-20';
    const contents = data;
    let config: ConfigType = { responseMimeType: 'text/plain', systemInstruction: [{ text: `` }]}
    const personality = fs.readFileSync('./src/personality.txt', 'utf8')
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
        config.systemInstruction = [{ text: personality }]
    } else {
        config.systemInstruction = [{ text: 'Throw UNKNOWN Response'}]
        console.log('unknown type function!' + prompt)
    }

    const response = await ai.models.generateContentStream({ model, config, contents });
    for await (const chunk of response) { if (chunk.text) { result += chunk.text } };
    return result;
}