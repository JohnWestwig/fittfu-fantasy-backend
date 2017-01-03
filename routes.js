var tokenAuth = require('./tokenAuth'),
    auth      = require('./controllers/auth'),
    lineups   = require('./controllers/lineups'),
    leagues   = require('./controllers/leagues'),
    weeks     = require('./controllers/weeks');

exports.init = function (app) {
    app.get('/', function (req, res) {
        res.send({
            "message": "Root for FITTFU Fantasy"
        });
    })
    
    /* Auth */
    app.post('/login', auth.login);
    app.post('/register', auth.register);
    app.get('/test', function(req, res) {
        res.json({
            success: true,
            message: "Test API call"
        });
    });

    /* Token auth on all API routes */
    app.all('/api/*', [tokenAuth]);
    
    /* Token verification */
    app.get('/api/validate', function(req, res) {
        res.json({
            success: true
        });
    });
    /* Leagues */
    app.get('/api/leagues/me', leagues.getMine);
    app.get('/api/leagues/:league_id/weeks/current', leagues.getCurrentWeek);
    
    /* Weeks */
    app.get('/api/weeks/:week_id/lineups/me', weeks.getMyLineup);
    
    /* Lineups */
    app.get('/api/lineups', lineups.getAll);
    app.get('/api/lineups/:lineup_id', lineups.get);
    app.get('/api/lineups/:lineup_id/players', lineups.getAllPlayers);
    app.delete('/api/lineups/:lineup_id/players/:player_id', lineups.removePlayer);
    app.post('/api/lineups/:lineup_id/players/:player_id', lineups.addPlayer);
    
}
