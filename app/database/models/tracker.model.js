/**
 * Constructor
 * @param {JSON} datas 
 */
function Tracker(name, address, rss_address, passkey) {
    this.name = name;
    this.address = address;
    this.rss_address = rss_address || null;
    this.passkey = passkey || null;
};

/**
 * Create new tracker
 * @param {Object} tracker 
 * @param {Function} callback 
 */
Tracker.create = function create(tracker, callback) {
    var db = require('../../database');
    db.run("INSERT INTO trackers (name, address, rss_address, passkey) VALUES (?,?,?,?)", tracker.name, tracker.address, tracker.rss_address, tracker.passkey, (err) => {
        if(err) 
            callback(err);
        else 
            callback(null);
    });
}

/**
 * Return list of all trackers
 * @param {Function} callback 
 */
Tracker.list = function list(callback) {
    var db = require('../../database');
    var results = [];
    db.all("SELECT * FROM trackers", (err, rows) => {
        if(rows !== null && typeof rows !== "undefined"){
            rows.forEach((row) => {
                results.push(row);
            })
        }
        callback(null, results);
    })
}

/**
 * Return a tracker
 * @param {Int} id 
 * @param {Function} callback 
 */
Tracker.get = function get(id, callback){
    var db = require('../../database');
    db.get("SELECT * FROM trackers WHERE id = ?", id, (err, data) => {
        if(err) 
            callback(err);
        else 
            callback(null, data);
    });
}

/**
 * Return a tracker by this id
 * @param {String} name 
 * @param {Function} callback 
 */
Tracker.getTrackerId = function getTrackerId(name, callback) {
    var db = require('../../database');
    db.get("SELECT * FROM trackers WHERE name = ?", name, (err, data) => {
        if(err) 
            callback(err);
        else 
            callback(null, data);
    });
}

/** Database table generator */
Tracker.Generate = "CREATE TABLE IF NOT EXISTS trackers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, rss_address TEXT, passkey INTEGER)";

module.exports = Tracker;