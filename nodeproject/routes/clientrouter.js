var express = require("express");

var clientrouter = express.Router();

var clientscontroller = require("../controller/clientsController")

clientrouter.route('')
.post(clientscontroller.getclients)

module.exports = clientrouter;