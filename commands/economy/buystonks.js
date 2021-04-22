module.exports = {
	name: "buystonks",
	description: "buy stonks",
	args: true,
	usage: "<number of stonks> <first 4 letters of the stonk you want to buy (e.g doge, amog)>",
	execute(msg, dbClient, args){
		var amount = parseInt(args[0]);
		var stock = args[1];
    var price;

		if (isNaN(amount)) {
			msg.reply("$buystonks <quantity> <first 4 characters of the stock>");
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
        msg.reply("that's more stonks than there are in the bank. type a lower number, or wait until someone sells some back to the bank.");
        throw err;
      }

      price = result[0][stock].value;

      return dbo.collection("economy").find(userQuery).toArray();
    }).then(function(userResult){
      console.log(userResult);
      const updateDocument =  {
        $inc: {
          "doge.quantity": -amount
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
          dogestock: amount,
          balance: -amount*price
        }
      }
      console.log("updated document");
      dbo.collection("economy").updateOne(userQuery, updateDocumentUser);
    }).then(function(updateUserResult, err){
      if (err) throw err;
      msg.reply(`you have bought ${amount} ${stock} for $${amount*price}.`)
    }).catch(err => {console.log(err)});
	}
}