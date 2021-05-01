
module.exports = {
	name: "deleteaccount",
	descripton: "delete user's profile",
	execute(msg, dbClient, args){
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.')
        throw err;
      }
    }).then(function(result,err){
      if (err) throw err;
			msg.reply("Are you sure you would like to delete your account? If so, please type `confirm`. Otherwise, type `no`.").then(() => {
	const filter = m => msg.author.id === m.author.id;

	msg.channel.awaitMessages(filter, { time: 6000, max: 1, errors: ['time'] })
		.then(messages => {
			if (messages = "confirm"){
			  msg.reply(`You have deleted your account.`);
			  return dbo.collection("economy").deleteOne(query);
			} else {
				msg.channel.send("you have not deleted your account.")
			}
		})
		.catch(() => {
			msg.channel.send('Error 408: Connection timed out. You have not deleted your account.');
		});
});
    }).catch(err => {console.log(err)});
  }
}