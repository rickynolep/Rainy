export default function plural(n, word) {
    return `${n} ${word}${n !== 1 ? 's' : ''}`;
}
