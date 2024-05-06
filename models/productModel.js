const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {

  vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor"
      },
  title: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
       unique: true,
     lowercase: true,
    },
    description: {
      type: String,
    },
    images: [],
    tags:[
      {
        type:String
      }
    ],
    category:[
      {
      type:String,
      }
    ],
    brand:String,
    type: {
      type: String,
      enum: ["Simple Product", "Variable Product"],
      default: "Simple Product", // Default to simple product type
    },
    simpleProductDetails: [
      {
        price: Number,
        discountPrice: Number,
        sku: String,
        quantity: Number,
      },
    ],
    variableProductDetails: [
      {
        attribute: [],
        // price: Number,
        // discountPrice: Number,
        // sku: String,
        // quantity: Number,
        // images: String, 
      },
    ],
  metaTagTitle:String,
  metaTagKeyword:String,
  metaTagDescription:String,

   ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
