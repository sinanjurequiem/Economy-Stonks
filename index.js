const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token} = require('./config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});
client.on('message', msg => {
    if (msg.content === `${prefix}ping`) {
        msg.reply(`this isn't the basic command you dumb`)
    } else if (msg.content === `you suck`) {
        msg.reply(`no u`)
    }
});

client.login(token);