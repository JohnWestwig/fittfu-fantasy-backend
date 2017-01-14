var api_error = require('./api_error');

exports.all = function (req, res) {
    var error_info = {
        message: "Could not get leagues",
        errors: {
            5000: "Database error (unknown)"
        }
    }
    var user_id = req.body.user_id;

    //If "me" is included, filter by leagues in which the user has a lineup"
    var filter = (req.query.me == undefined) ? "" : "WHERE leagues.id IN (SELECT leagues.id FROM leagues JOIN weeks ON weeks.league_id = leagues.id JOIN lineups ON lineups.user_id = ? AND lineups.week_id = weeks.id GROUP BY leagues.id) ";
    var query = {
        sql: "SELECT leagues.id, leagues.name, leagues.image, COUNT(DISTINCT weeks.id) AS week_count, COUNT(DISTINCT lineups.id) AS lineup_count " +
            "FROM leagues " +
            "LEFT JOIN weeks ON weeks.league_id = leagues.id " +
            "LEFT JOIN lineups ON lineups.week_id = weeks.id " +
            filter +
            "GROUP BY leagues.id",
        values: [user_id]
    };

    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.status(200).json({
                leagues: results
            });
        }
    });
}

exports.join = function (req, res) {
    var error_info = {
        message: "Could not join league",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var league_id = req.params.league_id;
    var total_funds = 50;
    var query = {
        sql: "INSERT INTO lineups (lineups.name, lineups.money_total, lineups.user_id, lineups.week_id) SELECT ?, ?, ?, weeks.id FROM weeks WHERE weeks.league_id = ?",
        values: [req.body.lineupName, total_funds, req.body.user_id, league_id]
    };
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.status(200).json({});
        }
    });
}

exports.getWeeks = function (req, res) {
    var error_info = {
        message: "Could not get weeks",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var league_id = req.params.league_id;
    var query = {
        sql: "SELECT weeks.id, weeks.number, weeks.edit_start, weeks.edit_end, weeks.live_start, weeks.live_end FROM weeks WHERE weeks.league_id = ? ORDER BY weeks.number ASC",
        values: [league_id]
    };
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.status(200).json({
                weeks: results
            });
        }
    });
};

exports.getCurrentWeek = function (req, res) {
    var error_info = {
        message: "Could not get current week",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var league_id = req.params.league_id;
    var query = {
        sql: "SELECT weeks.id, weeks.number, weeks.edit_start, weeks.edit_end, weeks.live_start, weeks.live_end FROM weeks WHERE weeks.league_id = ? AND ((weeks.edit_start < CURRENT_TIMESTAMP AND weeks.live_end > CURRENT_TIMESTAMP) OR (CURRENT_TIMESTAMP < weeks.edit_start)) ORDER BY weeks.edit_start ASC LIMIT 1",
        values: [league_id]
    };
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.status(200).json({
                week: results[0]
            });
        }
    });
};

exports.getArticles = function (req, res) {
    var error_info = {
        message: "Could not get articles",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var league_id = req.params.league_id
    var query = {
        sql: "SELECT articles.id, articles.title, articles.author, articles.date_published, articles.content FROM articles WHERE articles.league_id = ? ORDER BY articles.date_published DESC",
        values: [league_id]
    };
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.status(200).json({
                articles: results
            });
        }
    });
}

exports.getStandings = function (req, res) {
    var error_info = {
        message: "Could not get standings",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var week_id = req.query.week_id,
        league_id = req.params.league_id;
    var query = {
        sql: "SET @num_points = NULL; SET @rank_count = 0; " +
            "SELECT lineups.name AS lineup_name, CONCAT(users.first_name, ' ', users.last_name) AS owner_name, COALESCE(SUM(ppc.value * pp.count), 0) AS total_points " +
            "FROM lineups " +
            "JOIN users ON lineups.user_id = users.id " +
            "JOIN weeks ON weeks.league_id = ? " + ((week_id != undefined) ? "AND weeks.id = ? " : "") +
            "LEFT JOIN lineup_memberships lm ON lm.lineup_id = lineups.id " +
            "LEFT JOIN players ON players.id = lm.player_id " +
            "LEFT JOIN games ON games.week_id = weeks.id " +
            "LEFT JOIN player_performances pp ON pp.game_id = games.id AND pp.player_id = players.id " +
            "LEFT JOIN player_performance_categories ppc ON ppc.id = pp.player_performance_category_id " +
            "WHERE lineups.week_id = weeks.id " +
            "GROUP BY users.id " +
            "ORDER BY total_points DESC;",
        values: [league_id, week_id]
    };
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            console.log(week_id, league_id);
            var standings = results[2],
                current_rank = 0
            for (var i = 0; i < standings.length; i++) {
                standings[i].rank = (i == 0 || standings[i - 1].total_points != standings[i].total_points) ? ++current_rank : current_rank
            }
            res.status(200).json({
                standings: standings
            });
        }
    });
}
