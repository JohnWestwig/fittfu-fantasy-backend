exports.getMyLineup = function (req, res) {
    var week_id = req.params.week_id;
    var query = {
        sql: "SELECT lineups.id, lineups.week_id, lineups.user_id, lineups.name, lineups.money_total FROM lineups WHERE user_id = ? AND week_id = ?",
        values: [req.body.user_id, req.params.week_id]
    }

    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            res.status(500).json({
                errorCode: 1000,
                messsage: "Could not fetch lineup;",
                description: "Database error (unknown)"
            });
        } else {
            res.status(200).json({
                lineup: results[0]
            });
        }
    });
}
