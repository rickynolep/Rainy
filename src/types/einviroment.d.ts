declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_TOKEN: string;
            CLIENT_ID: string;
            GEMINI_KEY: string;
            GEMINI_KEY2?: string;
        }
    }
}

export {}