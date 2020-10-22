function log(guild, logchannel, user, action, reason, moderator) {
  const channel = guild.channels.find(channel => channel.name === logchannel);
  channel.send(`${user} for ${reason} (${action}) by ${moderator}`)
}

module.exports = log