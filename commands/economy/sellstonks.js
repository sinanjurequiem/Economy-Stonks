module.exports = {
	name: "sellstonks",
	description: "sell stonks",
	args: true,
	usage: "<number of stonks> <first 4 letters of the stonk you want to sell (e.g doge, amog)>",
	execute(msg, dbClient, args){
		var amount = parseInt(args[0]);
		var stockName = args[1];
    var price;

		if (isNaN(amount)) {
			msg.reply("Please enter a valid number.");
			return;
		}

    var dbo = dbClient.db("economy");
    var query = { bank: `1`};
    var userQuery = { id: `${msg.author.id}` };

    dbo.collection("economy").find(userQuery).toArray().then(function(userResult) {

      if (!(stockName in userResult[0].stock)){
        msg.reply("Stonk does not exist, please enter a valid stonk. Format: $sellstonks <amount> <first 4 letters of stonk>");
        throw err;
      }
      if (amount > userResult[0].stock[stockName].quantity){
        msg.reply("that's more stonks than you have. type a lower number.");
        throw err;
      }

      return dbo.collection("economy").find(query).toArray();
    }).then(function(result){
		  price = result[0][stockName].value;
      const updateDocument =  {
        $inc: {
          [stockName + ".quantity"]: -amount
        },
      };

      return dbo.collection("economy").updateOne(query, updateDocument);
    }).then(function(updateResult, err) {
      if (err) throw err;
      const updateDocumentUser = {
        $inc:{
          ["stock." + stockName + ".quantity"]: -amount,
          balance: amount*price
        }
      }
      console.log(`${msg.author.username} sold ${amount} ${stockName} at $${price}`);
      dbo.collection("economy").updateOne(userQuery, updateDocumentUser);
    }).then(function(updateUserResult, err){
      if (err) throw err;
      msg.reply(`you have sold ${amount} ${stockName} for $${price*amount}.`)
    }).catch(err => {console.log(err)});
	}
}