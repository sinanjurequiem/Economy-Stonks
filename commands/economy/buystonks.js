var helper = require('../../helpers.js');

module.exports = {
	name: "buystonks",
	description: "$buystonks <qty> <ticker>",
	args: true,
	usage: "<quantity> <ticker>",
  status: "enabled",
	execute(msg, dbClient, args){
		var amount, stockName, price, totalQuantity, demand, avgBuyPrice, ownedQuantity;

    var dbo = dbClient.db("economy");
    var query;
    var userQuery = { id: `${msg.author.id}` };

    dbo.collection("economy").find(userQuery).toArray().then(function(userResult) {
      if (userResult.length == 0) {
        msg.reply('please type $start to create an account first.');
        throw "no account";
      } else if (args.length < 2) {
        msg.reply("$buystonks <quantity> <ticker>");
        throw "not enough arguments"
      }
      amount = parseInt(args[0]);
      if (isNaN(amount) || amount < 1){
        msg.reply("enter a valid number");
        throw "invalid number"
      }

      stockName = args[1].toLowerCase();
      query = {ticker:stockName};

      return dbo.collection("bank").find(query).toArray();
    }).then(function(result,err) {
      if (result.length == 0){
        msg.reply("Stonk does not exist, please enter a valid stonk.");
        throw "stock does not exist";
      }
      if (amount > result[0].quantity){
        msg.reply("that's more stonks than there are in the bank. type a lower number, or wait until someone sells some back to the bank.");
        throw "bad input";
      }

      price = result[0].value;
      totalQuantity = result[0].totalQuantity;
      demand = result[0].demand;

      return dbo.collection("economy").find(userQuery).toArray();
    }).then(function(userResult){
      avgBuyPrice = userResult[0].stock[stockName].avgPrice;
      ownedQuantity = userResult[0].stock[stockName].quantity;
      const updateDocument =  {
        $inc: {
          quantity: -amount,
          demand: (amount/totalQuantity)*(1000-demand),
          // [stockName + ".value"]: price * (amount / totalQuantity) * (demand/500) * Math.random() * 2
        }
      };

      if (amount*price > userResult[0].balance){
        amount = Math.floor(userResult[0].balance/price);
        if (amount == 0)
        {
          msg.reply("haiyaa, too expensive. why so much? i didn't know you weren't billionaire. -uncle roger, 2021");
          throw "not enough money";
        }
      }
      return dbo.collection("bank").updateOne(query, updateDocument);
    }).then(function(updateResult, err) {
      if (err) throw err;
      const updateDocumentUser = {
        $inc:{
          ["stock." + stockName + ".quantity"]: amount,
          balance: -amount*price
        },
        $set: {
          ["stock." + stockName + ".avgPrice"]: (avgBuyPrice*ownedQuantity + price*amount)/(ownedQuantity + amount)
        }
      }
      console.log(`${msg.author.username} bought ${amount} ${stockName} at $${helper.formatNumber(price.toFixed(3))}`);
      dbo.collection("economy").updateOne(userQuery, updateDocumentUser);
    }).then(function(updateUserResult, err){
      if (err) throw err;
      msg.reply(`you have bought ${amount} ${stockName.toUpperCase()} for $${helper.formatNumber((price*amount).toFixed(3))}.`)
    }).catch(err => {console.log(err)});
	}
}