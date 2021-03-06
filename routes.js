var tokenAuth = require('./tokenAuth'),
    auth = require('./controllers/auth'),
    lineups = require('./controllers/lineups'),
    leagues = require('./controllers/leagues'),
    weeks = require('./controllers/weeks'),
    players = require('./controllers/players'),
    articles = require('./controllers/articles');

exports.init = function (app) {
    app.get('/', function (req, res) {
        res.json({
            "message": "Root for FITTFU Fantasy"
        });
    });

    /* Auth */
    app.post('/login', auth.login);
    app.post('/register', auth.register);

    /* Token auth on all API routes */
    app.all('/api/*', [tokenAuth]);

    /* Token verification */
    app.get('/api/validateToken', function (req, res) {
        res.status(200).json({});
    });

    /* Leagues */
    app.get('/api/leagues', leagues.all);
    app.post('/api/leagues/:league_id/lineups', leagues.join);
    app.get('/api/leagues/:league_id/weeks', leagues.getWeeks);
    app.get('/api/leagues/:league_id/weeks/current', leagues.getCurrentWeek);
    app.get('/api/leagues/:league_id/articles', leagues.getArticles);
    app.get('/api/leagues/:league_id/standings', leagues.getStandings);

    /* Weeks */
    app.get('/api/weeks/:week_id/lineups/me', weeks.getMyLineup);
    app.get('/api/weeks/:week_id/games', weeks.getGames);
    app.get('/api/weeks/:week_id/stats', weeks.getStats);

    /* Lineups */
    app.get('/api/lineups', lineups.getAll);
    app.get('/api/lineups/:lineup_id', lineups.get);
    app.get('/api/lineups/:lineup_id/players', lineups.getAllPlayers);
    app.delete('/api/lineups/:lineup_id/players/:player_id', lineups.removePlayer);
    app.put('/api/lineups/:lineup_id/players/:player_id', lineups.addPlayer);

    /* Players */
    app.get('/api/players/:player_id', players.get);
    app.get('/api/players/:player_id/weeklyStats', players.getWeeklyStats);

    /* Articles */
    app.get('/api/articles/:article_id', articles.get);

}
