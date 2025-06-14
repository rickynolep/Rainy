export default function timeConvert(time: Date) {
    const date = new Date(time);

    const witaOffset = 8 * 60;
    const localDate = new Date(date.getTime() + witaOffset * 60000);

    const hours = localDate.getHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    const day = localDate.getDate().toString().padStart(2, '0');
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const year = localDate.getFullYear();

    const result = `${hours}:${minutes} WITA, ${day}-${month}-${year}`;
    return result;
}
