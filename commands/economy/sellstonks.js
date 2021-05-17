var helper = require('../../helpers.js');

module.exports = {
	name: "sellstonks",
	description: "sell stonks",
	args: true,
	usage: "<quantity> <ticker>",
	execute(msg, dbClient, args){
		var amount = parseInt(args[0]);
		var stockName = args[1];
    var price;
    var totalQuantity;
    var demand;

		if (isNaN(amount)) {
			msg.reply("Please enter a valid number.");
			return;
		}

    var dbo = dbClient.db("economy");
    var query = {ticker:stockName};
    var userQuery = { id: `${msg.author.id}` };

    dbo.collection("economy").find(userQuery).toArray().then(function(userResult) {

      if (!(stockName in userResult[0].stock)){
        msg.reply("Stonk does not exist, please enter a valid stonk. Format: $sellstonks <amount> <ticker>");
        throw err;
      }
      if (amount > userResult[0].stock[stockName].quantity){
        msg.reply("that's more stonks than you have. type a lower number.");
        throw err;
      }

      return dbo.collection("bank").find(query).toArray();
    }).then(function(result){
		  price = result[0].value;
      totalQuantity = result[0].totalQuantity;
      demand = result[0].demand;

      const updateDocument =  {
        $inc: {
          quantity: amount,
          demand: -(amount/totalQuantity)*(1000-demand),
          // [stockName + ".value"]: -price * (amount / totalQuantity) * (demand/500) * Math.random() * 2
        },
      };

      return dbo.collection("bank").updateOne(query, updateDocument);
    }).then(function(updateResult, err) {
      if (err) throw err;
      const updateDocumentUser = {
        $inc:{
          ["stock." + stockName + ".quantity"]: -amount,
          balance: amount*price
        }
      }
      console.log(`${msg.author.username} sold ${amount} ${stockName} at $${helper.formatNumber(price.toFixed(3))}`);
      dbo.collection("economy").updateOne(userQuery, updateDocumentUser);
    }).then(function(updateUserResult, err){
      if (err) throw err;
      msg.reply(`you have sold ${amount} ${stockName} for $${helper.formatNumber((price*amount).toFixed(3))}.`)
    }).catch(err => {console.log(err)});
	}
}