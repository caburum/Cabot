module.exports = {
	name: 'warns',
	description: 'Shows warnings for a user',
  usage: '[user mention]',
  aliases: ['punishments'],
  perms: 'Manage Messages',
	async execute(client, message, args, guildConf) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Permission Denied.");

    const warns = [];

    let towarn = message.mentions.members.first();
    if(!towarn)
      return message.reply("Please mention a valid member of this server");

    const warnIDs = client.userProfiles.get(towarn.id, 'warnings');
    const warnData = warnIDs.map(id => client.modActions.get(id));

    warns.push(`**${warnIDs.length} Warnings:**`)
    message.channel.send(warns)
	},
};