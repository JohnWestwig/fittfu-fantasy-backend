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
            res.status(500).json({
                errorCode: 1000,
                message: "Could not authenticate",
                description: "Server error",
            });
        } else if (results.length == 0) {
            res.status(400).json({
                message: "Could not authenticate; email not found",
                errorCode: 1001
            });
        } else {
            bcrypt.compare(req.body.password, results[0].password, function (error, result) {
                if (error) {
                    res.status(500).json({
                        message: "Could not authenticate; server error",
                        errorCode: 1002
                    });
                } else {
                    if (result == false) {
                        res.status(400).json({
                            message: "Could not authenticate; password incorrect",
                            errorCode: 1003
                        });
                    } else {
                        var token = jwt.sign({
                            id: results[0].id
                        }, jwt_secret, {
                            expiresIn: '24h'
                        });
                        res.status(200).json({
                            token: token
                        });
                    }
                }
            });
        }
    });
}

/*
 * Registers a new user.
 * 400 error codes: 1000, 1001
 * 500 error codes: 1002, 1003
 */
exports.register = function (req, res) {
    //Validate fields
    if (req.body.firstName == undefined || req.body.firstName == "" || req.body.lastName == undefined || req.body.lastName == "" ||
        req.body.email == undefined || req.body.email == "" || req.body.password == undefined || req.body.password == "") {
        res.status(400).json({
            errorCode: 1000,
            message: "Could not register",
            description: "Name, email and password must be provided and non-empty"
        });
        return;
    }

    bcrypt.hash(req.body.password, 10, function (error, hash) {
        if (error) {
            res.status(500).json({
                errorCode: 1002,
                message: "Could not register",
                description: "Hash failed"
            });
        } else {
            var query = {
                sql: 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                values: [req.body.firstName, req.body.lastName, req.body.email, hash]
            };
            db.query(query.sql, query.values, function (error, results) {
                if (error) {
                    console.log(error);
                    switch (error.errno) {
                        case 1062:
                            res.status(400).json({
                                errorCode: 1001,
                                message: "Could not register",
                                description: "Email already in use"
                            });
                            break;
                        default:
                            res.status(500).json({
                                errorCode: 1003,
                                message: "Could not register",
                                description: "Unknown"
                            });
                    }
                } else {
                    res.status(200).send();
                }
            });
        }
    });
}
