
import path from 'path';

type ModuleStatus = {
    ok: boolean;
    error: string | null;
};

export function formatError(err: any) {
  return JSON.stringify(err, Object.getOwnPropertyNames(err));
}

export function getModuleName(filename: string) {
  return path.basename(filename, path.extname(filename));
}

const statuses: Record<string, ModuleStatus> = {};

export async function setWatchdog(module: string, ok: boolean, error: string | null = null) {
    statuses[module] = { ok, error: ok ? null : error };
}




export function watchdog() {return statuses;}
setWatchdog(path.basename(__filename, path.extname(__filename)), true);