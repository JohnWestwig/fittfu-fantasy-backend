var mysql = require('mysql');
var dbConfig = require("./config").dbConfig;

exports.connect = function (onCompleted) {
    var dbConnection = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database
    });

    dbConnection.connect(function (error) {
        if (error) {
            console.error('Error connecting to database: ' + error.stack);
            return;
        }
        console.log('Connected to database as ID: ' + dbConnection.threadId);
        if (typeof onCompleted === "function") {
            onCompleted();
        }
    });
    return dbConnection;
}
