const Discord = require('discord.js');

module.exports = {
	name:"blanks",
	desc:"fill in the blanks minigame",
	execute(msg, dbClient, args){
		var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    var keep_playing = true;
    dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.')
        throw err;
      }
      return dbo.collection("trivia").find({}).toArray()
    }).then(function(result,err){
      var item = result[Math.floor(Math.random() * result.length)];
      if (err) throw err;
      var correctAuthor;
      var correctAnswer = false;

      msg.channel.send(`**GAME START: 10 seconds to guess**\n ${item.question}`);
      const collector = msg.channel.createMessageCollector(() => {return true}, { time: 10000 });

      collector.on('collect', m => {
        if (item.correct_answer.toLowerCase() === m.content.toLowerCase()) {
          correctAuthor = msg.author;
          correctAnswer = true;
          collector.stop();
        }
      });

      collector.on('end', collected => {
        if (correctAnswer) {
          var reward = Math.max(100-((collected.filter(message => message.author.id == correctAuthor.id).size)-1)*5, 50)
          console.log(`${collected.size-1} answers, ${correctAuthor.username} wins`)
          msg.channel.send(`**${correctAuthor.username}**, correct answer. You win $${reward}`);
          var queryAnswerer = { id: `${correctAuthor.id}` };
          var updateDocument = {
            $inc:  {
              balance: reward
            }
          }

          // give rewards
          return dbo.collection("economy").updateOne(queryAnswerer, updateDocument);
        } else {
          msg.channel.send(`**GAME OVER**\n The correct answer was: ${item.correct_answer}`);
        }
      });
    }).catch(err => {console.log(err)});
	}
}