var express = require("express");
var articlescontroller = require("../controller/articleController")
var excelrouter = express.Router();

excelrouter.route('')
    .post(articlescontroller.excelpost)


module.exports = excelrouter;