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
          // console.log(result[0].balance);
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
              {name: "Doge Space Inc", value: `${result[0].dogestock} shares`},
              {name: "Amogus Drip", value: `${result[0].amogusdrip} shares`},
              {name: "PewDiePie Memes Ltd", value: `${result[0].pewdiepies} shares`},
              {name: "Markiplier's FNAF Monopoly", value: `${result[0].markipliers} shares`},
              {name: "Jack's Septic Tanks", value: `${result[0].jacksepticeyes} shares`},
              {name: "Fartnite by TerribleGames™", value: `${result[0].fartnite} shares`},
              {name: "Rob Blocks by Builderman Unlimited", value: `${result[0].robblocks} shares`}
            )
            msg.reply(stonksStatsEmbed)
        }
      });
    }
	}
}