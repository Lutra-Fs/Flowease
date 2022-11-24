const { beforeAction } = require('../helper/utils');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data : new SlashCommandBuilder()
		.setName('move')
		.setDescription('Move a song to a specific position in the queue')
		.addIntegerOption(option =>
			option.setName('track')
				.setDescription('the track number to move')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('position')
				.setDescription('the position to move the track to')
				.setRequired(true)),
	async execute(interaction, player) {
		beforeAction(interaction);

		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return interaction.followUp(
				{ content: '❌ | No music is being played!' });
		}
		const queueNumbers = [
			interaction.options.get('track').value - 1,
			interaction.options.get('position').value - 1];
		if (queueNumbers[0] > queue.tracks.length || queueNumbers[1] >
			queue.tracks.length) {
			return interaction.followUp(
				{ content: '❌ | Track number greater than queue depth!' });
		}

		try {
			const track = queue.remove(queueNumbers[0]);
			queue.insert(track, queueNumbers[1]);
			return interaction.followUp({
				content: `✅ | Moved **${track}**!`,
			});
		}
		catch (error) {
			console.log(error);
			return interaction.followUp({
				content: '❌ | Something went wrong!',
			});
		}
	},
};
