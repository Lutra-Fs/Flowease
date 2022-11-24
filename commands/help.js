const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List all of the commands'),
	execute(interaction) {
		let str = '';
		const commandFiles = fs.readdirSync('./commands')
			.filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./${file}`);
			if (command.name) {
				str += `Name: ${command.name}, Description: ${command.description} \n`;
			}
			else {
				str += `Name: ${command.data.name}, Description: ${command.data.description} \n`;
			}
		}

		return interaction.reply({
			content: str,
			ephemeral: true,
		});
	},
};
