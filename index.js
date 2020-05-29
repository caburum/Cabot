const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require("./config.json");
const data = require("./data.json");
//const website = require('./website.js')

client.login(process.env.token);

// website
var express = require('express');
var app = express();

function keepAlive(){
  app.listen(3000, ()=>{console.log("Server is Ready!")});
}

module.exports = keepAlive;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api', function(req, res) {
  res.json({"guilds": client.guilds.size, "channels": client.channels.size, "users": client.users.size});
});

app.get('/api/guilds', function(req, res) {
  res.send(`${client.guilds.size}`);
});

app.get('/api/channels', function(req, res) {
  res.send(`${client.channels.size}`);
});

app.get('/api/users', function(req, res) {
  res.send(`${client.users.size}`);
});

app.listen();
// end website

function randomInt(r) {
  return Math.floor((Math.random() * r))
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function idleFun() {
  setTimeout(function() {client.user.setStatus('idle')}, 5000);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Cabot has started, with ${client.users.size} total users, in ${client.channels.size} total channels of ${client.guilds.size} guilds`);

  keepAlive();

  // Shows how many servers bot is on
  if (client.guilds.size == 1) {s = ''} else {s = 's'}
  client.user.setPresence({
    status: "idle",
    game: {
      name: `${client.guilds.size} server${s}`,
      type: "WATCHING",
      url: config.url
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
      name: `${client.guilds.size} server${s}`,
      type: "WATCHING",
      url: config.url
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
      name: `${client.guilds.size} server${s}`,
      type: "WATCHING",
      url: config.url
    }
  });
});

client.on("message", async message => {
  // Np botception
  if(message.author.bot) return;
  
  if(message.isMemberMentioned(client.user)) {
    message.channel.send('Prefix:' + config.prefix);
    return;
  }

  // Ignore any message that does not start with prefix
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Separate command name and arguments for the command
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Idle fun
  client.user.setStatus('online');
  idleFun();
  
  if (command === "ping") {
    const ping = await message.channel.send("Ping?");
    ping.edit(`Pong! Bot latency is ${ping.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms.`);
    return
  }
  
  if (command === "say") {
    // Makes the bot say something and delete the message
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
    return
  }

  if (command === '8ball') {
    let sayMessage = args.join(" ");
		message.replytext = randomInt(data.replies.length);
		//message.channel.send("The answer to " + sayMessage + " is " + data.replies[message.replytext]);
    message.channel.send(data.replies[message.replytext]);
    return
  }

  if (command === 'ram') {
    message.delete().catch(O_o=>{});
    message.channel.send('<:downloadmoreram:676158930866405380>');
    return
  }

  if (command === 'help') {
    const help = {
      "title": "Help",
      "description": "Prefix: " + config.prefix + "\n [text] is a placeholder",
      "color": 7506394,
      "thumbnail": {
        "url": "https://raw.githubusercontent.com/google/material-design-icons/master/communication/2x_web/ic_live_help_white_48dp.png"
      },
      "author": {
        "name": "Cabot",
        "url": config.url,
        "icon_url": client.user.avatarURL
      },
      "fields": [
        {
          "name": "ping",
          "value": "Returns the latency of the bot and the API."
        },
        {
          "name": "say [text]",
          "value": "Makes the bot say something."
        },
        {
          "name": "8ball [question]",
          "value": "Asks the Magic 8 Ball a question and returns an answer."
        },
        {
          "name": "ram",
          "value": "<:downloadmoreram:676158930866405380>"
        },
        {
          "name": "help",
          "value": "Displays this help message."
        },
        {
          "name": "help admin",
          "value": "Displays help for admin commands."
        },
        {
          "name": "about",
          "value": "Shows info about the bot."
        }
      ]
    };
    const adminhelp = {
      "title": "Admin Help",
      "description": "Prefix: " + config.prefix + "\n [text] is a placeholder\nThe user has to have the corresponding permission to run the command.",
      "color": 7506394,
      "thumbnail": {
        "url": "https://raw.githubusercontent.com/google/material-design-icons/master/communication/2x_web/ic_live_help_white_48dp.png"
      },
      "author": {
        "name": "Cabot",
        "url": config.url,
        "icon_url": client.user.avatarURL
      },
      "fields": [
        {
          "name": "kick [@user] [reason]",
          "value": "Kicks the mentioned user for the specified reason."
        },
        {
          "name": "ban [@user] [reason]",
          "value": "Bans the mentioned user for the specified reason."
        },
        {
          "name": "botnick [nickname]",
          "value": "Changes the bot's nickname on the server"
        }
      ]
    };

    let page = args.join(" ");

    if (page.startsWith('admin')) {
      message.channel.send({embed: adminhelp});
      return
    } else {
      message.channel.send({embed: help});
      return
    }
  }

  if (command === 'about') {
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
        "url": config.url,
        "icon_url": client.user.avatarURL
      },
      "fields": [
        {
          "name": "Author",
          "value": "<@" + config.owner + ">"
        },
        {
          "name": "Version",
          "value": "1.0"
        },
        {
          "name": "Prefix",
          "value": config.prefix
        },
        {
          "name": "Uptime",
          "value": uptime
        }
      ]
    };

    message.channel.send({embed: about});
    return
  }

  if (command === 'botnick') {
    if(!message.member.hasPermission("MANAGE_NICKNAMES")) return;

    message.guild.members.get(client.user.id).setNickname(args.join(" "));
    message.delete().catch(O_o=>{});
    return
  }

  if (command === 'ban') {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Access denied.");

    let toban = message.mentions.members.first();

    if (!toban) return message.reply("Please mention a valid member of this server.");
    if(!toban.bannable) return message.reply("I cannot ban this user! Do they have a higher role than me? Do I have ban permissions?");
    
    let reason = args.slice(1).join(' ');
    if (!reason) return message.reply("Please indicate a reason for the ban.");

    await toban.ban(reason)
    .catch(error => message.reply(`I couldn't ban because of: ${error}`));
    message.channel.send(`${toban.user} has been banned by ${message.author} because: ${reason}`);
    
    message.delete().catch(O_o=>{});
    return
  }

  if (command === 'kick') {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Access denied.");

    let tokick = message.mentions.members.first();

    if (!tokick) return message.reply("Please mention a valid member of this server.");
    if (!tokick.kickable) return message.reply("I cannot kick this user! Do they have a higher role than me? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if (!reason) return message.reply("Please indicate a reason for the kick.");

    await tokick.kick(reason)
    .catch(error => message.reply(`I couldn't kick because of: ${error}`));
    message.channel.send(`${tokick.user} has been kicked by ${message.author} because: ${reason}`);
    
    message.delete().catch(O_o=>{});
    return
  }

  if (command === 'rickroll') {
    if (message.member.id != config.owner) return;
    message.delete().catch(O_o=>{});
    message.guild.members.get(client.user.id).setNickname("Rick Astley");
    await sleep(100);
    message.channel.send(data.rickroll[0], {tts: true});
    await sleep(10000);
    message.channel.send(data.rickroll[1], {tts: true});
    await sleep(6500);
    message.channel.send(data.rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(data.rickroll[3], {tts: true});
    await sleep(11000);
    message.channel.send(data.rickroll[4], {tts: true});
    await sleep(8000);
    message.channel.send(data.rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(data.rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(data.rickroll[5], {tts: true});
    await sleep(10000);
    message.channel.send(data.rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(data.rickroll[3], {tts: true});
    await sleep(11000);
    message.channel.send(data.rickroll[1], {tts: true});
    await sleep(6500);
    message.channel.send(data.rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(data.rickroll[2], {tts: true});
    await sleep(14500);
    message.channel.send(data.rickroll[6], {tts: true});
    message.guild.members.get(client.user.id).setNickname("");
  }

  if (command === 'prefix') {
    if (message.member.id != config.owner) return;
    message.delete().catch(O_o=>{});
    config.prefix = args.join(" ");
    fs.writeFileSync('config.json', JSON.stringify(config));
  }

  else {
    message.channel.send("Invalid command")
  }

});