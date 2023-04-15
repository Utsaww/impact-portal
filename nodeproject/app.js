var express = require("express");
const serverless = require("serverless-http");
var moviesrouter = require("./routes/movierouter");
var userrouter = require("./routes/userrouter");
var articlerouter = require("./routes/articlerouter");
var clientrouter = require("./routes/clientrouter");
var smartanalyserouter = require("./routes/smartanalyserouter");
var smartanalyseoldportalrouter = require("./routes/smartanalyseoldportalrouter");
var colorcoderouter = require("./routes/colorcoderouter");
var excelrouter = require("./routes/excelrouter");
var articledetailsrouter = require("./routes/articledetailsrouter");
var articleupdaterouter = require("./routes/articleupdaterouter");
var mailarticlerouter = require("./routes/mailarticlerouter");
var searchrouter = require("./routes/searchrouter");
var bodyParser = require("body-parser");
var mongoos = require("mongoose");

mongoos.set("debug", (collectionName, method, query, doc) => {
  console.log(JSON.stringify(query));
});

mongoos.Promise = Promise;

//Main Connection String
var db = mongoos.connect(
  "mongodb+srv://aamadmin:Rix2Jag8@irmpl-zame7.mongodb.net/impact?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    readPreference: "secondaryPreferred",
  }
);

var app = express();
var cors = require("cors");
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

var server = app.listen(3000, () => {
  console.log("server is running on port 3000");
});
server.timeout = 600000;

app.use("/movies", moviesrouter);
app.use("/articles", articlerouter);
app.use("/excels", excelrouter);
app.use("/mailarticle", mailarticlerouter);
app.use("/articledetails", articledetailsrouter);
app.use("/articleupdates", articleupdaterouter);
app.use("/users", userrouter);
app.use("/clients", clientrouter);
app.use("/smartanalyse", smartanalyserouter);
app.use("/smartanalyseoldportal", smartanalyseoldportalrouter);
app.use("/colorcode", colorcoderouter);
app.use("/search", searchrouter);
