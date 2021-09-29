// Small functions go here, otherwise it belongs in an individual file

function plural(amount, text, suffix = 's') {
	return `${amount} ${text}${amount > 1 ? suffix : ''}`;
}

function randomInt(r) {
	return Math.floor((Math.random() * r));
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { plural, randomInt, sleep };