const { prefix, token } = require("../config.json");
const fs = require('fs');
const Discord = require('discord.js');
const natural = require('natural');
const wordnet = new natural.WordNet();

module.exports = {
	args: [-1],
	name: "test4",
	description: "4th test",
	usage: `${prefix}test4`,
	perms: 4,
	async execute(message, args, other) {
		var admin = other[0]
		var bot = other[1]
		var commandName = other[2]

		wordnet.lookup(args[0], function(details) {
			console.log(details);
			if (details.length > 0) {
				message.channel.send("That is a word!");
			}
			else {
				message.chanenl.send("That is not a word!");
			}
		})
		

		
	}
};	