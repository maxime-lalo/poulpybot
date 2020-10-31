const hour = require('../ressources/hour.js');
module.exports = {
	name: 'stop',
	description: 'Arrête tous les sons en cours et dans la file d\'attente',
	execute(message,client,args) {
		const queue = message.client.queue;
		const serverQueue = queue.get(message.guild.id);
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
		message.channel.send("[**POULPYZIK**][**" + hour.get(false) + "**]  A la prochaine !").then(msg =>{
			message.delete({timeout: 2000});
		}).catch(console.error());
	},
};