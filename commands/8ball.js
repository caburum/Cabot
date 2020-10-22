const randomint = require('../functions/randomint.js');
const replies = require("../botdata/8ball.json");

module.exports = {
	name: '8ball',
	description: 'Ask the magic 8 ball a question',
  usage: '[question]',
  aliases: [],
	async execute(client, message, args, guildConf) {
	  let sayMessage = args.join(" ");
		message.replytext = randomInt(replies.length);
		//message.channel.send("The answer to " + sayMessage + " is " + data.replies[message.replytext]);
    message.channel.send(replies[message.replytext]);
	},
};