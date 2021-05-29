const Discord = require('discord.js');
var helper = require('../../helpers.js');

module.exports = {
	name: "shop",
	description: "show shop",
	execute(msg, dbClient, args){

    var dbo = dbClient.db("economy");
    dbo.collection("bank").find({}).toArray(function(err, result) {
      var shopEmbed = new Discord.MessageEmbed()
        .setTitle("Shop")
        .setDescription("this is the stonks market. go buy some stonks.")

      for (var i = 0; i < result.length; i++){
        var oldest = result[i].history[result[i].history.length-1];
        var change = (result[i].value - oldest)
        shopEmbed.addField(`${result[i].name} [${result[i].ticker.toUpperCase()}] $${helper.formatNumber(result[i].value.toFixed(2))}`, `${helper.formatNumber(change.toFixed(2))} (${(change/oldest).toFixed(4)*100}%)`)
      }
      msg.reply(shopEmbed);
    });
	}
}