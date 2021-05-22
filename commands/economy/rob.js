const Discord = require('discord.js');

module.exports = {
	name: "rob",
	description: "rob someone",
	// cooldown: 120,
	execute(msg, dbClient, args){
    var target;
    var player;
		var success;
    var playerBalInc, targetBalInc;

    // var mention = msg.mentions.users.first();
    targetUsername = args.join(' ');

    // if (args.length == 0 || !mention) {
    if (args.length == 0 ) {
      msg.reply("enter a username, ~~i~~ you can't rob thin air");
      return;
    // } else if (mention.id == msg.author.id){
    } else if (targetUsername == msg.author.username){
      msg.reply("you can't rob yourself you idiot. don't try and break the system.");
      return;
    }

    var dbo = dbClient.db("economy");
    var targetQuery = { username: targetUsername};
    var playerQuery = { id: msg.author.id };

    // get target balance, security level
    dbo.collection("economy").find(targetQuery).toArray().then(function(result, err) {
      if (err || result.length == 0){
        msg.reply("enter a valid username, ~~i~~ you can't rob someone who doesn't exist");
        throw err;
      }
      target = result[0];
      console.log(target.username)
      // get player balance, thievery level
      return dbo.collection("economy").find(playerQuery).toArray();
    }).then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.');
        throw "no account";
      };
      player = result[0];

      // calculate if theft is successful
    // success rate [S]: X/(X+L)
      var probability = (player.thievery)/(player.thievery + target.security);
      success = !!probability && Math.random() < probability;

      var reward = Math.max(0.2*target.balance);
      console.log(`p: ${probability}, s: ${success}`)

      if (success)
      {
        playerBalInc = reward;

        // send msg reply
        msg.reply(`Robbery successful, gained $${reward.toFixed(2)}`)
      } else {
        playerBalInc = -1*Math.min(player.balance, 2*reward);

        // send msg reply
        msg.reply(`You got caught, paid penalty -$${Math.abs(playerBalInc).toFixed(2)}`)
      }
      targetBalInc = -playerBalInc;

      const updatePlayerDocument = {
        $inc: {
          balance: playerBalInc,
          thievery: success ? 1:0
        }
      }
      return dbo.collection("economy").update(playerQuery, updatePlayerDocument);
      // update player and target balances
    }).then(function(result, err) {
      if (err) throw err;
      
      const updateTargetDocument = {
        $inc: {
          balance: targetBalInc
        }
      }
      return dbo.collection("economy").update(targetQuery, updateTargetDocument);
    }).catch(err => {console.log(err)})
	}
}