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
      var authorID;
      var correctAnswer = false;

      msg.channel.send(`**GAME START: 10 seconds to guess**\n ${item.question}`);
      const collector = msg.channel.createMessageCollector(() => {return true}, { time: 10000 });

      collector.on('collect', m => {
        console.log(`Collected ${m.content}`);
        if (item.answers.some(answer => answer.toLowerCase() === m.content.toLowerCase())) {
          authorID = msg.author.id;
          correctAnswer = true;
          collector.stop();
        }
      });

      collector.on('end', collected => {
        if (correctAnswer) {
          console.log(`${authorID} had ${collected.filter(message => message.author.id == authorID).size} answers`)
          var reward = Math.max(101-collected.filter(message => message.author.id == authorID).size, 4)
          console.log(`reward: ${reward}`);
          msg.reply(`Correct answer. You win $${reward}`);
          var queryAnswerer = { id: `${authorID}` };
          var updateDocument = {
            $inc:  {
              balance: reward
            }
          }

          // give rewards
          return dbo.collection("economy").updateOne(queryAnswerer, updateDocument);
        } else {
          msg.channel.send(`**GAME OVER**\n The correct answer was: ${item.answers}`);
        }
      });
    }).catch(err => {console.log(err)});
	}
}