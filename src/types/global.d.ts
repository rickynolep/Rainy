declare global {
    var Runtime: 'bun' | 'node';
    var red: (text: string) => string;
    var dim: (text: string) => string;
    var green: (text: string) => string;
    var yellow: (text: string) => string;
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
    chatModel: string,
    contextLimit: number,
    alwaysRespond: string[] | boolean,

    autoRespond: string[] | boolean,
    autoRespondCooldown: number,
    alwaysIgnoreSymbol: string,

    enableBump: string | boolean,
    bumpTriggeredMsg: string,
    bumpReminderMsg: string,

    enablePing: boolean,
    enableAfk: boolean,

    enableOsu: boolean,
    enableNeko: boolean
}

interface GeminiConfig {
    thinkingConfig?: ThinkingConfig;
    responseMimeType?: string;
    systemInstruction?: { 
        text: string 
    } [];
}

export {
    Config, ColorLog, GeminiConfig
}