const { beforeAction, trimString } = require('../helper/utils');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('View the queue of current songs!'),
	async execute(interaction, player) {
		beforeAction(interaction);
		const queue = player.getQueue(interaction.guildId);
		if (typeof queue != 'undefined') {
			return interaction.reply({
				embeds: [
					{
						title: 'Now Playing',
						description: trimString(
							`The Current song playing is 🎶 | **${queue.current.title}**! \n 🎶 | **${queue}**! `,
							4095,
						),
					},
				],
			});
		}
		else {
			return interaction.reply({
				content: 'There is no song in the queue!',
			});
		}
	},
};