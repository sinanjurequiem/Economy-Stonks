const Discord = require('discord.js');

module.exports = {
	name: "help",
	description: "commands list",
	execute(msg, args){
		
			var helpembed = new Discord.MessageEmbed()
				.setTitle("Economy Help")
				.addFields(
					{ name: "`$start`", value: "open an account at the meme bank.", inline: true },
					{ name: "`$daily`", value: "get your daily dose of internet. jk, get your daily paycheck.", inline: true },
					{ name: "`$hourly`", value: "get your hourly dose of caffeine and work. YOU NEED MONEY, NO TIME FOR SLEEP.", inline: true },
					{ name: "`$stats`", value: "get your stats, including bank balance", inline: true },
					{ name: "`$buyminer`", value: "buy or upgrade your crypto miner. crypto miners allow you to generate income while afk. ***(currently broken, do not use. if you do, you will crash the bot.)***", inline: true },
					{ name: "`$shop`", value: "see the stonks on sale. you can't buy directly from it though. ***(note: buying not implemented yet)***", inline: true},
					{ name: "`$help`", value: "what do you think you're looking at?", inline: true },
					{ name: "`$ping`", value: "this is won't give you your ping, or ping another user, nor will it reply with 'pong'. it is merely a test command.", inline: true },
					{ name: "`$patreon`", value: "donate on patreon. everything donated goes toward keeping the bot running.", inline: true },
					{ name: "`$vote`", value: "vote for the bot on top.gg and get rewards, up to $750000! so vote.", inline: true},
					// { name: "`$buystonks`", value: "vote for the bot on top.gg and get rewards, up to $750000! so vote.", inline: true},
					// { name: "`$sellstonks`", value: "vote for the bot on top.gg and get rewards, up to $750000! so vote.", inline: true}
				)
				.setDescription("yeah, i know. an economy is complicated. here's a list of my commands and their usage.")

			msg.reply(helpembed)
	}
}