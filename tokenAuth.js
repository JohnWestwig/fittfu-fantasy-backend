var jwt = require('jsonwebtoken');
var jwt_secret = require('./config').jwt.secret;

module.exports = function (req, res, next) {
    var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-token'];
    if (token) {
        jwt.verify(token, jwt_secret, function (error, decoded) {
            if (error) {
                res.end('Token error; ' + error, 400);
            } else {
                req.body.user_id = decoded.id;
            }
            next();
        });
    } else {
        res.end('No token provided', 400);
    }
}
