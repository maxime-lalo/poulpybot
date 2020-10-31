const ossPhrases = require('../ressources/ossPhrases.json');
module.exports = {
	name: 'oss',
	description: 'Balance une punch d\'OSS 117 au hasard',
	execute(message,client,args){
		const randInt = Math.floor(Math.random() * (ossPhrases.length));
		message.channel.send(ossPhrases[randInt]);
	}
}