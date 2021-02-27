const config = require('../config.json');
const sleep = require('../functions/sleep.js');

const rickroll = [
  'We\'re no strangers to love\nYou know the rules and so do I\nA full commitment\'s what I\'m thinking of\nYou wouldn\'t get this from any other guy',
  'I just wanna tell you how I\'m feeling\nGotta make you understand',
  'Never gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you',
  'We\'ve known each other for so long\nYour heart\'s been aching but you\'re too shy to say it\nInside we both know what\'s been going on\nWe know the game and we\'re gonna play it',
  'And if you ask me how I\'m feeling\nDon\'t tell me you\'re too blind to see',
  'Never gonna give, never gonna give (Give you up)\n(Ooh) Never gonna give, never gonna give (Give you up)',
  'Never gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry'
];

module.exports = {
	name: 'rickroll',
	description: 'Rickrolls the current channel',
  category: 'FUN',
  perms: 'OWNER',
	async execute(client, message, args, guildConf) {
	  if (message.member.id != config.owner) return message.react(config.emoji.deny);
    message.delete().catch(O_o=>{});
    message.guild.members.cache.get(client.user.id).setNickname('Rick Astley');
    await sleep(100);
    message.channel.send(rickroll[0], {tts: true});
    await sleep(10000);
    message.channel.send(rickroll[1], {tts: true});
    await sleep(6500);
    message.channel.send(rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(rickroll[3], {tts: true});
    await sleep(11000);
    message.channel.send(rickroll[4], {tts: true});
    await sleep(8000);
    message.channel.send(rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(rickroll[5], {tts: true});
    await sleep(10000);
    message.channel.send(rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(rickroll[3], {tts: true});
    await sleep(11000);
    message.channel.send(rickroll[1], {tts: true});
    await sleep(6500);
    message.channel.send(rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(rickroll[6], {tts: true});
    message.guild.members.cache.get(client.user.id).setNickname('');
	},
};