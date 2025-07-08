import { ofetch } from "ofetch";
import ColorThief from 'colorthief';

export default async function medianColor(link: string, type: "rgb" | 'hex'): Promise<number[] | string | null> {
    const arrayBuffer = await ofetch(link, { responseType: 'arrayBuffer' });
    const buffer = Buffer.from(arrayBuffer);

    const color = await ColorThief.getColor(buffer);
    const hex = `#${color.map((c: { toString: (arg0: number) => string; }) => c.toString(16).padStart(2, '0')).join('')}`;

    if (type === 'hex') {return hex}
    return color;
}