module.exports = {
	name: 'ram',
	description: 'Download More RAM!',
  usage: '',
  aliases: ['downloadmoreram'],
	async execute(client, message, args, guildConf) {
	  message.delete().catch(O_o=>{});
    message.channel.send('<:downloadmoreram:676158930866405380>');
	},
};