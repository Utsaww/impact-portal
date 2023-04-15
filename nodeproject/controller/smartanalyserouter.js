var express = require("express");
var smartanalysecontroller = require("../controller/smartanalyseController")
var smartanalyserouter = express.Router();


smartanalyserouter.route('/articles')
.post(smartanalysecontroller.articlepost);  

smartanalyserouter.route('/printChartData')
.post(smartanalysecontroller.printChartData);  

smartanalyserouter.route('/webChartData')
.post(smartanalysecontroller.webChartData);  

smartanalyserouter.route('/tvChartData')
.post(smartanalysecontroller.tvChartData);  

smartanalyserouter.route('/articlesCount')
.post(smartanalysecontroller.articlesCount);

smartanalyserouter.route('/publicationCount')
.post(smartanalysecontroller.publicationCount);  

smartanalyserouter.route('/circulationCount')
.post(smartanalysecontroller.circulationCount);  

smartanalyserouter.route('/circulationDistinctCount')
.post(smartanalysecontroller.circulationDistinctCount);

smartanalyserouter.route('/sourceChartData')
.post(smartanalysecontroller.sourceChartData);  

smartanalyserouter.route('/circulationDistinctChart')
.post(smartanalysecontroller.circulationDistinctChart);  

smartanalyserouter.route('/circulationAllChart')
.post(smartanalysecontroller.circulationAllChart);  

module.exports = smartanalyserouter;