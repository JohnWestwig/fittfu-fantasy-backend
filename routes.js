var tokenAuth = require('./tokenAuth');
exports.init = function (app) {
    app.get('/', function (req, res) {
        res.send({
            "message": "Root for FITTFU Fantasy"
        });
    })
    var auth = require('./controllers/auth');
    app.post('/login', auth.login);
    app.post('/register', auth.register);

    app.all('/api/*', [tokenAuth]);
    app.post('/api/test', function(req, res) {
        res.json({
            testmsg: "Hello world!"
        });
    })
}
