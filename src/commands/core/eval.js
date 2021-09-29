const Command = require('../../structs/Command');
const { MessageEmbed } = require('discord.js');
const FormatterPlugin = require('../../plugins/formatter');
const Beautify = require('beautify');

const life = 42;

class EvalCommand extends Command {
	description = 'Evaluates JavaScript code';
	aliases = ['parse'];
	slashCommand = false;

	static get deps() {
		return [
			FormatterPlugin
		];
	}

	filter(message) {
		console.log(this.config.owners.includes(message.author.id))
		return this.config.owners.includes(message.author.id);
	}

	async call(message, content, extra) {
		if (!content) return message.react(this.config.emoji.error);
console.log(content)
		try {
			const evaluated = eval(content);

			if (content.toLowerCase().startsWith('message.channel.send(')) {
				return;
			}

			let output = evaluated,
				format = 'js';
			if (typeof(evaluated) == 'object') {
				output = Beautify(JSON.stringify(evaluated), {format: 'json'});
				format = 'json';
			}

			let embed = new MessageEmbed()
				.addField('**To Evaluate**', `\`\`\`js\n${Beautify(this.clean(content), {format: 'js'})}\`\`\``)
				.addField('**Result**', '```' + format + '\n' + this.clean(output) + '```')
				.addField('**Type**', typeof(evaluated))
				.setTimestamp()
				.setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
			message.channel.send({embeds: [embed]});
		} catch (e) {
			let errorembed = new MessageEmbed()
				.setTitle(this.config.emoji.error + ' Something went wrong!')
				.setDescription(e.toString())
				.setTimestamp()
				.setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
			message.channel.send({embeds: [errorembed]});
		}
	}

	clean(input) { // Ensures the string is clean and will not cause issues
		return new String(input)
			.replace(process.env.token, 'Mjlx3zamasNOsd23fdz1sda23wO2Yw.TOKENz.emVjV4lcSzbdsjlz4U') // Fake token
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));
	}
};

module.exports = EvalCommand;