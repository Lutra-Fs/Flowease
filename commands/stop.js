const { beforeAction } = require('../helper/utils');

module.exports = {
	name: 'stop',
	description: 'Stop all songs in the queue!',
	async execute(interaction, player) {
		beforeAction(interaction);
		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return interaction.followUp({
				content: '❌ | No music is being played!',
			});
		}
		queue.destroy();
		return interaction.followUp({ content: '🛑 | Stopped the player!' });
	},
};
