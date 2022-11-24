const ncmApi = require('NeteaseCloudMusicApi');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { beforeAction } = require('../helper/utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lyric')
		.setDescription('Get the lyrics of the current song!'),
	async execute(interaction, player) {
		beforeAction(interaction);
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return interaction.followUp({
				content: '❌ | No music is being played!',
			});
		}
		const track = queue.current;

		async function lyricsFinder(title) {
			const res = await ncmApi.search({
				keywords: title,
				limit: 1,
				type: 1,
			});
			const lyrics = await ncmApi.lyric({
				id: res.body.result.songs[0].id,
			});
			let lyricsText = lyrics.body.lrc.lyric;
			lyricsText = lyricsText.replace(/\[.*\]/g, '');
			return lyricsText;
		}

		const lyrics = await lyricsFinder(track.title) || 'No lyrics found!';
		const lyricsEmbed = new EmbedBuilder()
			.setTitle(`Lyrics for ${track.title}`)
			.setDescription(lyrics)
			.setColor('#FF0000');

		return interaction.followUp({ embeds: [lyricsEmbed] });
	},
};