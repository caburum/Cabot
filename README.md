[![Known Vulnerabilities](https://snyk.io/test/github/caburum/Cabot/badge.svg?targetFile=package.json)](https://snyk.io/test/github/caburum/Cabot?targetFile=package.json)
[![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/caburum/Cabot)](https://libraries.io/github/caburum/Cabot)
![Guilds bot is in](https://img.shields.io/badge/dynamic/json?label=guilds&query=guilds&url=https%3A%2F%2Fcabot.ccreativecnd.repl.co%2Fapi)
![Uptime (ms)](https://img.shields.io/badge/dynamic/json?label=uptime&query=uptime&url=https%3A%2F%2Fcabot.ccreativecnd.repl.co%2Fapi&suffix=ms)

## Cabot is a simple, modular Discord bot written in Discord.js.
It's purpose is to be a useful and fully free bot for servers.
Currently, it is still in development.

### Help
The default prefix for Cabot is `$`
To see more about commands, run `$help`

### Feedback
Use the `$feedback` bot command to send feedback about the bot

### Documentation
#### API
*The API is still being developed, but you can see it [here](https://cabot.ccreativecnd.repl.co/api).*

#### Structure
```
index.js — Runs the bot
config.json — Non-sensitive configuration
src/
  index.js — Main setup class
  commands/ — Commands for a standard command handler, commands are grouped into subfolders by category
  plugins/ — More advanced code that does not need to be specificially invoked by a user
  structs/ — Structure classes used in various components (like plugins and commands)
  util/ — Useful snippets used across various files
website/ — Web interface (todo), currently static
```