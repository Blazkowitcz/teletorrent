const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
var search = require('./models/search.model');
var tracker = require('./models/tracker.model');
var dbFile = 'database.db';
var dbExists = fs.existsSync(dbFile);
var db = null;

if (!dbExists) {
    fs.openSync(dbFile, 'w');
}
var db = new sqlite3.Database(dbFile);

if (!dbExists) {
    db.run(tracker.Generate);
    db.run(search.Generate);
}

module.exports = db;