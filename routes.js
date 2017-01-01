exports.init = function (app) {
    app.get('/', function (req, res) {
        res.send({
            "message": "API root for FITTFU Fantasy"
        });
    })
    var auth = require('./controllers/auth');
    app.post('/login', auth.login);
    app.post('/register', auth.register);
}
