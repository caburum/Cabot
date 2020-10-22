var express = require('express');
var app = express();

function keepAlive(){
  app.listen(3000, ()=>{console.log("Server is Ready!")});
}

module.exports = keepAlive

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/website/index.html');
});

app.get('/api', function(req, res) {
  res.json({"guilds": client.guilds.cache.size, "channels": client.channels.cache.size, "users": client.users.cache.size, "uptime": client.uptime});
});

app.get('/api/guilds', function(req, res) {
  res.send(`${client.guilds.cache.size}`);
});

app.get('/api/channels', function(req, res) {
  res.send(`${client.channels.cache.size}`);
});

app.get('/api/users', function(req, res) {
  res.send(`${client.users.cache.size}`);
});

app.get('/api/uptime', function(req, res) {
  res.send(`${client.uptime}`);
});

app.get('/api/testsend/:message', function(req, res) {
  client.channels.cache.get('699271873279557652').send(`${req.params.message}`);
  res.send(`sent '${req.params.message}'`)
});

// 404
app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/website/404.html')
})

app.listen();