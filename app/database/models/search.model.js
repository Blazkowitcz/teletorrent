/**
 * Constructor
 * @param {JSON} datas 
 */
 function Search(datas) {
    for (var key in datas) {
        this[key] = datas[key];
    }
};

Search.Generate = "CREATE TABLE IF NOT EXISTS searchs (ID INTEGER PRIMARY KEY AUTOINCREMENT, tracker INTEGER, title TEXT, season INTEGER, episode INTEGER, last_update TEXT)";

module.exports = Search;