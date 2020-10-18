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

	["mbot","m-bot","matthewbot","matthew bot","720466960118186015"],

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
	var type = "";

	try {
	//checks if message starts with the prefix for commands, and if the message was sent by a bot
	var temp = message.content.toLowerCase()
	if (message.author.bot) {
		return
	};
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
		message.channel.send("I don't think I have that command ;-;");
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

