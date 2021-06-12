const Canvas = require('canvas');
const Discord = require('discord.js');
const config = require('../../configuration/config.json');
var helper = require('../../helpers.js');

module.exports = {
  name: "image",
  description: "test canvas",
  status: "disabled"
}
module.exports.execute = async function(msg, dbClient, args) {
  const canvas = Canvas.createCanvas(700, 250);
  const context = canvas.getContext('2d');

  // Since the image takes time to load, you should await it
  const background = await Canvas.loadImage('./wallpaper.jpg');
  // This uses the canvas dimensions to stretch the image onto the entire canvas
  context.drawImage(background, 0, 0, canvas.width, canvas.height);
  // Set the color of the stroke
  context.strokeStyle = '#74037b';
  // Draw a rectangle with the dimensions of the entire canvas
  context.strokeRect(0, 0, canvas.width, canvas.height);
  // Use the helpful Attachment class structure to process the file for you
  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

  msg.reply(attachment);
}