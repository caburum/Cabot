const env = Object.assign({}, process.env);

for (let key in env) {
	let value = env[key];
	if (
		typeof value == 'string' &&
		(value.charAt(0) == '{' || value.charAt(0) == '[')
	) try {
		env[key] = JSON.parse(value);
	} catch(e) {}
}

env.version = require('../../package.json').version;
env.authors = [
	'413455502480244747'
];

try {
	const config = require(process.env.configPath || '../../config.json');
	module.exports = {
		...env,
		...config
	};
} catch(e) {
	module.exports = env;
}