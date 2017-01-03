var db = require('../db').connect();

exports.getMine = function (req, res) {
    var query = {
        sql: "SELECT leagues.id, leagues.name, leagues.image FROM lineups JOIN weeks ON lineups.week_id = weeks.id JOIN leagues ON leagues.id = weeks.league_id WHERE lineups.user_id = ?",
        values: [req.body.user_id]
    }

    db.query(query.sql, query.values, function (error, results) {
        res.status(400);
        if (error) {
            res.json({
                messsage: "Could not fetch leagues; " + error
            });
        } else {
            res.status(200);
            res.json({
                leagues: results
            });
        }
    });
}

exports.getCurrentWeek = function (req, res) {
    var league_id = req.params.league_id;
    var query = {
        sql: "SELECT weeks.id, weeks.number, weeks.edit_after, weeks.edit_before, (weeks.edit_before > CURRENT_TIMESTAMP AND weeks.edit_after < CURRENT_TIMESTAMP) AS can_edit FROM weeks WHERE weeks.league_id = ? AND weeks.edit_after < CURRENT_TIMESTAMP ORDER BY weeks.edit_after ASC",
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

