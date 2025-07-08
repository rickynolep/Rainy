export default function timeConvert(
    input: Date | number,
    format: 'time' | 'date' | 'long' = 'date'
): string {
    // Time Parser
    if (typeof input === 'number') {
        const d = Math.floor(input / 86400);
        input %= 86400;
        const h = Math.floor(input / 3600);
        input %= 3600;
        const m = Math.floor(input / 60);
        const s = Math.floor(input % 60);

        const time = [h, m, s].map(n => n.toString().padStart(2, '0')).join(':');
        if (format === 'time') {
            return d > 0 ? `${d} hari, ${time}` : time;
        }

        return `Uptime: ${d > 0 ? `${d} hari, ` : ''}${time}`;
    }

    // Date Parser
    const witaOffset = 8 * 60;
    const localDate = new Date(input.getTime() + witaOffset * 60000);

    const seconds = localDate.getSeconds().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    const hours = localDate.getHours().toString().padStart(2, '0');
    const day = localDate.getDate().toString().padStart(2, '0');
    const monthNum = localDate.getMonth();
    const month = (monthNum + 1).toString().padStart(2, '0');
    const year = localDate.getFullYear();

    if (format === 'time') {
        return `${hours}:${minutes}:${seconds}`;
    }

    if (format === 'long') {
        const namaBulan = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${day} ${namaBulan[monthNum]} ${year}, ${hours}:${minutes} WITA`;
    }

    return `${hours}:${minutes} WITA, ${day}-${month}-${year}`;
}
