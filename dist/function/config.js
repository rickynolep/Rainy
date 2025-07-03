import fs from 'fs';
import path from 'path';
import { parseDocument } from 'yaml';
import crypto from 'crypto';
let confPath = path.join(process.cwd(), 'config.yaml');
let configDoc;
let configObj;
let lastHash = '';
const colorlog = {
    dim: '\x1b[2m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m'
};
function getHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}
function validateConfig(obj) {
    const requiredKeys = [
        'debugMode',
        'compatibilityMode',
        'status',
        'activity',
        'statusText',
        'statusUrl',
        'autoRespond',
        'autoRespondCooldown',
        'alwaysRespond',
        'alwaysIgnoreSymbol',
        'chatModel',
        'contextLimit'
    ];
    let valid = true;
    for (const key of requiredKeys) {
        if (!(key in obj)) {
            console.warn(colorlog.yellow, `[W] config.yaml missing key: ${key}`);
            valid = false;
        }
        else if (obj[key] === undefined ||
            obj[key] === null ||
            (typeof obj[key] === 'string' && obj[key].trim() === '') ||
            (Array.isArray(obj[key]) && obj[key].length === 0)) {
            console.warn(colorlog.yellow, `[W] config.yaml key "${key}" is empty or undefined`);
            valid = false;
        }
    }
    for (const key of Object.keys(obj)) {
        if (!requiredKeys.includes(key)) {
            console.warn(colorlog.yellow, `[W] config.yaml has unknown key: ${key}`);
        }
    }
    return valid;
}
function loadConfig() {
    try {
        const raw = fs.readFileSync(confPath, 'utf8');
        const hashed = getHash(raw);
        if (hashed === lastHash)
            return;
        configDoc = parseDocument(raw);
        configObj = configDoc.toJS();
        if (!validateConfig(configObj)) {
            console.error('[E] config.yaml structure is invalid! Please fix your config file.');
            process.exit(1);
        }
        lastHash = hashed;
        console.log(colorlog.dim, `[I] Reloaded config.yaml`);
    }
    catch (err) {
        console.error('Failed to load Config file (YAML), is it missing or invalid?');
        process.exit();
    }
}
loadConfig();
globalThis.colorLog = colorlog;
fs.watchFile(confPath, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
        loadConfig();
    }
});
export function getConfig() {
    return configObj;
}
export function modifyConfig(modifier) {
    const raw = fs.readFileSync(confPath, 'utf8');
    const doc = parseDocument(raw);
    modifier(doc);
    fs.writeFileSync(confPath, String(doc), 'utf8');
    loadConfig();
}
