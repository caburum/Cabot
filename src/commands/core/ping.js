const Command = require('../../structs/Command');

class PingCommand extends Command {
	description = 'Test bot latency';
	aliases = [ 'latency' ];

	discordEpoch = 1420070400000n;

	async call(message, content, extra) {
		let text = `API latency: ${Math.round(this.client.ws.ping)}ms`;
		let ping = await message.reply(text);
		ping.edit(`${text}\nBot latency: ${this.getSnowflake(ping.id) - this.getSnowflake(message.id)}ms`);
	}

	getSnowflake(snowflake) {
		return new Date(Number((BigInt(snowflake) >> 22n) + this.discordEpoch)).getTime();
	}
};

module.exports = PingCommand;