const { prefix, token } = require("../config.json");
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	args: [-1],
	name: "profile",
	aliases: ["statistics","stat","stats","pr"],
	description: "Sees your or someone else's profile.",
	usage: `${prefix}profile <optional mention>`,
	example: `${prefix}profile @Matthew`,
	perms: 4,
	
	async execute(message, args, other) {

		function createEmbed(user,userData) {
			if (!userData.rpswon/userData.rpsplayed) {
					var winrate = 0
				}
			else {
				var winrate = Math.round((userData.rpswon/userData.rpsplayed)*100)
			}
			var embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`Profile of ${user.username}`)
				
				.addFields(
					{ name: 'Balance', value: `$${userData.money}` },
					{ name: 'RPS Record W-L', value: `${userData.rpswon}-${userData.rpsplayed-userData.rpswon}`, inline: true },
					{ name: 'RPS Winrate', value: `${winrate}%`, inline: true },
					{ name: 'RPS Streak', value: userData.rpsstreak, inline: true},
					{ name: 'Age', value: `${(Math.floor((Date.now() - userData.timeCreated.toDate())/86400000))} days`}
				)
				
				.setTimestamp()
				.setFooter(`Matthew Bot Profile`);
			if (user.displayAvatarURL()) {
				embed.setThumbnail(`${user.displayAvatarURL()}`)
			}
			return embed
		}


		//start here
		var db = other[0].firestore()
		var firestore = other[0].firestore
		var userNum = message.author.id
		var target = args[0]
		if (args.length == 1) {
			if (message.channel.type == "dm") {
				return message.reply("Sorry but you can only search for others in a guild!")
			}
			else {
				if (target.startsWith('<@') && target.endsWith('>')) {
					target = target.slice(2, -1);

					if (target.startsWith('!')) {
						target = target.slice(1);
					}
					var user = target
					const userRef = db.collection('users').doc(user);
					user = await userRef.get();
					var userData = user.data()
					if (!userData) {
						return message.reply("Sorry, that person hasn't created a profile yet.")
					}
					user = await other[1].users.fetch(target)
					return message.channel.send(createEmbed(user,userData));
				}
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
					return message.reply("I can't find anyone with that username")
				}
				else if (users.length == 1) {
					var user = users[0]
					
					const userRef = db.collection('users').doc(user.id);
					user = await userRef.get();
				
					
					var userData = user.data()
					if (!userData) {
						return message.reply("Sorry, that person hasn't created a profile yet.")
					}
					user = await other[1].users.fetch(userNum)
				
					message.channel.send(createEmbed(users[0],userData));
				}
				else if (users.length > 1) {
					var send = []
					const filter = m => m.author.id == message.author.id && Math.floor(m.content) >= 0 && Math.floor(m.content) < users.length

					const collector = message.channel.createMessageCollector(filter, { max: 1, time: 15000 });
					for (i=0;i<users.length;i++) {
						send.push(`${i} - ${users[i].username}`)
					}
					message.reply(`There are too many possibilities :dizzy_face: here's who you can choose! \n` + send.join("\n"))
					collector.on('collect', async m => {
						
						var user = users[parseInt(m)]
						
						const userRef = db.collection('users').doc(user.id);
						user = await userRef.get();
						
						
						var userData = user.data()
						if (!userData) {
							return message.reply("Sorry, that person hasn't created a profile yet.")
						}
						user = await other[1].users.fetch(user.id)
					
						message.channel.send(createEmbed(user,userData));
						collector.stop()
						
					});

					collector.on('end', collected => {
						if (!collector.endReason()) {
							return message.channel.send("Cancelled command.")
						}
						
					})
					

					


				}
			}
		}
		else {
			const userRef = db.collection('users').doc(userNum);
			
			var user = await userRef.get();
			var userData = user.data()
			
			//if author doesn't have a profile, create one and send an empty profile
			if (!user.exists) {
				message.reply("Creating profile...")
				

				const embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`Profile of ${message.author.username}`)
				.setThumbnail(`${message.author.avatarURL()}`)
				.addFields(
					{ name: 'Balance', value: '$0' },
					{ name: 'RPS Record W-L', value: '0-0', inline: true },
					{ name: 'RPS Winrate', value: '0%', inline: true },
					{ name: 'RPS Streak', value: 0, inline: true},
					{ name: 'Age', value: `0 Days` }
				)
				
				.setTimestamp()
				.setFooter(`Matthew Bot Profile`);

				const setUser = await db.collection('users').doc(message.author.id).set({
					money: 0,
					rpsplayed: 0,
					rpswon: 0,
					rpsstreak: 0,
					timeCreated: firestore.Timestamp.fromDate(new Date()),	
				})
				.catch((err) => console.log(err))


				var p = JSON.parse(fs.readFileSync('players.json'))
				p.players[p.players.length] = {
					"playerid" : message.author.id,
					"lastwork" : 0,
					"lastdaily": 0,
					"lastweekly": 0
				}
				fs.writeFileSync('players.json', JSON.stringify(p,null,2));
				return message.channel.send(embed)
			}
			
			else {
				user = await other[1].users.fetch(userNum)

				
				
				message.channel.send(createEmbed(user,userData))
			}
		}




		

		

		
		
	},
};