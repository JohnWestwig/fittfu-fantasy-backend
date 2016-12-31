/* index.js */

/* Packages */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

/* Connect to database */
var mysql = require('mysql');
var mysql_config = require("./mysql_config.js");
var connection = mysql.createConnection({
    host: mysql_config.connection.host,
    user: mysql_config.connection.user,
    password: mysql_config.connection.password,
    port: 3306
});

connection.connect(function (error) {
    if (error) {
        console.error('Error connecting to database: ' + error.stack);
        return;
    } 
    console.log('Connected to database as ID: ' + connection.threadId);
});
connection.end();

/* JSON body parser */
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/* Port setup */
var port = process.env.PORT || 8000;

/* API routes */
var router = express.Router();
router.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

/* TODO add API routes */

/* Register routes */
app.use('/api', router);

/* Start server */
app.listen(port);
console.log('Listening on port ' + port);
