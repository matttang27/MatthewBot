const { prefix, token } = require("../config.json");
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
	args: [-1],
    name: "vote",
    options: "**Options:**\n\n**vote** - votes for an option\n**unvote** - unvotes for an option\n**create** - creates a new voting poll in this channel.\n**add** - adds an option to the poll\n**delete** - deletes an option from the poll\n**stop** - stops the poll in this channel.\n**show** - shows the votes(if allowed)\n**list** - lists all options.\n\n",
	description: "Vote and create polls!",
	usage: `${prefix}vote Matthew Bot`,
	perms: 3,
	async execute(message, args, other) {
		var admin = other[0]
		var bot = other[1]
        var commandName = other[2]
        var db = admin.firestore()
        var firestore = admin.firestore
        const votingRef = db.collection('voting').doc(message.channel.id)
        const voting = await votingRef.get()

        var embed = new Discord.MessageEmbed()
        .setColor('#26abFF')
        if (args.length == 0) {
            embed.setDescription(this.options + "**Ex.** " + this.usage)
            return message.channel.send(embed)
        }
        

        if (args[0] == "create") {
            if (voting.exists) {
                embed.setColor('#DC2700')
                embed.setDescription("This channel already has a poll going on!")
                return message.channel.send(embed)
            }
            if (!(message.member.hasPermission('MANAGE_MESSAGES'))) {
                embed.setColor('#DC2700')
                embed.setDescription("Get the manage messages permissions and then come back to me!")
                return message.channel.send(embed)
            }
            else if (args[1] == "auto") {
                const filter = m => m.member.hasPermission('MANAGE_MESSAGES') && m.author.id == message.author.id
                const collector = message.channel.createMessageCollector(filter, { time: 60000, max: 1});
                embed.setDescription("**Automatic Mode**:\nEnter vote settings with -> title of voting | description | votesperperson(>=1) | option1 $ emoji | option2 $ emoji | option3 $ emoji ...")
                message.channel.send(embed)
                const filter = m => m.author.id == message.author.id
                const collector = message.channel.createMessageCollector(filter, { time: 60000, max: 1});
                embed.setDescription("**Manual Mode**:\nEnter vote settings with -> title of voting | description | votesperperson(>=1) | channelid or \"here\" for this channel | option1 $ emoji | option2 $ emoji | option3 $ emoji ...")
                var sended = await message.channel.send(embed)

                collector.on('end', collected => {
                    var input = collected.first()
                    console.log(input)
                    input = input.content.split(" | ")
                    console.log(input)
                    if (input.length < 4) {
                        embed.setColor('#DC2700')
                        embed.setDescription('**Command Cancelled:** Not enough arguments!')
                        return sended.edit(embed)
                    }
                    else {

                        //checks if arguments are inputted correctly.
                        if (isNaN(input[2])) {
                            return sended.edit(error('**Command Cancelled:** Votes per person was not a number'))
                        }
                        else if (input[2] < 1) {
                            return sended.edit(error('**Command Cancelled:** Maximum votes must be 1 or more.'))
                        }
                        if (isNaN(input[3]) && input[3] != "here") {
                            return sended.edit(error('**Command Cancelled:** 4th argument was not a number or "here"'))
                        }
                        for (i=4;i<input.length;i++) {
                            var temp = input[i].split(" $ ")
                            if (temp.length != 2) {
                                return sended.edit(error(`**Command Cancelled:** Argument ${i+1} did not have a "$" seperator.`))
                            }
                            
                            //if (!temp[1].match(/<:.+?:\d+>/g)) {
                            if (temp[1].length > "😢") {
                                return sended.edit(error(`**Command Cancelled:** An emoji could not be detected in argument ${i+1}.`))
                            } 
                        }
                        
                    }

                });
            }
            else {
                
            }
        }

		function error(message) {
            const embed = new Discord.MessageEmbed()
            .setColor('#DC2700')
            .setDescription(message)
            return embed
        }

		
	}
};	