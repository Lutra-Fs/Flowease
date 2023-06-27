import { REST, Routes } from 'discord.js';
import config from '../config/config.json' assert { type: 'json' };
import fs from 'node:fs';

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('../commands')
	.filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	import(`../commands/${file}`).then(command => {
		if (command.data.name) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`Command ${file} is not valid!`);
		}
	})
		.catch(error => {
			console.error(error);
		});
}
console.log(commands);
// log each option of each command
for (const command of commands) {
	console.log(command.options);
}
// ask for the target before deploying
console.log('Please enter the target (guild or global):');
import readline from 'node:readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.on('line', (input) => {
	// Create a new REST instance

	const rest = new REST().setToken(config.token);

	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');

			if (input === 'global') {
				await rest.put(
					Routes.applicationCommands(config.clientId),
					{ body: commands },
				);
			}
			// guild is the default, set the guild id in config.json
			else {
				await rest.put(
					Routes.applicationGuildCommands(config.clientId, config.guildId),
					{ body: commands },
				);
			}
			console.log('Successfully reloaded application (/) commands.');
		} catch (error) {
			console.error(error);
		}
	})();
	rl.close();
});