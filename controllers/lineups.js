var api_error = require('./api_error');
exports.get = function (req, res) {
    var error_info = {
        message: "Could not get lineup",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var query = {
        sql: "SELECT lineups.id, lineups.name, lineups.money_total, COALESCE(SUM(players.price), 0) AS money_spent FROM lineups JOIN lineup_memberships ON lineup_memberships.lineup_id = lineups.id JOIN players ON players.id = lineup_memberships.player_id WHERE user_id = ? AND lineups.id = ?",
        values: [req.body.user_id, req.params.lineup_id]
    };

    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.json({
                lineup: results[0]
            });
        }
    });
}

exports.getAll = function (req, res) {
    var error_info = {
        message: "Could not get lineups",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var query = {
        sql: "SELECT lineups.id, lineups.name, lineups.money_total, COALESCE(SUM(players.price), 0) AS money_spent FROM lineups JOIN lineup_memberships ON lineup_memberships.lineup_id = lineups.id JOIN players ON players.id = lineup_memberships.player_id WHERE user_id = ?",
        values: [req.body.user_id]
    }

    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.json({
                lineups: results
            });
        }
    });
}

exports.getAllPlayers = function (req, res) {
    var error_info = {
        message: "Could not get players",
        errors: {
            5000: "Database error (unknown)"
        }
    };
    var lineup_id = req.params.lineup_id;
    var query = {
        sql: "SELECT players.id, players.first_name, players.last_name, players.price, players.image, players.year, players.nickname, IF(lineup_memberships.id IS NULL, 0, 1) AS owned FROM lineups JOIN players LEFT JOIN lineup_memberships ON lineup_memberships.lineup_id = lineups.id AND players.id = lineup_memberships.player_id WHERE lineups.id = ? ORDER BY owned DESC, price DESC, last_name ASC, first_name ASC",
        values: [lineup_id]
    };

    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.json({
                players: results
            });
        }
    });
}

exports.removePlayer = function (req, res) {
    var error_info = {
        message: "Could not drop player",
        errors: {
            4000: "Cannot edit lineup at this time",
            5000: "Database error (unknown)"
        }
    };
    var lineup_id = req.params.lineup_id,
        player_id = req.params.player_id;

    var checkEditPeriodQuery = {
            sql: "SELECT (weeks.edit_start < CURRENT_TIMESTAMP AND weeks.edit_end > CURRENT_TIMESTAMP) AS can_edit FROM lineups JOIN weeks ON lineups.week_id = weeks.id WHERE lineups.id = ?",
            values: [lineup_id]
        },
        insertQuery = {
            sql: "DELETE FROM lineup_memberships WHERE lineup_id = ? AND player_id = ?",
            values: [lineup_id, player_id]
        };

    db.query(checkEditPeriodQuery.sql, checkEditPeriodQuery.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else if (!results[0].can_edit) {
            api_error.send(res, error_info, 4000);
        } else {
            db.query(insertQuery.sql, insertQuery.values, function (error, results) {
                if (error) {
                    api_error.send(res, error_info, 5000);
                } else {
                    res.status(200).json({});
                }
            });
        }
    });
}

exports.addPlayer = function (req, res) {
    var error_info = {
        message: "Could not add player",
        errors: {
            4000: "Cannot edit lineup at this time",
            4001: "Insufficient funds",
            4002: "Too many players (limit 5)",
            5000: "Database error (unknown)"
        }
    };
    var lineup_id = req.params.lineup_id,
        player_id = req.params.player_id;

    var checkEditPeriodQuery = {
            sql: "SELECT (weeks.edit_start < CURRENT_TIMESTAMP AND weeks.edit_end > CURRENT_TIMESTAMP) AS can_edit FROM lineups JOIN weeks ON lineups.week_id = weeks.id WHERE lineups.id = ?",
            values: [lineup_id]
        },
        checkNumPlayersQuery = {
            sql: "SELECT (COUNT(players.id) < 5) as can_add FROM lineups JOIN lineup_memberships ON lineup_memberships.lineup_id = lineups.id JOIN players ON players.id = lineup_memberships.player_id WHERE lineup_id = ?",
            values: [lineup_id]
        },
        checkFundsLimitQuery = {
            sql: "SELECT lineups.money_total, (SUM(players.price) + (SELECT players.price FROM players WHERE players.id = ?)) AS new_total FROM lineups JOIN lineup_memberships ON lineup_memberships.lineup_id = lineups.id JOIN players ON players.id = lineup_memberships.player_id WHERE lineup_id = ?",
            values: [player_id, lineup_id]
        },
        insertQuery = {
            sql: "INSERT IGNORE INTO lineup_memberships (lineup_id, player_id) VALUES (?, ?)",
            values: [lineup_id, player_id]
        };

    db.query(checkEditPeriodQuery.sql, checkEditPeriodQuery.values, function (error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else if (!results[0].can_edit) {
            api_error.send(res, error_info, 4000);
        } else {
            db.query(checkFundsLimitQuery.sql, checkFundsLimitQuery.values, function (error, results) {
                if (error) {
                    api_error.send(res, error_info, 5000);
                } else if (results[0].new_total > results[0].money_total) {
                    api_error.send(res, error_info, 4001);
                } else {
                    db.query(checkNumPlayersQuery.sql, checkNumPlayersQuery.values, function (error, results) {
                        if (error) {
                            api_error.send(res, error_info, 5000);
                        } else if (!results[0].can_add) {
                            api_error.send(res, error_info, 4002);
                        } else {
                            db.query(insertQuery.sql, insertQuery.values, function (error, results) {
                                if (error) {
                                    api_error.send(res, error_info, 5000);
                                } else {
                                    res.status(200).json({});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
