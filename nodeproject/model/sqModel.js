var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var schema = new mongoose.Schema(
  {
    articleid: String,
    headline: String,
    subtitle: String,
    fulltext: String,
    article_type: String,
    pubdateRange: Date,
    clientidArray: [String],
  },
  { collection: "article_fulltext" }
);
schema.plugin(mongoosePaginate);
module.exports = mongoose.model("Search", schema);
