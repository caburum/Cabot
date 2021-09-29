require('events').captureRejections = true;
const Cabot = require('./src/Cabot.js');
const bot = new Cabot();

bot.loadEnabledPlugins();

bot.login(bot.config.token);

process.on('unhandledRejection', bot.onUnhandledRejection.bind(bot));
process.on('SIGINT', bot.cleanup.bind(bot));