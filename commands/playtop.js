const { GuildMember, SlashCommandBuilder } = require('discord.js');
const { QueryResolver } = require('discord-player');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('playtop')
		.setDescription('Play a song before the next in your channel!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('The song you want to play')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('query-type')
				.setDescription('The type of the query')
				.setRequired(true)
				.addChoices({ name: 'Song', value: 0 },
					{ name: 'Playlist', value: 1 },
					{ name: 'Not from Netease? check this', value: -1 })),
	async execute(interaction, player) {
		try {
			const user_voice = interaction.guild.members.cache.get(
				interaction.user.id,
			).voice;
			const bot_voice = interaction.guild.members.cache.get(
				interaction.client.user.id,
			).voice;
			if (!(interaction.member instanceof GuildMember) || !user_voice.channel) {
				return interaction.reply({
					content: 'You are not in a voice channel!',
					ephemeral: true,
				});
			}
			if (bot_voice.channel && user_voice.channelId !== bot_voice.channelId) {
				return interaction.reply({
					content: 'You are not in my voice channel!',
					ephemeral: true,
				});
			}
			await interaction.deferReply();

			const query = interaction.options.get('query').value;
			const query_type = interaction.options.get('query-type').value;
			console.log(query);
			let searchResult;
			if (query_type === -1) {
				searchResult = await player.search(query, {
					requestedBy: interaction.user,
					searchEngine: QueryResolver.resolve(query),
				});
			}
			else {
				searchResult = await player.search(query + '#' + query_type, {
					requestedBy: interaction.user,
					searchEngine: 'neteaseCloudMusic',
				});
			}
			if (!searchResult || !searchResult.tracks.length) {
				return interaction.followUp({ content: 'No results were found!' });
			}

			const queue = await player.createQueue(interaction.guild, {
				ytdlOptions: {
					quality: 'highest',
					filter: 'audioonly',
					highWaterMark: 1 << 25,
					dlChunkSize: 0,
				},
				metadata: interaction.channel,
			});

			try {
				if (!queue.connection) {
					await queue.connect(user_voice.channel);
				}
			}
			catch {
				player.deleteQueue(interaction.guildId);
				return interaction.followUp({
					content: 'Could not join your voice channel!',
				});
			}

			await interaction.followUp({
				content: `⏱ | Loading your ${
					searchResult.playlist ? 'playlist' : 'track'
				}...`,
			});
			searchResult.playlist
				? queue.insert(searchResult.tracks, 0)
				: queue.insert(searchResult.tracks[0], 0);
			if (!queue.playing) await queue.play();
		}
		catch (error) {
			console.log(error);
			interaction.followUp({
				content:
					'There was an error trying to execute that command: ' + error.message,
			});
		}
	},
};
