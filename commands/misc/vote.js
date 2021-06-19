const Discord = require('discord.js')

module.exports = {
  name: "vote",
  description: "vote for the bot on top.gg and get rewards!",
  status: "enabled",
  category: "extra",
  execute(msg, args) {
    var voteEmbed = new Discord.MessageEmbed()
      .setTitle("Vote for Economy Stonks on top.gg")
      .setDescription("Vote here and get a random reward, up to 10% of your current net worth.")
      .setURL("https://top.gg/bot/803384014618624081");

    msg.reply(voteEmbed);

    var promise = new Promise(() => {
      return 0;
    })
    return promise;
  }
}