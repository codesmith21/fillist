
var mysql   = require('mysql');
var db      = require('../env.js').db;

var connection = mysql.createConnection({
    host     : db.host,
    port     : db.port,
    user     : db.user,
    password : db.password,
    database : db.database
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting MySQL: ' + err.stack);
        return;
    }
    console.log('MySQL DB Connected as Id: ' + connection.threadId);
});

module.exports = {
    mysql: connection
};
