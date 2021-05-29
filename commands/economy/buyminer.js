var helper = require('../../helpers.js');

module.exports = {
	name: "buyminer",
	description: "upgrade equipment.",
	execute(msg, dbClient, args){
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.')
      };
      var costOfUpgrade =  ((result[0].rig + 2) ** 3) * 100;
      if (result[0].balance > costOfUpgrade) {

        const updateDocument = {
          $inc: {
            rig: 1,
            balance: -costOfUpgrade
          },
        };
        console.log(`${msg.author.username} has upgraded their mining machine to lvl ${result[0].rig + 1}.`);
        if (result[0].rig == 0) {
          msg.reply(`you have bought a crypto mining machine for ${costOfUpgrade}.`)
        } else {
          msg.reply(`you have upgraded your crypto miner to level ${result[0].rig + 1} for $${helper.formatNumber(costOfUpgrade)}.`)
        }
        return dbo.collection("economy").updateOne(query, updateDocument);
      }
      else {
        msg.reply("you can't afford to upgrade your crypto miner. get a job first.")
      }
    }).catch(err => {console.log(err)});
  }
}