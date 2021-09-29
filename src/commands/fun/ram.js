module.exports = {
	name: 'ram',
	description: 'Download More RAM!',
	aliases: ['downloadmoreram'],
	category: 'FUN',
	perms: 'HIDDEN',
	async execute(client, message, args, guildConf) {
		message.delete().catch(O_o=>{});
		message.channel.send('<:downloadmoreram:676158930866405380>');
	},
};