const log = require('../functions/log.js');
const config = require("../botdata/config.json");

module.exports = {
	name: 'ban',
	description: 'Bans a user from the server with a reason and logs it',
  usage: '<@user> <reason>',
  aliases: ['block'],
  perms: 'BAN_MEMBERS',
  category: 'MODERATION',
	async execute(client, message, args, guildConf) {
		if (!message.member.hasPermission("BAN_MEMBERS")) return message.react(config.denyEmoji);
    
    let toban = message.mentions.members.first();

    if (!toban) return message.reply("Please mention a valid member of this server.");
    if(!toban.bannable) return message.reply("I cannot ban this user! Do they have a higher role than me? Do I have ban permissions?");
    
    let reason = args.slice(1).join(' ');
    if (!reason) return message.reply("Please indicate a reason for the ban.");

    await toban.send(`You have been banned from ${message.guild.name} by ${message.author} because: ${reason}`);
    
    await toban.ban(reason)
    .catch(error => message.reply(`Sorry ${message.author}, I couldn't ban because of: ${error}`));
    message.channel.send(`${toban.user} has been banned by ${message.author} because: ${reason}`);

    log(message.guild, guildConf.logchannel, toban, 'BAN', reason, message.author);
	},
};