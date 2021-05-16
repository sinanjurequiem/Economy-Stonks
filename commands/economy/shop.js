const Discord = require('discord.js');
var helper = require('../../helpers.js');

module.exports = {
	name: "shop",
	description: "show shop",
	execute(msg, dbClient, args){

    var dbo = dbClient.db("economy");
    dbo.collection("bank").find({}).toArray(function(err, result) {
      console.log(result)
      var shopEmbed = new Discord.MessageEmbed()
        .setTitle("Shop")
        .setDescription("this is the stonks market. go buy some stonks.")

      for (var i = 0; i < result.length; i++){
        shopEmbed.addField(`${result[i].name} [${result[i].ticker.toUpperCase()}]`, `Quantity: ${result[i].quantity}/${result[i].totalQuantity} in stock. Value is $${helper.formatNumber(result[i].value.toFixed(2))}`)
      }
      msg.reply(shopEmbed);
    });
	}
}