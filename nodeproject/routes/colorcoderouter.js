var express = require("express");
var colorcodecontroller = require("../controller/colorcodeController")
var colorcoderouter = express.Router();


colorcoderouter.route('/getcompanys')
.post(colorcodecontroller.getcompanys);  

colorcoderouter.route('/getcompanysAll')
.post(colorcodecontroller.getcompanysAll);  

colorcoderouter.route('/insertdata')
.post(colorcodecontroller.insertdata);  

colorcoderouter.route('/resetdata')
.post(colorcodecontroller.resetdata);

module.exports = colorcoderouter;