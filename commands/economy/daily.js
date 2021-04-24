const dailycooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
	name: "daily",
	descripton: "daily paycheck",
	execute(msg, dbClient, args) {
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    dbo.collection("economy").find(query).toArray(function(err, result) {
      const dailycooldown = dailycooldowns.get(msg.author.id);
      if (dailycooldown) {
        const remaining = humanizeDuration(dailycooldown - Date.now());

        return msg.reply(`You have to wait ${remaining} before you can get another daily paycheck. don't be lazy`)

          .catch(console.error);
      }
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.')
      }

      else if (result.length != 0) {
        var bal = result[0].balance;
        const updateDocument = {
          $inc: {
            balance: 250
          },
        };
        dbo.collection("economy").updateOne(query, updateDocument, function(err, res) {
          if (err) throw err;
          console.log(`${msg.author.username} has recieved their daily bonus.`);
          msg.reply("you have recieved your daily bonus of $250.");
          dailycooldowns.set(msg.author.id, Date.now() + 86400000);
          setTimeout(() => dailycooldowns.delete(msg.author.id), 86400000);
        })
      };
    });
	}
}