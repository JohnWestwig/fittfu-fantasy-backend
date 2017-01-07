/* index.js */

/* Packages */
var express = require('express');
var app = express();
var config = require('./config');

/* JSON body parser */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(400)
        res.json({
            message: "JSON not parsable"
        });
    }
});

/* Port setup */
var port = process.env.PORT || 8000;

function registerRoutes() {
    /* Register routes */
    var router = require("./routes");
    router.init(app);
}

/* Global database connection */
global.db = require('./db').connect(registerRoutes);

/* Start server */
app.listen(port);
console.log('Listening on port ' + port);
