const fs = require('fs');
const Discord = require("discord.js");
var bot = new Discord.Client();
const {prefix, token, ownerID, rpgprefix} = require("./config.json");
bot.commands = new Discord.Collection();
bot.rpgcommands = new Discord.Collection();

var func = require("./functions.js")
func.importAll(func,global)
const {inputs,outputs,cleanup,gameClear,sleep} = require("./functions.js")



const Role = require('./role.js')

//currently making roles in the other repl.it
var games = []


var praise = ["nice","good","amazing","godly","legend"]

var chat = new Map();





//import commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with name : command module
	bot.commands.set(command.name, command);
}


//import rpgcommands
const rpgcommandFiles = fs.readdirSync('./rpg/rpgcommands').filter(file => file.endsWith('.js'));

for (const file of rpgcommandFiles) {
	const command = require(`./rpg/rpgcommands/${file}`);

	// set a new item in the Collection
	// with name : command module
	bot.rpgcommands.set(command.name, command);
}

//import 
//Firebase stuff

const admin = require('firebase-admin');

let serviceAccount = require('./servicekey.json');
let rpgserviceAccount = require('./rpg/rpgservicekey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var rpgadmin = admin.initializeApp({
  credential: admin.credential.cert(rpgserviceAccount)
},"rpg");

  

// discord


bot.on("ready", () => {
  console.log("Bot Ready at " + new Date().toString());
  changeStatus(bot)
	console.log("Changing status at " + new Date().toString());
});

bot.on("message", async message => {
	try {
	//no bot replies
	if (message.author.bot && message.author.id != bot.user.id) {
		return
	};

	if (message.channel.type == "dm") {
		if (message.author.id == bot.user.id && !message.content.startsWith(prefix)) {
			return;
		}
		var matthew = await bot.guilds.fetch("720351714791915520")
		var channel = await matthew.channels.cache.find(c => c.name == message.author.id)
		
		if (!channel) {
			var channel = await matthew.channels.create(message.author.id)
			var category = await matthew.channels.cache.find(c => c.name == "DM" && c.type == "category")
			channel.setParent(category.id)

			var alias = []
			var guilds = []
			var guildlist = bot.guilds.cache.array()
			for (i=0;i<guildlist.length;i++) {
				var g = guildlist[i]
				try {
					var m = await g.members.fetch(message.author.id)
					alias.push(m.nickname)
					guilds.push(g.name)
				}
				catch{}
			}

			var embed = new Discord.MessageEmbed()
			.setColor("#00FF00")
			.setTitle(message.author.username)
			.setDescription(message.author.tag)
			.addField("a.k.a", alias.join(",").length > 0 ? alias.join(",") : "None.")
			.addField("In Guilds: ", guilds.join(",").length > 0 ? guilds.join(",") : "None.")
			.setImage(message.author.displayAvatarURL)
			var sended = await channel.send(embed)
			sended.pin()
		}
		
		try {channel.send(message.content)}
		catch (err) {console.log(err + message.content)}
	}



	var type = "";

	
	//checks if message starts with the prefix for commands, and if the message was sent by a bot

	//ping response
	var temp = message.content.toLowerCase()
	var pingers = ["Ping me again b*tch I dare you","I guess you wanna die today huh?","I've got things to do.","Sigh...you got a death wish?","Bruh what do you want","Sup.","Please just stfu man","Stop pinging me","I'm blocking you.","Just let me sleep","Someone kill me","I'm here wassup","._.",".-.","-_-","-___-"]
	if (message.mentions.has(bot.user)) {
		message.channel.send(pingers[Math.floor(Math.random()*pingers.length)])
	}

	if (message.channel.type == "text") {
		
		if (message.author.id == bot.user.id) {
			return;
		}
		//Human trafficking cult stuff
		if (message.guild.id == "757770623450611784") {

			//emoji counting
			var emojis = message.content.match(/<:.+?:\d+>/g)
			if (emojis) {
				var emojis = emojis.map(e => e.match(/\d+/g)[0])
				emojis = emojis.filter((v,i) => emojis.indexOf(v) == i)

				for (var i=0;i<emojis.length;i++) {
					var r = JSON.parse(fs.readFileSync('reactions.json').toString());
					
					
					var e = message.guild.emojis.cache.get(emojis[i])
					var u = message.author
					
					if (e.id in r.reactions) {
						r.reactions[e.id].count++
					}
					else {
						r.reactions[e.id] = {}
						r.reactions[e.id]["name"] = e.name
						r.reactions[e.id]["count"] = 1
						r.reactions[e.id]["users"] = {}
					}
					if (u.id in r.reactions[e.id].users) {
						r.reactions[e.id].users[u.id]++
					}
					else {
						r.reactions[e.id].users[u.id] = 1
					}

					if (u.id in r.users) {
						r.users[u.id].count++
					}
					else {
						r.users[u.id] = {}
						r.users[u.id]["name"] = u.username
						r.users[u.id]["count"] = 1
						r.users[u.id]["reactions"] = {}
					}
					if (e.id in r.users[u.id].reactions) {
						r.users[u.id].reactions[e.id]++
					}
					else {
						r.users[u.id].reactions[e.id] = 1
					}

					let list = JSON.stringify(r,null,2);
					fs.writeFileSync('reactions.json', list);
				}
			}
			
			//only rolling in human trafficking channels
			if (message.channel.id != "757977875059179602" && message.channel.id != "778686664842805288") {
				var c = message.content
				if (c == "$wa" || c == "$wg" || c == "$ha" || c == "$hg" || c == "$ma" || c == "$mg") {
					message.delete()
					message.channel.send("Rolling waifus are only allowed in the <#757977875059179602> channel!")
					message.member.roles.add(message.guild.roles.cache.find(r => r.name == "Muted"));
					return setTimeout(function() {message.member.roles.remove(message.guild.roles.cache.find(r => r.name == "Muted"))}, 10000)
							
				}
			};
			var clean = message.content.replace(/\W/g, '').toLowerCase();
			if (clean == "imadegeneratetoo") {
				var act = message.guild.roles.cache.find(r => r.name == "Human Rights Activist");
				if (message.member.roles.cache.has("776509222145228870")) {
					message.channel.send(`${message.author.username} is now a degenerate!`);
					return message.member.roles.remove(act);
				}
				else {
					message.channel.send(`${message.author.username} is a degenerate.`)
				}
			}
			if (clean == "yallarefuckingdegenerates") {
				var act = message.guild.roles.cache.find(r => r.name == "Human Rights Activist");
				if (message.member.roles.cache.has("776509222145228870")) {
					message.channel.send(`We know`);
					return message.member.roles.remove(act);
				}
				else {
					message.channel.send(`${message.author.username} is now a <@&776509222145228870>!`,{"allowedMentions": { "users" : []}})
					return message.member.roles.add(act);
				}
			}
			if (clean == "procrastinationtime") {
				var act = message.guild.roles.cache.find(r => r.name == "Responsible Person");
				if (message.member.roles.cache.has("770826236158410762")) {
					message.channel.send(`${message.author.username} is now a Procrastinator!`);
					return message.member.roles.remove(act);
				}
				else {
					message.channel.send(`${message.author.username} is in Quadrant 1: Procrastinator.`)
				}
			}
			if (clean == "imaresponsibleboi") {
				var act = message.guild.roles.cache.find(r => r.name == "Responsible Person");
				if (message.member.roles.cache.has("770826236158410762")) {
					message.channel.send(`${message.author.username} is in Quadrant 2: Something idk i wasn't listening`);
					return message.member.roles.remove(act);
				}
				else {
					message.channel.send(`${message.author.username} is now a <@&770826236158410762>!`,{"allowedMentions": { "users" : []}})
					return message.member.roles.add(act);
				}
			}
			if (clean == "imapervert") {
				var act = message.guild.roles.cache.find(r => r.name == "Innocent");
				if (message.member.roles.cache.has("784135793987682384")) {
					message.channel.send(`${message.author.username} couldn't fight the *urge*`);
					return message.member.roles.remove(act);
				}
				else {
					message.channel.send(`${message.author.username}...h-h-***hentaii!***`)
				}
			}
			if (clean == "imunder18") {
				var act = message.guild.roles.cache.find(r => r.name == "Innocent");
				if (message.member.roles.cache.has("784135793987682384")) {
					message.channel.send(`${message.author.username} doesn't know anything :sweat:`);
					return message.member.roles.remove(act);
				}
				else {
					message.channel.send(`${message.author.username} is now <@&784135793987682384>!`,{"allowedMentions": { "users" : []}})
					return message.member.roles.add(act);
				}
			}
			
			
		};
		//Matthew Bot Testing stuff

		if (message.guild.id == "720351714791915520") {
			if (message.channel.parentID == "781939212416581654") {
				if (message.author.bot) {
					return;
				}
				var receive = await bot.users.fetch(message.channel.name)
				receive.send(message.content);
			} 
		}
	}
	


	if (message.author.id == "518232676411637780") {
		message.react("730499606915579954")
	}
	if (message.content.startsWith(prefix)) {
		type = "bot"
	}
	else if (message.content.startsWith(rpgprefix)) {
		type = "rpg"
	}
	//checks if matthew bot or rpg bot is called
	if (!type) {
		//some extra personality for Matthew Bot
		/*if (temp.length = 1 && temp.includes("e")) {
			var role = await message.guild.roles.cache.find(role => role.id == '758129827906584587');
			message.channel.send("Silence.")
			return message.member.roles.add(role)
			
		}*/
		temp = cleanup(temp)
		for (i=0;i<inputs.length;i++) {
			for (j=0;j<inputs[i].length;j++) {
				if (temp.split(" ").includes(inputs[i][j])) {
					for (k=0;k<outputs[i].length;k++) {
						return message.channel.send("No more.")
					}
					return
				}
			}

		}
		if (temp.length == 1 && temp.includes("e")) {
			var sended = await message.channel.send("E")
			await sleep(1000)
			return sended.edit("You thought");
		}
		if (message.author.id == ownerID) {
			
			temp = temp.split(" ")
			if (!(temp.includes("matthew") || temp.includes("matthewbot"))) {
				return
			}
			for (i=0;i<temp.length;i++) {
				if (praise.includes(temp[i])) {
					return message.channel.send("https://cdn.discordapp.com/attachments/720351714791915523/764105109536768020/unknown.png")
				}
			}
		}
		if (temp.includes("abdullah")) {
			if (!temp.includes("supreme") || !temp.includes("leader")) {
				message.channel.send("You must refer to him as Supreme Leader Abdullah!")
			}
			else {
				message.channel.send("All hail Supreme Leader Abdullah! <:hotabdullahcrop:746455282921636021> ")
			}
			return
		}
		
		
		return
	};
	
	









	//gets the arguments by slicing the prefix, and splitting them into an array
	const args = message.content.slice(prefix.length).trim().split(/ +/g)
	const commandName = args.shift().toLowerCase();


	
	console.log(commandName + " from " + message.author.username);
	console.log(args)

	//check if command exists for both prefix and rpgprefix
	if (type == "bot") {
		command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	}
	else {
		command = bot.rpgcommands.get(commandName) || bot.rpgcommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	}
	
	if (!command) {
		return;
	}

	/*perm levels:

	4 - DMs allowed
	3 - guild only(or gamemaster only)
	2 - administrator only
	1 - Matthew only
	0 - Shut down
	*/

	if (command.perms == 0) {
		return message.reply("Sorry, this command has been shut down and may be implented later.")
	}
	//guild check
	if (command.perms < 4 && message.channel.type !== 'text' && command.perms != 1) {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	
	
	//owner check
	if (command.perms == 1 && message.author.id !== ownerID) {
		return message.reply("Sorry, only Matthew Tang can use this command")
	}

	//admin check
	if (command.perms == 2 && (!(message.member.hasPermission("ADMINISTRATOR") || !message.member.roles.cache.some(role => role.name.includes("gamemaster"))) || message.author.id != ownerID)) {
		return message.reply("Sorry, you need admin / gamemaster permissions for this command!")
	}

	//args check
	if (!(command.args.includes(-1)) && !(command.args.includes(args.length))) {
		await message.reply("Are you sure that was the right number of arguments?")
		await message.channel.send("usage: " + command.usage)
		return
	}
	
	if(type == "bot") {
		var other = [admin,bot,commandName]
	}
	else {
		var other = [rpgadmin,bot,commandName]
	}
	
	command.execute(message,args,other);


	}
	catch (error){
		console.error(error)
	}
	
	

});

var ignore = ["576031405037977600"]


bot.on("messageReactionAdd", async function(reaction,user) {
	
	if (user.bot) {
		return;
	}
	if (!(reaction.emoji instanceof Discord.GuildEmoji)) {
		return;
	}
	if (reaction.message.channel.type != "text") {
		return;
	}
	if (reaction.message.guild.id != "757770623450611784") {
		return;
	}
	console.log(reaction.emoji)
	if (reaction.emoji.guild.id != "757770623450611784") {
		return;
	}
	
	
	var r = JSON.parse(fs.readFileSync('reactions.json').toString());
	var e = reaction.emoji
	var u = user
	console.log(reaction.emoji)
	if (e.id in r.reactions) {
		r.reactions[e.id].count++
	}
	else {
		r.reactions[e.id] = {}
		r.reactions[e.id]["name"] = e.name
		r.reactions[e.id]["count"] = 1
		r.reactions[e.id]["users"] = {}
	}
	if (u.id in r.reactions[e.id].users) {
		r.reactions[e.id].users[u.id]++
	}
	else {
		r.reactions[e.id].users[u.id] = 1
	}

	if (u.id in r.users) {
		r.users[u.id].count++
	}
	else {
		r.users[u.id] = {}
		r.users[u.id]["name"] = u.username
		r.users[u.id]["count"] = 1
		r.users[u.id]["reactions"] = {}
	}
	if (e.id in r.users[u.id].reactions) {
		r.users[u.id].reactions[e.id]++
	}
	else {
		r.users[u.id].reactions[e.id] = 1
	}

	let list = JSON.stringify(r,null,2);
	fs.writeFileSync('reactions.json', list);

	
})

bot.on("raw", async packet => {
	if (packet.t == "TYPING_START" || packet.t == "MESSAGE_CREATE") {
		return
	}
	console.log(packet)
	if (packet.t != "MESSAGE_REACTION_ADD") {
		return;
	}
	var guild = await bot.guilds.fetch(packet.d.guild_id)
	var member = await guild.members.fetch(packet.d.user_id)
	//ignore if bot
	if (member.user.bot) {
		return;
	}

	
	const channel = await guild.channels.cache.get(packet.d.channel_id);

	//if channel message is already cached no need to call twice
	//it'll be detected by messageReactionAdd anyways
	if (channel.messages.cache.has(packet.d.message_id)) return;
	var message = await channel.messages.fetch(packet.d.message_id)
	// Emojis can have identifiers of name:id format, so we have to account for that case as well
	const emoji = packet.d.emoji.id ? packet.d.emoji.id : packet.d.emoji.name;
	// This gives us the reaction we need to emit the event properly, in top of the message object
	const reaction = await message.reactions.cache.get(emoji);
	// Adds the currently reacting user to the reaction's users collection.
	if (reaction) reaction.users = (packet.d.user_id, member.user);


	bot.emit('messageReactionAdd', reaction, member.user);
})
//stalker time!


bot.on("presenceUpdate", async function(oldMember, newMember){
	console.log("hey")
	console.log(newMember)
	if (newMember.user.id == "576031405037977600") {
		if (newMember.guild.id == "712382129673338991") {
			console.log(newMember)
			var channel = await newMember.guild.channels.cache.find(c => c.name == "general")
			console.log(channel)
			if (!channel) {
				return
			}
			
			var status = oldMember.status
			if (newMember.status != 'offline' && status == 'offline') {
				channel.send("Edward has gone on!")
			}
			else if (newMember.status == 'offline') {
				channel.send("Edward has gone off.")
			}
		}
	}

	
	

	//bot & ignore detector
	if (newMember.user.bot) {
		return
	}
	

	var username = newMember.user.username

	if (newMember.member.nickname) {
		username = newMember.member.nickname
	}
	var status;
	if (!oldMember) {
		status = 'offline'
	}
	else {
		status = oldMember.status
	}
	var channel = await newMember.guild.channels.cache.find(c => c.name == "matthew-sees-you")
	if (!channel) {
		return
	}
	if (newMember.status != 'offline' && status == 'offline') {
		if (!ignore.includes(newMember.user.id) && channel) {
			channel.send(`${username} *I see you* :eyes:`)
		}
		
		console.log(`\n${username} from ${newMember.guild.name} has gone online.\n`)
	}
	else if (newMember.status == 'offline') {
		if (!ignore.includes(newMember.user.id) && channel) {
			channel.send(`*${username} where are you hiding*? :dagger:`)
		}
		console.log(`\n${username} from ${newMember.guild.name} has gone off.\n`)
	}
	
});

bot.on("guildCreate", function(guild){
  console.log(`Joined guild ${guild.name}`)
	const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))

  channel.send("Hi! I'm Matthew Bot, at your service!")
});

bot.on('guildMemberAdd', (member) => {

})
bot.on('rateLimit', (info) => {
  console.log(`Rate limit hit ${info}`)
})
//serverstuff



const express = require('express');
const bodyParser = require('body-parser');



const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(express.static('website'));

server.all('/', (req, res)=>{
  res.sendFile(__dirname + '/website/index.html');

})


function keepAlive(){
    server.listen(3000, ()=>{console.log("Server is Ready at " + new Date().toString())});
}





keepAlive()
bot.login(token).then(console.log("Setup Finished!"))



async function nameChange() {
	const dirs = fs.readdirSync('/home/runner/Matthew-Bot/amongus');
	var guild = await bot.guilds.fetch("757770623450611784");
	var names = ["Cult.","Needs A New Name Cult","NOT A Black Marketing Cult","Never Plays Among Us Cult","Matthew Cult?","Organ Collector Cult"];
	guild.setIcon(`/home/runner/Matthew-Bot/amongus/${dirs[Math.floor(Math.random()*dirs.length)]}`)
	guild.setName(names[Math.floor(Math.random()*names.length)]).catch((error) => {console.error(error)});
}

