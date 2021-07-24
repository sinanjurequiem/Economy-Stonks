const Discord = require('discord.js');

module.exports = {
	name: "pet",
	description: "your pets! you can put `pet store` to buy new pets",
  status: "enabled",
  category: "Bonuses",
	execute(msg, dbClient, args) {
		var dbo = dbClient.db("economy");
		var query = { id: `${msg.author.id}` };
		var pets = [];
		var balance;
		var promise = dbo.collection("economy").find(query).toArray().then(function(result, err) {
      if (err) throw err;
      if (result.length == 0) {
        msg.reply('please type $start to create an account first.');
        throw -1;
      }
      
			balance = result[0]["balance"]
			pets = result[0]["pets"]

			return dbo.collection("pets").find({}).toArray();
		}).then(function(result) {
			// owned pets
			if (args.length === 0) {
				var message = new Discord.MessageEmbed()
					.setTitle(`${msg.author.username}'s Pets`)
					.setDescription(`your pets. take care of them.`)
				for (var i = 0; i < result.length; i++) {
					var name = result[i]["name"]
					var bonus = pets[name]["bonus"]
					if (pets[name]["level"] >= 0) {
						// message.addField(`${result[i].name} ${pets["active"] == name ? "(active)" : "(inactive)"}`, `+${bonus}% ${result[i]["description"]}`);
						message.addField(`${result[i].name}`, `+${bonus}% ${result[i]["description"]}`);
					}
				}
				msg.reply(message)
			}

			if (args[0] === "store") {
				var	message = new Discord.MessageEmbed()
					.setTitle(`Which pet would you like to buy?`)
				for (var i = 0; i < result.length; i++) {
					var name = result[i]["name"];
					var price = pets[name]["upgrade_price"]
					var bonus = (result[i]["base_bonus"]) * (2 ** (pets[name]["level"] + 1))
					message.addField(`${name} [+${bonus}% ${result[i]["description"]}]`, `$${price}`);
				}
				msg.channel.send(message).then(() => {
					const filter = m => msg.author.id === m.author.id;
					msg.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
						.then(messages => {

							var animalName = messages.first().content;
							var animal = result.find(pet => pet["name"] === animalName)
							if (animal === undefined) {
								msg.reply("That's not a valid pet name.");
								return;
							}
							// user has enough money
							if (balance > pets[animalName]["upgrade_price"]) {
								var upgradePrice = animal["base_price"] * (4 ** (pets[animalName]["level"] + 2))
								var bonus = animal["base_bonus"] * (2 ** (pets[animalName]["level"] + 1));
								var upkeep = animal["base_upkeep"] * (1.5 ** (pets[animalName]["level"] + 1));
								const updateDocument = {
									$set: {
										["pets." + animalName + ".upgrade_price"]: upgradePrice,
										["pets." + animalName + ".bonus"]: bonus,
										["pets." + animalName + ".upkeep"]: upkeep
									},
									$inc: {
										["pets." + animalName + ".level"]: 1,
										balance: -pets[animalName]["upgrade_price"]
									}
								}
								// update user document
								msg.reply(`upgraded your ${animalName}!`)
								return dbo.collection("economy").updateOne(query, updateDocument);
								// upgrade user's pets (calculate upgrade_cost, bonus, upkeep using level and base values)
								// decrease user balance
							} else {
								msg.reply('you don\'t have enough money!')
							}
						}).catch(() => {
							msg.channel.send('Selection timed out.');
						});
				});
			}
    }).catch(err => {console.log(err); return err});
    return promise;
	}
}