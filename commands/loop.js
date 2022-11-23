const { QueueRepeatMode } = require('discord-player');
const { beforeAction } = require('../helper/utils');

module.exports = {
	name: 'loop',
	description: 'Sets loop mode',
	options: [
		{
			name: 'mode',
			type: 'INTEGER',
			description: 'Loop type',
			required: true,
			choices: [
				{
					name: 'Off',
					value: QueueRepeatMode.OFF,
				},
				{
					name: 'Track',
					value: QueueRepeatMode.TRACK,
				},
				{
					name: 'Queue',
					value: QueueRepeatMode.QUEUE,
				},
				{
					name: 'Autoplay',
					value: QueueRepeatMode.AUTOPLAY,
				},
			],
		},
	],
	async execute(interaction, player) {
		try {
			beforeAction(interaction);

			await interaction.deferReply();

			const queue = player.getQueue(interaction.guildId);
			if (!queue || !queue.playing) {
				return interaction.followUp({
					content: '❌ | No music is being played!',
				});
			}

			const loopMode = interaction.options.get('mode').value;
			const success = queue.setRepeatMode(loopMode);
			let mode = '▶';
			switch (loopMode) {
			case QueueRepeatMode.TRACK:
				mode = '🔂';
				break;
			case QueueRepeatMode.QUEUE:
				mode = '🔁';
				break;
			}

			return interaction.followUp({
				content: success
					? `${mode} | Updated loop mode!`
					: '❌ | Could not update loop mode!',
			});
		}
		catch (error) {
			console.log(error);
			await interaction.followUp({
				content:
					'There was an error trying to execute that command: ' + error.message,
			});
		}
	},
};
