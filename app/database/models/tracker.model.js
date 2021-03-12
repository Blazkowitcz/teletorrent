/**
 * Constructor
 * @param {JSON} datas 
 */
 function Search(datas) {
    for (var key in datas) {
        this[key] = datas[key];
    }
};

Search.Generate = "CREATE TABLE IF NOT EXISTS trackers (ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, rss_address TEXT, passkey INTEGER)";

module.exports = Search;