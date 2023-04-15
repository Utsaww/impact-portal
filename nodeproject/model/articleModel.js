var mongoos = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Schema = mongoos.Schema;

var articleModel = new Schema(
  {
    Title: String,
    Clientdetails: {
      clientid: String,
    },
    qualification: Array,
    rejected: String,
    showcase: String,
  },
  {
    collection: "impactliveupdated",
  }
);
articleModel.plugin(mongoosePaginate);
module.exports = mongoos.model("impactlives", articleModel);

//db.disconnect();
