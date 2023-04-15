var express = require("express");

var userrouter = express.Router();

var userscontroller = require("../controller/usersController")

userrouter.route('')
.post(userscontroller.login)

module.exports = userrouter;