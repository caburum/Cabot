const {WebhookClient, MessageEmbed} = require('discord.js');
const config = require("../config.json");

module.exports = {
	name: 'feedback',
	description: 'Sends feedback about the bot to the developers',
  usage: '<message>',
  category: 'CORE',
	async execute(client, message, args, guildConf) {
    const webhookClient = new WebhookClient(process.env.feedbackID, process.env.feedbackToken);

    let feedback = args.join(" ");
    let user = message.author.id;

    if (!feedback) return message.react(config.emoji.error);

    let embed = new MessageEmbed()
      .setColor(config.color.default)
      .setAuthor('Cabot Feedback', client.user.avatarURL())
      .setDescription(feedback)
      .addFields(
        {name: 'User', value: `<@${user}>`}
      )

    webhookClient.send({
      embeds: [embed]
    }).then(
      message.react(config.emoji.success)
    )
	},
};