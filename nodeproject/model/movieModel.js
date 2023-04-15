var mongoos = require("mongoose");

var Schema = mongoos.Schema;

var tutorialspointModel = new Schema({

    Title : String

},
{
    collection: 'article'
}

);

module.exports = mongoos.model("article",tutorialspointModel);