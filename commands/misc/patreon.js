const Discord = require('discord.js')

module.exports = {
	name: "patreon",
	description: "donate on patreon. everything donated goes toward keeping the bot running",
	execute(msg, args){
					var patreonembed = new Discord.MessageEmbed()
				.setTitle("Donate to Studio Hyaxn")
				.setDescription("You can become a patron here: https://www.patreon.com/studiohyaxn. All donations are much appreciated.")

			msg.reply(patreonembed)


	}
}