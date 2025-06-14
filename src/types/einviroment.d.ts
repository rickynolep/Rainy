declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string;
            CLIENT_ID: string;
            GEMINI_KEY: string;
            GEMINI_KEY2?: string;
            OSU_CLIENT?: number;
            OSU_SECRET?: string;
        }
    }
}

export {}