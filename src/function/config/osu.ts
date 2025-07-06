import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { ext } from '../bootstrap.js';
import { getConfig, modifyConfig } from '../config.js';

const osuCommandPath = path.resolve(__dirname, `../commands/user/s-osu.${ext}`);
const osuDisabledPath = osuCommandPath + '.disabled';
let running = false;
let invalidAnswer = 0;

function prompt(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function osuCheck() {
    if (running) return;
    running = true;

    try {
        if (fs.existsSync(osuDisabledPath)) {
            running = false;
            return;
        }

        let answer = '';
        if (invalidAnswer === 0) {
            answer = (await prompt('[Q] osu! Client or Secret key is missing, do you plan to disable osu slash command? (Yes/N): ')).trim().toLowerCase();
        } else {
            answer = (await prompt('[Q] Answer: ')).trim().toLowerCase();
        }

        if (['yes', 'y'].includes(answer)) {
            modifyConfig((doc) => {
                doc.set('enableOsu', false);
            });
        } else if (['no', 'n'].includes(answer)) {
            const a = `Please add your osu! Environment Key(s) before continuing!\n\n`
            const b = `Example key:\nOSU_CLIENT = "12345"\n`
            const c = `OSU_SECRET = "AbCd3fGh1YoUr0su5ecretT0k3NHeRE"\n`
            console.log(yellow(`${a}${b}${c}`));
            process.exit(1)
        } else {
            console.error('[E] Invalid Answer, only answer "Yes", "No", "Y", or "N"!');
            invalidAnswer++;
            running = false;
            await osuCheck();
        }
    } catch (err) {
        console.error('[E] osuCheck error:', err);
    } finally {
        running = false;
    }
}

export async function reloadOsu() {
    if (!process.env.OSU_CLIENT && getConfig().enableOsu === true || !process.env.OSU_SECRET && getConfig().enableOsu === true) {
        if (getConfig().compatibilityMode === true) {console.log(yellow("[W] osu! Client/Secret is marked as missing but compatibility mode is enabled!"))}
        else {await osuCheck()};
    };
}