var db = require('../db').connect();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var jwt_secret = require('../config').jwt.secret;

exports.login = function (req, res) {
    var query = {
        sql: 'SELECT id, password FROM users WHERE email = ?',
        values: [req.body.email]
    }
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            res.json({
                success: false,
                message: "Could not authenticate; error unknown"
            });
        } else if (results.length == 0) {
            res.json({
                success: false,
                message: "Could not authenticate; email not found"
            });
        } else {
            bcrypt.compare(req.body.password, results[0].password, function (error, result) {
                if (error) {
                    res.json({
                        success: false,
                        message: "Could not authenticate; password incomparable"
                    });
                } else {
                    if (result == false) {
                        res.json({
                            success: false,
                            message: "Could not authenticate; password incorrect"
                        });
                    } else {
                        var token = jwt.sign({
                            id: results[0].id
                        }, jwt_secret, {
                            expiresIn: '1h'
                        });
                        res.json({
                            success: true,
                            token: token
                        });
                    }
                }
            });
        }
    });
}

exports.register = function (req, res) {
    bcrypt.hash(req.body.password, 10, function (error, hash) {
        if (error) {
            res.json({
                success: false,
                message: "Couldn't generate password hash",
            });
        } else {
            var query = {
                sql: 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                values: [req.body.first_name, req.body.last_name, req.body.email, hash]
            };
            db.query(query.sql, query.values, function (error, results) {
                if (error) {
                    res.json({
                        success: false,
                        message: "Could not insert user information",
                        error: error
                    });
                } else {
                    res.json({
                        success: true
                    });
                }
            });
        }
    });
}
