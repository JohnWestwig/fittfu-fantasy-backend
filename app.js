/* index.js */

/* Packages */
var express = require('express');
var app = express();
var config = require('./config');

/* JSON body parser */
var bodyParser = require('body-parser');
app.use(bodyParser.json());

/* Port setup */
var port = process.env.PORT || 8000;

/* Register routes */
var router = require("./routes");
router.init(app);

/* Start server */
app.listen(port);
console.log('Listening on port ' + port);
