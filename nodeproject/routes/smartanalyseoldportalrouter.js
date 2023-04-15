var express = require("express");
var smartanalyseoldportalController = require("../controller/smartanalyseoldportalController")
var smartanalyseoldportalrouter = express.Router();


smartanalyseoldportalrouter.route('/YearChartData')
.post(smartanalyseoldportalController.YearChartData);  

smartanalyseoldportalrouter.route('/AVEChartData')
.post(smartanalyseoldportalController.AVEChartData);  

smartanalyseoldportalrouter.route('/TopTenPubChartData')
.post(smartanalyseoldportalController.TopTenPubChartData);  

smartanalyseoldportalrouter.route('/TopTenJournalistChartData')
.post(smartanalyseoldportalController.TopTenJournalistChartData);  

smartanalyseoldportalrouter.route('/RegionChartData')
.post(smartanalyseoldportalController.RegionChartData);  
module.exports = smartanalyseoldportalrouter;