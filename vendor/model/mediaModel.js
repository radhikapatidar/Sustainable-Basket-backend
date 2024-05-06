const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var mediaSchema = new mongoose.Schema({
    // vendor: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Vendor",
    //   },

    title:{
        type:String,
     },
     images:{
        type:String
     },
     createdAt: {
        type: Date,
        default: new Date(),
    },
},
{
    timestamps:true,
}
);

//Export the model
module.exports = mongoose.model('Media', mediaSchema);