const { prefix, token } = require("../config.json");
const fs = require('fs');
const Discord = require('discord.js');
const functions = require('../functions.js')
module.exports = {
	args: [-1],
	name: "message",
	description: "Messages someone through Matthew Bot",
	usage: `${prefix}message username / mention $ message`,
	perms: 1,
	async execute(message, args, other) {
		var admin = other[0]
		var bot = other[1]
		var commandName = other[2]
		var seperator = args.indexOf("$")
		if (seperator == -1) {
			return message.reply("I need a seperator!")
		}
		var finder = args.slice(0,seperator);
		var content = args.slice(seperator+1,args.length);
		console.log(finder,content);
		var author = functions.findMember(message,finder);
		if (!author) {
			return
		}
		author = await bot.users.fetch(author);
		
		author.send(content.join(" "));
		
		message.channel.send("Message sent!")
		
	}
};	