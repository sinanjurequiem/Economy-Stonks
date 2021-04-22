const hourlycooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
	name: "hourly",
	descripton: "hourly paycheck",
	execute(msg, dbClient, args){
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    dbo.collection("economy").find(query).toArray(function(err, result) {
      const hourlycooldown = hourlycooldowns.get(msg.author.id);
      if (hourlycooldown) {
        const remaining = humanizeDuration(hourlycooldown - Date.now());

        return msg.reply(`You have to wait ${remaining} before you can get another load of cash. money doesn't grow on trees, you know.`)
          .catch(console.error);
      }

      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.')
      }

      else if (result.length != 0) {

        const updateDocument = {
          $inc: {
            balance: 25
          },
        };
        var bal = result[0].balance;
        dbo.collection("economy").updateOne(query, updateDocument, function(err, res) {
          if (err) throw err;
          console.log(`${msg.author.username} has recieved their hourly bonus.`);
          msg.reply("you have recieved your hourly bonus of 25$.");
          hourlycooldowns.set(msg.author.id, Date.now() + 3600000);
          setTimeout(() => hourlycooldowns.delete(msg.author.id), 3600000);
        });
      };
    });
	}
}