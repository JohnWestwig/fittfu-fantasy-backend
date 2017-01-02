var db = require('../db').connect();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var jwt_secret = require('../config').jwt.secret;

exports.login = function (req, res) {
    res.status(400);
    var query = {
        sql: 'SELECT id, password FROM users WHERE email = ?',
        values: [req.body.email]
    }
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            res.json({
                message: "Could not authenticate; " + error
            });
        } else if (results.length == 0) {
            res.json({
                message: "Could not authenticate; email not found"
            });
        } else {
            bcrypt.compare(req.body.password, results[0].password, function (error, result) {
                if (error) {
                    res.json({
                        message: "Could not authenticate; password incomparable"
                    });
                } else {
                    if (result == false) {
                        res.json({
                            message: "Could not authenticate; password incorrect"
                        });
                    } else {
                        var token = jwt.sign({
                            id: results[0].id
                        }, jwt_secret, {
                            expiresIn: '24h'
                        });
                        res.status (200);
                        res.json({
                            token: token
                        });
                    }
                }
            });
        }
    });
}

exports.register = function (req, res) {
    res.status(400);
    bcrypt.hash(req.body.password, 10, function (error, hash) {
        if (error) {
            res.json({
                message: "Could not register; hash failed",
            });
        } else {
            var query = {
                sql: 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                values: [req.body.firstName, req.body.lastName, req.body.email, hash]
            };
            db.query(query.sql, query.values, function (error, results) {
                if (error) {
                    res.json({
                        message: "Could not register;" + error,
                    });
                } else {
                    res.status(400);
                    res.send();
                }
            });
        }
    });
}
