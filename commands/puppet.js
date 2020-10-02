const { prefix, token } = require("../config.json");

module.exports = {
	args: [-1],
	name: "puppet",
	aliases: ["pp","say"],
	description: "Speak through TosBot!",
	usage: `${prefix}puppet <message>`,
	example: `${prefix}puppet HII!`,
	perms: 4,
	
	execute(message, args, other) {
		if (args.length == 0) {
			return message.reply("You need a message!")
		}
		message.delete()
		if (message.channel.type == "text") {
			message.channel.send(args.join(' '))
		}
		else {
			message.client.users.cache.get(message.author.id).send(args.join(' '));
		}
		
		console.log(`controlled by ${message.author.username} in ${message.channel.type}`)
	
	},
}