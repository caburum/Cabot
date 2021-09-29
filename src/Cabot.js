const { Intents, Client } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./util/config');
const { plural } = require('./util');

class Cabot {
	constructor() {
		Object.defineProperty(this, 'config', { value: config });

		Object.defineProperty(this, 'client', {
			value: new Client({
				allowedMentions: {
					parse: ['users', 'roles'],
					repliedUser: false
				},
				intents: [
					// We might want to listen for new threads
					Intents.FLAGS.GUILDS,
					// Join/leave events
					Intents.FLAGS.GUILD_MEMBERS,
					// Commands and moderation
					Intents.FLAGS.GUILD_MESSAGES,
					// Listening for reactions as commands
					Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
					// Listening for commands in DM
					Intents.FLAGS.DIRECT_MESSAGES,
					// Status feedback to users
					Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
					Intents.FLAGS.DIRECT_MESSAGE_TYPING,
					Intents.FLAGS.GUILD_PRESENCES,
				],
				partials: [ // https://discordjs.guide/additional-info/changes-in-v13.html#dm-channels
					'CHANNEL'
				]
			})
		});

		this.isDevmode = this.config.enviroment === 'development';
		this._loggedIn = false;
		this._plugins = [];
		this._loadedPlugins = [];

		this.client.on('ready', this.wrapListener(this.onReady, this));
		this.client.on('error', this.wrapListener(this.onError, this));
		this.client.on('guildCreate', this.wrapListener(this.onGuildCreate, this));
		this.client.on('guildDelete', this.wrapListener(this.onGuildDelete, this));
	}

	login(token) {
		if (this._loggedIn) throw new Error('Cannot call login() twice');

		this._loggedIn = true;
		this.client.login(token);
	}

	loadPlugin(Plugin) {
		if (this._plugins.includes(Plugin)) return;
		if (this._loggedIn) throw new Error('Plugins must be loaded before calling login()');

		this._plugins.push(Plugin);

		if (Plugin.deps) {
			Plugin.deps.forEach(this.loadPlugin.bind(this));
		}

		const plugin = new Plugin(this);
		plugin.load();
		this._loadedPlugins.push(plugin);
	}

	loadEnabledPlugins() {
		const disabledPlugins = this.config.plugins?.disabled;
		const dir = path.join(__dirname, 'plugins');

		fs.readdirSync(dir).forEach(file => {
			let pluginPath = path.join(dir, file);
			let plugin = path.parse(file).name;

			if (disabledPlugins instanceof Array && disabledPlugins.includes(plugin)) return;

			const Plugin = require(pluginPath);
			this.loadPlugin(Plugin);
		});
	}

	wrapListener(listener, context) {
		return function(arg) {
			try {
				return listener.call(context, arg);
			} catch (error) {
				return this.reportError('Listener error:', error);
			}
		}.bind(this);
	}

	async reportError(message, error) {
		console.error(message, error);

		if (this.config.errorReporting) {
			let newMessage = message;
			
			if (error) {
				if (typeof error.stack === 'string') {
					newMessage += `\`\`\`apache\n${error.stack.slice(0, 1000)}\`\`\``;
				} else {
					newMessage += `\`\`\`json\n${JSON.stringify(error)}\`\`\``
				}
			}

			const channel = this.client.channels.cache.get(this.config.errorReporting.channel);
			if (channel) {
				try {
					await channel.send(newMessage);
				} catch(e) {
					// Discard error
				}
			}
		}
	}

	async cleanup() {
		for (let plugin of this._loadedPlugins) {
			await plugin.cleanup();
		}

		this.client.destroy();
	}

	onReady() {
		console.log(`Logged in as ${this.client.user.tag}`);
		console.log(`Cabot v${this.config.version} has started with ${plural(this._loadedPlugins.length, 'loaded plugin')}`);
	}

	onError(error) {
		return this.reportError('Unknown error:', error);
	}

	onGuildCreate() {
		// This event triggers when the bot joins a guild.
		console.log(`Joined ${guild.name} (id: ${guild.id}) with ${guild.memberCount} members!`);
	}

	onGuildDelete() {
		// This event triggers when the bot is removed from a guild.
		console.log(`Left ${guild.name} (id: ${guild.id})`);
	}

	onUnhandledRejection(error) {
		return this.reportError('Unhanded rejection:', error);
	}
}

module.exports = Cabot;