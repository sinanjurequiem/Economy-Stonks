const Discord = require('discord.js');
const config = require('../../configuration/config.json');
var helper = require('../../helpers.js');

module.exports = {
	name: "stats",
	description: "get your stats",
	execute(msg, dbClient, args){
		var taggedUser = msg.mentions.users.first();
		if (!msg.mentions.users.size){
			taggedUser = msg.author;
		}
      var dbo = dbClient.db("economy");
      var query = { id: `${taggedUser.id}` };
      var queryAll = {};
      var rank = 1;
      var totalUsers;

      dbo.collection("economy").find(queryAll).toArray().then(function(result, err) {
        var balance;
        for (var i = 0; i < result.length; i++) {
          if (result[i].id == msg.author.id) {
            balance = result[i].balance;
            break;
          }
        }
        for (var i = 0; i < result.length; i++) {
          if (result[i].id == msg.author.id || result[i].username == 'bank') {
            continue;
          }
          if (result[i].balance > balance) {
            rank += 1;
          }
        }
        total_users = result.length-1;

        return dbo.collection("economy").find(query).toArray();
      }).then(function(result, err) {
        if (result.length == 0) {
          msg.reply("type $start to create an account first.")
        }
        else {
          var cashStatsEmbed = new Discord.MessageEmbed()
            .setTitle(`${taggedUser.username}'s General Stats`)
            .setDescription(`These are your stats`)
            .addFields(
              { name: "bank balance", value: `$${helper.formatNumber(result[0].balance.toFixed(2))}` },
							{ name: "global rank", value: `#${rank} out of ${total_users} players.`}
            )
          msg.reply(cashStatsEmbed);

          var costOfUpgrade = ((result[0].rig + 2) ** 2) * 100;

          var minerStatsEmbed = new Discord.MessageEmbed()
            .setTitle(`${taggedUser.username}'s Crypto Miner Stats`)
            .setDescription(`this is your crypto miner's stats. it lets you create passive income.`)
            .addFields(
              { name: "miner level", value: `level ${result[0].rig}` },
              { name: "earnings per block", value: `$${config.moneyPerBlock*(result[0].rig/2)}` },
              { name: "cost to upgrade to next level", value: `$${costOfUpgrade}` }
            )
          msg.reply(minerStatsEmbed);

          var stonksStatsEmbed = new Discord.MessageEmbed()
            .setTitle(`${taggedUser.username}'s Stonks`)
            .setDescription(`these are your *stonks*. their value will fluctuate, so buy and sell these as much as you can.`)
            .addFields(
              {name: "Doge Space Inc", value: `${result[0].stock.dgs.quantity} shares (avg $${result[0].stock.dgs.avgPrice.toFixed(2)})`},
              {name: "Amogus Drip", value: `${result[0].stock.adp.quantity} shares (avg $${result[0].stock.adp.avgPrice.toFixed(2)})`},
              {name: "PewDiePie Memes Ltd", value: `${result[0].stock.pdp.quantity} shares (avg $${result[0].stock.pdp.avgPrice.toFixed(2)})`},
              {name: "Markiplier's FNAF Monopoly", value: `${result[0].stock.mkp.quantity} shares (avg $${result[0].stock.mkp.avgPrice.toFixed(2)})`},
              {name: "Jack's Septic Tanks", value: `${result[0].stock.jst.quantity} shares (avg $${result[0].stock.jst.avgPrice.toFixed(2)})`},
              {name: "Fartnite by TerribleGames™", value: `${result[0].stock.ftg.quantity} shares (avg $${result[0].stock.ftg.avgPrice.toFixed(2)})`},
              {name: "Rob Blocks by Builderman Unlimited", value: `${result[0].stock.rbk.quantity} shares (avg $${result[0].stock.rbk.avgPrice.toFixed(2)})`}
            )
            msg.reply(stonksStatsEmbed)
        }
      }).catch(err => {console.log(err)});
    }
	}
