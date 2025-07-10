import fs from 'fs';
import path from 'path';
import { ext, getFileMeta } from '../../bootstrap.js';
import { getConfig } from '../config.js';
function setAI(set) {
    const { __dirname } = getFileMeta(import.meta);
    const disablePath = `${path.resolve(__dirname, `../../function/chat.${ext}`)}.disabled`;
    const enablePath = path.resolve(__dirname, `../../function/chat.${ext}`);
    if (fs.existsSync(disablePath) && set == true) {
        fs.renameSync(disablePath, enablePath);
    }
    else if (fs.existsSync(enablePath) && set == false) {
        fs.renameSync(enablePath, disablePath);
    }
}
export async function reloadAI() {
    if (getConfig().AI === false) {
        setAI(false);
    }
    else {
        setAI(true);
    }
    ;
}
