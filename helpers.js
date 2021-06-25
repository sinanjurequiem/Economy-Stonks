const Discord = require('discord.js');
const fs = require("fs");
const config = require('./configuration/config.json');
var plotly = require('plotly')(config.plotly_username, config.plotly_API_key);
const Canvas = require('canvas');

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

exports.formatNumber = function (num, sign = '-', decimals = 2) {
  var rtext = num.toFixed(decimals).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  if (sign.includes('+') && num >= 0) {
    return '+' + rtext;
  }
  return rtext;
};

exports.generatePlot = function (xvalues, yvalues, filename = 'default.png') {
  return new Promise((resolve, reject) =>{
    var trace1 = {
      x: xvalues,
      y: yvalues,
      type: "scatter",
      line: {
        width: 10
      }
    };
    var data = { data: [trace1] };
    var layout = {
      xaxis: { domain: [0, 0.45] },
      yaxis: { domain: [0, 0.45] }
    };

    var graphOptions = {
      layout: layout,
      format: filename.split('.')[1]
    }

    plotly.getImage(data, graphOptions, function(err, imageStream) {
      if ( err ) return reject(err);

      // save the file, the load the file?
      var fileStream = fs.createWriteStream(filename);
      imageStream.pipe(fileStream)
      fileStream.on('error', reject);
      fileStream.on('finish', resolve);
    });
  })
}


exports.drawCanvas = async function(width, height, filename = 'default.png') {
      const canvas = Canvas.createCanvas(width, height);
      const context = canvas.getContext('2d');

      // Since the image takes time to load, you should await it
      const background = await Canvas.loadImage(filename);
      // This uses the canvas dimensions to stretch the image onto the entire canvas
      context.drawImage(background, 0, 0, canvas.width, canvas.height);
      // Use the helpful Attachment class structure to process the file for you
      return new Discord.MessageAttachment(canvas.toBuffer(), filename);
}