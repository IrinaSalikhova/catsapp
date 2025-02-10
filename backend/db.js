const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    //socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    host: '34.29.63.110',
    port: 3306,
    user: 'CATSforMAP',
    password: 'CATSforMAP1234!', 
    database: 'catmap'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = connection;
