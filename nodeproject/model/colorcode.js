var mongoose         = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
 
var color = new mongoose.Schema({ 

        // Title : String,
        //     Clientdetails : { 
        //         _id: String,
        //     	clientid : String,
        //         companysdata: Array,
        //         createdon: String,
        //         userid: String
        //     }
        // },
        clientid: String,
        companysdata: Array,
        createdon: String,
        userid: String 
    },
    {
        collection: 'companycolors'
    });
    color.plugin(mongoosePaginate);
 
module.exports = mongoose.model('color', color); // Model.paginate()