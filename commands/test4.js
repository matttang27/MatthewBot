const { prefix, token } = require("../config.json");
const fs = require('fs');
const Discord = require('discord.js');

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

		

		
	}
};	