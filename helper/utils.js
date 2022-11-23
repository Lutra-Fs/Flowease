const { GuildMember } = require('discord.js');
module.exports = {
	trimString: (str, max) => ((str.length > max)
		? `${str.slice(0, max - 3)}...`
		: str),
	beforeAction: (interaction) => {
		const user_voice = interaction.guild.members.cache.get(
			interaction.user.id).voice;
		const bot_voice = interaction.guild.members.cache.get(
			interaction.client.user.id).voice;
		if (!(interaction.member instanceof GuildMember) || !user_voice.channel) {
			return interaction.reply({
				content: 'You are not in a voice channel!',
				ephemeral: true,
			});
		}
		if (
			bot_voice.channel &&
			user_voice.channelId !== bot_voice.channelId
		) {
			return interaction.reply({
				content: 'You are not in my voice channel!',
				ephemeral: true,
			});
		}
	},
};