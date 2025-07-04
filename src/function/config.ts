import fs from 'fs';
import path from 'path';
import { parseDocument, Document } from 'yaml';
import crypto from 'crypto';
import type { Config } from '../types/config';
import { refreshSlash } from './config/slash';

let confPath = path.join(process.cwd(), 'config.yaml');
let configDoc: Document.Parsed;
let configObj: Config;
let lastHash = '';

function getHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
}

function validateConfig(obj: any) {
    const requiredKeys = [
        'verbose',
        'compatibilityMode',
        'status',
        'activity',
        'statusText',
        'statusSubText',
        'statusUrl',
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

function loadConfig() {
    try {
        const raw = fs.readFileSync(confPath, 'utf8');
        configDoc = parseDocument(raw);
        configObj = configDoc.toJS() as Config;
        if (!validateConfig(configObj)) {
            console.error('[E] config.yaml structure is invalid! Please fix your config file.');
            process.exit(1);
        }
        if (getConfig().verbose) {console.log(colorLog.dim, `[I] Reloaded config.yaml`)};
    } catch (err) {
        console.error('[E] Failed to load Config file (YAML), is it missing or invalid?');
        process.exit();
    }
}

async function checkConfig() {
    const raw = fs.readFileSync(confPath, 'utf8');
    const hashed = getHash(raw);
    if (hashed === lastHash) return;

    loadConfig();
    await refreshSlash();

    lastHash = hashed;
    
}

await checkConfig();
fs.watchFile(confPath, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
        checkConfig();
    }
});

export function getConfig(): Config {
    return configObj;
}

export function modifyConfig(modifier: (doc: Document.Parsed) => void) {
    const raw = fs.readFileSync(confPath, 'utf8');
    const doc = parseDocument(raw);
    modifier(doc);
    fs.writeFileSync(confPath, String(doc), 'utf8');
    loadConfig();
}
