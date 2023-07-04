import { useMainPlayer, useQueue } from 'discord-player';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('search')
	.setDescription('Search results for a song, and select one to play')
	.addStringOption(option =>
		option.setName('query')
			.setDescription('The song you want to play')
			.setRequired(true));

export async function execute(interaction) {
	const player = useMainPlayer();
	const channel = interaction.member.voice.channel;
	if (!channel) {
		return interaction.reply({
			content: 'You are not in a voice channel!',
			ephemeral: true,
		});
	}
	if (!channel.joinable) {
		return interaction.reply({
			content: 'I cannot join your voice channel!',
			ephemeral: true,
		});
	}
	// check if the bot has already joined another channel in this guild
	const queue = useQueue(interaction.guild.id);
	if (queue && queue.channel !== channel) {
		return interaction.reply({
			content: 'I am already playing in another channel!',
			ephemeral: true,
		});
	}

	const query = interaction.options.getString('query', true);

	await interaction.deferReply();

	const searchResult = await player.search(query, {
		requestedBy: interaction.user,
	});

	if (!searchResult?.tracks.length) {
		return interaction.editReply(`No results were found for your query ${query}!`);
	}
	else {
		try {
			// first we need to get the user to select a track
			// then we can play it
			// reply the user with the search results
			// and then wait for the user to select a track
			console.log(`searchResult: ${JSON.stringify(searchResult)}`);
			interaction.editReply(`🎶 | Search results for **${query}**:\n` + searchResult.tracks.map((track, index) => {
				return `**${++index} -** ${track.title} - ${track.author} (${track.duration})`;
			}
			).join('\n'));
			// wait for the user to select a track
			const filter = m => m.author.id === interaction.user.id && /^(\d+|cancel)$/i.test(m.content);
			const response = await interaction.channel.awaitMessages({
				filter,
				max: 1,
				time: 30000,
				errors: ['time'],
			});
			// if the user cancels the selection, which means the content is not a valid number
			const regex = /^\d$/i;
			if (!regex.test(response.first().content)) {
				return interaction.editReply('Cancelled selection.');
			}
			// get the track index
			const trackIndex = Number(response.first().content) - 1;
			// get the track
			const track = searchResult.tracks[trackIndex];
			// play the track
			await player.play(channel, track, {
				nodeOptions: {
					metadata: {
						channel: interaction.channel,
						client: interaction.guild.members.me,
						requestedBy: interaction.user,
					},
				},
			});
			await interaction.editReply(`🎶 | Track **${searchResult.tracks[0].title}** queued!`);
		} catch (error) {
			console.error(error);
			await interaction.editReply({
				content: 'There was an error trying to execute that command!\n' + error,
			});
		}
	}
}
