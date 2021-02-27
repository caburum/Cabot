const Discord = require('discord.js');
const config = require('../config.json');
const Beautify = require('beautify');

module.exports = {
	name: 'eval',
	description: 'Evaluates a code chunk',
  aliases: ['parse'],
  category: 'CORE',
  perms: 'OWNER',
	async execute(client, message, args, guildConf) {
	  if (message.member.id != config.owner) return message.react(config.emoji.deny);
    if (!args) return message.react(config.emoji.error);

    try {
      const life = 42;

      if (args.join(' ').toLowerCase().includes('token')) {
        return;
      }

      const toEval = args.join(' ');
      const evaluated = eval(toEval);

      if (args.join(' ').toLowerCase().startsWith('message.channel.send(')) {
        return;
      }

      if (typeof(evaluated) == 'object') {output = Beautify(JSON.stringify(evaluated), {format: 'json'}); format = 'json';}
      else {output = evaluated; format = 'js';}

      let embed = new Discord.MessageEmbed()
        .addField('**To Evaluate**', `\`\`\`js\n${Beautify(args.join(' '), {format: 'js'})}\`\`\``)
        .addField('**Result**', '```' + format + '\n' + output + '```')
        .addField('**Type**', typeof(evaluated))
        .setTimestamp()
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
      message.channel.send(embed);
      
    } catch (e) {
      let errorembed = new Discord.MessageEmbed()
        .setTitle(config.emoji.error + ' Something went wrong!')
        .setDescription(e)
        .setTimestamp()
        .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
      message.channel.send(errorembed);
    }
	},
};