import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { execSync } from 'child_process';

console.log('\x1b[2m%s\x1b[0m', '[I] Checking depenencies...')
const packageJsonPath = path.join(process.cwd(), 'package.json');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const runtime = process.versions?.bun ? 'bun' : 'node';
globalThis.Runtime = runtime as 'bun' | 'node';

globalThis.dim = (text: string) => `\x1b[2m${text}\x1b[0m`;
globalThis.red = (text: string) => `\x1b[31m${text}\x1b[0m`;
globalThis.green = (text: string) => `\x1b[32m${text}\x1b[0m`;
globalThis.yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
console.log(dim(`[I] Detected runtime: ${runtime}`));

export function getFileMeta(importMeta: ImportMeta) {
	const url = typeof importMeta.url === 'string' && importMeta.url.startsWith('file://')
		? importMeta.url
		: pathToFileURL(importMeta.url).toString();
	const __filename = fileURLToPath(url);
	const __dirname = path.dirname(__filename);
	return { __filename, __dirname };
}

const { __filename } = getFileMeta(import.meta);
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
        let pkgManager: 'npm' | 'bun'
        if (runtime === 'node') {pkgManager = 'npm'} else {pkgManager = 'bun'}
        console.log('\x1b[2m%s\x1b[0m', `[I] ${missingDeps.length} dependencies missing: ${missingDeps.join(', ')}`);
        console.log('\x1b[2m%s\x1b[0m', `[I] Installing using ${pkgManager}...`);
        execSync(`${pkgManager} install`, { stdio: 'inherit' });
        console.warn(green('[I] Dependencies installed! Please restart the bot if this is the first run.'));
        process.exit(0);
    }   
}

checkDeps();