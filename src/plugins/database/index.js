// Database
const Enmap = require('enmap');

client.settings = new Enmap({
	name: 'settings',
	fetchAll: false,
	autoFetch: true,
	cloneLevel: 'deep'
});
const defaultSettings = {	
	prefix: '$',	
	logchannel: 'mod-logs'
}
client.modActions = new Enmap({
	name: 'actions'
});
client.userProfiles = new Enmap({
	name: 'userProfiles'
});