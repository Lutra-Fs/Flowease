const { beforeAction } = require('../helper/utils');

module.exports = {
	name: 'nowplaying',
	description: 'Get the song that is currently playing.',
	async execute(interaction, player) {
		beforeAction(interaction);

		await interaction.deferReply();
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return interaction.followUp({
				content: '❌ | No music is being played!',
			});
		}
		const progress = queue.createProgressBar();
		const perc = queue.getPlayerTimestamp();

		return interaction.followUp({
			embeds: [
				{
					title: 'Now Playing',
					description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
					fields: [
						{
							name: '\u200b',
							value: progress,
						},
					],
					color: 0xffffff,
				},
			],
		});
	},
};
