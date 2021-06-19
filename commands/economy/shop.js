const Discord = require('discord.js');
var helper = require('../../helpers.js');
const yahooFinance = require('yahoo-finance');

module.exports = {
  name: "stonks",
  description: "see the stonks on sale",
  status: "enabled"
}

module.exports.execute = async function(msg, dbClient, args) {
  var shopEmbed = new Discord.MessageEmbed()
    .setTitle("Stonks")
    .setDescription("this is the stonks market.")
  var symbols = [];
  if (args.length == 0) {
    symbols = ['AAPL', 'asdf', 'AMC', 'TSLA'];
  } else {
    symbols = args;
  }

  const result = await yahooFinance.quote({symbols: symbols, modules:['price']});

  for (var i = 0; i < symbols.length; i++) {
    var stock = result[symbols[i]];
    if (stock.price.shortName == null) {

      continue;
    }

    var change = (stock.price.regularMarketPrice - stock.price.regularMarketOpen);

    shopEmbed.addField(`${stock.price.shortName} [${symbols[i]}] $${stock.price.regularMarketPrice}`, `${helper.formatNumber(change.toFixed(2))} (${helper.formatNumber((change * 100 / stock.price.regularMarketOpen).toFixed(2))}%)`)
  }
  msg.reply(shopEmbed);
}