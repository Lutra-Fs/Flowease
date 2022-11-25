const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config/config.json');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('../commands')
	.filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
}
console.log(commands);
// log each option of each command
for (const command of commands) {
	console.log(command.options);
}
// ask for the target before deploying
console.log('Please enter the target (guild or global):');
const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});
rl.on('line', (input) => {
	// Create a new REST instance
	const rest = new REST({ version: '10' }).setToken(token);

	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');

			if (input === 'global') {
				await rest.put(
					Routes.applicationCommands(clientId),
					{ body: commands },
				);
			}
			// guild is the default, set the guild id in config.json
			else {
				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);
			}

			console.log('Successfully reloaded application (/) commands.');
		}
		catch (error) {
			console.error(error);
		}
	})();
	rl.close();
});