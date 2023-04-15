var express = require("express");
var articlescontroller = require("../controller/articleController")
var articledetailsrouter = express.Router();

articledetailsrouter.route('')
    .post(articlescontroller.articledetailpost);



module.exports = articledetailsrouter;