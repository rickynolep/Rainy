declare global {
    var colorLog: ColorLog
}

interface ColorLog {
    dim: string
    yellow:  string
    green: string
}

interface Config {
    verbose: boolean,
    compatibilityMode: boolean,
    status: string,
    activity: false | string,
    statusText: string | boolean,
    statusSubText: string | boolean,
    statusUrl: string | boolean,
    AI: boolean,
    slashAI: boolean,
    autoRespond: array,
    autoRespondCooldown: number,
    alwaysRespond: array,
    alwaysIgnoreSymbol: string,
    chatModel: string,
    contextLimit: number,
    enableOsu: boolean,
    enableAfk: boolean,
    enablePing: boolean
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