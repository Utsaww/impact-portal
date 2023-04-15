var express = require("express");
var articlescontroller = require("../controller/articleV2Controller")
var articlerouter = express.Router();


articlerouter.route('/articles')
    .post(articlescontroller.articlepost);





module.exports = articlerouter;