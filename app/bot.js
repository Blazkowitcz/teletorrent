const TelegramBot = require('node-telegram-bot-api');
const config = require('../config.json');
const token = config.bot_token;
var database = require('./database/index');
const Tracker = require('./database/models/tracker.model');
var bot = null;
var tracker_list = [];

/**
 * Init bot
 */
function init() {
    bot = new TelegramBot(token, {polling: true});
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, "Greeting " + msg.chat.username);
    });
    setTrackerCommands(bot);
    
}

/**
 * Set tracker command
 * @param {Object} bot 
 */
function setTrackerCommands(bot){
    bot.onText(/\/tracker add (.+)/, (msg, info) => {
        elements = info[1].split(' ');
        if(elements.length < 2){
            bot.sendMessage(msg.chat.id, "Missing arguments");
            return null;
        }else {
            Tracker.create(new Tracker(elements[0], elements[1], elements[2] || null, elements[3] || null), (err) => {
                bot.sendMessage(msg.chat.id, "Tracker added");
            });
            //tracker_list.push(new Tracker(elements[0], elements[1], elements[2] || null, elements[3] || null));
            
        }
    })
    bot.onText(/\/tracker list/, (msg, info) => {
        Tracker.list(function (err, data) {
            if (err){
                return null;
            }
            data.forEach(tracker => {
                bot.sendMessage(msg.chat.id, tracker.name + " (" + tracker.address + ")");
            });
        });
    })
}

module.exports = { init }