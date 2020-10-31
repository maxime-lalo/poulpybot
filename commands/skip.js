module.exports = {
	name: 'skip',
	description: 'Passe à la chanson suivante',
	execute(message,client,args) {
		const queue = message.client.queue;
		const serverQueue = queue.get(message.guild.id);
		if (!serverQueue){
			 message.channel.send('[**POULPYZIK**] : Il n\'y a aucun son à skip');
		};
		serverQueue.connection.dispatcher.end();
		message.delete({timeout: 1000});
	},
};