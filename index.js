/* index.js */

/* Packages */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

/* JSON body parser */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Port setup */
var port = process.env.PORT || 8000;

/* API routes */
var router = express.Router();
router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!' 
    });   
});

/* TODO add API routes */

/* Register routes */
app.use('/api', router);

/* Start server */
app.listen(port);
console.log('Magic happens on port ' + port);