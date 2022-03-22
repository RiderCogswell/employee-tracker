const mysql = require('mysql2');

// create connection to DB
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RiderCogswell',
    database: 'employee_db'
});

module.exports = db;