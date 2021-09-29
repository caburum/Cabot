const { SlashCommandBuilder } = require('@discordjs/builders');

class Command {
	constructor(bot) {
		Object.defineProperty(this, 'bot', { value: bot });
		Object.defineProperty(this, 'client', { value: bot.client });
		Object.defineProperty(this, 'config', { value: bot.config });

		this.aliases = [];
		this.ratelimit = 0;
		this.description = '';
		this.info = '';
		this.usage = '';
		this.slashCommand = new SlashCommandBuilder(); // Set to false to disable slash command
	}

	static get deps() { // Array of plugin depenedcy classes
		return [];
	}

	isAllowed() { // Limit who can run the command
		return true;
	}

	call() { // Command code
		throw new Error('call() not implemented');
	}

	cleanup() { // Cleanup before exiting
	}

	getBoolArgs(message) { // Get argument keys
		if (message.isInteraction) {
			console.log(message.content)
			return message.inner.options.data.filter(option => option.value == true).map(option => option.name);
		} else {
			return message._unprefixedContent.split(' ');
		};
	}
}

module.exports = Command;