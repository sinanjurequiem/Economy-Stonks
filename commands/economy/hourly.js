const humanizeDuration = require('humanize-duration')

module.exports = {
	name: "hourly",
	descripton: "hourly paycheck",
	cooldown:3600,
	execute(msg, dbClient, args){
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.');
        throw "no account";
      }

      const updateDocument = {
        $inc: {
          balance: 25
        },
      };
      console.log(`${msg.author.username} has recieved their hourly bonus.`);
      msg.reply("you have recieved your hourly bonus of $25.");

      return dbo.collection("economy").updateOne(query, updateDocument);
    }).catch(err => {console.log(err)});
	}
}