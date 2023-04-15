var mysql = require("mysql");
var connection = mysql.createPool({
  // host: "192.168.248.4",
  host: "myimpact.impactmeasurement.co.in",
  user: "root",
  password: "delta",
  database: "impact",
});
module.exports = connection;
