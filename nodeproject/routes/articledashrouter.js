var express = require("express");
var articlescontroller = require("../controller/articledashController")
var articlerouter = express.Router();

articlerouter.route('')
    .post(articlescontroller.articlepost)


articlerouter.route('/excels')
    .post(articlescontroller.excelpost)    




module.exports = articlerouter;