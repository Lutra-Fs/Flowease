const { beforeAction } = require('../helper/utils');

module.exports = {
	name: 'remove',
	description: 'remove a song from the queue!',
	options: [
		{
			name: 'number',
			type: 4, // 'INTEGER' Type
			description: 'The queue number you want to remove',
			required: true,
		},
	],
	async execute(interaction, player) {
		beforeAction(interaction);

		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return interaction.followUp(
				{ content: '❌ | No music is being played!' });
		}
		const number = interaction.options.get('number').value - 1;
		if (number > queue.tracks.length) {
			return interaction.followUp(
				{ content: '❌ | Track number greater than queue depth!' });
		}
		const removedTrack = queue.remove(number);
		return interaction.followUp({
			content: removedTrack
				? `✅ | Removed **${removedTrack}**!`
				: '❌ | Something went wrong!',
		});
	},
};
