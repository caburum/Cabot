// Website
var express = require('express');
var app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/website/index.html');
});

// API
app.get('/api', function(req, res) {
	res.json({'guilds': client.guilds.cache.size, 'channels': client.channels.cache.size, 'users': client.users.cache.size, 'uptime': client.uptime});
});

app.get('/api/guilds', function(req, res) {
	res.send(client.guilds.cache.size);
});

app.get('/api/channels', function(req, res) {
	res.send(client.channels.cache.size);
});

app.get('/api/users', function(req, res) {
	res.send(client.users.cache.size);
});

app.get('/api/uptime', function(req, res) {
	res.send(client.uptime);
});

// 404
app.use(function (req, res, next) {
	res.status(404).sendFile(__dirname + '/website/404.html')
})

app.listen();