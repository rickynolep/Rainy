import { formatError, getModuleName, setWatchdog } from "@/watchdog";

export async function handleChat (data: {
    role: string;
    parts: { text: string }[];
}) {
    try {
        console.log('Recieved Data: \n' + JSON.stringify(data, null, 2));
        setWatchdog(getModuleName(__filename), true);
    } catch (error) {
        setWatchdog(getModuleName(__filename), false, formatError(error));
    }
    
    







}