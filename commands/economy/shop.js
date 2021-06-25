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
        .setDescription(`**$${helper.formatNumber(portfolioTotalValue)}**\n${helper.formatNumber(Math.abs(portfolioGain), sign = '+')} (${helper.formatNumber(portfolioGain * 100 / portfolioOriginalValue, sign = '+')}%)`);
      msg.reply(portfolioEmbed);
      msg.reply(userStocksEmbed);
      msg.reply(watchlistEmbed);
      msg.reply(`use **$stonks <TICKER>** for more options and detailed information`);
      return;
    } else {
      symbols = args;
    }

    const stockResult = await yahooFinance.quote({ symbols: symbols, modules: ['price'] });
    
    var toDate = Date.now();
    var fromDate = new Date(toDate - 10*604800000);
    var histories = await yahooFinance.historical({
      symbols: symbols,
      from: fromDate,
      to: new Date(toDate),
      period: 'd'});

    for (var i = 0; i < symbols.length; i++) {
      var stock = stockResult[symbols[i]];
      if (stock.price.shortName == null) {

        continue;
      }
      var stonkEmbed = new Discord.MessageEmbed()
        .setTitle(`${symbols[i].toUpperCase()}`)
        .setDescription(`${stock.price.shortName}`);

      var change = (stock.price.regularMarketPrice - stock.price.regularMarketOpen);
      stonkEmbed.addField(`$${stock.price.regularMarketPrice}`, `${helper.formatNumber(change, sign='+')} (${helper.formatNumber((change * 100 / stock.price.regularMarketOpen), sign='+')}%)`);

      var history = histories[symbols[i]];
      var prices = history.map(quote => quote.high);
      var dates = history.map(quote => quote.date);

      await helper.generatePlot(dates, prices);

      var attachment = await helper.drawCanvas(125, 125);
      // msg.reply(attachment);
      stonkEmbed.attachFiles(attachment);
      // stonkEmbed.setImage('./test.png')
      msg.reply(stonkEmbed);
      // msg.reply(attachment)
    }
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