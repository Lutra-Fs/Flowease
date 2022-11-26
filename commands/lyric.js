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

		async function lyricsFinder(title, author) {
			const res = await ncmApi.search({
				keywords: title + ' ' + author,
				limit: 1,
				type: 1,
			});
			let lyrics = await ncmApi.lyric({
				id: res.body.result.songs[0].id,
			});
			let lyricsText = lyrics.body.lrc.lyric;
			lyricsText = lyricsText.replace(/\[.*\]/g, '');
			// if lyrics are too short, try to get the lyrics from Musixmatch
			if (lyricsText.length < 100) {
				console.log('lyrics too short, trying Musixmatch');
				const songlyrics = require('songlyrics');
				lyrics = await songlyrics.getLyrics(title);
				lyricsText = lyrics.lyrics.length > 0 ? lyrics.lyrics : lyricsText;
			}
			// replace multiple newlines with a single newline
			lyricsText = lyricsText.replace(/\n{2,}/g, '\n');
			return lyricsText;
		}

		const lyrics = await lyricsFinder(track.title, track.author) ||
			'No lyrics found!';
		// deal with long lyrics
		if (lyrics.length > 2048) {
			const embed = new EmbedBuilder()
				.setTitle(`${track.title} - ${track.author}`)
				.setDescription('Lyrics are too long to display here!');
			return interaction.followUp({ embeds: [embed] });
		}
		else {
			const embed = new EmbedBuilder()
				.setTitle(`Lyrics for ${track.title}`)
				.setDescription(lyrics)
				.setColor('#FF0000')
				.setTimestamp();
			return interaction.followUp({ embeds: [embed] });
		}
	},
};