const Command = require('../../structs/Command');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const FormatterPlugin = require('../../plugins/formatter');
const humanizeDuration = require('humanize-duration');

class AboutCommand extends Command {
	description = 'Shows info about the bot';
	aliases = ['stats', 'uptime'];
	slashCommand = new SlashCommandBuilder()
		.addBooleanOption(option =>
			option.setName('stats')
				.setDescription('Show bot stats')
		);

	static get deps() {
		return [
			FormatterPlugin
		];
	}

	call(message, content) {
		let args = this.getBoolArgs(message);
		
		let authors = this.config.authors.map(a => `<@${a}>`).join(', ')
		let prefixes = this.bot.commandHandler.getPrefixes(message.guild).map(p => this.bot.format.code(p)).join(', ');

		let embed = new MessageEmbed()
			.setColor(this.config.color.default)
			.setAuthor('About Cabot', this.client.user.avatarURL(), this.config.url)
			.addFields(
				{name: 'Author', value: authors, inline: true},
				{name: 'Version', value: this.config.version, inline: true},
				{name: 'Prefix', value: prefixes, inline: true},
				{name: 'Uptime', value: humanizeDuration(this.client.uptime, { round: true }), inline: true},
			)

		if (args.includes('stats')) {
			embed.addFields(
				{name: 'Users', value: this.client.users.cache.size.toString(), inline: true},
				{name: 'Guilds', value: this.client.guilds.cache.size.toString(), inline: true},
				{name: 'Channels', value: this.client.channels.cache.size.toString(), inline: true},
			)
		}

		message.reply({ embeds: [embed] });
	}
}

module.exports = AboutCommand;