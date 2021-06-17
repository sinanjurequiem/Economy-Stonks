  var helper = require('../../helpers.js');
const yahooFinance = require('yahoo-finance');

module.exports = {
  name: "buystonks",
  description: "$buystonks <qty> <ticker>",
  args: true,
  usage: "<quantity> <ticker>",
  status: "enabled"
}

module.exports.execute = async function(msg, dbClient, args) {

  var dbo = dbClient.db("economy");
  var userQuery = { id: `${msg.author.id}` };
  var amount, stockName, avgBuyPrice, ownedQuantity, price;

  var userResult = await dbo.collection("economy_test").find(userQuery).toArray();

  if (userResult.length == 0) {
    msg.reply('please type $start to create an account first.');
    throw -1;
  } else if (args.length < 2) {
    msg.reply("$buystonks <quantity> <ticker>");
    throw -2;
  }
  amount = parseInt(args[0]);
  if (isNaN(amount) || amount < 1) {
    msg.reply("enter a valid number");
    throw -3;
  }

  stockName = args[1].toUpperCase();
  const stockResult = await yahooFinance.quote(stockName, ['price']);
  if (stockResult.price.shortName == null) {
    msg.reply("Stonk does not exist, please enter a valid stonk.");
    throw -4;
  }

  price = stockResult.price.regularMarketPrice;
  if (amount * price > userResult[0].balance) {
    amount = Math.floor(userResult[0].balance / price);
    if (amount == 0) {
      msg.reply("haiyaa, too expensive. why so much? i didn't know you weren't billionaire. -uncle roger, 2021");
      throw -5;
    }
  }

  userStock = userResult[0].stock.filter(stock => stock.name == stockName.toLowerCase())

  if (userStock.length == 0) {
    updateDocumentUser = {
      $inc: {
        balance: -amount * price,
      },
      $addToSet: {
        stock: {
          name: stockName,
          avgPrice: price,
          quantity: amount,
        }
      }
    };
    await dbo.collection("economy_test").updateOne({ id: `${msg.author.id}` }, updateDocumentUser);
  } else {
    avgBuyPrice = userStock[0].avgPrice;
    ownedQuantity = userStock[0].quantity;

    updateDocumentUser = {
      $inc: {
        balance: -amount * price,
        "stock.$.quantity": amount
      },
      $set: {
        "stock.$.avgPrice": (avgBuyPrice * ownedQuantity + price * amount) / (ownedQuantity + amount)
      }
    };

    await dbo.collection("economy_test").updateOne({ id: `${msg.author.id}`, "stock.name": stockName }, updateDocumentUser);
  }

  console.log(`${msg.author.username} bought ${amount} ${stockName.toUpperCase()} for $${helper.formatNumber((price * amount).toFixed(3))}.`);
  msg.reply(`you have bought ${amount} ${stockName.toUpperCase()} for $${helper.formatNumber((price * amount).toFixed(3))}.`);
}
