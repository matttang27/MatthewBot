const fs = require('fs');
const Discord = require("discord.js");
const bot = new Discord.Client();
const {prefix, token, ownerID, rpgprefix} = require("./config.json");
bot.commands = new Discord.Collection();
bot.rpgcommands = new Discord.Collection();


const Role = require('./role.js')

//currently making roles in the other repl.it
const queue = new Map();
var games = []


var praise = ["nice","good","amazing","godly","legend"]

var chat = new Map();

function cleanup(str) {
	//I don't even know man
  return str.replace(/[^0-9a-z-A-Z ]/g, "").replace(/ +/, " ")
}



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


//bunch of reactions
var inputs = [
	["asdfgergighr"],

	["pog","poggers","pogchamp"],

	["mbot","m-bot","matthewbot","matthew bot"],

	["weirdchamp"]
]
var outputs = [
	["EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE\nEE         EE         EE         EE         EE         EE         EE         EE         EE\nEEEE    EEEE     EEEE    EEEE     EEEE    EEEE     EEEE     EEEE    EEEE\nEE         EE         EE         EE         EE         EE         EE         EE         EE\nEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE\nEEEEEEEEEEEEEEEEEE\nEE         EE         EE\nEEEE    EEEE     EEEE\nEE         EE         EE\nEEEEEEEEEEEEEEEEEE\nEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE\nEE         EE         EE         EE         EE         EE\nEEEE    EEEE     EEEE    EEEE    EEEE     EEEE\nEE         EE         EE         EE         EE         EE\nEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE\nEEEEEEEEEEEEEEEEEE\nEE         EE         EE\nEEEE    EEEE     EEEE\nEE         EE         EE\nEEEEEEEEEEEEEEEEEE\nEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE\nEE         EE         EE         EE         EE         EE         EE         EE         EE\nEEEE    EEEE     EEEE    EEEE     EEEE    EEEE     EEEE     EEEE    EEEE\nEE         EE         EE         EE         EE         EE         EE         EE         EE\nEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"],

	["That's pretty pog <a:pog:758146624400392212>"],
	
	["Did someone say ~~jim~~ **MATTHEW BOT?**"],
	
	
	["True, that is kinda weirdchamp.","https://tenor.com/view/weirdchamping-weirdchamp-twitch-meme-ryan-gutierrez-gif-17202815"]
]


/*input meaning
&& - and
|| = or
! = not
%% = doesn't have
## = has
->> = word comes after(add spaces manually)
() = brackets
;;"" = response(s) (In quotes)
ex.

##("very"->>"pog"||"that's"->>"pog")&&%%"weirdchamp";;"That's pretty pog"
If string has very pog or that's pog, and doesn't have weirdchamp, respond with That's pretty pog
##abdullah&&%%supreme;;"You must call him Supreme Leader Abdullah!"

WIP
*/

function converter(input,rule,output) {
	//WIP
} 




  

// discord


bot.on("ready", () => {
  console.log("Bot Ready!");
  changeStatus()
});

bot.on("message", async message => {
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

	try {
	//checks if message starts with the prefix for commands, and if the message was sent by a bot

	//ping response
	var temp = message.content.toLowerCase()
	var pingers = ["Ping me again b*tch I dare you","I guess you wanna die today huh?","I've got things to do.","Sigh...you got a death wish?","Oml..what do you want.","Sup.","Please..stfu man","Stop pinging me","I'm blocking you.","Just let me sleep","Someone kill me"]
	if (message.mentions.has(bot.user)) {
		message.channel.send(pingers[Math.floor(Math.random()*pingers.length)])
	}

	if (message.channel.type == "text") {
		
		
		//Human trafficking cult stuff
		if (message.guild.id == "757770623450611784") {
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

})

//stalker time!
bot.on("presenceUpdate", async function(oldMember, newMember){
	

	
	

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
    server.listen(3000, ()=>{console.log("Server is Ready!")});
}





keepAlive()
bot.login(token).then(console.log("Setup Finished!"))


//checks games.json every 10 seconds to clear old challenges
var namechange = setInterval(async function() {
	var guild = await bot.guilds.fetch("757770623450611784");
	var names = ["Cult.","Needs A New Name Cult","NOT A Black Marketing Cult","Never Plays Among Us Cult","Matthew Cult?","Organ Collector Cult"];
	guild.setName(names[Math.floor(Math.random()*names.length)]).catch((error) => {console.error(error)});
}, 600000)

var gameclear = setInterval(function(){
	var g = JSON.parse(fs.readFileSync('games.json').toString());
	var games = g.games.filter(myFunction);

	function myFunction(game) {
		var diff = Date.now() - game.challengetime
		return Math.floor(diff/60000) < 5
	}
	g.games = games
	let data = JSON.stringify(g,null,2);
	fs.writeFileSync('games.json', data);
},10000)

//clears counters every minute
var gameclear = setInterval(function(){
	var g = JSON.parse(fs.readFileSync('games.json').toString());
	var games = g.games.filter(myFunction);

	function myFunction(game) {
		var diff = Date.now() - game.challengetime
		return Math.floor(diff/60000) < 5
	}
	g.games = games
	let data = JSON.stringify(g,null,2);
	fs.writeFileSync('games.json', data);
},60000)

function changeStatus() {
	setTimeout(function(){
		bot.user.setPresence({ activity: { name: 'Everyone must die.' }, status: 'dnd' })
		.then()
		.catch(console.error);
		var message2 = setTimeout(function(){
			bot.user.setPresence({ activity: { name: 'Everyone must die.' }, status: 'idle' })
			.then()
			.catch(console.error);
			var message3 = setTimeout(function(){
				bot.user.setPresence({ activity: { name: 'Everyone must die.' }, status: 'online' })
				.then()
				.catch(console.error);
				changeStatus()
			},10000)
		}, 10000)

	}, 10000)
}

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
}   

