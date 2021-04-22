const Discord = require('discord.js')

module.exports = {
	name: "vote",
	description: "vote on top.gg",
	execute(msg, args){
		var voteEmbed = new Discord.MessageEmbed()
		.setTitle("Vote for Economy Stonks on top.gg")
		.setDescription("Vote here and get a random reward, up to 10% of your current net worth.")
		.setURL("https://top.gg/bot/803384014618624081");

		msg.reply(voteEmbed);
	}
}