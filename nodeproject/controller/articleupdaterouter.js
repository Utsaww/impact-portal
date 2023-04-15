var express = require("express");
var articlescontroller = require("../controller/articleController")
var articleupdaterouter = express.Router();

articleupdaterouter.route('')
    .post(articlescontroller.articleupdateget)

module.exports = articleupdaterouter;