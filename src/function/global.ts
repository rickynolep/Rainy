import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { Config } from '../types/config';

const colorlog = {
    dim: '\x1b[2m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m'
}

try {
    const confPath = path.join(process.cwd(), 'config.yaml')
    const raw = fs.readFileSync(confPath, 'utf-8');
    globalThis.config = YAML.parse(raw) as Config;
    globalThis.colorLog = colorlog;
} catch {
    console.error('Failed to load Config file (YAML), Is it missing?');
    process.exit();
};
