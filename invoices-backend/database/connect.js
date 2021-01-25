const mysql = require('mysql');
const settings = require('../settings.json');
let pool;

function connectDatabase() {
    if (!pool) {
        pool = mysql.createPool({
            connectionLimit: settings.connectionLimit,
            host: settings.host,
            user: settings.user,
            password: settings.password,
            database: settings.database,
            dateStrings: true,
        });
    }
    return pool;
}

module.exports = connectDatabase();
