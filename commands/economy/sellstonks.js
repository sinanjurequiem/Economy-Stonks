var helper = require('../../helpers.js');
const yahooFinance = require('yahoo-finance');

module.exports = {
  name: "sellstonks",
  description: "$sellstonks <qty> <ticker>",
  args: true,
  usage: "<quantity> <ticker>",
  status: "enabled"
}

module.exports.execute = async function(msg, dbClient, args) {
  var amount, stockName, price, totalQuantity, demand;

  var dbo = dbClient.db("economy");
  var query;
  var userQuery = { id: `${msg.author.id}` }

  var userResult = await dbo.collection("economy_test").find(userQuery).toArray();
  if (userResult.length == 0) {
    msg.reply('please type $start to create an account first.');
    throw -1;
  } else if (args.length < 2) {
    msg.reply("$sellstonks <quantity> <ticker>");
    throw -2
  }
  amount = parseInt(args[0]);
  if (isNaN(amount) || amount < 1) {
    msg.reply("enter a valid number. Format: $sellstonks <quantity> <ticker>");
    throw -2;
  }

  stockName = args[1].toUpperCase();
  const stockResult = await yahooFinance.quote(stockName, ['price']);
  if (stockResult.price.shortName == null) {
    msg.reply("Stonk does not exist, please enter a valid stonk. Format: $sellstonks <quantity> <ticker>");
    throw -2;
  }
  price = stockResult.price.regularMarketPrice;

  userStockResult = userResult[0].stock.filter(stock => stock.name == stockName)
  
  if (userStockResult.length == 0 || userStockResult[0].quantity == 0) {
    msg.reply(`You have no ${stockName.toUpperCase()} shares to sell.`);
    throw -3;
  } else if (amount > userStockResult[0].quantity) {
    amount = userStockResult[0].quantity;
  }

  const updateDocumentUser = {
    $inc: {
      ["stock.$.quantity"]: -amount,
      balance: amount * price
    }
  }
  await dbo.collection("economy_test").updateOne({ id: `${msg.author.id}`, "stock.name": stockName }, updateDocumentUser);

  console.log(`${msg.author.username} sold ${amount} ${stockName} at $${helper.formatNumber(price.toFixed(3))}`);
  msg.reply(`you have sold ${amount} ${stockName.toUpperCase()} for $${helper.formatNumber((price * amount).toFixed(3))}.`)
}