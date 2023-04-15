var express = require("express");
var articlescontroller = require("../controller/articleController");
var articlescontrollerDash = require("../controller/articledashController");
var articlerouter = express.Router();

// articlerouter.post('/RejectArticles', articlescontroller.RejectarticlesList);

articlerouter
  .route("/RejectArticles")
  .post(articlescontroller.RejectarticlesList);

articlerouter.route("/articles").post(articlescontroller.articlepost);

articlerouter
  .route("/getrejectedArticles")
  .post(articlescontroller.getrejectedArticles);

articlerouter.route("/articlesdash").post(articlescontrollerDash.articlepost);
articlerouter
  .route("/clienteditions")
  .post(articlescontrollerDash.clienteditions);

articlerouter.route("/jourcount").post(articlescontrollerDash.journalistData);

articlerouter.route("/pubcount").post(articlescontrollerDash.publicationData);

articlerouter.route("/comcount").post(articlescontrollerDash.companyData);

articlerouter.route("/headlinetext").post(articlescontrollerDash.headlineData);

articlerouter.route("/allarticles").post(articlescontrollerDash.allData);

articlerouter.route("/chartarticles").post(articlescontrollerDash.chartData);

articlerouter
  .route("/chartpassingarticles")
  .post(articlescontrollerDash.chartPassingData);

articlerouter.route("/articlesbyid").post(articlescontroller.articlesById);

articlerouter.route("/updateshowcase").post(articlescontroller.updateshowcase);

articlerouter.route("/getsummary").post(articlescontroller.getsummary);

articlerouter
  .route("/getclientkeyword")
  .post(articlescontroller.getclientkeyword);

articlerouter
  .route("/getPublicationList")
  .post(articlescontroller.getPublicationList);

articlerouter.route("/getEditionList").post(articlescontroller.getEditionList);
articlerouter
  .route("/getLanguageList")
  .post(articlescontroller.getLanguageList);

articlerouter
  .route("/getClientKeywordList")
  .post(articlescontroller.getClientKeywordList);

// articlerouter.route('')
//     .post(articlescontroller.articlepost)

articlerouter.route("/excels").post(articlescontroller.excelpost);

// articlerouter.route("/getfulltext").post(articlescontroller.getfulltext);

module.exports = articlerouter;
