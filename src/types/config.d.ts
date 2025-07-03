declare global {
    var colorLog: ColorLog
}

interface ColorLog {
    dim: string
    yellow:  string
    green: string
}

interface Config {
    debugMode: boolean,
    compatibilityMode: boolean,
    status: string,
    activity: false | string,
    statusText: string | boolean,
    statusUrl: string | boolean,
    autoRespond: array,
    autoRespondCooldown: number,
    alwaysRespond: array,
    alwaysIgnoreSymbol: string,
    chatModel: string,
    contextLimit: number,
}

interface GeminiConfig {
    thinkingConfig?: ThinkingConfig;
    responseMimeType: string;
    systemInstruction: { 
        text: string 
    } [];
}

export {
    Config, ColorLog, GeminiConfig
}