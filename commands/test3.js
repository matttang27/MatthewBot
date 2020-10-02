const { prefix, token } = require("../config.json");
const fs = require('fs');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
	args: [-1],
	name: "test3",
	description: "Testing with firestore!",
	usage: `${prefix}test3`,
	perms: 1,
	async execute(message, args, other) {
		var admin = other[0]
		var bot = other[1]
		var commandName = other[2]
		var serverQueue = other[3]
		
		var channel = await bot.channels.fetch("738414916821844038")
		
		var connection = channel.join().then(connection => {
			const dispatcher = connection.play(
				ytdl("https://www.youtube.com/watch?v=o0YvJdl-rCI"), {quality: 'highestaudio'}
			)
			console.log("playing!")
		})
		
	}
};