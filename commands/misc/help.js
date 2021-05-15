const Discord = require('discord.js');
const config = require('../../configuration/config.json');
const {prefix} = require('../../bot.js')

module.exports = {
	name: "help",
	description: "commands list",
	execute(msg, args){
		
			var helpembed = new Discord.MessageEmbed()
				.setTitle("Economy Help")
				.addFields(
					{ name: "`$start`", value: "open an account at the meme bank."},
					{ name: "`$daily`", value: "get your daily dose of internet. jk, get your daily paycheck."},
					{ name: "`$hourly`", value: "get your hourly dose of caffeine and work. YOU NEED MONEY, NO TIME FOR SLEEP."},
					{ name: "`$vote`", value: "vote for the bot on top.gg and get rewards!"},
					{ name: "`$stats`", value: "get your stats, including bank balance"},
					{ name: "`$leaderboard`", value: "show the 10 people around the world with the highest bank balance"},
					{ name: "`$buyminer`", value: "buy or upgrade your crypto miner. crypto miners allow you to generate income while afk."},
					{ name: "`$shop`", value: "see the stonks on sale."},
					{ name: "`$buystonks`", value: "$buystonks <qty> <first 4 letters of stock>"},
					{ name: "`$sellstonks`", value: "sell stonks. for usage, check the entry for buystonks."},
					{ name: "`$help`", value: "what do you think you're looking at?"},
					{ name: "`$patreon`", value: "donate on patreon. everything donated goes toward keeping the bot running."},
					{ name: "`$blanks`", value: "do a fill in the blanks game. no, we aren't copying dank memer."}
				)
				.setDescription(`yeah, i know. an economy is complicated. here's a list of my commands and their usage. btw my prefix is \`${prefix}\``)

			msg.reply(helpembed)
	}
}