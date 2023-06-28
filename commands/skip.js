import { useQueue } from 'discord-player';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('skip')
	.setDescription('If you are the requester, skip the current song')
	.addBooleanOption(option =>
		option.setName('force')
			.setDescription('If you are not the requester, force skip the current song, require \'DJ\' role or admin')
			.setRequired(false));

export async function execute(interaction) {
	const channel = interaction.member.voice.channel;
	const queue = useQueue(interaction.guild.id)
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
	const force = interaction.options.getBoolean('force', false);
	if (force) {
		if (interaction.member.roles.cache.some(role => role.name === 'DJ') || interaction.member.permissions.has('ADMINISTRATOR')) {
			// skip the current song
			queue.node.skip();
			await interaction.reply(`Skipped in ${channel.name}`);
		}
		else {
			await interaction.reply('You do not have the permission to force skip the current song!');
		}
	}
	else {
		if(queue.currentTrack.requestedBy === interaction.user) {
			// skip the current song
			queue.node.skip();
			await interaction.reply(`Skipped in ${channel.name}`);
		}
		else {
			await interaction.reply('You are not the requester of the current song, consider change force to true');
		}
	}
}