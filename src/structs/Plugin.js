class Plugin {
	constructor(bot) {
		Object.defineProperty(this, 'bot', { value: bot });
		Object.defineProperty(this, 'client', { value: bot.client });
		Object.defineProperty(this, 'config', { value: bot.config });
	}

	static get deps() { // Array of plugin depenedcy classes
		return [];
	}

	load() { // Plugin code
		throw new Error('load() not implemented');
	}

	cleanup() { // Cleanup before exiting
	}
}

module.exports = Plugin;