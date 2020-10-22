const Discord = require('discord.js');
const client = new Discord.Client();

//const website = require('./functions/website.js');
const data = require("./botdata/about.json");

// Command Handler
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

function keepAlive(){
  app.listen(3000, ()=>{console.log("Server is Ready!")});
}

// Enmaps
const Enmap = require('enmap');
client.settings = new Enmap({
  name: "settings",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep'
});
const defaultSettings = {	
  prefix: "$",	
  logchannel: "mod-logs"
}
client.modActions = new Enmap({
  name: 'actions'
});
client.userProfiles = new Enmap({
  name: 'userProfiles'
});

function idleFun() {
  setTimeout(function() {client.user.setStatus('idle')}, 5000);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Cabot has started, with ${client.users.cache.size} total users, in ${client.channels.cache.size} total channels of ${client.guilds.cache.size} guilds`);

  keepAlive();

  // Shows how many servers bot is on
  if (client.guilds.size == 1) {s = ''} else {s = 's'}
  client.user.setPresence({
    status: "idle",
    game: {
      name: `${client.guilds.cache.size} server${s}`,
      type: "WATCHING",
      url: data.url
    }
  });
  //client.user.setActivity(`on ${client.guilds.size} server${s}`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`Joined ${guild.name} (id: ${guild.id}) with ${guild.memberCount} members!`);
  if (client.guilds.size == 1) {s = ''} else {s = 's'}
  client.user.setPresence({
    status: "idle",
    game: {
      name: `${client.guilds.cache.size} server${s}`,
      type: "WATCHING",
      url: data.url
    }
  });
});

client.on("guildDelete", guild => {
  // This event triggers when the bot is removed from a guild.
  console.log(`Left ${guild.name} (id: ${guild.id})`);
  if (client.guilds.size == 1) {s = ''} else {s = 's'}
  client.user.setPresence({
    status: "idle",
    game: {
      name: `${client.guilds.cache.size} server${s}`,
      type: "WATCHING",
      url: data.url
    }
  });
});

client.on("message", async message => {
  // Np botception
  if(!message.guild || message.author.bot) return;
  
  /*if(message.mentions.has(client.user)) {
    message.channel.send('Prefix:' + config.prefix);
    return;
  }*/

  // Ignore any message that does not start with prefix
  const guildConf = client.settings.ensure(message.guild.id, defaultSettings);
  if(message.content.indexOf(guildConf.prefix) !== 0) return;

  // Separate command name and arguments for the command
  const args = message.content.split(/\s+/g);
  const commandName = args.shift().slice(guildConf.prefix.length).toLowerCase();

  client.userProfiles.ensure(message.author.id, {
    id: message.author.id,
    guild: message.guild.id,
    totalActions: 0,
    warnings: [],
    kicks: []
  });

  // Idle fun
  client.user.setStatus('online');
  idleFun();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  try {
    command.execute(client, message, args, guildConf);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }
});

client.login(process.env.token);

// API
var express = require('express');
var app = express();

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

// 404
app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/website/404.html')
})

app.listen();