const config = require('../config.json');

module.exports = {
	name: 'botnick',
	description: 'Change\'s the bot\'s nickname in the server',
  usage: '<nickname>',
  perms: 'MANAGE_NICKNAMES',
  category: 'CORE',
	async execute(client, message, args, guildConf) {
    if(!message.member.hasPermission('MANAGE_NICKNAMES')) return message.react(config.emoji.deny);

    message.guild.members.cache.get(client.user.id).setNickname(args.join(' '));
    message.delete().catch(O_o=>{});
	},
};