exports.get = function (req, res) {
    var article_id = req.params.article_id
    var query = {
        sql: "SELECT articles.id, articles.title, articles.author, articles.date_published, articles.content FROM articles WHERE articles.id = ? LIMIT 1",
        values: [article_id]
    };
    db.query(query.sql, query.values, function(error, results) {
        if (error) {
            res.status(500).json({
                errorCode: 1000,
                message: "Could not get articles",
                description: "Database error (unknown)"
            });
        } else {
            res.status(200).json({
                article: results[0]
            });
        }
    });
}