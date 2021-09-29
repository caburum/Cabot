const { MessageMentions, Collection } = require('discord.js');

// Copy the useful ones from https://discord.js.org/#/docs/main/stable/class/CommandInteraction if you need
const reflectKeys = [
	// 'applicationId',
	'channelId',
	'createdAt',
	'createdTimestamp',
	'guildId',
	'id',
	// Not compatible
	// 'type'
];

class InteractionCompat {
	static stringifyOption(option) {
		if (option.value == null && option.type !== 'SUB_COMMAND') {
			return '';
		}

		switch (option.type) {
			case 'SUB_COMMAND':
				return (option.name + ' ' + InteractionCompat.stringifyOptions(option.options)).trim();
			case 'USER':
				return `<@${option.value}>`;
			case 'CHANNEL':
				return `<#${option.value}>`;
			case 'ROLE':
				return `<@&${option.value}>`;
			case 'MENTIONABLE':
				if (option.user || option.member) {
					return `<@${option.value}>`;
				} else if (option.channel) {
					return `<#${option.value}>`;
				} else if (option.role) {
					return `<@&${option.value}>`;
				}
			default:
				return option.value.toString();
		}
	}

	static stringifyOptions(options) {
		let content = '';

		if (!options) return content;

		for (const option of options) {
			content += InteractionCompat.stringifyOption(option) + ' ';
		}

		return content.slice(0, -1);
	}

	constructor(interaction) {
		Object.defineProperty(this, 'inner', { value: interaction });
		Object.defineProperty(this, 'client', { value: interaction.client });

		this._replied = false;
		this._succeeded = false;
		this.isInteraction = true;

		const content = InteractionCompat.stringifyOptions(interaction.options.data);

		this._unprefixedContent = content;
		this.content = '/' + this.inner.commandName + ' ' + content;

		for (const key of reflectKeys) {
			this[key] = this.inner[key];
		}
	}

	async reply(...args) {
		if (this._replied) {
			return await this.inner.channel.send(...args);
		}

		this._replied = true;

		let returned;
		try {
			returned = await this.inner.reply(...args);
		} catch(e) {
			if (!this._succeeded) {
				this._replied = false;
			}

			throw e;
		}

		this._succeeded = true;

		if (returned === undefined && !args[0].ephemeral) { // Ephemeral responses cannot be fetched or deleted
			return await this.inner.fetchReply();
		}

		return returned;
	}

	async react(emoji) {
		if (!this._replied) {
			return await this.inner.reply({
				content: emoji,
				ephemeral: true
			});
			this._replied = true;
		};
	}

	get channel() {
		return new Proxy(this.inner.channel, {
			get: (target, key) => {
				if (key === 'send') {
					return (...args) => {
						return this.reply(...args);
					};
				}

				return Reflect.get(target, key);
			}
		});
	}

	get guild() {
		return this.inner.guild;
	}

	get member() {
		return this.inner.member;
	}

	get author() {
		return this.inner.user;
	}

	get mentions() {
		const users = new Collection();

		for (const match of this._unprefixedContent.matchAll(MessageMentions.USERS_PATTERN)) {
			const id = match[1];
			const user = this.inner.client.users.cache.get(id);

			if (user) {
				users.set(id, user);
			}
		}

		const mentions = new MessageMentions(this, null, null, false, false);

		// Passing `users` to the mentions constructor seems to do weird stuff
		// You end up with invalid structures with all null fields
		mentions.users = users;

		return mentions;
	}

	get attachments() {
		return new Collection();
	}

	get reactions() {
		return new Collection();
	}
}

module.exports = InteractionCompat;