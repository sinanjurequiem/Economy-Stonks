module.exports = {
	name:"updates",
  status: "enabled",
  description: "check here for feature updates",
	execute(msg, args){
		msg.reply("We've added pets and robbery. So go play with your dog and then burglarize your rival's house.")

    var promise = new Promise(() => {
      return 0;
    })
    return promise;
	}
}