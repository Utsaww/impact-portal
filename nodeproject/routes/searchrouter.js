var express = require("express");
var searchrouter = express.Router();
var srController = require("../controller/searchController")

searchrouter.route('/getarticles').post(srController.getArticles);

module.exports = searchrouter;