var express = require("express");
var articlescontroller = require("../controller/articleController")
var RejectArticlesRouter = express.Router();

RejectArticlesRouter.route('')
.post(articlescontroller.RejectarticlesList);    

module.exports = RejectArticlesRouter;