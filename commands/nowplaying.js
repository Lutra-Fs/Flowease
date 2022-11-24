const { beforeAction } = require('../helper/utils');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data : new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Get the current song playing'),
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
