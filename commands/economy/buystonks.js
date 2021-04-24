module.exports = {
	name: "buystonks",
	description: "buy stonks",
	args: true,
	usage: "<number of stonks> <first 4 letters of the stonk you want to buy (e.g doge, amog)>",
	execute(msg, dbClient, args){
		var amount = parseInt(args[0]);
		var stockName = args[1];
    var price;

		if (isNaN(amount)) {
			msg.reply("$buystonks <quantity> <first 4 characters of the stock>");
			return;
		}

    var dbo = dbClient.db("economy");
    var query = { bank: `1`};
    var userQuery = { id: `${msg.author.id}` };

    dbo.collection("economy").find(query).toArray().then(function(result) {

      if (!(stockName in result[0])){
        msg.reply("Stonk does not exist, please enter a valid stonk.");
        throw err;
      }
      if (amount > result[0][stockName].quantity){
        msg.reply("that's more stonks than there are in the bank. type a lower number, or wait until someone sells some back to the bank.");
        throw err;
      }

      price = result[0][stockName].value;

      return dbo.collection("economy").find(userQuery).toArray();
    }).then(function(userResult){
      const updateDocument =  {
        $inc: {
          [stockName + ".quantity"]: -amount
        },
      };

      if (amount*price > userResult[0].balance){
        msg.reply("haiyaa, too expensive. why so much? i didn't know you weren't billionaire. -uncle roger, 2021");
        throw err;
      }
      return dbo.collection("economy").updateOne(query, updateDocument);
    }).then(function(updateResult, err) {
      if (err) throw err;
      const updateDocumentUser = {
        $inc:{
          ["stock." + stockName + ".quantity"]: amount,
          balance: -amount*price
        }
      }
      console.log(`${msg.author.username} bought ${amount} ${stockName} at $${price}`);
      dbo.collection("economy").updateOne(userQuery, updateDocumentUser);
    }).then(function(updateUserResult, err){
      if (err) throw err;
      msg.reply(`you have bought ${amount} ${stockName} for $${amount*price}.`)
    }).catch(err => {console.log(err)});
	}
}