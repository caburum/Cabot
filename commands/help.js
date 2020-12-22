const config = require("../botdata/config.json");

module.exports = {
	name: 'help',
	description: 'Lists all commands or info about a specific command.',
	aliases: ['commands', 'cmds'],
	usage: '<command name>',
  category: 'CORE',
	execute(client, message, args, guildConf) {
		let prefix = guildConf.prefix;
    const data = [];
    const {commands} = message.client;

    if (!args.length) {
      data.push('Commands');
      data.push(commands.map(command => command.name).join(', '));
      data.push(`\nYou can send \`${prefix}help <command name>\` to get info on a specific command!`);

      return message.author.send(data, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply('I\'ve sent you a DM with all my commands!');
        })
        .catch(error => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
          message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
        });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.react(config.errorEmoji);
    }

    data.push(`**Name:** ${command.name}`);

    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
    if (command.description) data.push(`**Description:** ${command.description}`);
    if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
    if (command.perms) data.push(`**Perms:** ${command.perms}`);
    if (command.info) data.push(`**Additional Info:** ${command.info}`);
    if (command.category) data.push(`**Category:** ${command.category}`);

    //data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

    message.channel.send(data, { split: true });

	},
};