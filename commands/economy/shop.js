const Discord = require('discord.js');

module.exports = {
	name: "shop",
	description: "show shop",
	execute(msg, dbClient, args){

    var dbo = dbClient.db("economy");
    var query = { "bank": "1" };
    dbo.collection("economy").find(query).toArray(function(err, result) {
      var shopEmbed = new Discord.MessageEmbed()
        .setTitle("Shop")
        .setDescription("this is the stonks market. go buy some stonks.")
        .addFields(
        {name: "Doge Space Inc", value: `${result[0].doge.quantity}/${result[0].doge.totalQuantity} in stock. Value is $${result[0].doge.value.toFixed(2)}`},
        {name: "Amogus Drip", value: `${result[0].amog.quantity}/${result[0].amog.totalQuantity} in stock. Value is $${result[0].amog.value.toFixed(2)}`},
        {name: "PewDiePie Memes Ltd", value: `${result[0].pewd.quantity}/${result[0].pewd.totalQuantity} in stock. Value is $${result[0].pewd.value.toFixed(2)}`},
        {name: "MarkiPlier's FNAF Monopoly", value: `${result[0].mark.quantity}/${result[0].mark.totalQuantity} in stock. Value is $${result[0].mark.value.toFixed(2)}`},
        {name: "Jack's Septic Tanks", value: `${result[0].jack.quantity}/${result[0].jack.totalQuantity} in stock. Value is $${result[0].jack.value.toFixed(2)}`},
        {name: "Fartnite by TerribleGames™", value: `${result[0].fart.quantity}/${result[0].fart.totalQuantity} in stock. Value is $${result[0].fart.value.toFixed(2)}`},
        {name: "Rob Blocks by Builderman Unlimited", value: `${result[0].robb.quantity}/${result[0].robb.totalQuantity} in stock. Value is $${result[0].robb.value.toFixed(2)}`}
      )
      msg.reply(shopEmbed);
    });
	}
}