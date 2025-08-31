import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, InteractionContextType, MessageComponentInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { access, constants, mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { getConfig } from '../../function/config.js';
import { getAverageColor } from 'fast-average-color-node';
import { randomInt } from 'crypto';

export default { 
	data: new SlashCommandBuilder()
		.setName('afk')
		.setDescription('Set your afk that will remind anyone that try to notify you')
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for your afk')
                .setRequired(false))
        .addBooleanOption(boolean => 
            boolean.setName('reply')
                .setDescription('Reply anyone that trying to mention you? Default: True (Yes)')
                .setRequired(false)),

	async execute(interaction: ChatInputCommandInteraction) {
        // Pre Handler
        const config = getConfig();
        const reason = interaction.options.getString('reason');
        const reply = interaction.options.getBoolean('reply') ?? true;
        const cachePath = path.join(process.cwd(), 'cache', 'servers', `${interaction.guildId}`);
        const afkFile = path.join(cachePath, 'afk.json');

        let afkData: Record<string, {
            afkReason: string | null,
            afkDate: number,
            reply: boolean
        }> = {};
        
        try {
            try { await access(cachePath, constants.F_OK) } 
            catch { 
                await mkdir(cachePath, { recursive: true });
                console.log(dim('[I] Creating afk cache...'));
            };

            try { afkData = JSON.parse(await readFile(afkFile, 'utf-8'))} 
            catch { console.log(dim('[I] Creating cache file...')) };

        } catch (e) {
            console.error('[E] Error on fetching afk cache.');
            const code = (e as NodeJS.ErrnoException).code;
            if (code !== 'ENOENT') throw e;
            process.exit(1);
        };

        // If user not AFK
        if (!afkData[interaction.user.id]) {
            const color: any = (await getAverageColor(interaction.user.displayAvatarURL())).hex
            const embed = new EmbedBuilder()
                .setTitle(`Mengatur ${interaction.user.displayName} dalam mode AFK!`)
                .setColor(color)
            afkData[interaction.user.id] = {
                    afkReason: reason,
                    afkDate: Date.now(),
                    reply: reply
            };

            await writeFile(afkFile, JSON.stringify(afkData, null, 2), 'utf-8');
            await interaction.reply({ embeds: [embed]})
        }

        // If user already AFK
        else {
            const afkClear = new ButtonBuilder()
                .setCustomId('afkClear')
                .setLabel('Hapus')
                .setStyle(ButtonStyle.Primary);
            const afkUpdate = new ButtonBuilder()
                .setCustomId('afkUpdate')
                .setLabel('Update aja deh!')
                .setStyle(ButtonStyle.Success);
            const afkCancel = new ButtonBuilder()
                .setCustomId('afkCancel')
                .setLabel('Batal')
                .setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(afkClear)
                .addComponents(afkUpdate)
                .addComponents(afkCancel)
            const question = await interaction.reply({ 
                content: 'Kamu udah lagi AFK nih, mau ku perbaharui waktu afknya atau hapus?', 
                components: [row], flags: MessageFlags.Ephemeral, 
                withResponse: true
            });
            const collectorFilter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;

            try {
                const confirm = await question.resource!.message!.awaitMessageComponent({ filter: collectorFilter, time: 10_000 });
                if (confirm.customId === 'afkUpdate') {
                    await confirm.update({ content: 'AFK diperbarui!', components: [] });
                    afkData[interaction.user.id] = {
                        afkReason: reason,
                        afkDate: Date.now(),
                        reply: reply
                    };
                } else if (confirm.customId === 'afkClear') {
                    let answer: string
                    const user = interaction.user.displayName

                    if (randomInt(100) === 69) {
                        answer = `Okaerinasai, ${user}-san! Gohan ni suru? Ofuro ni suru? Soretomo... DISUKODO NITRO NI SURU ⸜(｡˃ ᵕ ˂ )⸝♡ `}
                    else {
                        answer = `Selamat datang kembali, ${user}!`
                    }

                    await confirm.update({ content: answer, components: [] });
                    delete afkData[interaction.user.id];
                } else if (confirm.customId === 'afkCancel') {
                    await confirm.update({ content: `Wakkata! ${interaction.user.displayName}-san`, components: [] });
                    return
                };
                await writeFile(afkFile, JSON.stringify(afkData, null, 2), 'utf-8');
            } catch {
                await interaction.editReply({ content: 'Dasar lambat!', components: [] });
            }
        }
	}
};