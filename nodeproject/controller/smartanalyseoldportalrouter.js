var express = require("express");
var smartanalyseoldportalcontroller = require("../controller/smartanalyseoldportalController")
var smartanalyseoldportalrouter = express.Router();


smartanalyseoldportalrouter.route('/articles')
.post(smartanalyseoldportalcontroller.articlepost);  

smartanalyseoldportalrouter.route('/printChartData')
.post(smartanalyseoldportalcontroller.printChartData);  

module.exports = smartanalyseoldportalrouter;