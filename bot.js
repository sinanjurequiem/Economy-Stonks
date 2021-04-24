//initial constants
const Discord = require('discord.js');
const client = new Discord.Client({ shardCount: 1 });
client.commands = new Discord.Collection();
const fs = require("fs");
const commandFolders = fs.readdirSync('./commands');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}
const config = require('./config.json')
const AutoPoster = require('topgg-autoposter')
const ap = AutoPoster(config.topggtoken, client)
ap.on('posted', () => {
	console.log('Posted stats to Top.gg!')
})

const prefix = config.prefix;
const QuickChart = require('quickchart-js');
const humanizeDuration = require('humanize-duration');

require('dotenv').config();



//global variables
const moneyPerBlock = 0.7;
var MongoClient = require('mongodb').MongoClient;
var url = config.dburl;
var dbClient = null;


//client login
client.login(config.token);

//client on login
client.on('ready', () => {
	console.log(`Bot is ready. (${client.guilds.cache.size} Guilds - ${client.channels.cache.size} Channels - ${client.users.cache.size} Users)`);
	let activities = [`stonks go brr`, `stonks go brrr`, `stonks go brrrr`], i = 0;
	setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: "WATCHING" }), 50000)
});

MongoClient.connect(url, function(err, db) {
  dbClient = db;
})

//cryptomining function
function cryptoMine() {
  var dbo = dbClient.db("economy");

  // unique list of rigs
  var rigs = new Set();

  // query for all users
  var query = ({});
  dbo.collection("economy").find(query).toArray(function(err, result) {
    if (err) throw err;
    if (result == undefined)
      console.log("no users");

    // go through the users to get a unique Set of rigs
    for (var i = 0; i < result.length; i++) {
      rigs.add(result[i].rig);
    }

    // convert Set to Array to be able to iterate through them
    var rigArray = Array.from(rigs);
    for (var i = 0; i < rigArray.length; i++) {

      const updateDocument = {
        $inc: {
          balance: (rigArray[i]+2)**3*100
        }
      };

      // update the balances for all users with this rig level
      var updateQuery = ({ "rig": rigArray[i] });
      dbo.collection("economy").updateMany(updateQuery, updateDocument);
    }
  });
}

// //stonks update function
// function stockUpdate(){
// 	var dbo = dbClient.db("economy");
// 	var query = ({bank: "1"});
// 	dbo.collection("economy").find(query).toArray(function(err, result){
// 		if (err) throw err;
// 		var stockList = result[0].
// 		const updateDocument = {
// 			$inc: {
				
// 			}
// 		}

// 	})
// }

//loop for stuff
(function loop() {
	var rand = Math.round(Math.random() * (500000 - 250000)) + 250000;
	setTimeout(function() {
		cryptoMine();
		loop();
	}, rand);
	console.log("a block has been mined")
}());

//command handler
client.on('message', msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	try {
		command.execute(msg, dbClient, args);
	} catch (error) {
		console.error(error);
		msg.reply('congratulations. you crashed the bot. please report this by sending a dm to SRequiem#9127.');
	}
});

//require('child_process').fork('./dashboard/index.js');

//top.gg voting stuff
const Topgg = require("@top-gg/sdk")
const express = require("express")
const app = express()
const webhook = new Topgg.Webhook("d56VME40aC")

app.post("/dblwebhook", webhook.listener(vote => {
  console.log(`${vote.user} has voted.`);
  var dbo = dbClient.db("economy");
  var query = { id: `${vote.user}` };
  dbo.collection("economy").find(query).toArray(function(err, result) {
    if (result.length == 0){
      return;
    } else {
      const updateDocument = {
        $inc: {
          balance: (result[0].balance+100)*0.05
        },
      };
      dbo.collection("economy").updateOne(query, updateDocument, function(err, res) {
        if (err) throw err;
        let voter = vote.user();
        client.users.cache.get(vote.user.id).send(`Thank you for voting. You have recieved $${(result[0].balance+100)*0.05}. Vote again in 12 hours to recieve your next reward.`);
      })
    }
  })
}))

app.listen(8080)