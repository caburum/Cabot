const data = require("../botdata/about.json");

module.exports = {
	name: 'about',
	description: 'Shows info about the bot',
  usage: '',
  aliases: ['stats', 'uptime'],
	async execute(client, message, args, guildConf) {
		let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.round(totalSeconds % 60);
    if (days != 0) {
      uptime = `${days} days,  ${hours} hours, ${minutes} minutes, ${seconds} seconds`
    } else if (hours != 0) {
      uptime = `${hours} hours, ${minutes} minutes, ${seconds} seconds`
    } else if (minutes != 0) {
      uptime = `${minutes} minutes, ${seconds} seconds`
    } else {
      uptime = `${seconds} seconds`
    }
    const about = {
      "title": "About Cabot",
      "color": 7506394,
      "author": {
        "name": "Cabot",
        "url": data.url,
        "icon_url": client.user.avatarURL
      },
      "fields": [
        {
          "name": "Author",
          "value": "<@" + data.owner + ">"
        },
        {
          "name": "Version",
          "value": "1.0"
        },
        {
          "name": "Prefix",
          "value": guildConf.prefix
        },
        {
          "name": "Uptime",
          "value": uptime
        }
      ]
    };

    message.channel.send({embed: about});
	},
};