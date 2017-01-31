var api_error = require('./api_error');

exports.getMyLineup = function (req, res) {
    var error_info = {
        message: "Could not get my lineup",
        errors: {
            5000: "Database error (unknown)"
        }
    }
    var week_id = req.params.week_id;
    var query = {
        sql: "SELECT lineups.id, lineups.week_id, lineups.user_id, lineups.name, lineups.money_total, COALESCE(SUM(players.price), 0) AS money_spent FROM lineups JOIN lineup_memberships lm ON lm.lineup_id = lineups.id JOIN players ON players.id = lm.player_id WHERE user_id = ? AND week_id = ?",
        values: [req.body.user_id, req.params.week_id]
    }

    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.status(200).json({
                lineup: results[0]
            });
        }
    });
}

exports.getGames = function (req, res) {
    var error_info = {
        message: "Could not get games",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var week_id = req.params.week_id;
    var lineup_id = (req.query.lineup_id == undefined) ? "-1" : req.query.lineup_id;
    var query = {
        sql: "SELECT games.id AS game_id, games.home_team_id, games.away_team_id, games.time AS game_time, " +
            "teams.id AS team_id, teams.name AS team_name, (teams.id = games.home_team_id) AS is_home_team, " +
            "players.id AS player_id, players.first_name AS player_first_name, players.last_name AS player_last_name, players.year AS player_year, players.nickname AS player_nickname, " +
            "(IF(lm.id IS NULL, false, true)) AS player_owned, " +
            "COALESCE(SUM(ppc.value * pp.count), 0) AS player_points " +
            "FROM games " +
            "JOIN teams ON teams.id = games.home_team_id OR teams.id = games.away_team_id " +
            "JOIN players " +
            "JOIN team_memberships tm ON tm.player_id = players.id AND tm.team_id = teams.id " +
            "LEFT JOIN player_performances pp ON pp.player_id = players.id AND pp.game_id = games.id " +
            "LEFT JOIN player_performance_categories ppc ON pp.player_performance_category_id = ppc.id " +
            "LEFT JOIN lineup_memberships lm ON lm.player_id = players.id AND lm.lineup_id = ? " +
            "WHERE week_id = ? " +
            "GROUP BY game_id, team_id, player_id " +
            "ORDER BY games.time, games.id, teams.id = home_team_id DESC, player_points DESC, player_last_name, player_first_name",
        values: [lineup_id, week_id]
    }
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            var games = [];
            var current_game = {}

            for (var i = 0; i < results.length; i++) {
                var entry = results[i];
                if (i == 0 || current_game.id != entry.game_id) {
                    if (i > 0) {
                        games.push(current_game);
                    }
                    current_game = {};
                    current_game.id = entry.game_id;
                    current_game.time = entry.game_time;
                    current_game.home_team = {};
                    current_game.away_team = {};
                }
                if (entry.is_home_team) {
                    if (Object.keys(current_game.home_team).length == 0) {
                        current_game.home_team.id = entry.team_id;
                        current_game.home_team.name = entry.team_name;
                        current_game.home_team.players = [];
                    }
                    current_game.home_team.players.push({
                        id: entry.player_id,
                        first_name: entry.player_first_name,
                        last_name: entry.player_last_name,
                        year: entry.player_year,
                        nickname: entry.player_nickname,
                        points: entry.player_points,
                        owned: entry.player_owned
                    });

                } else {
                    if (Object.keys(current_game.away_team).length == 0) {
                        current_game.away_team.id = entry.team_id;
                        current_game.away_team.name = entry.team_name;
                        current_game.away_team.players = [];
                    }
                    current_game.away_team.players.push({
                        id: entry.player_id,
                        first_name: entry.player_first_name,
                        last_name: entry.player_last_name,
                        year: entry.player_year,
                        nickname: entry.player_nickname,
                        points: entry.player_points,
                        owned: entry.player_owned
                    });
                }
            }
            if (current_game.id != undefined) {
                games.push(current_game);
            }

            res.status(200).json({
                games: games
            });
        }
    });
}

exports.getStats = function (req, res) {
    var error_info = {
        message: "Could not get stats",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    
    var week_id = req.params.week_id;
    console.log(week_id);
    
    var query = {
        sql: "SELECT players.id AS player_id, players.first_name AS player_name, COALESCE(pp.count, 0) AS count, ppc.name, ppc.value FROM players " +
            "LEFT JOIN games ON games.week_id = ? " +
            "JOIN teams ON teams.id = games.home_team_id OR teams.id = games.away_team_id " +
            "JOIN team_memberships tm ON tm.player_id = players.id AND tm.team_id = teams.id " +
            "JOIN player_performance_categories ppc " +
            "LEFT JOIN player_performances pp ON pp.player_performance_category_id = ppc.id AND pp.game_id = games.id AND pp.player_id = players.id " +
            "ORDER BY players.id, ppc.value DESC, ppc.name",
        values: [week_id]
    };
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            res.status(500).json({
                message: error 
            });
            //api_error.send(res, error_info, 5000);
        } else {
            //We have some processing to get this thing into JSON:
            var players = [];
            var stats = {};
            for (var i = 0; i < results.length; i++) {
                var row = results[i];

                if (i == 0 || stats.player_id != row.player_id) {
                    console.log(i);
                    if (i > 0) {
                        players.push(stats);
                    }
                    stats = {
                        player_id: row.player_id,
                        player_name: row.player_name,
                        point_total: 0,
                        categories: []
                    };
                }

                stats.categories.push({
                    name: row.name,
                    count: row.count,
                    value: row.value
                });
                stats.point_total += (row.value * row.count);
            }
            if (stats.player_id != undefined) {
                players.push(stats);
            }
            res.status(200).json({
                stats: players
            });
        }
    });
};
