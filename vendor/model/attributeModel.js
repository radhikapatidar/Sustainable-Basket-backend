const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
  {
    // vendor: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Vendor", 
    // },
  
    attributeName: {
        type: String,
      },

    attributeOptions: [{
        type: String,
      }],
   },
  { timestamps: true }
);


module.exports = mongoose.model("VendorAttribute", attributeSchema);
