const { beforeAction } = require('../helper/utils');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('swap')
		.setDescription('swap song positions in the queue!')
		.addIntegerOption(option =>
			option.setName('track1')
				.setDescription('The track number you want to swap')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('track2')
				.setDescription('The track number you want to swap')
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
			interaction.options.get('track1').value - 1,
			interaction.options.get('track2').value - 1];
		// Sort so the lowest number is first for swap logic to work
		queueNumbers.sort(function(a, b) {
			return a - b;
		});
		if (queueNumbers[1] > queue.tracks.length) {
			return interaction.followUp(
				{ content: '❌ | Track number greater than queue depth!' });
		}

		try {
			// Remove higher track first to avoid list order issues
			const track2 = queue.remove(queueNumbers[1]);
			const track1 = queue.remove(queueNumbers[0]);
			// Add track in lower position first to avoid list order issues
			queue.insert(track2, queueNumbers[0]);
			queue.insert(track1, queueNumbers[1]);
			return interaction.followUp({
				content: `✅ | Swapped **${track1}** & **${track2}**!`,
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
