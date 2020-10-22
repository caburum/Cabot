const Discord = require('discord.js');
const client = new Discord.Client();

const website = require('./functions/website.js');
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

  website();

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