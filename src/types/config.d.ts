declare global {
    var config: Config
    var colorLog: ColorLog
}

interface ColorLog {
    dim: string
    yellow:  string
    green: string
}

interface Config {
    statusName: string,
    status: false | string
}

interface GeminiConfig {
    thinkingConfig?: ThinkingConfig;
    responseMimeType: string;
    systemInstruction: { text: string }[];
}

export {
    Config, ColorLog, GeminiConfig
}