var express = require("express");
var articlescontroller = require("../controller/articleController")
var mailarticlerouter = express.Router();

mailarticlerouter.route('')
    .post(articlescontroller.sendmail)


module.exports = mailarticlerouter;