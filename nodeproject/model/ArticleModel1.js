var mongoose         = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
 
var schema = new mongoose.Schema({ 

	 Title : String,
        Clientdetails : { 
        	clientid : String
        },
        qualification : Array,
        rejected : Number,
        showcase : String

    },
    {
        collection: 'impactliveupdated'
    });
schema.plugin(mongoosePaginate);
 
module.exports = mongoose.model('Model',  schema); // Model.paginate()