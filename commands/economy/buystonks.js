var helper = require('../../helpers.js');

module.exports = {
	name: "buystonks",
	description: "buy stonks",
	args: true,
	usage: "<quantity> <ticker>",
	
	execute(msg, dbClient, args){
		var amount = parseInt(args[0]);
		var stockName = args[1];
    var price;
    var totalQuantity;
    var demand;
    var avgBuyPrice, ownedQuantity;

		if (isNaN(amount)) {
			msg.reply("$buystonks <quantity> <ticker>");
			return;
		}

    var dbo = dbClient.db("economy");
    var query = {ticker:stockName};
    var userQuery = { id: `${msg.author.id}` };

    dbo.collection("bank").find(query).toArray().then(function(result, err) {
      if (err){
        msg.reply("Stonk does not exist, please enter a valid stonk.");
        throw err;
      }
      if (amount > result[0].quantity){
        msg.reply("that's more stonks than there are in the bank. type a lower number, or wait until someone sells some back to the bank.");
        throw err;
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
        msg.reply("haiyaa, too expensive. why so much? i didn't know you weren't billionaire. -uncle roger, 2021");
        throw err;
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
      msg.reply(`you have bought ${amount} ${stockName} for $${helper.formatNumber((price*amount).toFixed(3))}.`)
    }).catch(err => {console.log(err)});
	}
}