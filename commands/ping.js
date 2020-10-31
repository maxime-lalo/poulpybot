module.exports = {
	name: 'ping',
	description: 'Ping le bot',
	execute(message,client,args){
		const timeTaken = Date.now() - message.createdTimestamp;
		message.reply(`Pong! This message had a latency of ${timeTaken}ms.`).then(msg =>{
			msg.delete({timeout : 2000});
		}).catch(console.error);
		message.delete({timeout : 2000});
	}
}