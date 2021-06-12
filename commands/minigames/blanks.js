const Discord = require('discord.js');

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

module.exports = {
  name: "trivia",
  description: "do a trivia game. no, we aren't copying dank memer.",
  status: "enabled",
  execute(msg, dbClient, args) {
    var dbo = dbClient.db("economy");
    var query = { id: `${msg.author.id}` };
    var keep_playing = true;
    var promise = dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.')
        throw err;
      }
      return dbo.collection("trivia").find({}).toArray()
    }).then(function(result, err) {
      var item = result[Math.floor(Math.random() * result.length)];
      if (err) throw err;
      var correctAuthor;
      var correctAnswer = false;

      // msg.channel.send(`**GAME START: 10 seconds to guess**\n ${item.question}`);
      var answers = item.incorrect_answers;
      answers.push(item.correct_answer);
      shuffleArray(answers);

      var question = new Discord.MessageEmbed()
        .setTitle(`${msg.author.username} 10 seconds to guess\n${item.question}`)

      for (var i = 0; i < answers.length; i++) {
        question.addField(`${i}`, `${answers[i]}`)
      }
      msg.channel.send(question).then(() => {
        const filter = m => msg.author.id === m.author.id;

        msg.channel.awaitMessages(filter, { time: 10000, max: 1, errors: ['time'] })
          .then(m => {
            console.log(`${m.first().content} ${answers[parseInt(m.first().content)]}`)
            if (item.correct_answer === answers[parseInt(m.first().content)]) {
              var reward = 100
              console.log(`${msg.author.username} wins`)
              msg.reply(`correct answer. You win $${reward}`);
              var updateDocument = {
                $inc: {
                  balance: reward
                }
              }
              // give rewards
              return dbo.collection("economy").updateOne(query, updateDocument);
            } else {
              console.log(`${msg.author.username}' loses`);
              msg.channel.send(`**GAME OVER**\n The correct answer was: ${item.correct_answer}`);
            }
          });
      });
    }).catch(err => { console.log(err); return err });
    return promise;
  }
}