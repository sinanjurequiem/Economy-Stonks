module.exports = {
  name: 'ping',
  description: 'this does not ping people, etc',
  status: "disabled",
  category: "Extra",
  execute(msg, args) {
    msg.reply(`the bot works. are you happy now?`)

    var promise = new Promise(() => {
      return 0;
    })
    return promise;
  },
};