export default function plural(n: number, word: string) {
    return `${n} ${word}${n !== 1 ? 's' : ''}`;
}