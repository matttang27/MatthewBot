function minutesToMessage(minutes) {
	var days = Math.floor(minutes/1440)

	var hours = Math.floor((minutes-(days*1440))/60)

	var minutes = Math.floor(minutes-(days*1440)-(hours*60))

	var timer = ""
	if (days == 1) {
		timer += `1 day, `
	}
	else if (days > 1) {
		timer += `${days} days, `
	}
	if (hours == 1) {
		timer += `1 hour `
	}
	else {
		timer += `${hours} hours `
	}
	if (minutes == 1) {
		timer += `and 1 minute`
	}
	else {
		timer += `and ${minutes} minutes`
	}
	return timer
}

function findMember(message,args) {
	if (message.mentions.members.first()) {
		return message.mentions.members.first();
	}
	else {
		var finder = args.join(" ").toLowerCase()
				
			var users = []
			message.guild.members.cache.each(member => {
				
				if (member.user.username.toLowerCase().includes(finder)) {
					users.push(member.user)
				}
				else if (member.nickname) {
					if (member.nickname.toLowerCase().includes(finder)) {
						users.push(member.user)
					}
				}
			})
	}
}
module.exports = minutesToMessage;