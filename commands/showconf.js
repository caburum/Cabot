const config = require('../config.json');

module.exports = {
	name: 'showconf',
	description: 'Views the server\'s  configuration',
  usage: '<setting>',
  aliases: ['viewconf', 'viewsettings'],
  category: 'ADMIN',
  perms: 'MANAGE_GUILD',
	async execute(client, message, args, guildConf) {
		if (!message.member.hasPermission('MANAGE_GUILD')) return message.react(config.emoji.deny);
    
    let configProps = Object.keys(guildConf).map(prop => {
      return `${prop}: ${guildConf[prop]}`;
    });
    message.channel.send(`The following are the server's current configuration:
    \`\`\`${configProps.join('\n')}\`\`\``);
	},
};