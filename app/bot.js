const TelegramBot = require('node-telegram-bot-api');
const config = require('../config.json');
const token = config.bot_token;
var database = require('./database/index');
var bot = null;

/**
 * Init bot
 */
function start() {
    bot = new TelegramBot(token, {polling: true});
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, "Greeting " + msg.chat.username);
    });
}

module.exports = { start }