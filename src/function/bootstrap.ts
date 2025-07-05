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

const colorlog = {
    dim: '\x1b[2m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m'
};

const fileurl = fileURLToPath(import.meta.url);
globalThis.__filename = fileurl;
globalThis.__dirname = path.dirname(__filename);
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
}

globalThis.colorLog = colorlog;
checkDeps();