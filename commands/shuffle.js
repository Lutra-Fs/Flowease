const { trimString, beforeAction } = require('../helper/utils');

module.exports = {
	name: 'shuffle',
	description: 'shuffle the queue!',
	async execute(interaction, player) {
		beforeAction(interaction);
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return interaction.followUp(
				{ content: '❌ | No music is being played!' });
		}
		try {
			queue.shuffle();
			return interaction.followUp({
				embeds: [
					{
						title: 'Now Playing',
						description: trimString(
							`The Current song playing is 🎶 | **${queue.current.title}**! \n 🎶 | ${queue}! `,
							4095,
						),
					},
				],
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
