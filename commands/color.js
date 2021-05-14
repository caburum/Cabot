const {MessageEmbed} = require('discord.js');
const config = require('../config.json');

function hexToDec(hexString){
	return parseInt(hexString, 16);
}

function rgbToHex(r, g, b) {
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
	// Expand shorthand form (e.g. #03F) to full form (e.g. #0033FF)
	let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function isHexColor (hex) {
	if (hex.charAt(0) === '#') {
		hex = hex.substring(1);
	}
	return typeof hex === 'string'
		&& (hex.length === 6 || hex.length === 3)
		&& !isNaN(Number('0x' + hex))
}

module.exports = {
	name: 'color',
	description: 'Shows information about a color',
	usage: '<hex color code>',
	info: 'The # before the color code is not required, but will work',
	aliases: ['hex', 'colour'],
	category: 'UTILITIES',
	execute(client, message, args, guildConf) {
		let color = false;

		if (isHexColor(args[0])) {
			color = true;
			hex = args[0].toUpperCase();
			if (hex.charAt(0) === '#') {
				hex = hex.substring(1);
			}
			if (hex.length === 3) {
				hex = `${hex.charAt(0)}${hex.charAt(0)}${hex.charAt(1)}${hex.charAt(1)}${hex.charAt(2)}${hex.charAt(2)}`.toUpperCase();
			}
			decimal = hexToDec(hex);
			rgb = hexToRgb(hex);
		}

		if (color) {
			let embed = new MessageEmbed()
				.setColor(hex)
				.setTitle('Color')
				.addFields(
					{name: 'Hex', value: '#' + hex},
					{name: 'Decimal', value: decimal},
					{name: 'Red', value: rgb.r, inline: true},
					{name: 'Green', value: rgb.g, inline: true},
					{name: 'Blue', value: rgb.b, inline: true},
				)
				.setThumbnail(`https://dummyimage.com/400x400/${hex}/${hex}`);

			message.channel.send(embed);
		} else {
			message.react(config.emoji.error);
		}
	},
};