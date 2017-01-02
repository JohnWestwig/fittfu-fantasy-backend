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
        console.error('Bad JSON');
        res.status(400)
        res.json({
            message: "JSON not parsable"
        });
    }
});

/* Port setup */
var port = process.env.PORT || 8000;

/* Register routes */
var router = require("./routes");
router.init(app);

/* Start server */
app.listen(port);
console.log('Listening on port ' + port);
