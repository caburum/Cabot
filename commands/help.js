const {MessageEmbed} = require('discord.js');
const config = require("../config.json");

module.exports = {
	name: 'help',
	description: 'Lists all commands or info about a specific command.',
	aliases: ['commands', 'cmds'],
	usage: '<command name>',
  category: 'CORE',
	async execute(client, message, args, guildConf) {
		let prefix = guildConf.prefix;
    const data = [];
    const {commands} = message.client;

    if (!args.length) {
      data.push('Allowed Commands');
      let names = [];
      await commands.forEach(command => {
        let allowed = true;
        if (command.perms) {
          allowed = false;
          if (command.perms === 'OWNER') {
            if (message.member.id === config.owner) {allowed = true} // Owner only commands
          } else if (command.perms === 'HIDDEN') {
            allowed = false;
          } else {
            if (message.member.hasPermission(command.perms)) {allowed = true} // If the user has the permissions
          }
        }
        if (allowed) {
          names.push(command.name);
        }
      });
      data.push(names.join(', '));
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
      return message.react(config.emoji.error);
    }

    let embed = new MessageEmbed()
      .setColor(config.color.default)
      .setAuthor('Cabot Help', client.user.avatarURL(), config.url)
      .setDescription('All `<args>` are required but all `[args]` are optional.')
      .addFields(
        {name: 'Name', value: command.name, inline: true}
      )

    if (command.category) {embed.addFields(
      {name: 'Category', value: command.category, inline: true}
    )};

    if (command.perms) {embed.addFields(
      {name: 'Permissions', value: command.perms, inline: true}
    )};

    if (command.description) {embed.addFields(
      {name: 'Description', value: command.description}
    )};

    if (command.aliases) {embed.addFields(
      {name: 'Aliases', value: command.aliases.join(', ')}
    )};

    let usage = prefix + command.name;
    if (command.usage) {usage = usage + ' ' + command.usage;}
    embed.addFields(
      {name: 'Usage', value: '`' + usage + '`'}
    );

    if (command.info) {embed.addFields(
      {name: 'Additional Info', value: command.info}
    )};

    /*embed.addFields(
      {name: 'Cooldown', value: `${command.cooldown || 3} second(s)`}
    );*/

    message.channel.send(embed);

	},
};