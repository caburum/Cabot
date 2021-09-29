const Plugin = require('../../structs/Plugin');

class FormatterPlugin extends Plugin {
	load() {
		this.bot.format = new Formatter(this.bot);
	}
}

class Formatter {
	constructor() {
		this.ZWSP = String.fromCharCode(8203);
	}

	indent(str, prefix) {
		switch (typeof prefix) {
			case 'string': prefix = prefix; // Custom character
			case 'number': prefix = new Array(prefix + 1).join(' '); // Repeated spaces
			default: prefix = String.fromCharCode(8203); // Tab
		}

		return prefix + str.replace(/\n/g, `\n${prefix}`);
	}

	quote(str) {
		return this.indent(str, '> ');
	}

	escape(str) {
		return str.replace(/[*_`~\\]/g, '\\$&');
	}

	sugar(content, ...flags) {
		let str = '';
		for (let i = 0; i < flags.length; i++) {
			str += flags[i];
		}

		str += this.escape(content);

		let i = flags.length;
		while (i--) {
			str += flags[i];
		}

		return str;
	}

	code(content) {
		return this.sugar(content, '``')
	}

	italic(content) {
		return this.sugar(content, '*');
	}

	bold(content) {
		return this.sugar(content, '**');
	}

	strike(content) {
		return this.sugar(content, '~~');
	}

	underline(content) {
		return this.sugar(content, '__');
	}

	spoiler(content) {
		return this.sugar(content, '||');
	}

	codeBlock(content, lang = '') {
		return this.sugar(`${lang}\n${String(content).trimEnd()}\n`, '```');
	}

	link(text, url) {
		if (!url) return text;

		return `[${text}](${url})`;
	}

	timestamp(ts, format = 'f') { // https://c.r74n.com/discord/formatting#Timestamps
		return `<t:${ts}:${format}>`;
	}

	timeSince(ts) {
		return this.timestamp(ts, 'R');
	}
}

module.exports = FormatterPlugin;