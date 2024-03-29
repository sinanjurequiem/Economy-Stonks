const humanizeDuration = require('humanize-duration')

module.exports = {
  name: "hourly",
  description: "get your hourly dose of caffeine and work. YOU NEED MONEY, NO TIME FOR SLEEP.",
  cooldown: 3600,
  status: "enabled",
  category: "Make Money Now",
  execute(msg, dbClient, args) {
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    var promise = dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please **$start** a new account first.');
        throw -1;
      }

      const updateDocument = {
        $inc: {
          balance: 100
        },
      };
      console.log(`${msg.author.username} has recieved their hourly bonus.`);
      msg.reply("you have recieved your hourly bonus of $100.");

      return dbo.collection("economy").updateOne(query, updateDocument);
    }).catch(err => { console.log(err); return err });
    return promise;
  }
}