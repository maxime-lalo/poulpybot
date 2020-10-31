module.exports = {
	name: 'vol',
	description: 'Change le volume de la musique lue',
	execute(message,client,args) {
		const queue = message.client.queue;
		const serverQueue = queue.get(message.guild.id);
		if(!isNaN(args[0])){
			if (args[0] >= 0 && args[0] <= 1000) {
				message.channel.send('[**POULPYZIK**] Volume set à ' + args[0]).then(msg =>{
					msg.delete({timeout: 2000});
					message.delete({timeout: 2000});
				}).catch(console.error);;
				serverQueue.connection.dispatcher.setVolume(args[0]/1000);
			}else{
				message.channel.send('[**POULPYZIK**] Veuillez saisir un volume entre 1 et 1000').then(msg =>{
					msg.delete({timeout: 2000});
					message.delete({timeout: 2000});
				}).catch(console.error);
			}
		}else{
			message.channel.send('[**POULPYZIK**] Veuillez saisir un volume valide').then(msg =>{
				msg.delete({timeout: 2000});
				message.delete({timeout: 2000});
			}).catch(console.error);;
		}
	},
};