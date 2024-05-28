const { getArticleByID } = require("../../models/article-models/article-models")


exports.getArticle = (req, res, next) => {

    const {article_id} = req.params
    
    getArticleByID(article_id).then((result) => {
        res.status(200).send({article: result})
    })
    .catch(next)
}