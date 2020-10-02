const { prefix, token } = require("../config.json");

module.exports = {
	args: [0],
	name: "ping",
	category: "bot",
	aliases: ["pong","latency","lag"],
	description: "Ping me!",
	usage: `${prefix}ping`,
	perms: 4,
	
	execute(message, args, other) {
		var ping = Date.now() - message.createdAt
		if (other[2] == "ping") {
			var added = ":ping_pong: Pong! "
		}
		else if (other[2] == "pong") {
			var added = ":ping_pong: Ping! "
		}
		else {
			var added = "Ping: "
		}
		message.channel.send(added + `\`${ping}ms\``);
		
	},
};

function msToTime(ms){
  days = Math.floor(ms / 86400000); // 24*60*60*1000
  daysms = ms % 86400000; // 24*60*60*1000
  hours = Math.floor(daysms / 3600000); // 60*60*1000
  hoursms = ms % 3600000; // 60*60*1000
  minutes = Math.floor(hoursms / 60000); // 60*1000
  minutesms = ms % 60000; // 60*1000
  sec = Math.floor(minutesms / 1000);

  let str = "";
  if (days) str = str + days + "d";
  if (hours) str = str + hours + "h";
  if (minutes) str = str + minutes + "m";
  if (sec) str = str + sec + "s";

  return str;
}