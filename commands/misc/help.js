const Discord = require('discord.js');
const config = require('../../configuration/config.json');
const { prefix } = require('../../bot.js')
var { getCommands } = require('../../helpers.js')

var commands = getCommands();

module.exports = {
  name: "help",
  description: "what do you think you're looking at?",
  status: "enabled",
  category: "get started",
  execute(msg, args) {
    var helpembed = new Discord.MessageEmbed()
      .setTitle("Economy Help")
      .setDescription(`yeah, i know. an economy is complicated. here's a list of my commands and their usage.`)
    msg.reply(helpembed)
    
    var categories = new Set(commands.map(command => command.category))
    
    for (category of Array.from(categories)) {

      var helpembed = new Discord.MessageEmbed()
        .setTitle(category.toUpperCase())
      for (command of commands.filter(command => command.category == category)) {
        helpembed.addField(command[1].name, command[1].description)
      }
      msg.reply(helpembed);
    }

    var promise = new Promise(() => {
      return 0;
    })
    return promise;
  }
}