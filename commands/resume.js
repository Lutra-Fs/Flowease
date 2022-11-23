const { beforeAction } = require('../helper/utils');

module.exports = {
	name: 'resume',
	description: 'Resume current song!',
	async execute(interaction, player) {
		beforeAction(interaction);

		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return interaction.followUp({
				content: '❌ | No music is being played!',
			});
		}
		const success = queue.setPaused(false);
		return interaction.followUp({
			content: success ? '▶ | Resumed!' : '❌ | Something went wrong!',
		});
	},
};
