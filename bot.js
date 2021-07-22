//initial constants
const Discord = require('discord.js');
const helpers = require('./helpers.js');
const Sequelize = require('sequelize');

const client = new Discord.Client({ shardCount: 1 });
client.cooldowns = new Discord.Collection();
client.commands = helpers.getCommands();

const config = require('./configuration/config.json')
const AutoPoster = require('topgg-autoposter')
const ap = AutoPoster(config.topggtoken, client)
const botdash = require('botdash.pro');
var dashboard;

const QuickChart = require('quickchart-js');
const humanizeDuration = require('humanize-duration');

require('dotenv').config();

//global variables
var MongoClient = require('mongodb').MongoClient;
var url = config.dburl;
var dbClient = null;

const sequelize = new Sequelize(config.sqldbname, config.sqldbusername, config.sqldbpassword, {
	host: config.sqlhost,
	dialect: 'mysql',
	logging: false,
});

const Logs = sequelize.define('command_log', {
  userid: Sequelize.BIGINT,
  username: Sequelize.TEXT,
	command: Sequelize.TEXT,
	parameters: Sequelize.TEXT,
});

//client login
client.login(config.token);

//client on login
client.on('ready', async () => {
	dashboard = new botdash.APIclient(config.botdashtoken);
	client.user.setActivity(`stonks go brrr`, {
		type: 'WATCHING'
	})
  Logs.sync();
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
			if (result[i].username == "bank")
				continue;
			rigs.add(result[i].rig);
		}
		// convert Set to Array to be able to iterate through them
		var rigArray = Array.from(rigs);
		for (var i = 0; i < rigArray.length; i++) {
			const updateDocument = {
				$inc: {
					balance: (config.moneyPerBlock * rigArray[i])
				}
			};

			// update the balances for all users with this rig level
			var updateQuery = ({ "rig": rigArray[i] });
			dbo.collection("economy").updateMany(updateQuery, updateDocument);
		}
	});
}

//stonks update function
function stockUpdate() {
	var dbo = dbClient.db("economy");
	dbo.collection("bank").find({}).toArray().then(function(result, err) {
		if (err) throw err;
		for (var i = 0; i < result.length; i++) {
			var query = { name: `${result[i].name}` }
			var history = result[i].history;
			history.splice(0, 0, result[i].value);
			history.pop();

			var rand = Math.random() * 2 - 1;
			const updateDocument = {
				$inc: {
					value: (result[i].value * ((result[i].demand) / 1000)) + (0.01 * result[i].value * rand),
					demand: -(1 / 2) * result[i].demand,
				},
				$set: {
					history: history,
				}
			}
			dbo.collection("bank").updateOne(query, updateDocument);
		}
	}).catch(err => { console.log(err) });
}

//loop for stuff
(function loop() {
	var rand = Math.round(Math.random() * (500000 - 250000)) + 250000;
	setTimeout(function() {
		cryptoMine();
		stockUpdate();
		loop();
	}, rand);
	// console.log("a block has been mined")
}());

//command handler
client.on('message', async function(msg) {
	var prefix;
	try {
		prefix = await dashboard.getVal(msg.guild.id, "prefix");
	} catch (err) {
		prefix = '$';
	}

	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	console.log(`${msg.author.username} ${msg.content}`)

	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(msg.author.id)) {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now);
			console.log(`${msg.author.username} please wait ${humanizeDuration(timeLeft)} before reusing \`${command.name}\``)
			return msg.reply(`please wait ${humanizeDuration(timeLeft)} before reusing \`${command.name}\``);
		}
	}
	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);


	try {
		var rv = command.execute(msg, dbClient, args);
    Promise.resolve(rv).then(function(result) {
      if (result == -1) {
	      setTimeout(() => timestamps.delete(msg.author.id));
      }
    }).catch(err => {console.log(err)});
	} catch (error) {
		console.error(error);
		msg.reply('error: bot has crashed');
	}
  try {
    // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
    const log = await Logs.create({
      userid: msg.author.id,
      username: msg.author.username,
      command: commandName,
      parameters: args.join(),
    });
  }
  catch (e) {
    console.log('Something went wrong with adding a tag. Error:', e.name);
  }
});