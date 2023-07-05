import { useMainPlayer, useQueue } from 'discord-player';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('play')
	.setDescription('Play a song in your channel!')
	.addStringOption(option =>
		option.setName('query')
			.setDescription('The song you want to play')
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('position')
			.setDescription('this num is from 0, negative numbers will be treated from the end')
			.setRequired(false));

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
	console.log(`query: ${query}`);
	const searchResult = await player.search(query, {
		requestedBy: interaction.user,
	});
	if (!searchResult?.tracks.length) {
		return interaction.editReply(`No results were found for your query ${query}!`);
	}
	else {
		try {
			const track = searchResult.tracks[0];
			let position = interaction.options.getInteger('location', false);
			const queue = useQueue(interaction.guild.id);
			if (queue && position !== undefined && position !== null && position !== -1 && position !== queue.tracks.length - 1) {
				if (position > queue.tracks.length - 1 || position < -queue.tracks.length + 1) {
					return interaction.editReply(`Invalid position ${position}!`);
				}
				else if (position < 0) {
					position = queue.tracks.length + position;
				}
				queue.add(track, position);
			}
			else {
				await player.play(channel, track, {
					nodeOptions: {
						metadata: {
							channel: interaction.channel,
							client: interaction.guild.members.me,
							requestedBy: interaction.user,
						},
						leaveOnEmpty: true,
						leaveOnEmptyCooldown: 60000,
						leaveOnEnd: true,
						leaveOnEndCooldown: 300000,
					},
				});
			}
			await interaction.editReply(`🎶 | Track **${searchResult.tracks[0].title}** queued!`);
		} catch (error) {
			console.error(error);
			await interaction.editReply({
				content: 'There was an error trying to execute that command!\n' + error,
			});
		}
	}
}