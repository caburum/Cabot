const {MessageEmbed} = require('discord.js');
const config = require('../config.json');
const pjson = require('../package.json');

module.exports = {
	name: 'about',
	description: 'Shows info about the bot',
	aliases: ['stats', 'uptime'],
	category: 'CORE',
	async execute(client, message, args, guildConf) {
		let totalSeconds = (client.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.round(totalSeconds % 60);

		if (days != 0) {
			uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
		} else if (hours != 0) {
			uptime = `${hours} hours, ${minutes} minutes, ${seconds} seconds`
		} else if (minutes != 0) {
			uptime = `${minutes} minutes, ${seconds} seconds`
		} else {
			uptime = `${seconds} seconds`
		}

		let embed = new MessageEmbed()
			.setColor(config.color.default)
			.setAuthor('About Cabot', client.user.avatarURL(), config.url)
			.addFields(
				{name: 'Author', value: `<@${config.owner}>`, inline: true},
				{name: 'Version', value: pjson.version, inline: true},
				{name: 'Prefix', value: guildConf.prefix, inline: true},
				{name: 'Uptime', value: uptime, inline: true},
			)

		if (args.includes('stats')) {
			embed.addFields(
				{name: 'Users', value: client.users.cache.size, inline: true},
				{name: 'Guilds', value: client.guilds.cache.size, inline: true},
				{name: 'Channels', value: client.channels.cache.size, inline: true},
			)
		}

		message.channel.send(embed);
	},
};