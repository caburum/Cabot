module.exports = {
	name: 'reload',
	description: 'Reloads a command',
  usage: '<command>',
  aliases: ['latency'],
  perms: 'Manage Guild',
	async execute(client, message, args, guildConf) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("Permission Denied.");
    
		if (!args.length) return message.reply(`You didn't pass any command to reload!`);
    const commandName = args[0].toLowerCase();
    const command = message.client.commands.get(commandName)
      || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return message.reply(`There is no command with name or alias \`${commandName}\`!`);
    delete require.cache[require.resolve(`./${command.name}.js`)];
    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
    } catch (error) {
      console.error(error);
      message.reply(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
    }
    message.react('✅');
	},
};