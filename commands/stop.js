module.exports = {
	name: 'stop',
	description: 'Arrête tous les sons en cours et dans la file d\'attente',
	execute(message,client,args) {
		const queue = message.client.queue;
		const serverQueue = queue.get(message.guild.id);
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
	},
};