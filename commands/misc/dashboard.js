const Discord = require('discord.js');
module.exports = {
  name: "dashboard",
  description: "access the dashboard for the bot",
  status: "enabled",
  category: "extra",
  execute(msg, args) {
    var dashboardEmbed = new Discord.MessageEmbed()
      .setTitle("Dashboard for Economy Stonks")
      .setURL("https://economystonks.botdash.pro")
      .setDescription("Here, you can customize Economy Stonks for your own server. There are currently very few options for customization. More things coming soon.")
    msg.reply(dashboardEmbed)

    var promise = new Promise(() => {
      return 0;
    })
    return promise;
  }
}