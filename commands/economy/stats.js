const Discord = require('discord.js');
const config = require('../../configuration/config.json');
var helper = require('../../helpers.js');

module.exports = {
  name: "stats",
  description: "get your stats, including bank balance",
  status: "enabled",
  execute(msg, dbClient, args) {
    var taggedUser = msg.mentions.users.first();
    if (!msg.mentions.users.size) {
      taggedUser = msg.author;
    }
    var dbo = dbClient.db("economy");
    var query = { id: `${taggedUser.id}` };
    var queryAll = {};
    var rank = 1;
    var totalUsers;
    var bank;

    var promise = dbo.collection("bank").find(queryAll).toArray().then(function(result, err) {
      if (result.length == 0) {
        throw "bank query all returned empty list"
      }
      bank = result;
      return dbo.collection("economy").find(queryAll).toArray();
    }).then(function(result, err) {
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
      total_users = result.length - 1;

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
            { name: "global rank", value: `#${rank} out of ${total_users} players.` }
          )
        msg.reply(cashStatsEmbed);

        var costOfUpgrade = ((result[0].rig + 2) ** 2) * 100;

        var minerStatsEmbed = new Discord.MessageEmbed()
          .setTitle(`${taggedUser.username}'s Crypto Miner Stats`)
          .setDescription(`this is your crypto miner's stats. it lets you create passive income.`)
          .addFields(
            { name: "miner level", value: `level ${result[0].rig}` },
            { name: "earnings per block", value: `$${config.moneyPerBlock * (result[0].rig / 2)}` },
            { name: "cost to upgrade to next level", value: `$${costOfUpgrade}` }
          )
        msg.reply(minerStatsEmbed);

        var stonksStatsEmbed = new Discord.MessageEmbed()
          .setTitle(`${taggedUser.username}'s Stonks`)
          .setDescription(`Stock, price, total value, total return`)

        for (var i = 0; i < bank.length; i++) {
          var ticker = bank[i].ticker
          var curPrice = bank[i].value
          var userStock = result[0].stock[`${ticker}`]
          var plural = userStock.quantity == 1 ? 0 : 1;
          var stockReturn = userStock.avgPrice == 0 ? 0 : (curPrice - userStock.avgPrice)
          var gain = userStock.avgPrice == 0 ? 0 : (stockReturn * 100 / userStock.avgPrice).toFixed(2)

          stonksStatsEmbed.addField(`[${ticker.toUpperCase()}] $${helper.formatNumber(curPrice.toFixed(2))}, $${helper.formatNumber((curPrice * userStock.quantity).toFixed(2))}, $${helper.formatNumber(stockReturn.toFixed(2))}`, `${bank[i].name} ${userStock.quantity} share${plural ? "s" : ""} ${gain}%`)
        }
        msg.reply(stonksStatsEmbed)
      }
    }).catch(err => { console.log(err); return err });
    return promise;
  }
}