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
	if (args.length >= 1 && message.channel.type == "dm")  {
		message.reply("You can only search for others inside a guild!")
		return false
	}

	if (message.mentions.members.first()) {
		return message.mentions.members.first().id;
	}
	else if (args[0].length == 18 && !isNaN(args[0])) {
		return args[0]
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
			if (users.length == 0) {
				message.reply("I can't find anyone with that username")
				return false
			}
			else if (users.length == 1) {
				var user = users[0]
				return user.id
			}
			else {
				var send = []
				const filter = m => m.author.id == message.author.id && Math.floor(m.content) >= 0 && Math.floor(m.content) < users.length

				const collector = message.channel.createMessageCollector(filter, { max: 1, time: 15000 });
				for (i=0;i<users.length;i++) {
					send.push(`${i} - ${users[i].username}`)
				}
				message.reply(`There are too many possibilities :dizzy_face: here's who you can choose! \n` + send.join("\n"))
				collector.on('collect', async m => {
					
					return users[parseInt(m)].id
					
					
					
				});

				collector.on('end', collected => {
					if (!collector.endReason()) {
						message.channel.send("Cancelled command.")
						return false
					}
					
				})
			}
	}
};
exports.minutesToMessage = minutesToMessage
exports.findMember = findMember