const Discord = require('discord.js');
const config = require('../../configuration/config.json');
const { prefix } = require('../../bot.js')
var { getCommands } = require('../../helpers.js')
const disbut = require("discord-buttons");

var commands = getCommands();

module.exports = {
  name: "help",
  description: "what do you think you're looking at?",
  status: "enabled",
  category: "Get Started",
  execute(msg, dbClient, args) {
    if (args.length > 0) {
      command_search = commands.filter(command => command.name == args[0])
      for (command of command_search){
        var helpembed = new Discord.MessageEmbed()
          .setTitle(`Help`)
          .addField(`$${command[1].name}`, command[1].description)
      }
      msg.channel.send(helpembed);
    } else {
      var categories = new Set(commands.map(command => command.category));
      let row = new disbut.MessageActionRow();

      for (category of Array.from(categories)) {
        let button = new disbut.MessageButton()
          .setLabel(category)
          .setID(category)
          .setStyle("blurple");
        row.addComponents(button)
      }

      client.on('clickButton', async (button) => {
        if (button.clicker.user.id == msg.author.id) {
          console.log(button.id)

          var helpembed = new Discord.MessageEmbed()
            .setTitle(button.id.toUpperCase())
          for (command of commands.filter(command => command.category == button.id)) {
            helpembed.addField(`$${command[1].name}`, command[1].description)
          }
          msg.reply(helpembed);
        }
      });

      msg.channel.send("Help Menu", row);
    }

    var promise = new Promise(() => {
      return 0;
    })
    return promise;
  }
}