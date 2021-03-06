var api_error = require('./api_error');

exports.get = function (req, res) {
    var error_info = {
        message: "Could not get player",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var player_id = req.params.player_id
    var lineup_id = req.query.lineup_id;
    var league_id = req.query.league_id;

    var query = {
        sql: "SELECT players.id, players.first_name, players.last_name, players.price, players.image, players.nickname, players.year " +
            ((lineup_id == undefined) ? "," : ", (IF(lm.id IS NULL, false, true)) AS owned, ") +
            "teams.name as team_name " +
            "FROM players " +
            ((lineup_id == undefined) ? "" : "LEFT JOIN lineup_memberships lm ON lm.player_id = players.id AND lm.lineup_id = ? ") +
            "LEFT JOIN team_memberships tm ON tm.player_id = players.id " +
            "LEFT JOIN teams ON teams.id = tm.team_id " +
            "WHERE players.id = ? LIMIT 1",
        values: []
    };

    query.values = (lineup_id == undefined) ? [player_id] : [lineup_id, player_id];

    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.status(200).json({
                player: results[0]
            });
        }
    });
}

exports.getWeeklyStats = function (req, res) {
    var error_info = {
        message: "Could not get stats",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var player_id = req.params.player_id;
    var league_id = req.query.league_id;
    var query = {
        sql: "SELECT weeks.id AS week_id, weeks.number AS week_number, COALESCE(pp.count, 0) AS count, ppc.name, ppc.value FROM weeks " +
            "LEFT JOIN games ON games.week_id = weeks.id " +
            "JOIN player_performance_categories ppc " +
            "LEFT JOIN player_performances pp ON pp.player_performance_category_id = ppc.id AND pp.game_id = games.id AND pp.player_id = ? " +
            "JOIN teams ON teams.id = games.home_team_id OR teams.id = games.away_team_id " +
            "JOIN team_memberships tm ON tm.player_id = ? AND tm.team_id = teams.id " +
            "WHERE weeks.league_id = ? " +
            "ORDER BY weeks.id, ppc.value DESC, ppc.name",
        values: [player_id, player_id, league_id]
    };
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            /*res.status(500).json({
                message: error
            });
            return;*/
            api_error.send(res, error_info, 5000);
        } else {
            //We have some processing to get this thing into JSON:
            var weeks = [];
            var weekly_stats = {};
            for (var i = 0; i < results.length; i++) {
                var row = results[i];

                if (i == 0 || weekly_stats.week_id != row.week_id) {
                    if (i > 0) {
                        weeks.push(weekly_stats);
                    }
                    weekly_stats = {
                        week_id: row.week_id,
                        week_number: row.week_number,
                        point_total: 0,
                        categories: []
                    };
                }

                weekly_stats.categories.push({
                    name: row.name,
                    count: row.count,
                    value: row.value
                });
                weekly_stats.point_total += (row.value * row.count);
            }
            if (weekly_stats.week_id != undefined) {
                weeks.push(weekly_stats);
            }
            res.status(200).json({
                stats: weeks
            });
        }
    });
};


