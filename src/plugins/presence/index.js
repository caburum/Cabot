const Plugin = require('../../structs/Plugin');
const { plural } = require('../../util');

class PresencePlugin extends Plugin {
	load() {
		this.client.on('ready', this.bot.wrapListener(this.updatePresence, this));
		this.client.on('guildCreate', this.bot.wrapListener(this.updatePresence, this));
		this.client.on('guildDelete', this.bot.wrapListener(this.updatePresence, this));
	}

	updatePresence() {
		// Shows how many servers bot is on
		this.client.user.setActivity({
			name: plural(this.client.guilds.cache.size, 'server'),
			type: 'WATCHING',
			url: this.config.url
		});
	}
}

module.exports = PresencePlugin;