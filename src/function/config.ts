import fs from 'fs';
import path from 'path';
import { parseDocument, Document } from 'yaml';
import type { Config } from '../types/config';

let confPath = path.join(process.cwd(), 'config.yaml');
let configDoc: Document.Parsed;
let configObj: Config;

function validateConfig(obj: any) {
    const requiredKeys = [
        'verbose',
        'compatibilityMode',
        'status',
        'activity',
        'statusText',
        'statusSubText',
        'statusUrl',
        'AI',
        'slashAI',
        'chatModel',
        'contextLimit',
        'alwaysIgnoreSymbol',
        'autoRespond',
        'autoRespondCooldown',
        'alwaysRespond',
        'enablePing',
        'enableOsu',
        'enableAfk',
    ];
    let valid = true;
    for (const key of requiredKeys) {
        if (!(key in obj)) {
            console.warn(colorLog.yellow, `[W] config.yaml missing key: ${key}`);
            valid = false;
        } else if (
            obj[key] === undefined || 
            obj[key] === null ||
            (typeof obj[key] === 'string' && obj[key].trim() === '') ||
            (Array.isArray(obj[key]) && obj[key].length === 0)
        ) {
            console.warn(colorLog.yellow, `[W] config.yaml key "${key}" is empty or undefined`);
            valid = false;
        }
    }
    for (const key of Object.keys(obj)) {
        if (!requiredKeys.includes(key)) {
            console.warn(colorLog.yellow, `[W] config.yaml has unknown key: ${key}`);
        }
    }
    return valid;
}

export async function reloadConfig() {
    try {
        const raw = fs.readFileSync(confPath, 'utf8');
        configDoc = parseDocument(raw);
        configObj = configDoc.toJS() as Config;
        if (!validateConfig(configObj)) {
            console.error('[E] config.yaml structure is invalid! Please fix your config file.');
            process.exit(1);
        }
        if (getConfig().verbose) {console.log(colorLog.dim, `[I] Configurations reloaded`)};
    } catch (err) {
        console.error('[E] Failed to load Config file (YAML), is it missing or invalid?');
        process.exit();
    }
}

export function getConfig(): Config {
    return configObj;
}

await reloadConfig();
export function modifyConfig(modifier: (doc: Document.Parsed) => void) {
    const raw = fs.readFileSync(confPath, 'utf8');
    const doc = parseDocument(raw);
    modifier(doc);
    fs.writeFileSync(confPath, String(doc), 'utf8');
    reloadConfig();
}
