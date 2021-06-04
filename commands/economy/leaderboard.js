const Discord = require('discord.js');
var helper = require('../../helpers.js');

module.exports = {
	name:"leaderboard",
	description:"show the 10 people around the world with the highest bank balance",
	execute(msg, dbClient, args){
    var dbo = dbClient.db("economy");
		dbo.collection("economy").find({}).toArray().then(function(result, err) {
      var leaderboard = result.filter(user => user.username != "bank" && user.balance)
          .sort((a, b) => b.balance - a.balance)
          .slice(0, 10)
          .map((user, position) => `[${position+1}] ${user.username}: ${helper.formatNumber(user.balance.toFixed(2))}$`)
          .join('\n')
      var embed = new Discord.MessageEmbed()
          .setTitle('Global Leaderboard')
          .setDescription(leaderboard)
      msg.channel.send(embed);
    }).catch(err => console.log(err));
  }
}
