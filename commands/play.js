const ytdl = require("ytdl-core");

module.exports = {
	name: 'play',
	description: 'Permet de lancer une musique sur youtube',
	async execute(message,client,args){
		try {
		  const queue = message.client.queue;
		  const serverQueue = queue.get(message.guild.id);

		  const voiceChannel = message.member.voice.channel;
		  if (!voiceChannel)
		    return message.channel.send(
		      "[**POULPYZIK**] : Connecte toi à un salon pour que je puisse te rejoindre :)"
		    );
		  const permissions = voiceChannel.permissionsFor(message.client.user);
		  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
		    return message.channel.send(
		      "[**POULPYZIK**] : Je n'ai pas les permissions pour te rejoindre :("
		    );
		  }

		  const songInfo = await ytdl.getInfo(args[0]);
		  const song = {
		    title: songInfo.videoDetails.title,
		    url: songInfo.videoDetails.video_url
		  };

		  if (!serverQueue) {
		    const queueContruct = {
		      textChannel: message.channel,
		      voiceChannel: voiceChannel,
		      connection: null,
		      songs: [],
		      volume: 1,
		      playing: true
		    };

		    queue.set(message.guild.id, queueContruct);

		    queueContruct.songs.push(song);

		    try {
		      var connection = await voiceChannel.join();
		      queueContruct.connection = connection;
		      this.play(message, queueContruct.songs[0]);
		    } catch (err) {
		      console.log(err);
		      message.channel.send("Erreur lors de la lecture de l'URL");
		      queue.delete(message.guild.id);
		    }
		  } else {
		    serverQueue.songs.push(song);
		    console.log(`${song.title} has been added to the queue!`);
		    message.channel.send(
		      `[**POULPYZIK**] : **${song.title}** a été ajouté à la file d'attente`
		    );
		  }
		} catch (error) {
		  console.log(error);
		}
		message.delete({timeout: 1000});
	},
	play(message, song) {
	    const queue = message.client.queue;
	    const guild = message.guild;
	    const serverQueue = queue.get(message.guild.id);

	    if (!song) {
	      serverQueue.voiceChannel.leave();
	      queue.delete(guild.id);
	      return;
	    }

	    const dispatcher = serverQueue.connection
	      .play(ytdl(song.url))
	      .on("finish", () => {
	        serverQueue.songs.shift();
	        this.play(message, serverQueue.songs[0]);
	      })
	      .on("error", error => console.error(error));
	    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
	    serverQueue.textChannel.send(`[**POULPYZIK**] : Son joué actuellement : **${song.title}**`);
  	}
}