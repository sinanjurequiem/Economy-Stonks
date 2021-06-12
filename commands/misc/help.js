const Discord = require('discord.js');
const config = require('../../configuration/config.json');
const { prefix } = require('../../bot.js')
var { getCommands }= require('../../helpers.js')

var commands = getCommands();

module.exports = {
	name: "help",
	description: "what do you think you're looking at?",
  status: "enabled",
	execute(msg, args){
      var helpembed = new Discord.MessageEmbed()
        .setTitle("Economy Help")
        .setDescription(`yeah, i know. an economy is complicated. here's a list of my commands and their usage. btw my prefix is \`${prefix}\``)
      for (entry of commands){
        if (entry[0] != undefined && entry[1].status == "enabled")
          helpembed.addField(entry[1].name, entry[1].description)
      }
      msg.reply(helpembed);

      var promise = new Promise(() => {
        return 0;
      })
      return promise;
  }
}