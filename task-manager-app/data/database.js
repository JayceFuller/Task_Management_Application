const { join, dirname } = require("path");
const Database = require('better-sqlite3');

//Create the database connection
let db;
try {
    const db = new Database(join(__dirname, "database.db"));
    console.log("Database connected");
}
catch (err) {
    console.log("Database connection failed", err);
}

module.exports = db;