module.exports = {
	name: 'botnick',
	description: 'Change\'s the bot\'s nickname in the server',
  usage: '[nickname]',
  aliases: [],
  perms: 'Manage Nicknames',
	async execute(client, message, args, guildConf) {
    if(!message.member.hasPermission("MANAGE_NICKNAMES")) return;

    message.guild.members.get(client.user.id).setNickname(args.join(" "));
    message.delete().catch(O_o=>{});
	},
};