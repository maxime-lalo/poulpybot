module.exports = {
	name: 'hour',
	description: 'Permet de formater l\'heure automatiquement',
	get(withSeconds) {
		let date = new Date();
		let hour = date.getHours();
		if (hour <= 9) {
			hour = "0" + hour;
		}

		let minutes = date.getMinutes();
		if (minutes <= 9) {
			minutes = "0" + minutes;
		}

		if (withSeconds) {
			let seconds = date.getSeconds();
			if (seconds <= 9) {
				seconds = "0" + seconds;
			}
			return hour + ":" + minutes + ":" + seconds;
		}else{
			return hour + ":" + minutes;
		}
	},
};