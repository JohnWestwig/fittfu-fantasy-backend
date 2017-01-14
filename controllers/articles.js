var api_error = require('./api_error');

exports.get = function (req, res) {
    var error_info = {
        message: "Could not get article",
        errors: {
            5000: "Database error (unknown)"
        }
    }
    var article_id = req.params.article_id
    var query = {
        sql: "SELECT articles.id, articles.title, articles.author, articles.date_published, articles.content FROM articles WHERE articles.id = ? LIMIT 1",
        values: [article_id]
    };
    db.query(query.sql, query.values, function(error, results) {
        if (error) {
            api_error.send(res, error_info, 5000);
        } else {
            res.status(200).json({
                article: results[0]
            });
        }
    });
}