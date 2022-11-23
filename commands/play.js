const { GuildMember } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  options: [
    {
      name: "query",
      type: 3, // 'STRING' Type
      description: "The song you want to play",
      required: true
    }
  ],
  async execute(interaction, player) {
    try {
      const user_voice = interaction.guild.members.cache.get(interaction.user.id).voice;
      if (!(interaction.member instanceof GuildMember) || !user_voice.channel) {
        return void interaction.reply({
          content: "You are not in a voice channel!",
          ephemeral: true
        });
      }
      const bot_voice = interaction.guild.members.cache.get(interaction.client.user.id).voice;
      if (
        bot_voice.channel &&
        user_voice.channelId !== bot_voice.channelId
      ) {
        return void interaction.reply({
          content: "You are not in my voice channel!",
          ephemeral: true
        });
      }
      await interaction.deferReply();
      const query = interaction.options.get("query").value;
      console.log(query);
      const searchResult = await player
        .search(query, {
          requestedBy: interaction.user,
          searchEngine: 'neteaseCloudMusic'
        })
        .catch(() => {});
      console.log(searchResult);
      if (!searchResult || !searchResult.tracks.length)
        return void interaction.followUp({ content: "No results were found!" });
      const queue = await player.createQueue(interaction.guild, {
        ytdlOptions: {
          quality: "highest",
          filter: "audioonly",
          highWaterMark: 1 << 25,
          dlChunkSize: 0
        },
        metadata: interaction.channel
      });
      try {
        if (!queue.connection) await queue.connect(user_voice.channelId);
      } catch {
        void player.deleteQueue(interaction.guildId);
        return void interaction.followUp({
          content: "Could not join your voice channel!"
        });
      }
      await interaction.followUp({ content: "Enqueued!" });
      queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
    } catch (error) {
      console.log(error);
      return void interaction.followUp({
        content: `There was an error: ${error.message}`
      });
    }
  }
};