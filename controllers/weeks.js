var db = require('../db').connect();

exports.getMyLineup = function (req, res) {
    var week_id = req.params.week_id;
    var query = {
        sql: "SELECT lineups.id, lineups.week_id, lineups.user_id, lineups.name, lineups.money_total FROM lineups WHERE user_id = ? AND week_id = ?",
        values: [req.body.user_id, req.params.week_id]
    }

    db.query(query.sql, query.values, function (error, results) {
        res.status(400);
        if (error) {
            res.json({
                messsage: "Could not fetch lineup; " + error
            });
        } else {
            res.status(200);
            res.json({
                lineup: results[0]
            });
        }
    });
}

