const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const config = require('../config.json');
const token = config.bot_token;
var database = require('./database/index');
const Search = require('./database/models/search.model');
const Tracker = require('./database/models/tracker.model');
var bot = null;

/**
 * Init bot
 */
function init() {
    bot = new TelegramBot(token, { polling: true });
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, "Greeting " + msg.chat.username);
    });
    bot.onText(/\/find/, (msg) => {
        Search.list(function (err, data) {
            data.forEach((row) => {
                Tracker.get(row.id, function (err, tracker) {
                    if (err || tracker === undefined) { return null; }
                    address = "https://" + tracker.address + tracker.rss_address.replace('<PASSKEY>', tracker.passkey);
                    fetch(address)
                    .then(res => res.json())
                    .then((torrent) => {
                        torrent.forEach((s) => {
                            search_text = row.title.split('.');
                            find = false;
                            search_text.forEach((search) => {
                                if(s.name.toLowerCase().includes(search))
                                    find = true;
                                else
                                    find = false;
                            })
                            if(find === true)
                                bot.sendMessage(msg.chat.id,"Torrent found : " + s.name + " on tracker " + tracker.name);
                        })
                    });
                });
            })
        })
    })
    setTrackerCommands(bot);
    setSearchCommands(bot);

}

/**
 * Set search commands
 * @param {Object} bot 
 */
function setSearchCommands(bot) {
    bot.onText(/\/search add (.+)/, (msg, info) => {
        elements = info[1].split(' ');
        if (elements.length < 2) {
            bot.sendMessage(msg.chat.id, "Missing arguments");
            return null;
        } else {
            search = new Search(elements[0], elements[1], elements[2] || null, elements[3] || null, elements[4] || null);
            Search.create(new Search(elements[0], elements[1], elements[2] || null, elements[3] || null, elements[4] || null), (err) => {
                bot.sendMessage(msg.chat.id, "Search added");
            });
        }
    })
}

/**
 * Set tracker commands
 * @param {Object} bot 
 */
function setTrackerCommands(bot) {
    bot.onText(/\/tracker add (.+)/, (msg, info) => {
        elements = info[1].split(' ');
        if (elements.length < 2) {
            bot.sendMessage(msg.chat.id, "Missing arguments");
            return null;
        } else {
            Tracker.create(new Tracker(elements[0], elements[1], elements[2] || null, elements[3] || null), (err) => {
                bot.sendMessage(msg.chat.id, "Tracker added");
            });
        }
    })
    bot.onText(/\/tracker list/, (msg, info) => {
        Tracker.list(function (err, data) {
            if (err) {
                return null;
            }
            data.forEach(tracker => {
                bot.sendMessage(msg.chat.id, tracker.name + " (" + tracker.address + ")");
            });
        });
    })
}

module.exports = { init }