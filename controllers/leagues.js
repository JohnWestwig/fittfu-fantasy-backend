exports.all = function (req, res) {
    var user_id = req.body.user_id

    //If "me" is included, filter by leagues in which the user has a lineup"
    var filter = (req.query.me == undefined) ? "" : "WHERE leagues.id IN (SELECT leagues.id FROM leagues JOIN weeks ON weeks.league_id = leagues.id JOIN lineups ON lineups.user_id = ? AND lineups.week_id = weeks.id GROUP BY leagues.id) ";
    var query = {
        sql: "SELECT leagues.id, leagues.name, leagues.image, COUNT(DISTINCT lineups.user_id) AS lineup_count " +
            "FROM leagues " +
            "JOIN weeks ON weeks.league_id = leagues.id " +
            "JOIN lineups ON lineups.week_id = weeks.id " +
            filter +
            "GROUP BY leagues.id",
        values: [user_id]
    };
    
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            res.status(500).json({
                errorCode: 1001,
                message: "Could not fetch leagues",
                description: "Database error (unknown)"
            });
        } else {
            res.status(200).json({
                leagues: results
            });
        }
    });
}

exports.join = function (req, res) {
    var league_id = req.params.league_id;
    var query = {
        sql: "INSERT INTO lineups (lineups.name, lineups.money_total, lineups.user_id, lineups.week_id) SELECT ?, 50, ?, weeks.id FROM weeks WHERE weeks.league_id = ?",
        values: [req.body.name, req.body.user_id, league_id]
    };
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            res.status(400).json({
                message: "Could not join league; " + error,
                errorCode: 1
            });
        } else {
            res.status(200).send();
        }
    });
}

exports.getCurrentWeek = function (req, res) {
    var league_id = req.params.league_id;
    var query = {
        sql: "SELECT weeks.id, weeks.number, weeks.edit_after, weeks.edit_before, (weeks.edit_before > CURRENT_TIMESTAMP AND weeks.edit_after < CURRENT_TIMESTAMP) AS can_edit, weeks.live_start, weeks.live_end, (weeks.live_start < CURRENT_TIMESTAMP AND weeks.live_end > CURRENT_TIMESTAMP) AS is_live FROM weeks WHERE weeks.league_id = ? AND weeks.edit_after < CURRENT_TIMESTAMP ORDER BY weeks.edit_after ASC",
        values: [league_id]
    };
    db.query(query.sql, query.values, function (error, results) {
        res.status(400);
        if (error) {
            res.json({
                messsage: "Could not fetch current week; " + error
            });
        } else {
            res.status(200);
            res.json({
                week: results[0]
            });
        }
    });
}
