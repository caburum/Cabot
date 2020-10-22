const rickroll = require("../botdata/rickroll.json");

module.exports = {
	name: 'rickroll',
	description: '',
  usage: '',
  aliases: [],
	async execute(client, message, args, guildConf) {
	  if (message.member.id != config.owner) return;
    message.delete().catch(O_o=>{});
    message.guild.members.get(client.user.id).setNickname("Rick Astley");
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
    message.guild.members.get(client.user.id).setNickname("");
	},
};