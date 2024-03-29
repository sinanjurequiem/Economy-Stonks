const Discord = require('discord.js');
var helper = require('../../helpers.js');

module.exports = {
  name: "rob",
  description: "rob a guy. we designed this for maximum sneakiness. Check the **$leaderboard** for targets.\neg. $rob mmvmo",
  cooldown: 30,
  status: "enabled",
  category: "Make Money Now",
  execute(msg, dbClient, args) {
    var target;
    var player;
    var success;
    var playerBalInc, targetBalInc;
    var playerPetBonus;
    var targetPetBonus;

    // var mention = msg.mentions.users.first();
    targetUsername = args.join(' ');

    // if (args.length == 0 || !mention) {
    if (args.length == 0) {
      msg.reply("enter a username, you can't rob thin air");
      return -1;
      // } else if (mention.id == msg.author.id){
    } else if (targetUsername == msg.author.username) {
      msg.reply("you can't rob yourself. don't try and break the system.");
      return -1;
    }

    var dbo = dbClient.db("economy");
    var targetQuery = { username: targetUsername };
    var playerQuery = { id: msg.author.id };

    // get target balance, security level
    var promise = dbo.collection("economy").find(targetQuery).toArray().then(function(result, err) {
      if (err || result.length == 0) {
        msg.reply("That person doesn't exist, enter a valid username. Don't ping them! (eg. **$rob mmvmo**)");
        throw -1;
      }
      target = result[0];
      targetPetBonus = result[0].pets.dog.bonus / 100;
      console.log(target.username)
      // get player balance, thievery level
      return dbo.collection("economy").find(playerQuery).toArray();
    }).then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please **$start** a new account first.');
        throw -1;
      };
      //   get robber cat bonus
      player = result[0];
      playerPetBonus = result[0].pets.cat.bonus / 100;

      // calculate if theft is successful
      var probability = player.thievery * (1 + playerPetBonus) / (player.thievery * (1 + playerPetBonus) + target.security * (1 + targetPetBonus))
      success = !!probability && Math.random() < probability;

      var unscaledReward = Math.min(0.1 * target.balance, 2 * player.balance)
      var reward = (unscaledReward) * (1 + playerPetBonus) / (1 + targetPetBonus)
      console.log(`Cb:${playerPetBonus} Db:${targetPetBonus}, Original reward:${unscaledReward} Reward:${reward}`);
      // var reward = Math.max(0.2*target.balance);
      console.log(`p: ${probability}, s: ${success}`)

      if (success) {
        playerBalInc = reward;
        targetBalInc = -1 * Math.min(playerBalInc, target.balance);

        // send msg reply
        msg.reply(`Robbery successful, your cat helped you steal an extra $${helper.formatNumber((playerPetBonus * unscaledReward).toFixed(2))}. Your target's dog protected $${helper.formatNumber((targetPetBonus * unscaledReward).toFixed(2))} from being stolen. You gained $${helper.formatNumber(reward.toFixed(2))}. `)
      } else {
        playerBalInc = -1 * Math.min(player.balance, 2 * reward);
        targetBalInc = -playerBalInc;

        // send msg reply
        msg.reply(`You got caught. You paid $${helper.formatNumber(Math.abs(playerBalInc).toFixed(2))} in fines to the police.`)
      }

      var x;
      if (player.thievery < 2) {
        x = 0;
      } else {
        x = -2;
      }
      const updatePlayerDocument = {
        $inc: {
          balance: playerBalInc//,
          // thievery: success ? 1:x
        }
      }
      return dbo.collection("economy").updateOne(playerQuery, updatePlayerDocument);
      // update player and target balances
    }).then(function(result, err) {
      if (err) throw err;

      const updateTargetDocument = {
        $inc: {
          balance: targetBalInc
        }
      }
      return dbo.collection("economy").updateOne(targetQuery, updateTargetDocument);
    }).catch(err => { console.log(err); return err });
    return promise;
  }
}