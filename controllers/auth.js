var api_error = require('./api_error'),
    bcrypt = require('bcrypt-nodejs'),
    jwt = require('jsonwebtoken'),
    jwt_secret = require('../config').jwt.secret;

exports.login = function (req, res) {
    var error_info = {
        message: "Could not authenticate",
        errors: {
            4000: "Email and password must be provided and non-empty",
            4001: "Email not found",
            4002: "Password incorrect",
            5000: "Database error (unknown)",
            5001: "Hash error (unknown)"
        }
    };
    var email = req.body.email,
        password = req.body.password;

    if (email == undefined || email == "" || password == undefined || password == "") {
        api_error.send(res, error_info, 4000);
        return;
    }

    var query = {
        sql: 'SELECT id, password FROM users WHERE email = ?',
        values: [email]
    }
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else if (results.length == 0) {
            api_error.send(res, error_info, 4001);
        } else {
            bcrypt.compare(password, results[0].password, function (error, result) {
                if (error) {
                    api_error.send(res, error_info, 5001)
                } else {
                    if (result == false) {
                        api_error.send(res, error_info, 4002)
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
    var error_info = {
        message: "Could not register",
        errors: {
            4000: "Name, email and password must be provided and non-empty",
            4001: "Email must be of valid format",
            4002: "Email already in use",
            5000: "Database error (unknown)",
            5001: "Hash error (unknown)"
        }
    };
    
    var firstName = req.body.firstName,
        lastName = req.body.lastName,
        email = req.body.email,
        password = req.body.password;

    //Validate fields
    if (firstName == undefined || firstName == "" || lastName == undefined || lastName == "" || email == undefined || email == "" || password == undefined || password == "") {
        api_error.send(res, error_info, 4000);
        return;
    }
    
    if (email.match(/\S+@\S+\.\S+/) == null) {
        api_error.send(res, error_info, 4001);
    }

    bcrypt.hash(password, 10, function (error, hash) {
        if (error) {
            api_error.send(res, error_info, 5001);
        } else {
            var query = {
                sql: 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                values: [firstName, lastName, email, hash]
            };
            db.query(query.sql, query.values, function (error, results) {
                if (error) {
                    switch (error.errno) {
                        case 1062:
                            api_error.send(res, error_info, 4002);
                            break;
                        default:
                            api_error.send(res, error_info, 5000)
                    }
                } else {
                    res.status(200).send();
                }
            });
        }
    });
}
