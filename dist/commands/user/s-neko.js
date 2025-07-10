import { ofetch } from 'ofetch';
import { randomInt } from 'crypto';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName('neko')
        .setDescription('Fetch a random catgirl image, meow..'),
    async execute(interaction) {
        let nekores;
        try {
            nekores = await ofetch('https://api.nekosia.cat/api/v1/images/catgirl');
        }
        catch (error) {
            console.error('[E] Error on fetching nekores:', error?.data || error?.message || error);
            await interaction.reply('anu, ada yang salah nih!');
            return;
        }
        ;
        const noises = [
            'Nyaaaa!', 'Nyaann', 'Nyaa..', 'Nya nyaaaan!',
            'Purrrr', 'Pwrrrrrwwwrrr', 'Gorogorogoroo',
            'Meowwwwww!', 'Meooooow',
            'Rawrrrrr!', 'Rawrrr',
            'Mrawwrrrr!', 'Grrrrrrrrr',
            'Mawwwww', 'Mewwwww!'
        ];
        let character;
        if (nekores.anime.title !== null) {
            character = `${nekores.anime.character} (${nekores.anime.title || 'No title'})`;
        }
        else
            character = '';
        const desc = (`Artist: [${nekores.attribution.artist.username}](${nekores.attribution.artist.profile})\n` +
            `${character}` +
            `-# Tags: ${nekores.tags.join(', ')}`);
        const embed = new EmbedBuilder()
            .setTitle(noises[randomInt(15)])
            .setDescription(desc)
            .setImage(nekores.image.original.url)
            .setFooter({ text: `Nekosia ${nekores.attribution.copyright}`, iconURL: `https://files.catbox.moe/n9h30p.png` })
            .setColor(nekores.colors.main);
        const source = new ButtonBuilder()
            .setLabel('Source')
            .setURL(nekores.source.url)
            .setStyle(ButtonStyle.Link);
        const download = new ButtonBuilder()
            .setLabel('Download')
            .setURL(nekores.image.original.url)
            .setStyle(ButtonStyle.Link);
        const row = new ActionRowBuilder()
            .addComponents(source, download);
        interaction.reply({ embeds: [embed], components: [row.toJSON()] });
    }
};
