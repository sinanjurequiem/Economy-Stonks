const Discord = require('discord.js');
const config = require('../../configuration/config.json');
var helper = require('../../helpers.js');
const yahooFinance = require('yahoo-finance');

module.exports = {
  name: "stats",
  description: "get your stats, including bank balance",
  status: "enabled"
}

module.exports.execute = async function(msg, dbClient, args) {
  if (args.length == 0)
      taggedUser = msg.author.username;
  else {
    if (!msg.mentions.users.size)
      taggedUser = args.join(' ');
    else
      taggedUser = msg.mentions.users.first().username;
  }

  var dbo = dbClient.db("economy");
  var rank, totalUsers, user, totalReturn = 0, originalInput = 0, portfolioValue = 0;

  var result = await dbo.collection("economy_test").find({}).toArray();

  if (result.filter(user => user.id == msg.author.id).length == 0) {
    msg.reply("type $start to create an account first.");
    throw -1;
  }
  userSearch = result.filter(user => user.username == taggedUser);
  if (userSearch.length == 0) {
    msg.reply("Tagged user doesn't exist.");
    throw `Tagged user doesn't exist. ${taggedUser}`;
  }
  user = userSearch[0];
  balance = user.balance;

  rank = result.filter(user => user.balance > balance).length;
  total_users = result.length;

  var cashStatsEmbed = new Discord.MessageEmbed()
    .setTitle(`${taggedUser}'s General Stats`)
    .setDescription(`These are your stats`)
    .addFields(
      { name: "bank balance", value: `$${helper.formatNumber(balance.toFixed(2))}` },
      { name: "global rank", value: `#${rank} out of ${total_users} players.` }
    )
  msg.reply(cashStatsEmbed);

  var costOfUpgrade = ((user.rig + 2) ** 2) * 100;

  var minerStatsEmbed = new Discord.MessageEmbed()
    .setTitle(`${taggedUser}'s Crypto Miner Stats`)
    .setDescription(`this is your crypto miner's stats. it lets you create passive income.`)
    .addFields(
      { name: "miner level", value: `level ${user.rig}` },
      { name: "earnings per block (~8 blocks mined per hour)", value: `$${config.moneyPerBlock * (user.rig / 2)}` },
      { name: "cost to upgrade to next level", value: `$${costOfUpgrade}` }
    )
  msg.reply(minerStatsEmbed);

  var stonksStatsEmbed = new Discord.MessageEmbed()
    .setTitle(`${taggedUser}'s Stonks`)
    .setDescription(`[Stock] price, total value, total return`)

  var symbols = user.stock.map(stock => stock.name);

  const stockResult = await yahooFinance.quote({ symbols: symbols, modules: ['price'] });
  
  for (var i = 0; i < user.stock.length; i++) {
    var ticker = user.stock[i].name
    var curPrice = stockResult[ticker].price.regularMarketPrice;
    var userStock = user.stock[i];
    var plural = userStock.quantity == 1 ? 0 : 1;
    var stockReturn = userStock.avgPrice == 0 ? 0 : (curPrice - userStock.avgPrice)
    var totalStockReturn = stockReturn * userStock.quantity;
    var gain = userStock.avgPrice == 0 ? 0 : (stockReturn * 100 / userStock.avgPrice).toFixed(2)

    if (userStock.quantity == 0) {
      continue;
    }
    totalReturn += totalStockReturn;
    originalInput += userStock.avgPrice * userStock.quantity;
    portfolioValue += userStock.quantity * curPrice;

    stonksStatsEmbed.addField(`[${ticker.toUpperCase()}] $${helper.formatNumber(curPrice.toFixed(2))}, $${helper.formatNumber((curPrice * userStock.quantity).toFixed(2))}, $${helper.formatNumber(totalStockReturn.toFixed(2))}`, `${stockResult[ticker].price.shortName} ${userStock.quantity} share${plural ? "s" : ""} ${gain}%`)
  }

  stonksStatsEmbed.addField(`Total Portfolio Value: $${helper.formatNumber(portfolioValue.toFixed(2))}`, `${totalReturn > 0 ? 'Up' : 'Down'} $${helper.formatNumber(totalReturn.toFixed(2))} (${helper.formatNumber((totalReturn * 100 / originalInput).toFixed(2))}%)`);

  msg.reply(stonksStatsEmbed);
}