const Discord = require('discord.js');
var helper = require('../../helpers.js');
const yahooFinance = require('yahoo-finance');

module.exports = {
  name: "stonks",
  description: "see the stonks on sale",
  status: "enabled"
}

module.exports.execute = async function(msg, dbClient, args) {
  var symbols = [];

  var dbo = dbClient.db("economy");
  var query = { id: `${msg.author.id}` };
  const userResult = await dbo.collection("economy_test").find(query).toArray()

  if (args.length == 0) {
    if (userResult.length == 0) {
      msg.reply("type $start to create an account first.");
      throw -1;
    }

    user = userResult[0];

    userStocks = user.stock.map(stock => stock.name);
    if (user.watchlist.length != 0) {
      userStocks = userStocks.concat(user.watchlist);
    }
    var userStocksEmbed = new Discord.MessageEmbed()
      .setTitle(`${msg.author.username}'s stonks (today's price)`)
      .setDescription(`check **$stats** for total values`)
    var watchlistEmbed = new Discord.MessageEmbed()
      .setTitle(`${msg.author.username}'s watchlist (today's price)`)

    const stockResult = await yahooFinance.quote({ symbols: userStocks, modules: ['price'] });

    var watchlist = user.watchlist
    var portfolioTotalValue = 0;
    var portfolioOriginalValue = 0;

    for (var i = 0; i < user.stock.length; i++) {
      var ticker = user.stock[i].name
      var curPrice = stockResult[ticker].price.regularMarketPrice;
      var originalValue = user.stock[i].avgPrice * user.stock[i].quantity;
      var totalValue = curPrice * user.stock[i].quantity;
      var open = stockResult[ticker].price.regularMarketOpen
      var dayGain = curPrice - open;
      portfolioTotalValue += totalValue;
      portfolioOriginalValue += originalValue;

      userStocksEmbed.addField(`${ticker.toUpperCase()} $${helper.formatNumber(curPrice)}`, `${helper.formatNumber(dayGain, sign = '+')} (${helper.formatNumber(100 * dayGain / open)}%)`);
    }
    watchlist.filter(function(value) {
      return !user.stock.includes(value);
    })
    for (var i = 0; i < watchlist.length; i++) {

      var ticker = watchlist[i]
      var curPrice = stockResult[ticker].price.regularMarketPrice;
      var open = stockResult[ticker].price.regularMarketOpen
      var dayGain = curPrice - open;

      watchlistEmbed.addField(`${ticker.toUpperCase()} $${helper.formatNumber(curPrice)}`, `${helper.formatNumber(dayGain, sign = '+')} (${helper.formatNumber(100 * dayGain / open)}%)`);
    }
    var portfolioGain = portfolioTotalValue - portfolioOriginalValue;
    var portfolioEmbed = new Discord.MessageEmbed()
      .setTitle(`portfolio value`)
      .setDescription(`**$${helper.formatNumber(portfolioTotalValue)}**\n${helper.formatNumber(Math.abs(portfolioGain), sign='+')} (${helper.formatNumber(portfolioGain * 100 / portfolioOriginalValue, sign='+')}%)`);
    msg.reply(portfolioEmbed);
    msg.reply(userStocksEmbed);
    msg.reply(watchlistEmbed);
    msg.reply(`use **$stonks <TICKER>** for more options and detailed information`);
  } else {
    symbols = args;
  }
  if (userResult.length != 0) {
    symbols.push(userResult.watchlist)
  }

  const result = await yahooFinance.quote({ symbols: symbols, modules: ['price'] });

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



/*
$stonks
total value
gain ($, %)
your stocks
your watchlist

$stonks AMC
price
day's gain
graph
shares owned
total value
avg price
portfolio %
today's return
total return
1. buy
2. sell
3. toggle watch (currently watching/not watching)
 */