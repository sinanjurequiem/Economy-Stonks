const hourlycooldowns = new Map();
const humanizeDuration = require('humanize-duration')

module.exports = {
	name: "deleteaccount",
	descripton: "delete user's profile",
	execute(msg, dbClient, args){
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    console.log(`${msg.author.username} deleted their account`);
    dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.')
        throw err;
      }
      return dbo.collection("economy").deleteOne(query);
    }).then(function(result,err){
      if (err) throw err;
      msg.reply("you have deleted your account.");
    }).catch(err => {console.log(err)});
  }
}