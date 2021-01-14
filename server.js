/* Librairies */
const Discord = require("discord.js");
const fs = require('fs');
const request = require('request');
const readline = require('readline');
const { google } = require('googleapis');

/* Variables du drive google */
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';

function authorize(credentials, callback) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
	});
}

function getAccessToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error retrieving access token', err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
}

function uploadFiles(auth) {
	const drive = google.drive({ version: 'v3', auth });
	
	fs.readdir('./images/',(err,files) => {
		for(var i = 0; i < files.length; i++){
			var fileMetadata = {
				'name': files[i],
				parents: ["1NHxCQO6kW27lLd6Wtc_qcPdv5wpHwOdN"]
			};

			var media = {
				mimeType: 'image/jpeg',
				body: fs.createReadStream("./images/" + files[i])
			};

			drive.files.create({
				resource: fileMetadata,
				media: media,
				fields: 'id'
			}, (err, file) => {
				if (err) {
					console.error(err);
				} else {
					drive.files.get({ fileId: file.data.id }, (err, re) => { // Added
						if (err) {
							console.error(err);
						}
						fs.unlink("./images/" + re.data.name,(err) => {
							if(err){
								console.error(err);
							}else{
								console.log("Le fichier " + re.data.name + " bien été upload et supprimé du local");
							}
						})
					});
				}
			});
		}
	})
	/*const fileMetadata = {
		'name': 'test.jpg'
	};
	const media = {
		mimeType: 'image/jpeg',
		body: fs.createReadStream('test.jpg')
	};*/

}

/* Ressources */
const ossPhrases = require("./ressources/ossPhrases.json");
const config = require("./config.json");
const roleList = require("./ressources/rolesList.json");

/* Objets */
const client = new Discord.Client();

client.queue = new Map();

/* Récupération de toutes les commandes disponibles */
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
/* Fin récupération des commandes */

client.on("ready",() =>{
	client.user.setActivity("Boire un coup",{type: "COMPETING"});
	console.log("Le bot est up !");
	// Pour chaque serveur
	client.guilds.cache.forEach(server =>{
		// On cherche dans tous les channels le channel tests-max
		server.channels.cache.forEach(channel =>{
			if (channel.id === config.roleChannel) {
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
	if (message.author.bot) return;
	// Pour ne pas rentrer en conflit avec les autres bots
	if (message.content.startsWith("!")) return;

	// Si le message reçu est dans le channel des photos
	if(message.channel.id === config.photoChannel){
		// Si le message contient bien une photo ou un fichier
		if(message.attachments.size >= 1){
			// On va télécharger la photo
			var photo = message.attachments.first();
			request.head(photo.url, function (err, res, body) {
				// On stocke la photo sur le file system
				request(photo.url).pipe(fs.createWriteStream("images/" + photo.name)).on('close',() => {
					// On envoie la photo sur le drive

					fs.readFile('credentials.json', (err, content) => {
						if (err) return console.log('Error loading client secret file:', err);
						// Authorize a client with credentials, then call the Google Drive API.
						authorize(JSON.parse(content), uploadFiles);

						// On envoie un message de confirmation
						message.react("✅");
					});
				});
			});
			
		}else{
			message.reply("merci d'upload une photo gros connard de merde").then(msg => {
				msg.delete({ timeout: 2000 });
				message.delete({ timeout: 2000 });
			}).catch(console.error);
		}
	}else{
		if (!message.content.startsWith(config.prefix)) return;

		const commandBody = message.content.slice(config.prefix.length);
		const args = commandBody.split(' ');

		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName);

		try {
			command.execute(message, client, args);
		} catch (error) {
			message.reply("je n'ai pas reconnu ta commande").then(msg => {
				msg.delete({ timeout: 2000 });
				message.delete({ timeout: 2000 });
			}).catch(console.error);
		}
	}
});


// Quand un utilisateur ajoute une réaction sur le message des rôles
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

// Quand un utilisateur enlève une réaction sur le message des rôles
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