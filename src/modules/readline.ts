import readline from 'readline';
import { client } from '@/index';
import { TextChannel } from 'discord.js';
import { getModuleName, setWatchdog } from '@/watchdog';

let currentChannel: TextChannel | null = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('\x1b[2m%s\x1b[0m', `[I] Console ready. Type a command below`);

rl.on('line', async (input) => {
    const trimmed = input.trim();

    if (trimmed === 'exit') {
        console.log('\x1b[2m%s\x1b[0m', `[I] Exiting, have a nice day!`);
        process.exit(0);
    }
    if (trimmed.startsWith('send ')) {
        const id = trimmed.split(' ')[1];
        const channel = client.channels.cache.get(id);
        if (!channel || !channel.isTextBased()) {
            console.warn('\x1b[33m%s\x1b[0m', `[E] Invalid Channel!`);
            currentChannel = null;
        } else {
            currentChannel = channel as TextChannel;
            console.log('\x1b[32m%s\x1b[0m', `[I] Entering #${(currentChannel as TextChannel).name}`);
            console.log('\x1b[2m%s\x1b[0m', `[T] Use /ch to see current channel, /rp to reply with message id`);
        }
        rl.prompt();
        return;
    }

    // Step 2: send message or reply
    if (currentChannel) {
        if (trimmed.startsWith('/ch')) {
            console.log('\x1b[32m%s\x1b[0m', `[I] Currently in #${(currentChannel as TextChannel).name}`);
        } else if (trimmed.startsWith('/rp')) {
            const [_, msgId, ...msgParts] = trimmed.split(' ');
            const replyMsg = await currentChannel.messages.fetch(msgId).catch(() => null);
            if (!replyMsg) {
                console.error('[E] Failed to fetch replied message');
            } else {
                await currentChannel.send({ content: msgParts.join(' '), reply: { messageReference: replyMsg.id } });
                console.log('\x1b[32m%s\x1b[0m', `[I] Message replied to #${(currentChannel as TextChannel).name}!`);
            }
        } else {
            await currentChannel.send(trimmed);
            console.log('\x1b[32m%s\x1b[0m', `[I] Message sent to #${(currentChannel as TextChannel).name}!`);
        }
    } else {
        console.warn('\x1b[33m%s\x1b[0m', `[E] Invalid Command!`);
    }

    rl.prompt();
    setWatchdog(getModuleName(__filename), true);
});