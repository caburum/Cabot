const randomInt = require('../functions/randomInt.js');

const replies = [
	'It is certain',
	'It is decidedly so',
	'Without a doubt',
	'Yes, definitely',
	'You may rely on it',
	'As I see it, yes',
	'Most likely',
	'Outlook good',
	'Yes',
	'Signs point to yes',
	'Reply hazy try again',
	'Ask again later',
	'Better not tell you now',
	'Cannot predict now',
	'Concentrate and ask again',
	'Don\'t count on it',
	'My reply is no',
	'My sources say no',
	'Outlook not so good',
	'Very doubtful'
];

module.exports = {
	name: '8ball',
	description: 'Ask the magic 8 ball a question',
	usage: '[question]',
	category: 'FUN',
	async execute(client, message, args, guildConf) {
		let sayMessage = args.join(' ');
		message.replytext = randomInt(replies.length);
		//message.channel.send('The answer to ' + sayMessage + ' is ' + data.replies[message.replytext]);
		message.channel.send(replies[message.replytext]);
	},
};