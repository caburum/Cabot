const fs = require('fs');
const path = require('path');
const Plugin = require('../../structs/Plugin');
const InteractionCompat = require('../../structs/InteractionCompat');
const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');

class CommandHandlerPlugin extends Plugin {
	load() {
		this.bot.commandHandler = new CommandHandler(this.bot);
	}

	cleanup() {
		return this.bot.commandHandler.cleanup();
	}
}

class CommandHandler {
	constructor(bot) {
		Object.defineProperty(this, 'bot', { value: bot });
		Object.defineProperty(this, 'config', { value: bot.config });

		this.commands = new Collection();

		this.loadEnabledCommands();

		bot.client.on('ready', bot.wrapListener(this.registerSlashCommands, this));
		bot.client.on('messageCreate', bot.wrapListener(this.onMessage, this));
		bot.client.on('interactionCreate', bot.wrapListener(this.onInteraction, this));
	}

	loadCommand(Command, name) {
		Command.deps.forEach(this.bot.loadPlugin.bind(this.bot));

		const command = new Command(this.bot);
		command.aliases.unshift(name);
		command.aliases = command.aliases.map(alias => alias.toLowerCase());

		this.commands.set(name, command);
	}

	loadEnabledCommands() {
		const disabledCommands = this.config.commands?.disabled;
		const disabledCategories = this.config.commands?.disabledCategories;
		const dir = path.join(__dirname, '../../commands');

		// Loop through categories
		fs.readdirSync(dir, { withFileTypes: true }).forEach(category => {
			if (!category.isDirectory()) return;

			if (disabledCategories instanceof Array && disabledCategories.includes(category.name)) return;

			fs.readdirSync(path.join(dir, category.name)).forEach(file => {
				let commandPath = path.join(dir, category.name, file);
				let command = path.parse(file).name;

				if (disabledCommands instanceof Array && disabledCommands.includes(command)) return;

				try {
					const Command = require(commandPath);
					this.loadCommand(Command, command);	
				} catch(error) {
					this.bot.reportError(`Failure while parsing command \`${command}\`:`, error)
				}
			})
		});
	}

	async registerSlashCommands() {
		let commands = this.commands.filter(command => command.slashCommand != false);
		if (commands.length === 0) return;

		commands.each(command => {
			if (command.slashCommand.name === undefined) {
				command.slashCommand.setName(command.aliases[0]);
			}

			if (command.slashCommand.description === undefined) {
				command.slashCommand.setDescription(command.description);
			}
		});

		const rest = new REST({ version: '9' }).setToken(this.bot.client.token);

		try {
			await rest.put(`/applications/${this.bot.client.application.id}/guilds/430847589018107904/commands`, {
				body: commands.map(c => c.slashCommand.toJSON())
			});
		} catch(error) {
			this.bot.reportError('Failed while registering slash commands', error);
		}
	}

	async onMessage(message) {
		// Ignore bots and self
		if (message.author.bot || message.author.id === this.bot.client.user.id) return;

		const text = message.content.trim();
		const prefixes = await this.getPrefixes(message.guild);

		let i = prefixes.length;
		let matched = false;
		while (i--) { // Loop over prefixes
		let prefix = prefixes[i];
			if (text.slice(0, prefix.length) !== prefix) continue; // Text doesn't start with prefix, skip

			const trimmed = text.slice(prefix.length).trimLeft(); // Trim prefix
			for (let command of this.commands.values()) {
				let aliases = command.aliases;
				let i = aliases.length;

				while (i--) {
					let alias = aliases[i];
					if (trimmed.slice(0, alias.length).toLowerCase() != alias) continue; // Text doesn't start with alias, skip

					if (!command.isAllowed(message)) continue; // Check if command can run on message

					matched = true;
					let content = trimmed.slice(alias.length + 1).trimLeft();
					message._unprefixedContent = content;
					this.callCommand(command, message, content, { alias });
				}
			}
		}
	}

	async onInteraction(interaction) {
		if (!interaction.isCommand()) return;

		const command = this.getAlias(interaction.commandName);
		const compat = new InteractionCompat(interaction);

		if (!command.isAllowed(interaction)) return; // Check if command can run on message

		this.callCommand(command, compat, compat._unprefixedContent, {
			alias: interaction.commandName,
			interaction: interaction
		});
	}

	getAlias(alias) { // Gets the main command by an alias
		for (const command of this.commands.values()) {
			const aliases = command.aliases;
			let i = aliases.length;

			while (i--) {
				if (aliases[i] == alias) {
					return command;
				}
			}
		}

		return null;
	}

	async callCommand(command, message, content, extra) {
		try {
			await command.call(message, content, extra);
		} catch(e) {
			const lines = e.stack.split('\n');
			const firstRelevant = lines.findIndex(line => line.includes('Commander.callCommand'));
			const errorMessage = lines.slice(0, firstRelevant);

			this.bot.reportError(`Error while executing ${command.constructor.name}:`, e);

			if (this.config.inlineErrors) {
				// await message.channel.send(codeBlock('apache', errorMessage));
			}
		}
	}

	getPrefixes(guild) {
		return ['$', 'cab!'];
	}

	async cleanup() {
		for (let command of this.commands.values()) {
			await command.cleanup();
		}
	}
}
/*
client.on('message', async message => {
	// Get the guild's specific prefix
	const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

	// Sends the prefix if you mention the bot
	if (message.mentions.members.first()) {
		if (message.mentions.members.first().id === client.user.id) {
			message.channel.send('Prefix: ' + guildConf.prefix);
			return;
		}
	}

	// Ignore any message that does not start with prefix
	if(message.content.indexOf(guildConf.prefix) !== 0) return;

	// Separate command name and arguments for the command
	const args = message.content.split(/\s+/g);
	const commandName = args.shift().slice(guildConf.prefix.length).toLowerCase();

	client.userProfiles.ensure(message.author.id, {
		id: message.author.id,
		guild: message.guild.id,
		totalActions: 0,
		warnings: [],
		kicks: []
	});

	// Checks if the command is valid or an alias
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	// Runs the command
	try {
		command.execute(client, message, args, guildConf);
	} catch (error) {
		console.error(error);
		message.react(config.emoji.error);
		message.reply('There was an error trying to execute that command!');
	}
});

function idleFun() {
	client.user.setStatus('online');
	setTimeout(function() {client.user.setStatus('idle')}, 5000);
}
*/

module.exports = CommandHandlerPlugin;