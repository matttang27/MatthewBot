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
	perms: 1,
	async execute(message, args, other) {
		var admin = other[0]
		var bot = other[1]
		var commandName = other[2]

		const dirs = fs.readdirSync('/home/runner/Matthew-Bot/amongus');
		message.guild.setIcon(`/home/runner/Matthew-Bot/amongus/${dirs[Math.floor(Math.random()*dirs.length)]}`)

		
		
		
	}
};	