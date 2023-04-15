var express = require("express");
var moviescontroller = require("../controller/moviesController");
var movierouter = express.Router();

movierouter.route('')
    .get(moviescontroller.get)
    .post(moviescontroller.add)


movierouter.route('/:id')
    .get(moviescontroller.getById)
    .put(moviescontroller.updateById)
    .patch(moviescontroller.pathch);

module.exports = movierouter;