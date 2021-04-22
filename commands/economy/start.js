module.exports = {
	name: "start",
	descripton: "create an account",
	execute(msg, dbClient, args){
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    dbo.collection("economy").find(query).toArray(function(err, result) {
      if (err) throw err;
      if (result.length == 0) {
        const newAccount = {
          id: `${msg.author.id}`,
          balance: 0,
          username: `${msg.author.username}`,

          dogestock: 0,
          amogusdrip: 0,
          pewdiepies: 0,
          markspliers: 0,
          jacksepticeyes: 0,
          fartnite: 0,
          robblocks: 0,

          rig: 0,
          pool: 0
        };
        dbo.collection("economy").insertOne(newAccount, function(err, res) {
          console.log(`${msg.author.username} now has 0$.`)
          msg.reply(`you have created an account at the meme bank. and you're flat broke.`)
        })
      } else {
        var bal = result[0].balance;
        msg.reply(`you have already created an account.`)
        console.log(`${msg.author.username} has ` + bal + `in his/her account.`);
        //const obj = JSON.parse(result[0]);
      }
    });
	}
}