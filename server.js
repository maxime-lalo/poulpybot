/* Librairies */
const Discord = require("discord.js");
const YoutubeStream = require("youtube-audio-stream");
const fs = require('fs');

/* Ressources */
const ossPhrases = require("./ressources/ossPhrases.json");
const config = require("./config.json");
const roleList = require("./ressources/rolesList.json");
/* Objets */
const client = new Discord.Client();


/* Récupération de toutes les commandes disponibles */
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
/* */

client.on("ready",() =>{
	client.user.setActivity("Among Us",{type: "PLAYING"});

	// Pour chaque serveur
	client.guilds.cache.forEach(server =>{
		// On cherche dans tous les channels le channel tests-max
		server.channels.cache.forEach(channel =>{
			if (channel.id === "772076819267452928") {
				// On cherche si le message est déjà présent
				let isMessageThere = false;
				channel.messages.fetch().then(messages => {
					messages.forEach(msg =>{
						if (msg.author.id == client.user.id) {
							isMessageThere = true;
						}
					});

					if (!isMessageThere) {
					const msg = channel.send("Choisissez votre rôle");
					msg.then(message =>{
						server.emojis.cache.forEach(emoji =>{
							message.react(emoji);
						})	
					});
				}
				}).catch(console.error);
				// Si le messsage des rôles n'est pas présent on l'envoie
			}
		})
	})
});

client.on("message",function(message){
	if(message.author.bot) return;
	if(!message.content.startsWith(config.prefix)) return;

	const commandBody = message.content.slice(config.prefix.length);
	const args = commandBody.split(' ');

	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	try{
		command.execute(message,client,args);
	}catch(error){
		console.log(error);
		message.reply("je n'ai pas reconnu ta commande").then(msg =>{
			msg.delete({timeout : 2000});
			message.delete({timeout : 2000});
		}).catch(console.error);
	}
});

client.on('messageReactionAdd', (reaction, user) => {
	const message = reaction.message;
	const emoji = reaction.emoji;
	// si c'est bien une react sur le message du bot
	if (message.author.id == client.user.id) {
		// Si le bot ne réagit pas à son propre message
		if (user.id != client.user.id) {
			for(var i = 0; i < roleList.length; i++){
				if (roleList[i].id == emoji.id) {
					let role = message.guild.roles.cache.find(r => r.id === roleList[i].role);
					let member = message.guild.members.cache.find(u => u.id === user.id);
					
					message.channel.send("Le rôle " + role.name + " t'as bien été ajouté").then(msg => {
						msg.delete({timeout: 2000});
					}).catch(console.error);

					member.roles.add(role);
					console.log("Rôle " + roleList[i].name + " ajouté à " + user.username);
				}
			}
		}
	}
});

client.on('messageReactionRemove', (reaction, user) => {
	const message = reaction.message;
	const emoji = reaction.emoji;
	// si c'est bien une react sur le message du bot
	if (message.author.id == client.user.id) {
		// Si le bot ne réagit pas à son propre message
		if (user.id != client.user.id) {
			for(var i = 0; i < roleList.length; i++){
				if (roleList[i].id == emoji.id) {
					let role = message.guild.roles.cache.find(r => r.id === roleList[i].role);
					let member = message.guild.members.cache.find(u => u.id === user.id);

					message.channel.send("Le rôle " + role.name + " t'as bien été retiré").then(msg => {
						msg.delete({timeout: 2000});
					}).catch(console.error);

					member.roles.remove(role);
					console.log("Rôle " + roleList[i].name + " retiré à " + user.username);
				}
			}
		}
	}
});

client.login(config.BOT_TOKEN);