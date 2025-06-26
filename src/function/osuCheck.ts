import fs from 'fs';
import path from 'path';
import readline from 'readline';

const osuCommandPath = path.resolve(__dirname, '../commands/user/osu.ts');
const osuDisabledPath = osuCommandPath + '.disabled'
let rl: any = '';

if (config.compatibilityMode === false) {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

function disable() {
    if (fs.existsSync(osuCommandPath)) {
        fs.renameSync(osuCommandPath, osuDisabledPath);
        console.log(colorLog.green, '[I] Osu has been disabled!');
    } else {
        console.log(colorLog.yellow, '[I] Osu command already disabled or not found.');
    }
};

async function missingErr() {
    const answer = (await prompt('Osu Client or Secret key is missing, do you plan to disable osu slash command? (Yes/N): ')).trim().toLowerCase();
    
    if (['yes', 'y'].includes(answer.trim().toLowerCase())) {
        disable();
    } else if (['no', 'n'].includes(answer.trim().toLowerCase())) {
        console.log(colorLog.yellow, 'Please add your Osu Einviroment Key(s) before continue!\n\n',
            'Example key:\n',
            'OSU_CLIENT = "12345"\n',
            'OSU_SECRET = "AbCd3fGh1YoUr0su5ecretT0k3NHeRE"\n'         
        ); process.exit(1);
    } else {
        console.error('Invalid Answer, only answer \'Yes\', \'no\' or \'y\', \'N\'!')
        await missingErr()
    }
};

function prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer: any) => resolve(answer));
    });
}

export async function osuCheck(){
    if (fs.existsSync(osuDisabledPath)) {} 
    else {
        const answer = (await prompt('Osu Client or Secret key is missing, do you plan to disable osu slash command? (Yes/N): ')).trim().toLowerCase();
        
        if (['yes', 'y'].includes(answer.trim().toLowerCase())) {
            disable();
        } else if (['no', 'n'].includes(answer.trim().toLowerCase())) {
            console.log(colorLog.yellow, 'Please add your Osu Einviroment Key(s) before continue!\n\n',
                'Example key:\n',
                'OSU_CLIENT = "12345"\n',
                'OSU_SECRET = "AbCd3fGh1YoUr0su5ecretT0k3NHeRE"\n'         
            ); process.exit(1);
        } else {
            console.error('Invalid Answer, only answer \'Yes\', \'no\' or \'y\', \'N\'!')
            await missingErr()
        }
    }
};