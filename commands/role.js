const rolesList = require('../ressources/rolesList.json');
module.exports = {
	name: 'role',
	description: 'Obtenir ou supprimer un rôle',
	execute(message,client,args){
		let role = null;
		for(var i = 0; i < rolesList.length; i++){
			if(rolesList[i].name == args[1]){
				role = message.guild.roles.cache.find(r => r.id === rolesList[i].role);
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
	}
}