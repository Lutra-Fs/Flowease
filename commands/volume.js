const { beforeAction } = require('../helper/utils');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Change the volume!')
		.addIntegerOption((option) =>
			option
				.setName('volume')
				.setDescription('Number between 0-200')
				.setRequired(true),
		),
	async execute(interaction, player) {
		beforeAction(interaction);
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return interaction.followUp({
				content: '❌ | No music is being played!',
			});
		}

		let volume = interaction.options.get('volume').value;
		volume = Math.max(0, volume);
		volume = Math.min(200, volume);
		const success = queue.setVolume(volume);

		return interaction.followUp({
			content: success
				? `🔊 | Volume set to ${volume}!`
				: '❌ | Something went wrong!',
		});
	},
};
