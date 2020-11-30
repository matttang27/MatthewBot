const { prefix, token } = require("../config.json");
const fs = require('fs');
const Discord = require('discord.js');
const nhentai = require('nhentai-js');

module.exports = {
	args: [-1],
	name: "nhentai",
	description: "You horny bastard.",
	usage: `${prefix}nhentai {option}`,
	perms: 4,
	async execute(message, args, other) {
		var admin = other[0]
		var bot = other[1]
		var commandName = other[2]
		if (args[0] == "get") {
			if (nhentai.exists(args[1])) {
				var doujin = await nhentai.getDoujin(args[1])
				var details = doujin.details
				var embed = new Discord.MessageEmbed()
				.setColor("#00FF00")
				.setTitle(doujin.title)
				.setDescription(`\n**Tags**:\n${details.tags.join(" , ")}`)
				.addFields(
					{name: "**characters**", value: details.characters ? details.characters.join(" , ") : "none"},
					{name: "**parodies**", value: details.parodies ? details.parodies.join(" , ") : "none"},
					{name: "**artists**", value: details.artists ? details.artists.join(" , ") : "none"},
					{name: "**groups**", value: details.groups ? details.groups.join(" , ") : "none"},
					{name: "**categories**", value: details.categories ? details.categories.join(" , ") : "none"},
					{name: "**languages**", value: details.languages ? details.languages.join(" , ") : "none"},
					{name: "**pages**", value: doujin.pages.length}
				)
				.setURL(doujin.link)
			}
			message.channel.send(embed);
		}
		else {
			message.channel.send(`${args[1]} does not exist.`)
		}
		

		
	}
};	