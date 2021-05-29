const Canvas = require('canvas');
const Discord = require('discord.js');
const config = require('../../configuration/config.json');
var helper = require('../../helpers.js');

module.exports = {
	name: "image",
	description: "test node-html-to-image",
	execute(msg, dbClient, args) {
    if (args.length == 0){
      msg.reply("no args")
      return;
    }
    name = args[0]
    const _htmlTemplate = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <style>
        body {
          font-family: "Poppins", Arial, Helvetica, sans-serif;
          background: rgb(22, 22, 22);
          color: #fff;
          max-width: 300px;
        }

        .app {
          max-width: 300px;
          padding: 20px;
          display: flex;
          flex-direction: row;
          border-top: 3px solid rgb(16, 180, 209);
          background: rgb(31, 31, 31);
          align-items: center;
        }

        img {
          width: 50px;
          height: 50px;
          margin-right: 20px;
          border-radius: 50%;
          border: 1px solid #fff;
          padding: 5px;
        }
      </style>
    </head>
    <body>
      <div class="app">
        <img src="https://avatars.dicebear.com/4.5/api/avataaars/${name}.svg" />

        <h4>Welcome ${name}</h4>
      </div>
    </body>
  </html>
  `

    const images = nodeHtmlToImage({
      html: _htmlTemplate,
      quality: 100,
      type: 'jpeg',
      puppeteerArgs: {
        args: ['--no-sandbox'],
      },
      encoding: 'buffer',
    }).then(function(result,err){
      msg.channel.send(new MessageAttachment(images, `${name}.jpeg`));
    }).catch(err => {console.log(err)});
  // for more configuration options refer to the library

  }
}