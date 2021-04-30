const Discord = require('discord.js');
const config = require('../../config.json');
const {prefix} = require('../../bot.js')

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
					{ name: "`$buyminer`", value: "buy or upgrade your crypto miner. crypto miners allow you to generate income while afk.", inline: true },
					{ name: "`$shop`", value: "see the stonks on sale. you can't buy directly from it though.", inline: true},
					{ name: "`$buystonks`", value: "buy stonks. to use this command, after typing buystonks, type the number of stonks you want to buy, then the first 4 letters of the stonks you want to buy. complex, i know. but this is an economy. what did you expect?", inline: true},
					{ name: "`$sellstonks`", value: "sell stonks. for usage, check the entry for buystonks.", inline: true},
					{ name: "`$help`", value: "what do you think you're looking at?", inline: true },
					{ name: "`$ping`", value: "this is won't give you your ping, or ping another user, nor will it reply with 'pong'. it is merely a test command.", inline: true },
					{ name: "`$patreon`", value: "donate on patreon. everything donated goes toward keeping the bot running.", inline: true },
					{ name: "`$vote`", value: "vote for the bot on top.gg and get rewards, up to $750000! so vote.", inline: true},
					{ name: "`$deleteaccount`", value: "delete all your progress so far and remove your account.", inline: true},

				)
				.setDescription(`yeah, i know. an economy is complicated. here's a list of my commands and their usage. btw my prefix is \`${prefix}\``)

			msg.reply(helpembed)
	}
}