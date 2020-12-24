const log = require('../functions/log.js');
const config = require("../config.json");

module.exports = {
	name: 'warn',
	description: 'Warns a member with a reason and logs it',
  usage: '<@user> <reason>',
  category: 'MODERATION',
  perms: 'MANAGE_MESSAGES',
	async execute(client, message, args, guildConf) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.react(config.emoji.deny);

    let towarn = message.mentions.members.first();
    if(!towarn)
      return message.reply("Please mention a valid member of this server");
    
    let reason = args.slice(1).join(' ');
    if (!reason) return message.reply("Please indicate a reason for the warn.");

    const newActionId = client.modActions.autonum;
    client.modActions.set(newActionId, {
        user: towarn.id,
        guild: message.guild.id,
        type: 'warning',
        moderator: message.author.id,
        reason: reason,
        when: Date.now()
    });

    client.userProfiles.push(towarn.id, newActionId, 'warnings');
    client.userProfiles.inc(towarn.id, 'totalActions');

    message.channel.send(`${towarn.user} has been warned by ${message.author} because: ${reason}`);

    log(message.guild, guildConf.logchannel, towarn, 'WARN', reason, message.author);
	},
};