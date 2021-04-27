module.exports = {
	name: "rank",
	description: "Show global ranking.",
	execute(msg, dbClient, args){
    var dbo = dbClient.db("economy");
    var query = {};
    dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.');
      };

      var balance;
      var rank = 0;
      // console.log(result.length);

      for (var i = 0; i < result.length; i++) {
        if (result[i].id == msg.author.id) {
          balance = result[i].balance;
          break;
        }
      }
      
      for (var i = 0; i < result.length; i++) {
        if (result[i].id == msg.author.id || result[i].username == 'bank') {
          continue;
        }

        if (result[i].balance > balance) {
          rank += 1;
        }
      }
      msg.reply(`rank = ${rank}/${result.length-1}`);
      console.log(`rank = ${rank}/${result.length-1}`);
    }).catch(err => {console.log(err)});
  }
}