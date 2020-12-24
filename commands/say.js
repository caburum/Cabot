const config = require("../config.json");

module.exports = {
	name: 'say',
	description: 'Makes the bot say a message',
  usage: '<message>',
  aliases: ['repeat', 'send'],
  category: 'FUN',
  perms: 'MANAGE_MESSAGES',
	async execute(client, message, args, guildConf) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.react(config.denyEmoji);

    const sayMessage = args.join(" "); 
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
	},
};