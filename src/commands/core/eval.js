const Command = require('../../structs/Command');
const { MessageEmbed } = require('discord.js');
const FormatterPlugin = require('../../plugins/formatter');
const Beautify = require('beautify');

const life = 42;

class EvalCommand extends Command {
	description = 'Evaluates JavaScript code';
	aliases = ['parse', 'exec'];
	usage = '<JS>';
	slashCommand = false;

	static get deps() {
		return [
			FormatterPlugin
		];
	}

	filter(message) {
		return this.config.owners.includes(message.author.id);
	}

	async call(message, content, extra) {
		if (!content) return message.react(this.config.emoji.error);

		try {
			if (/^```js(?:on)?.*```$/is.test(content)) content = content.replace(/^```js(?:on)?|```$/gis, ''); // Extract from code block

			const evaluated = eval(content);

			if (content.toLowerCase().startsWith('message.channel.send(')) return;

			message.channel.send({ embeds: [ new MessageEmbed()
				.addField('**To Evaluate**', this.clean(content))
				.addField('**Result**', this.clean(evaluated, typeof(evaluated) === 'object'))
				.addField('**Type**', typeof(evaluated))
				.setTimestamp()
				.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			] });
		} catch (e) {
			message.channel.send({ embeds: [ new MessageEmbed()
				.setTitle(this.config.emoji.error + ' Something went wrong!')
				.setDescription(e.toString())
				.setTimestamp()
				.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			] });
		}
	}

	clean(input, isJSON = false) { // Ensures the string is clean and will not cause issues
		let format = isJSON ? 'json' : 'js';
		if (isJSON) input = JSON.stringify(input);
		return this.bot.format.codeBlock(
			Beautify(
				new String(input)
					.replace(this.config.token, 'Mjlx3zamasNOsd23fdz1sda23wO2Yw.TOKENz.emVjV4lcSzbdsjlz4U') // Fake token
					.replace(/`/g, '`' + String.fromCharCode(8203))
					.replace(/@/g, '@' + String.fromCharCode(8203)),
			{ format }),
		format);
	}
};

module.exports = EvalCommand;