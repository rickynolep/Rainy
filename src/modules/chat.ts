export async function handleChat (data: {
    role: string;
    parts: { text: string }[];
}) {
    console.log('Recieved Data: \n' + JSON.stringify(data, null, 2));
    







}