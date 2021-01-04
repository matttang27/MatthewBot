const { prefix, token } = require("../config.json");
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	args: [-1],
	name: "kidnap",
	description: "Kidnaps everyone to one channel",
	usage: `${prefix}kidnap Channel Name`,
	perms: 2,
	async execute(message, args, other) {
		var admin = other[0]
		var bot = other[1]
        var commandName = other[2]
        
        var channel = args.join(" ")
        channel = message.guild.channels.cache.find(c => c.name.toLowerCase() == channel.toLowerCase());
        message.guild.voiceStates.cache.each(v => v.setChannel(channel))
		

		
	}
};	