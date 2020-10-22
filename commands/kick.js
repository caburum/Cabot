const log = require('../functions/log.js');

module.exports = {
	name: 'kick',
	description: 'Kicks a user from the server with a reason and logs it',
  usage: '[user mention] [reason]',
  aliases: [],
  perms: 'Kick Members',
	async execute(client, message, args, guildConf, guildConf) {
		if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Permission Denied.");

    let tokick = message.mentions.members.first();
    if(!tokick)
      return message.reply("Please mention a valid member of this server");
    if(!tokick.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role than me? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if (!reason) return message.reply("Please indicate a reason for the kick.");
    
    await tokick.send(`You have been kicked from ${message.guild.name} by ${message.author} because: ${reason}`);

    //await tokick.kick(reason)
    //  .catch(error => message.channel.send(`Sorry ${message.author}, I couldn't kick due to ${error}`));
    message.channel.send(`${tokick.user} has been kicked by ${message.author} because: ${reason}`);
    log(message.guild, guildConf.logchannel, tokick, 'KICK', reason, message.author);
	},
};