import * as fs from 'fs';
import * as Discord from 'discord.js';
import { ActivityType } from 'discord.js';
import config from './config/config.json' assert { type: 'json' };
import { Player } from 'discord-player';
import { FloweaseExtractor } from '@flowease/extractor';

const client = new Discord.Client({
	intents: ['GuildVoiceStates', 'GuildMessages', 'Guilds'],
});

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));
console.log(commandFiles);

for (const file of commandFiles) {
	const command = await import (`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const player = Player.singleton(client, {});

// register extractors, the default extractor set is not used
await player.extractors.register(FloweaseExtractor);
await player.extractors.loadDefault();
if(player.extractors.size === 0) {
	console.error("No extractors registered, exiting...");
	process.exit(1);
}

// Events listeners
player.events.on('error', (queue, error) => {
	console.log(
		`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
	console.log(
		`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.events.on('playerStart', (queue, track) => {
	queue.metadata.channel.send(
		`▶ | Started playing: **${track.title}**!`);
});

player.events.on('audioTrackAdd', (queue, track) => {
	queue.metadata.channel.send(`🎶 | Track **${track.title}** queued!`);
});

player.events.on('disconnect', queue => {
	queue.metadata.channel.send(
		'❌ | I was manually disconnected from the voice channel, clearing queue!');
});

player.events.on('channelEmpty', queue => {
	queue.metadata.channel.send('❌ | Nobody is in the voice channel, leaving...');
});

player.events.on('queueEnd', queue => {
	queue.metadata.channel.send('✅ | Queue finished! Holding in the channel for 5 minutes before leaving...');
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
		await command.execute(interaction, player);
	} catch (error) {
		console.error(error);
		await interaction.followUp({
			content: 'There was an error trying to execute that command!',
		});
	}
});
client.login(config.token).catch(console.error);