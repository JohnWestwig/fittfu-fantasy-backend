var bcrypt = require('bcrypt-nodejs'),
    jwt = require('jsonwebtoken'),
    jwt_secret = require('../config').jwt.secret;

exports.login = function (req, res) {
    var email = req.body.email,
        password = req.body.password;

    if (email == undefined || email == "" || password == undefined || password == "") {
        res.status(400).json({
            errorCode: 1000,
            message: "Could not authenticate",
            description: "Email and password must be provided and non-empty"
        });
        return;
    }

    var query = {
        sql: 'SELECT id, password FROM users WHERE email = ?',
        values: [email]
    }
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            res.status(500).json({
                errorCode: 1003,
                message: "Could not authenticate",
                description: "Database error (unknown)",
            });
        } else if (results.length == 0) {
            res.status(400).json({
                errorCode: 1001,
                message: "Could not authenticate",
                description: "Email not found"
            });
        } else {
            bcrypt.compare(password, results[0].password, function (error, result) {
                if (error) {
                    res.status(500).json({
                        errorCode: 1004,
                        message: "Could not authenticate",
                        description: "Hash error"
                    });
                } else {
                    if (result == false) {
                        res.status(400).json({
                            errorCode: 1002,
                            message: "Could not authenticate",
                            description: "Password incorrect"
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
exports.register = function (req, res) {
    var firstName = req.body.firstName,
        lastName = req.body.lastName,
        email = req.body.email,
        password = req.body.password;
    
    //Validate fields
    if (firstName == undefined || firstName == "" || lastName == undefined || lastName == "" || email == undefined || email == "" || password == undefined || password == "") {
        res.status(400).json({
            errorCode: 1000,
            message: "Could not register",
            description: "Name, email and password must be provided and non-empty"
        });
        return;
    }

    bcrypt.hash(password, 10, function (error, hash) {
        if (error) {
            res.status(500).json({
                errorCode: 1002,
                message: "Could not register",
                description: "Hash failed"
            });
        } else {
            var query = {
                sql: 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                values: [firstName, lastName, email, hash]
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
                    res.status(200).json({});
                }
            });
        }
    });
}
