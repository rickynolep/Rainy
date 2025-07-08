declare module 'colorthief' {
    export default class ColorThief {
        static getColor(image: Buffer | any, quality?: number): Promise<[number, number, number]>;
        static getPalette(image: Buffer | any, colorCount?: number, quality?: number): Promise<[number, number, number][]>;
    }
}