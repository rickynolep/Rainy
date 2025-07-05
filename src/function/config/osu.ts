import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { modifyConfig } from '../config';
import { ext } from '../bootstrap';

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

export async function osuCheck() {
    if (running) return;
    running = true;

    try {
        if (fs.existsSync(osuDisabledPath)) {
            running = false;
            return;
        }

        let answer = '';
        if (invalidAnswer === 0) {
            answer = (await prompt('osu! Client or Secret key is missing, do you plan to disable osu slash command? (Yes/N): ')).trim().toLowerCase();
        } else {
            answer = (await prompt('Answer: ')).trim().toLowerCase();
        }

        if (['yes', 'y'].includes(answer)) {
            modifyConfig((doc) => {
                doc.set('enableOsu', false);
            });
        } else if (['no', 'n'].includes(answer)) {
            console.log(colorLog.yellow,
                'Please add your osu! Environment Key(s) before continuing!\n\n',
                'Example key:\n',
                'OSU_CLIENT = "12345"\n',
                'OSU_SECRET = "AbCd3fGh1YoUr0su5ecretT0k3NHeRE"\n'
            );
        } else {
            console.error('Invalid Answer, only answer "Yes", "No", "Y", or "N"!');
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