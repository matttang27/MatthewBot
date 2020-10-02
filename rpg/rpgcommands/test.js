const { prefix, token } = require("../../config.json");
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	args: [-1],
	name: "test",
	description: "Tests for Matthew only.",
	usage: `${prefix}test`,
	perms: 1,
	async execute(message, args, other) {
		message.channel.send("It worked!");
	}
};	