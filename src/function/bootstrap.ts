import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

console.log('\x1b[2m%s\x1b[0m', '[I] Checking depenencies...')
const packageJsonPath = path.join(process.cwd(), 'package.json');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
function detectPkgManager(): 'bun' | 'npm' | 'yarn' | 'pnpm' {
    if (fs.existsSync(path.join(process.cwd(), 'bun.lockb'))) return 'bun';
    if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) return 'yarn';
    return 'npm';
}

globalThis.dim = (text: string) => `\x1b[2m${text}\x1b[0m`;
globalThis.red = (text: string) => `\x1b[31m${text}\x1b[0m`;
globalThis.green = (text: string) => `\x1b[32m${text}\x1b[0m`;
globalThis.yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;


const fileurl = fileURLToPath(import.meta.url);
globalThis.__filename = fileurl;
globalThis.__dirname = path.resolve(path.dirname(__filename), '../');
const isCompiled = __filename.endsWith('.js');
const ext = isCompiled ? 'js' : 'ts';
export { ext };

export function checkDeps() {
    if (!fs.existsSync(packageJsonPath)) return;
    const missingDeps: string[] = [];
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = Object.keys(pkg.dependencies || {});

    for (const dep of deps) {
        const depPath = path.join(nodeModulesPath, dep);
        if (!fs.existsSync(depPath)) {
            missingDeps.push(dep);
        }
    }

    if (missingDeps.length > 0) {
        const pkgManager = detectPkgManager();
        console.log('\x1b[2m%s\x1b[0m', `[I] ${missingDeps.length} dependencies missing: ${missingDeps.join(', ')}`);
        console.log('\x1b[2m%s\x1b[0m', `[I] Installing using ${pkgManager}...`);
        execSync(`${pkgManager} install`, { stdio: 'inherit' });
        console.warn('\x1b[32m%s\x1b[0m', '[I] Dependencies installed! Please restart the bot if this is the first run.');
        process.exit(0);
    }

    if (!process.env.DISCORD_TOKEN) {
        console.log(`Environment keys is missing (Discord Token) \nCreate new ".env" or import your env with these variable:\n`, `  
        DISCORD_TOKEN = "MTxxxxxxxxxxxxxxxxxx"  - [Your Discord Token]
        GEMINI_KEY = "AIxxxxxxxx"               - [Your Gemini Key]
        CLIENT_ID = "13xxxxxxxx"                - [Your Discord Client ID]
        OSU_CLIENT = "xxxxx"                    - [Your Osu Client ID] (optional)
        OSU_SECRET = "1xxxxxxxxxx"              - [Your Osu Secret] (optional)\n`
        ); process.exit(1)
    };    
}

checkDeps();