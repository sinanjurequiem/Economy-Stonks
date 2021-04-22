module.exports = {
	name: "sellstonks",
	description: "sell stonks",
	args: true,
	usage: "<number of stonks> <first 4 letters of the stonk you want to buy (e.g doge, amog)>",
	execute(msg, dbClient, args){
		var amount = parseInt(args[0]);
		var stock = args[1];
    var price;
		
		if (isNaN(amount)) {
			msg.reply("please type a valid number.");
			return;
		}

    var dbo = dbClient.db("economy");
    var query = { bank: `1`};
    var userQuery = { id: `${msg.author.id}` };

    dbo.collection("economy").find(query).toArray().then(function(result) {
      console.log(result);
      
      if (!(stock in result[0])){
        console.log("Stock does not exist");
        msg.reply("Stonk does not exist, please enter a valid stonk.");
        throw err;
      }
      if (amount > result[0][stock].quantity){
        msg.reply("that's more stonks than you have. type a lower number, or buy some stonks.");
        throw err;
      }
      
      price = result[0][stock].value;
      
      return dbo.collection("economy").find(userQuery).toArray();
    }).then(function(userResult){
      console.log(userResult);
      const updateDocument =  {
        $inc: {
          "[stock].quantity": amount
        },
      };

      return dbo.collection("economy").updateOne(query, updateDocument);
    }).then(function(updateResult, err) {
      if (err) throw err;
      const updateDocumentUser = {
        $inc:{
          dogestock: -amount,
          balance: amount*price
        }
      }
      console.log("updated document");
      dbo.collection("economy").updateOne(userQuery, updateDocumentUser);
    }).then(function(updateUserResult, err){
      if (err) throw err;
      msg.reply(`you have sold ${amount} ${stock} for $${amount*price}.`)
    }).catch(err => {console.log(err)});
	}
}