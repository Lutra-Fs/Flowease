const fs = require('fs');
const Discord = require('discord.js');
const { ActivityType } = require('discord.js');
const Client = require('./client/Client');
const config = require('./config/config.json');
const { Player } = require('discord-player');
// from helpers extractor.js import ncmExtractor
const { NcmExtractor } = require('./extractor/extractor.js');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if (command.data.name) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`Command ${file} is not valid!`);
	}
}

console.log(client.commands);

const player = new Player(client);
player.use('neteaseCloudMusic', NcmExtractor);

player.on('error', (queue, error) => {
	console.log(
		`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
	console.log(
		`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
	queue.metadata.send(
		`▶ | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on('trackAdd', (queue, track) => {
	queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on('botDisconnect', queue => {
	queue.metadata.send(
		'❌ | I was manually disconnected from the voice channel, clearing queue!');
});

player.on('channelEmpty', queue => {
	queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
});

player.on('queueEnd', queue => {
	queue.metadata.send('✅ | Queue finished!');
});

client.once('ready', async () => {
	console.log('Ready!');
});

client.on('ready', function() {
	client.user.setActivity('Online for playing music', { type: ActivityType.Listening });
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('interactionCreate', async interaction => {
	const command = client.commands.get(interaction.commandName.toLowerCase());

	try {
		command.execute(interaction, player);
	}
	catch (error) {
		console.error(error);
		interaction.followUp({
			content: 'There was an error trying to execute that command!',
		});
	}
});

client.login(config.token);
