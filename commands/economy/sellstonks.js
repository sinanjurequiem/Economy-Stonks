var helper = require('../../helpers.js');

module.exports = {
  name: "sellstonks",
  description: "$sellstonks __quantity__ __ticker__\neg. $sellstonks 1 DGS",
  args: true,
  usage: "<quantity> <ticker>",
  status: "enabled",
  category: "Make Money Passively",
  execute(msg, dbClient, args) {
    var amount, stockName, price, totalQuantity, demand;

    var dbo = dbClient.db("economy");
    var query;
    var userQuery = { id: `${msg.author.id}` }

    var promise = dbo.collection("economy").find(userQuery).toArray().then(function(userResult) {
      if (userResult.length == 0) {
        msg.reply('please type $start to create an account first.');
        throw -1;
      } else if (args.length < 2) {
        msg.reply("$sellstonks <quantity> <ticker>");
        throw "not enough arguments"
      }
      amount = parseInt(args[0]);
      if (isNaN(amount) || amount < 1) {
        msg.reply("enter a valid number");
        throw "invalid number"
      }
      stockName = args[1].toLowerCase();
      query = { ticker: stockName };

      if (!(stockName in userResult[0].stock)) {
        msg.reply("Stonk does not exist, please enter a valid stonk. Format: $sellstonks <quantity> <ticker>");
        throw "stock does not exist";
      }
      if (amount > userResult[0].stock[stockName].quantity) {
        amount = userResult[0].stock[stockName].quantity;
        if (amount == 0) {
          msg.reply(`You have no ${stockName.toUpperCase()} shares to sell.`);
          throw "no shares to sell"
        }
      }

      return dbo.collection("bank").find(query).toArray();
    }).then(function(result) {
      price = result[0].value;
      totalQuantity = result[0].totalQuantity;
      demand = result[0].demand;

      const updateDocument = {
        $inc: {
          quantity: amount,
          demand: -(amount / totalQuantity) * (1000 - demand),
          // [stockName + ".value"]: -price * (amount / totalQuantity) * (demand/500) * Math.random() * 2
        },
      };

      return dbo.collection("bank").updateOne(query, updateDocument);
    }).then(function(updateResult, err) {
      if (err) throw err;
      const updateDocumentUser = {
        $inc: {
          ["stock." + stockName + ".quantity"]: -amount,
          balance: amount * price
        }
      }
      console.log(`${msg.author.username} sold ${amount} ${stockName} at $${helper.formatNumber(price.toFixed(3))}`);
      dbo.collection("economy").updateOne(userQuery, updateDocumentUser);
    }).then(function(updateUserResult, err) {
      if (err) throw err;
      msg.reply(`you have sold ${amount} ${stockName.toUpperCase()} for $${helper.formatNumber((price * amount).toFixed(3))}.`)
    }).catch(err => { console.log(err); return err });
    return promise;
  }
}