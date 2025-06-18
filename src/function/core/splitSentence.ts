export default function splitSentence(result: any) {
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
}