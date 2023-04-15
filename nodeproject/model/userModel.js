var mongoos = require("mongoose");

var Schema = mongoos.Schema;

var userModel = new Schema({

        email : String,
	contactid : String,
        logintime : {type: Date, default: Date.now}

    },
    {
    versionKey: false // You should be aware of the outcome after set to false
    },
    {
        collection: 'logindetaillogs'
    }

);

module.exports = mongoos.model("logindetaillogs",userModel);

//db.disconnect();