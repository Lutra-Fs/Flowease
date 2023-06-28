import { useQueue } from 'discord-player';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('pause')
	.setDescription('If you are the requester, pause/resume the current song')
	.addBooleanOption(option =>
		option.setName('force')
			.setDescription('If you are not the requester, force pause/resume the current song, require \'DJ\' role or admin')
			.setRequired(false));

export async function execute(interaction) {
	const channel = interaction.member.voice.channel;
	if (!channel) {
		return interaction.reply({
			content: 'You are not in a voice channel!',
			ephemeral: true,
		});
	}
	const queue = useQueue(interaction.guild.id);
	if (queue.channel !== channel) {
		return interaction.reply({
			content: 'You are not in the same channel as the bot!',
			ephemeral: true,
		});
	}
	const force = interaction.options.getBoolean('force', false);
	if (force) {
		// check if the user has the DJ role or admin
		if (interaction.member.roles.cache.some(role => role.name === 'DJ') || interaction.member.permissions.has('ADMINISTRATOR')) {
			// pause the current song
			queue.node.setPaused(!queue.node.isPaused());
			if (queue.node.isPaused()) {
				await interaction.reply(`Paused in ${channel.name}`);
			}
			else {
				await interaction.reply(`Resumed in ${channel.name}`);
			}
		}
	}
	else {
		// check the current song requester
		const requester = queue.currentTrack.requestedBy;
		if (requester === interaction.user) {
			// pause the current song
			queue.node.setPaused(!queue.node.isPaused());
			if (queue.node.isPaused()) {
				await interaction.reply(`Paused in ${channel.name}`);
			}
			else {
				await interaction.reply(`Resumed in ${channel.name}`);
			}
		}
		else {
			await interaction.reply('You are not the requester of the current song, consider change force to true');
		}
	}

}