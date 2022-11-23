const { beforeAction } = require('../helper/utils');

module.exports = {
	name: 'skip',
	description: 'Skip a song!',
	async execute(interaction, player) {
		beforeAction(interaction);

		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return interaction.followUp(
				{ content: '❌ | No music is being played!' });
		}
		const currentTrack = queue.current;
		const success = queue.skip();
		return interaction.followUp({
			content: success
				? `✅ | Skipped **${currentTrack}**!`
				: '❌ | Something went wrong!',
		});
	},
};
