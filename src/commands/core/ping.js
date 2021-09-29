module.exports = {
	name: 'ping',
	description: 'Test bot latency',
	aliases: ['latency'],
	category: 'CORE',
	async execute(client, message, args, guildConf) {
		const ping = await message.channel.send("Ping?");
		ping.edit(`Pong! Bot latency is ${ping.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
	},
};