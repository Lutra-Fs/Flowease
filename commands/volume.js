const { beforeAction } = require('../helper/utils');

module.exports = {
	name: 'volume',
	description: 'Change the volume!',
	options: [
		{
			name: 'volume',
			type: 4, // 'INTEGER' Type
			description: 'Number between 0-200',
			required: true,
		},
	],
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
