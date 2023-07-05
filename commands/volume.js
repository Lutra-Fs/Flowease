import { useQueue } from 'discord-player';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('volume')
	.setDescription('Change the volume of the player')
	.addIntegerOption(option =>
		option.setName('volume')
			.setDescription('The volume you want to set')
			.setRequired(true)
			.setMinValue(0)
			.setMaxValue(100));


export async function execute(interaction) {
	const channel = interaction.member.voice.channel;
	const queue = useQueue(interaction.guild.id);
	if (!channel) {
		return interaction.reply({
			content: 'You are not in a voice channel!',
			ephemeral: true,
		});
	}
	if (!queue.currentTrack) {
		return interaction.reply({
			content: 'There is no song playing!',
			ephemeral: true,
		});
	}
	// check if the user is in the same channel as the bot
	if (channel !== queue.channel) {
		return interaction.reply({
			content: 'You are not in the same channel as the bot!',
			ephemeral: true,
		});
	}
	if (interaction.member.roles.cache.some(role => role.name === 'DJ') || interaction.member.permissions.has('ADMINISTRATOR')) {
		// skip the current song
		const volume = interaction.options.getInteger('volume');
		queue.node.setVolume(volume);
		await interaction.reply(`Volume set to ${volume} in ${channel.name}`);
	}
	else {
		await interaction.reply('You do not have the permission to force skip the current song!');
	}
}