module.exports = {
	name: 'showconf',
	description: 'Views the server\'s  configuration',
  usage: '[setting] [value]',
  aliases: ['viewconf', 'viewsettings'],
  perms: 'Manage Guild',
	async execute(client, message, args, guildConf) {
		if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("Permission Denied.");
    
    let configProps = Object.keys(guildConf).map(prop => {
      return `${prop}: ${guildConf[prop]}`;
    });
    message.channel.send(`The following are the server's current configuration:
    \`\`\`${configProps.join("\n")}\`\`\``);
	},
};