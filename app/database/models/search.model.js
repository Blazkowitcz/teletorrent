/**
 * Constructor
 * @param {JSON} datas 
 */
function Search(tracker_id, title, season, episode, last_update) {
    this.tracker = tracker_id;
    this.title = title;
    this.season = season;
    this.episode = episode;
    this.last_update = last_update;
};

/**
 * Create a research
 * @param {Object} search 
 * @param {Function} callback 
 */
Search.create = function create(search, callback) {
    var db = require('../../database');
    db.get("SELECT id FROM trackers WHERE name = ?", search.tracker, (err, row) => {
        console.log(err);
        console.log(row.ID);
        db.run("INSERT INTO searchs (tracker, title, season, episode, last_update) VALUES (?,?,?,?,?)", row.id, search.title, search.season, search.episode, search.last_update, (err) => {
            if(err) 
                callback(err);
            else 
                callback(null);
        });
    })
}

/**
 * Return list of research
 * @param {Function} callback 
 */
Search.list = function list(callback) {
    var db = require('../../database');
    results = [];
    db.all("SELECT * FROM searchs", (err, rows) => {
        if(rows !== null && typeof rows !== "undefined"){
            rows.forEach((row) => {
                results.push(row);
            })
        }
        callback(null, results);
    })
}

/** Database table generator */
Search.Generate = "CREATE TABLE IF NOT EXISTS searchs (id INTEGER PRIMARY KEY AUTOINCREMENT, tracker INTEGER, title TEXT, season INTEGER, episode INTEGER, last_update TEXT)";

module.exports = Search;