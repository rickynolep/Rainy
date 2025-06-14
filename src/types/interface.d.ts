interface ThinkingConfig {
  thinkingBudget?: number;
}

interface ConfigType {
  thinkingConfig?: ThinkingConfig;
  responseMimeType: string;
  systemInstruction: { text: string }[];
}
