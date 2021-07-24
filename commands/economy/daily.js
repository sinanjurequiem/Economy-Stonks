const humanizeDuration = require('humanize-duration')

module.exports = {
  name: "daily",
  description: "get your daily dose of internet. jk, get your daily paycheck.",
  cooldown: 86400,
  status: "enabled",
  category: "moneynow",
  execute(msg, dbClient, args) {
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    var promise = dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.');
        throw -1;
      }

      const updateDocument = {
        $inc: {
          balance: 500
        },
      };
      console.log(`${msg.author.username} has recieved their daily bonus.`);
      msg.reply("you have recieved your daily bonus of $500.");

      return dbo.collection("economy").updateOne(query, updateDocument);
    }).catch(err => { console.log(err); return err });
    return promise;
  }
}