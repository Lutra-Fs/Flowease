const { SlashCommandBuilder, EmbedBuilder } = require(
	'discord.js');
const { beforeAction } = require('../helper/utils');
const ncmApi = require('NeteaseCloudMusicApi');

module.exports = {
	name: 'search',
	description: 'Search for a song! You can choose from the list of songs to play!',
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription(
			'Search for a song! You can choose from the list of songs to play!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('The song you want to play')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('number-limit')
				.setDescription(
					'The number of results you want to get, default is 10, max is 20')
				.setRequired(false)),
	async execute(interaction, player) {
		try {
			beforeAction(interaction, player);
			await interaction.deferReply();
			const query = interaction.options.get('query').value;
			const number_limit = interaction.options.get('number-limit')
				? interaction.options.get('number-limit').value
				: 10;
			if (number_limit > 20 || number_limit < 1) {
				return interaction.followUp(
					{ content: 'The number limit is invalid!' });
			}
			console.log(query);
			// generate search result
			const searchResult = (await ncmApi.search({
				keywords: query,
				limit: number_limit,
				type: 1,
			})).body;
			// build embed
			const embed = new EmbedBuilder()
				.setTitle('Search Result - enter the number to play')
				.setColor('#0099ff')
				.setTimestamp();
			let searchResultString = '';
			for (const song of searchResult.result.songs) {
				const artists = song.artists.map((artist) => artist.name);
				searchResultString += `${song.id} - ${song.name} - ${artists.join(
					', ')}\n`;

			}
			embed.setDescription(searchResultString);
			// send embed
			await interaction.followUp({ embeds: [embed] });
		}
		catch (error) {
			console.log(error);
			interaction.followUp({
				content: 'There was an error trying to execute that command: ' +
					error.message,
			});
		}
	},
};
