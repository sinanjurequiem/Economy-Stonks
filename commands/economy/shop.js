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
        {name: "Doge Space Inc", value: `${result[0].doge.quantity} in stock. Value is $${result[0].doge.value}`},
        {name: "Amogus Drip", value: `${result[0].amog.quantity} in stock. Value is $${result[0].amog.value}`},
        {name: "PewDiePie Memes Ltd", value: `${result[0].pewd.quantity} in stock. Value is $${result[0].pewd.value}`},
        {name: "MarkiPlier's FNAF Monopoly", value: `${result[0].mark.quantity} in stock. Value is $${result[0].mark.value}`},
        {name: "Jack's Septic Tanks", value: `${result[0].jack.quantity} in stock. Value is $${result[0].jack.value}`},
        {name: "Fartnite by TerribleGames™", value: `${result[0].fart.quantity} in stock. Value is $${result[0].fart.value}`},
        {name: "Rob Blocks by Builderman Unlimited", value: `${result[0].robb.quantity} in stock. Value is $${result[0].robb.value}`}
      )
      msg.reply(shopEmbed);
    });
	}
}