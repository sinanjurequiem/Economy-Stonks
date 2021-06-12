const Discord = require('discord.js');
var helper = require('../../helpers.js');

module.exports = {
  name: "stonks",
  description: "see the stonks on sale",
  status: "enabled",
  execute(msg, dbClient, args) {

    var dbo = dbClient.db("economy");
    var promise = dbo.collection("bank").find({}).toArray(function(err, result) {
      var shopEmbed = new Discord.MessageEmbed()
        .setTitle("Shop")
        .setDescription("this is the stonks market. go buy some stonks. The gain shown is over the last 5 hours.")

      for (var i = 0; i < result.length; i++) {
        var oldest = result[i].history[result[i].history.length - 1];
        var change = (result[i].value - oldest);
        var sign = change > 0 ? ':arrow_up_small:' : ':small_red_triangle_down:';
        var rating = `neutral`
        switch (true) {
          case result[i].demand > 5:
            rating = `BUY`;
            break;
          case result[i].demand < -5:
            rating = `SELL`;
            break;
          default:
            rating = `neutral`;
            break;
        }
        shopEmbed.addField(`${result[i].name} [${result[i].ticker.toUpperCase()}] $${helper.formatNumber(result[i].value.toFixed(2))}`, `${sign} ${helper.formatNumber(change.toFixed(2))} (${helper.formatNumber((change * 100 / oldest).toFixed(2))}%)\tRating: ${rating}`)
      }
      msg.reply(shopEmbed);
    }).catch(err => { console.log(err); return err });
    return promise;
  }
}