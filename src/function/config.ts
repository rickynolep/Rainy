import fs from 'fs';
import path from 'path';
import plural from './tools/plural.js';
import deepEqual from './tools/deepEqual.js';
import { reloadAI } from './config/ai.js';
import { parseDocument, Document } from 'yaml';
import { reloadSlash } from './config/slash.js';
import { reloadStatus } from './config/status.js';
import type { Config } from '../types/global.js';
if (!process.env.DISCORD_TOKEN) {
        console.log(`Environment keys is missing (Discord Token) \nCreate new ".env" or import your env with these variable:\n`, `  
        DISCORD_TOKEN = "MTxxxxxxxxxxxxxxxxxx"  - [Your Discord Token]
        GEMINI_KEY = "AIxxxxxxxx"               - [Your Gemini Key]
        CLIENT_ID = "13xxxxxxxx"                - [Your Discord Client ID]
        OSU_CLIENT = "xxxxx"                    - [Your Osu Client ID] (optional)
        OSU_SECRET = "1xxxxxxxxxx"              - [Your Osu Secret] (optional)\n`
        ); process.exit(1)
}; 

let confPath = path.join(process.cwd(), 'config.yaml');
let lastconfig: any; let config: Config

export async function reloadConfig() {
    const raw = fs.readFileSync(confPath, 'utf8');
    const configDoc = parseDocument(raw);
    config = configDoc.toJS() as Config;

    const configSchema: Record<string, {
            types: string[], 
            category: 'system' | 'status' | 'ai' | 'autorespond' | 'slash'
    }> = {
        verbose: { 
            types: ['boolean'], 
            category: 'system' 
        },
        compatibilityMode: { 
            types: ['boolean'], 
            category: 'system' 
        },
        status: { 
            types: ['string', 'false'], 
            category: 'status' 
        },
        activity: { 
            types: ['string', 'false'], 
            category: 'status' 
        },
        statusText: { 
            types: ['string', 'false'], 
            category: 'status' 
        },
        statusSubText: { 
            types: ['string', 'false'],
            category: 'status' 
        },
        statusUrl: { 
            types: ['string', 'false'],
            category: 'status' 
        },
        AI: { 
            types: ['boolean'],
            category: 'ai' 
        },
        slashAI: { 
            types: ['boolean'],
            category: 'ai' 
        },
        chatModel: { 
            types: ['string'],
            category: 'ai' 
        },
        contextLimit: { 
            types: ['number'],
            category: 'ai' 
        },
        alwaysRespond: { 
            types: ['numberset', 'false'],
            category: 'ai' 
        },
        autoRespond: { 
            types: ['object', 'numberset', 'false'],
            category: 'autorespond' 
        },
        autoRespondCooldown: { 
            types: ['number'],
            category: 'autorespond' 
        },
        alwaysIgnoreSymbol: { 
            types: ['string'],
            category: 'autorespond' 
        },
        enablePing: { 
            types: ['boolean'],
            category: 'slash' 
        },
        enableOsu: { 
            types: ['boolean'],
            category: 'slash' 
        },
        enableAfk: { 
            types: ['boolean'],
            category: 'slash' 
        }, 
        enableNeko: { 
            types: ['boolean'],
            category: 'slash' 
        },
    };

    let anomalies = {
        unknown: new Set<string>(),
        invalid: {} as Record<string, { expected: string[], got: string, value: any }>,
        missing: new Set<string>()
    };

    if (JSON.stringify(config) === JSON.stringify(lastconfig)) {return};
    const needreload: Set<string> = new Set();
    let totalreload = 0
    const checkedConfig: Set<string> = new Set();
    for (const key in config) {
        const ckey = key as keyof Config;
        const schema = configSchema[key];
        const rawVal = config[ckey];
        let currConfig: any = typeof rawVal;
        // Only allow False boolean
        if (currConfig === 'boolean') if (config[ckey] === false && schema.types.includes("false")) currConfig = 'false';
        // Only allow number in object (and stringified number)
        if (Array.isArray(rawVal) && rawVal.length > 0 && rawVal.every(x => typeof x === 'number' && Number.isFinite(x) ||
            Array.isArray(rawVal) && rawVal.length > 0 && !isNaN(Number(rawVal)))
        ) currConfig = 'numberset';
        checkedConfig.add(key);
        if (!schema) {anomalies.unknown.add(key); continue};
        if (typeof lastconfig === 'undefined') {
            needreload.add('All')
        } else {
            if (lastconfig[key] !== rawVal) if (!deepEqual(lastconfig[key], rawVal)) {
                totalreload++
                needreload.add(configSchema[key].category)
            }
        }
        if (!schema.types.includes(currConfig)) {
            anomalies.invalid[key] = {
                expected: schema.types,
                got: currConfig,
                value: config[ckey]
            }
        }
    }

    for (const key in configSchema) {
        if (!checkedConfig.has(key)) {
            anomalies.missing.add(key);
        }
    }
    
    function print(anomalies: {
        missing: Set<string>,
        unknown: Set<string>,
        invalid: Record<string, { expected: string[], got: string, value: any }>
    }) {
        
        const total = anomalies.missing.size + anomalies.unknown.size + Object.keys(anomalies.invalid).length;
        if (total > 0) {
            console.error(`[I] ${plural(total, "Problem")} found on your configurations:`);
        }
        
        if (anomalies.missing.size > 0) {
            console.log(`    - ${red(plural(anomalies.missing.size, "Missing configuration"))}: ${[...anomalies.missing].join(', ')}`);
        }

        if (Object.keys(anomalies.invalid).length > 0) {
            
            console.log(`    - ${red(plural(Object.keys(anomalies.invalid).length, "Invalid configuration"))}:`);
            
            for (const key of Object.keys(anomalies.invalid)) {
                const { expected, got, value } = anomalies.invalid[key];
                if (deepEqual(expected, ["boolean"])) {
                    console.log(`        - ${red(`${key}`)} can only be true or false, but you put ${value} (${got})!`);
                } else if (deepEqual(expected, ["string", "false"])) {
                    console.log(`        - ${red(`${key}`)} can only be a text or false, but you put ${value} (${got})!`);
                } else if (deepEqual(expected, ["string"])) {
                    console.log(`        - ${red(`${key}`)} cannot be disabled and only allow text, but you put ${value} (${got})!`);
                } else if (deepEqual(expected, ["number"])) {
                    console.log(`        - ${red(`${key}`)} can only be a number, but you put ${value} (${got})!`);
                } else if (deepEqual(expected, ['object', 'false'])) {
                    console.log(`        - ${red(`${key}`)} can only be a set of text or false, but you put ${value} (${got})!`);
                } else if (deepEqual(expected, ['object', 'numberset', 'false'])) {
                    console.log(`        - ${red(`${key}`)} can only be a set of text and number or false, but you put ${value} (${got})!`);
                }else if (deepEqual(expected, ['numberset', 'false'])) {
                    console.log(`        - ${red(`${key}`)} can only be a set of number or false, but you put ${value} (${got})!`);
                }else {
                    console.log(`        - ${red(`${key}`)} only accepts ${expected.join(' or ')}, but you put ${value} (${got})!`);
                }
            }
        };

        if (anomalies.unknown.size > 0) {
            console.log(`    - ${yellow(plural(anomalies.unknown.size, "Unknown configuration"))}: ${[...anomalies.unknown].join(', ')}`);
        }

        if (total > 0) {
            console.log(red('[I] Please fix your config files before continue!'));
            process.exit(1);
        } else {
            if (config.verbose) console.log(dim('[I] All configurations values are valid!') );
        }
    }

    print(anomalies);
    lastconfig = JSON.parse(JSON.stringify(config));

    
    if (needreload.size > 1) {
        if (config.verbose) console.log(dim(`[I] Reloading ${totalreload} configurations...`));
        console.log(dim(`    (${[...needreload].join(', ')})`) );
    } else if (needreload.size > 0) {
        if (config.verbose) console.log(dim(`[I] Reloading ${[...needreload].join().toLocaleLowerCase()} configurations...`) );
    }

    if (needreload.has('system')) {console.log(`[I] System configurations need bot restart to take affect!`)};
    if (needreload.has('ai') || needreload.has('All')) {await reloadAI()};
    if (needreload.has('slash') || needreload.has('All')) {await reloadSlash()};
    if (needreload.has('status') || needreload.has('All')) {await reloadStatus()};
}

export function getConfig(): Config {
    return config;
};

export async function modifyConfig(modifier: (doc: Document.Parsed) => void) {
    const raw = fs.readFileSync(confPath, 'utf8');
    const doc = parseDocument(raw);
    modifier(doc);
    fs.writeFileSync(confPath, String(doc), 'utf8');
    await reloadConfig();
};