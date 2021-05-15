const Discord = require('discord.js');

// include quiz
const quiz = require('../../configuration/blanks.json');

module.exports = {
	name:"blanks",
	desc:"fill in the blanks minigame",
	cooldown:20,
	execute(msg, dbClient, args){
    var item = quiz[Math.floor(Math.random() * quiz.length)];
		var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    var keep_playing = true;
    dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.')
        throw err;
      }
    }).then(function(result,err){
      if (err) throw err;
      const filter = response => {
        return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
      };
        msg.channel.send(`**GAME START: 10 seconds to guess**\n ${item.question}`).then(() => {
          msg.channel.awaitMessages(filter, { time: 10000, max: 1, errors: ['time'] })
            .then(messages => {
                msg.reply(`Correct answer.`);

                var queryAnswerer = { id: `${response.first().author.id}` };
								var updateDocument = {
									$inc:  {
										balance: 10
									}
								}
								
                // give rewards
                return dbo.collection("economy").updateOne(queryAnswerer, updateDocument);
            }).catch(messages => {
              msg.channel.send(`**GAME OVER**\n The correct answer was: ${item.answers}`);
            });
        });
    }).catch(err => {console.log(err)});
	}
}