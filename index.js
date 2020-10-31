const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();
const prefix = "$";
const roleList = [
	{
		"id" : "634735250727239691",
		"name": "dofus",
		"role": "687599237067964417"
	},
	{
		"id" : "634735318708256778",
		"name": "fortnite",
		"role": "687599194432995358"
	},
	{
		"id" : "634735402317512704",
		"name": "minecraft",
		"role": "687599104872022129"
	},
	{
		"id" : "634735658228776960",
		"name": "lol",
		"role": "687599279023718411"
	},
	{
		"id" : "687598870397583400",
		"name": "seaof",
		"role": "687599149423656980"
	},
	{
		"id" : "687603472027353088",
		"name": "pegi18",
		"role": "687606697367175188"
	},
	{
		"id" : "703323042205663383",
		"name": "valorant",
		"role": "699751048016822462"
	},
	{
		"id" : "771728624515678248",
		"name": "amongus",
		"role": "771305256704540702"
	},
	{
		"id" : "771729147218100225",
		"name": "ageof",
		"role": "687599037813358592"
	}
];

const ossPhrases = [
	"J'aime me beurrer la biscotte",
	"À l'occasion, je vous mettrai un petit coup de polish...",
	"J'aime quand on m'enduit d'huile...",
	"23 à 0 ! C'est la piquette Jack ! Tu sais pas jouer Jack ! T'es mauvais !",
	"J’aime me battre",
	"Comment est votre blanquette ?",
	"Les plats à base de viande sont ils de bonne qualité ?",
	"J'ai été réveillé par un homme qui hurlait à la mort du haut de cette tour ! J'ai dû le faire taire",
	"Ah ! C’était donc ça tout ce tintouin",
	"Mais ce sera surtout l'occasion de rencontrer le gratin Cairote. Et non pas le gratin de pommes de terre ! … Nan, parce que ça ressemble à carotte, Cairote. Le… le légume, puisque vous avez dit gratin… Gratin de pommes de terre… C’est, c’est une astuce…",
	"On me dit le plus grand bien des harengs pommes à l'huile",
	"C'est notre Raïs à nous : c'est M.René Coty. Un grand homme. Il marquera l'Histoire. Il aime les Cochinchinois, les Malgaches, les Marocains, les Sénégalais… c'est donc ton ami. Ce sera ton porte-bonheur",
	"C'est marrant, c'est toujours les nazis qui ont le mauvais rôle. Nous sommes en 1955, herr Bramard, on peut avoir une deuxième chance, merci",
	"Avant de partir sale espion, fais-moi l'amour !",
	"Pas envie...",
	"Non je ne crois pas non",
	"Il s'agirait de grandir hein, il s'agirait de grandir",
	"Jolie voiture ! Dommage qu'elle soit si sale",
	"Tu n'es pas seulement un lâche mais aussi un traitre comme ta petite taille le laissait deviner !",
	"Que j’te trimballe des poules, que j’te trimballe des pastèques !",
	"Enfin ça fait un peu Jacques a dit a dit pas de charcuterie !",
	"Vous avez bien une amicale des anciens nazis ? un club ? une association peut-être ?",
	"Écoutez mon ptit, là j'viens d'tuer un croco'. Alors si vous voulez qu'on travaille d'égal à égal, faudrait vous y mettre",
	"Vous voyez ce que ça fait un million déjà ?",
	"Une dictature c'est quand les gens sont communistes, déjà. Qu'ils ont froid, avec des chapeaux gris et des chaussures à fermeture éclair. C'est ça, une dictature, Dolorès",
	"J’appelle ça la France, mademoiselle. Et pas n’importe laquelle ; la France du général de Gaulle.",
	"Tous les allemands ne sont pas Nazis !",
	"Oui, je connais cette théorie",
	"Habile !",
	"On en reparlera quand il faudra porter quelque chose de lourd",
	"Shut up ! Kiss my ass !",
	"D’accord, faisons comme ça, ravi de t’avoir revu l’ami.",
	"Oh pardon, je suis affreusement maladroite, apparemment je vous ai... éclaboussé",
	"Ne dit-on pas qu’une femme qui éclabousse un homme, c’est un peu comme la rosée d’une matinée de printemps. C’est la promesse d’une belle journée et la perspective d’une soirée enflammée",
	"C’est l’inexpugnable arrogance de votre beauté qui m’asperge",
	"Où est Heinrich Von Zimmel ? Je répète ma question : où est heinrich Von Zimmel et pose ce transistor",
	"Rechercher un nazi avec des Juifs ? Quelle drôle d'idée...",
	"On dira ce qu'on veut, la France ça reste le pays des 400 fromages"
];

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
	if(!message.content.startsWith(prefix)) return;

	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();

	switch(command){
		case "ping":
			const timeTaken = Date.now() - message.createdTimestamp;
			message.reply(`Pong! This message had a latency of ${timeTaken}ms.`).then(msg =>{
				msg.delete({timeout : 2000});
			}).catch(console.error);
			message.delete({timeout : 2000});
			break;
		case "oss":
			const randInt = Math.floor(Math.random() * (ossPhrases.length));
			message.channel.send(ossPhrases[randInt]);
			break;
		case "role":
			let role = null;
			for(var i = 0; i < roleList.length; i++){
				if(roleList[i].name == args[1]){
					role = message.guild.roles.cache.find(r => r.id === roleList[i].role);
				}
			}

			if (role == null) {
				message.reply("Le rôle que tu as demandé n'a pas été trouvé").then(msg =>{
					msg.delete({timeout : 2000});
					message.delete({timeout : 2000});
				}).catch(console.error);
			}else{
				let member = message.guild.members.cache.find(u => u.id === message.author.id);
				if (args[0] == "quit" || args[0] == "q") {
					member.roles.remove(role);
					message.reply("Le rôle " + role.name + " t'as bien été retiré").then(msg =>{
						msg.delete({timeout : 2000});
						message.delete({timeout : 2000});
					}).catch(console.error);
				}else if (args[0] == "get" || args[0] == "g"){
					member.roles.add(role);
					message.reply("Le rôle " + role.name + " t'as bien été ajouté").then(msg =>{
						msg.delete({timeout : 2000});
						message.delete({timeout : 2000});
					}).catch(console.error);
				}else{
					return;
				}
			}
			break;
		default:
			message.reply("je n'ai pas reconnu ta commande").then(msg =>{
				msg.delete({timeout : 2000});
				message.delete({timeout : 2000});
			}).catch(console.error);;
			break;
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