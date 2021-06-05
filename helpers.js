const Discord = require('discord.js');
const fs = require("fs");

var commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

exports.getCommands = function() {
  var command;
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      command = require(`./commands/${folder}/${file}`);
      commands.set(command.name, command);
    }
  }
  return commands;
};

exports.formatNumber = function (num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
};