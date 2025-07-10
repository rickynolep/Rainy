import * as osu from 'osu-api-v2-js';
import convertTime from '../../function/tools/convertTime.js';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName('osu')
        .setDescription('Osu Intergrations')
        .addSubcommand(subcommand => subcommand
        .setName('bestplay')
        .setDescription('Fetch info about user Top PP Play')
        .addStringOption(option => option.setName('username')
        .setDescription('Player Username')
        .setRequired(true))
        .addBooleanOption(boolean => boolean.setName('lazer')
        .setDescription('Enable Lazer Mode?')
        .setRequired(true))),
    async execute(interaction) {
        const username = interaction.options.getString('username');
        const lazerMode = interaction.options.getBoolean('lazer');
        const api = await osu.API.createAsync(process.env.OSU_CLIENT, process.env.OSU_SECRET);
        const user = await api.getUser(username);
        const score = (await api.getUserScores(user, "best", osu.Ruleset.osu, { lazer: lazerMode }, { limit: 1 }))[0];
        let rank = '';
        let totalScore = '';
        if (score.rank === 'SH') {
            rank = 'Silver S';
        }
        else if (score.rank === 'XH') {
            rank = 'Silver SS // PERFECT';
        }
        console.log(score);
        if (lazerMode === false) {
            totalScore = score.classic_total_score.toString().padStart(8, '0');
        }
        else {
            totalScore = score.total_score;
        }
        const beatmapDiff = await api.getBeatmapDifficultyAttributesOsu(score.beatmap, score.mods);
        const performance = `🟢 ${score.statistics.great || 0} 🟡 ${score.statistics.ok || 0} 🟠 ${score.statistics.meh || 0} 🔴 ${score.statistics.ignore_miss || score.statistics.miss || 0} 🔗 ${score.max_combo || 0}x`;
        const accuracy = (score.accuracy * 100).toFixed(2) + '%';
        const starRating = `${beatmapDiff.star_rating.toFixed(2)} ⭐`;
        const stats = `[${score.beatmapset.artist} - ${score.beatmapset.title}](https://osu.ppy.sh/beatmapsets/${score.beatmap.beatmapset_id}#osu/${score.beatmap.id})\n` +
            `${score.beatmap.version} + ${score.mods.map((m) => m.acronym).toString()} (${starRating})\n` +
            `${convertTime(score.ended_at, 'date')}\n` +
            `# ${totalScore} (${accuracy})\n` +
            `**${rank || score.rank}** +${score.pp?.toFixed(0)}pp\n\n` +
            `${performance}`;
        const embed = new EmbedBuilder()
            .setTitle(`${username}'s Top PP Play`)
            .setURL(`https://osu.ppy.sh/users/${score.user_id}`)
            .setDescription(stats)
            .setImage(score.beatmapset.covers.cover)
            .setThumbnail(score.user.avatar_url);
        await interaction.reply({ embeds: [embed] });
    }
};
