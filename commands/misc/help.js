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
  category: "get started",
  execute(msg, args) {

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
          helpembed.addField(command[1].name, command[1].description)
        }
        msg.reply(helpembed);
      }
    });

    msg.channel.send("Help Menu", row);

    var promise = new Promise(() => {
      return 0;
    })
    return promise;
  }
}