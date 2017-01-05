var db = require('../db').connect();

exports.get = function (req, res) {
    var player_id = req.params.player_id
    var lineup_id = req.query.lineup_id;
    
    var query;
    if (lineup_id == undefined) {
        query = {
            sql: "SELECT players.id, players.first_name, players.last_name, players.price, players.image, players.nickname, players.year FROM players WHERE players.id = ?",
            values: [player_id]
        };
    } else {
        query = {
            sql: "SELECT players.id, players.first_name, players.last_name, players.price, players.image, players.nickname, players.year, (IF(lm.id IS NULL, false, true)) AS owned FROM players LEFT JOIN lineup_memberships lm ON lm.player_id = players.id AND lm.lineup_id = ? WHERE players.id = ?",
            values: [lineup_id, player_id]
        };
    }
    

    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            res.status(400).json({
                messsage: "Could not fetch lineups; " + error,
                errorCode: 1
            });
        } else {
            res.status(200).json({
                player: results[0]
            });
        }
    });
}

exports.getWeeklyStats = function(req, res) {
    var player_id = req.params.player_id;
    var league_id = req.query.league_id;
    var query = {
        sql: "SELECT weeks.id as week_id, weeks.number as week_number, pp.count, ppc.name, ppc.value FROM player_performances pp JOIN player_performance_categories ppc ON pp.player_performance_category_id = ppc.id JOIN weeks ON weeks.league_id = ? JOIN games ON pp.game_id = games.id AND games.week_id = weeks.id WHERE pp.player_id = ? ORDER BY weeks.number, ppc.value DESC, ppc.name",
        values: [league_id, player_id]
    };
    db.query(query.sql, query.values, function (error, results) {
        if (error) {
            res.status(400).json({
                messsage: "Could not fetch player stats; " + error,
                errorCode: 1
            });
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
                    weekly_stats = {};
                    weekly_stats.week_id = row.week_id;
                    weekly_stats.week_number = row.week_number;
                    weekly_stats.point_total = 0;
                    weekly_stats.categories = [];
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
            console.log(player_id, league_id, weeks);
            res.status(200).json({
                stats: weeks
            });
        }
    });
}
