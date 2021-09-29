const Command = require('../../structs/Command');
const { WebhookClient, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class FeedbackCommand extends Command {
	description = 'Sends feedback about the bot to the developers';
	usage = '<message>';
	slashCommand = new SlashCommandBuilder()
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Your feedback')
				.setRequired(true)
		);

	call(message, content) {
		const webhookClient = new WebhookClient({
			id: this.config.feedbackWebhook.id,
			token: this.config.feedbackWebhook.token
		});

		if (!content) return message.react(this.config.emoji.error);

		let embed = new MessageEmbed()
			.setColor(this.config.color.default)
			.setAuthor('Cabot Feedback', this.client.user.avatarURL())
			.setDescription(content)
			.addFields(
				{name: 'User', value: `<@${message.author.id}>`}
			)

		webhookClient.send({
			embeds: [embed]
		}).then(
			message.react(this.config.emoji.success)
		)
	}
}

module.exports = FeedbackCommand;