module.exports = {
  name: "start",
  description: "open an account at the meme bank.",
  status: "enabled",
  execute(msg, dbClient, args) {
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    var promise = dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        const newAccount = {
          id: `${msg.author.id}`,
          balance: 0,
          balanceUpdate:0,
          username: `${msg.author.username}`,
          stock: [],
          thievery: 1,
          security: 1,
          rig: 0,
          pool: 0,
          pets: {
            cat: { level: -1, bonus: 0, upgrade_price: 100, upkeep: 20 },
            "jelly boi": { level: -1, bonus: 0, upgrade_price: 100, upkeep: 20 },
            dog: { level: -1, bonus: 0, upgrade_price: 100, upkeep: 20 },
            hamster: { level: -1, bonus: 0, upgrade_price: 100, upkeep: 20 },
            fish: { level: -1, bonus: 0, upgrade_price: 100, upkeep: 20 },
            active: "cat" }
        };
        return dbo.collection("economy").insertOne(newAccount, function(err, res) {
          console.log(`${msg.author.username} now has 0$.`)
          msg.reply(`you have created an account at the meme bank. and you're flat broke. Tips: get your **$daily** and **$hourly** work bonuses to start. Try **$stonks** trading, **$rob** people on the **$leaderboard**, and buy from the **$pet store** for % bonuses!`)
        })
      } else {
        var bal = result[0].balance;
        msg.reply(`you have already created an account.`)
        console.log(`${msg.author.username} has ` + bal + `in his/her account.`);
      }
    }).catch(err => { console.log(err); return err });
    return promise;
  }
}