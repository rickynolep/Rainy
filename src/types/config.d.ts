interface Config {
    status: false | 'watching' | 'listening' | 'playing',
    statusName: string?
}

interface ThinkingConfig {
  thinkingBudget?: number;
}

interface ConfigType {
  thinkingConfig?: ThinkingConfig;
  responseMimeType: string;
  systemInstruction: { text: string }[];
}

declare global {
    var config: Config
    var warnLog: '\x1b[32m%s\x1b[0m'
    var dimLog: '\x1b[2m%s\x1b[0m'
}

export { Config, ConfigType, ThinkingConfig }