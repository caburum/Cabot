const Command = require('../../structs/Command');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

class BotNickCommand extends Command {
	description = 'Changes or resets the bot\'s nickname in the server';
	usage = '[nickname]';
	slashCommand = new SlashCommandBuilder()
		.addStringOption(option =>
			option.setName('nickname')
				.setDescription('New bot nickname')
		);

	filter(message) {
		return message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES);
	}

	call(message, content) {
		message.guild.members.cache.get(this.client.user.id).setNickname(content);
		
		if (message.isInteraction) {
			message.reply({
				content: 'Nickname changed',
				ephemeral: true
			});
		} else {
			message.delete().catch(O_o => {});
		}
	}
};

module.exports = BotNickCommand;