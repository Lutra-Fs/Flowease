const { beforeAction } = require('../helper/utils');

module.exports = {
	name: 'pause',
	description: 'Pause current song!',
	async execute(interaction, player) {
		beforeAction(interaction);

		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return interaction.followUp({
				content: '❌ | No music is being played!',
			});
		}
		const success = queue.setPaused(true);
		return interaction.followUp({
			content: success ? '⏸ | Paused!' : '❌ | Something went wrong!',
		});
	},
};
