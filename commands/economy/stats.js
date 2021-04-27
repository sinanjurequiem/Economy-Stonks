const Discord = require('discord.js');

module.exports = {
	name: "stats",
	description: "get your stats",
	execute(msg, dbClient, args){
		var taggedUser = msg.mentions.users.first();
		if (!msg.mentions.users.size){
			taggedUser = msg.author;
      var dbo = dbClient.db("economy");
      var query = { id: `${taggedUser.id}` };
      dbo.collection("economy").find(query).toArray(function(err, result) {
        if (result.length == 0) {
          msg.reply("type $start to create an account first.")
        }
        else {
          var cashStatsEmbed = new Discord.MessageEmbed()
            .setTitle(`${taggedUser.username}'s General Stats`)
            .setDescription(`these are your stats.`)
            .addFields(
              { name: "current money", value: `${Math.round(result[0].balance*100)/100}$` }
            )
          msg.reply(cashStatsEmbed);

          var costOfUpgrade = ((result[0].rig + 2) ** 4) * 100;

          var minerStatsEmbed = new Discord.MessageEmbed()
            .setTitle(`${taggedUser.username}'s Crypto Miner Stats`)
            .setDescription(`this is your crypto miner's stats. it lets you create passive income.`)
            .addFields(
              { name: "miner level", value: `level ${result[0].rig}` },
              { name: "earnings per block", value: `${Math.round(result[0].rig * 0.7 * 100) / 100}$` },
              { name: "cost to upgrade to next level", value: `${costOfUpgrade}$` }
            )
          msg.reply(minerStatsEmbed);

          var stonksStatsEmbed = new Discord.MessageEmbed()
            .setTitle(`${taggedUser.username}'s Stonks`)
            .setDescription(`these are your *stonks*. their value will fluctuate, so buy and sell these as much as you can.`)
            .addFields(
              {name: "Doge Space Inc", value: `${result[0].stock.doge.quantity} shares (avg $${result[0].stock.doge.avgPrice.toFixed(2)})`},
              {name: "Amogus Drip", value: `${result[0].stock.amog.quantity} shares (avg $${result[0].stock.amog.avgPrice.toFixed(2)})`},
              {name: "PewDiePie Memes Ltd", value: `${result[0].stock.pewd.quantity} shares (avg $${result[0].stock.pewd.avgPrice.toFixed(2)})`},
              {name: "Markiplier's FNAF Monopoly", value: `${result[0].stock.mark.quantity} shares (avg $${result[0].stock.mark.avgPrice.toFixed(2)})`},
              {name: "Jack's Septic Tanks", value: `${result[0].stock.jack.quantity} shares (avg $${result[0].stock.jack.avgPrice.toFixed(2)})`},
              {name: "Fartnite by TerribleGames™", value: `${result[0].stock.fart.quantity} shares (avg $${result[0].stock.fart.avgPrice.toFixed(2)})`},
              {name: "Rob Blocks by Builderman Unlimited", value: `${result[0].stock.robb.quantity} shares (avg $${result[0].stock.robb.avgPrice.toFixed(2)})`}
            )
            msg.reply(stonksStatsEmbed)
        }
      });
    }
	}
}