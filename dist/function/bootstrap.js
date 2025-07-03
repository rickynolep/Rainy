import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
console.log('\x1b[2m%s\x1b[0m', '[I] Checking depenencies...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
function detectPkgManager() {
    if (fs.existsSync(path.join(process.cwd(), 'bun.lockb')))
        return 'bun';
    if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml')))
        return 'pnpm';
    if (fs.existsSync(path.join(process.cwd(), 'yarn.lock')))
        return 'yarn';
    return 'npm';
}
export function checkDeps() {
    if (!fs.existsSync(packageJsonPath))
        return;
    const missingDeps = [];
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
checkDeps();
