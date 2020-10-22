module.exports = {
	name: 'say',
	description: 'Makes the bot say a message',
  usage: '[message]',
  aliases: ['repeat', 'send'],
  perms: 'Manage Messages',
	async execute(client, message, args, guildConf) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Permission Denied.");

    const sayMessage = args.join(" "); 
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
	},
};