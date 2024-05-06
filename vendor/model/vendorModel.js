
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  
  name: {
    type: String,
    //required: true
  },
  email: {
    type: String,
   // required: true,
   // unique: true
  },
  mobile: {
    type: String,
   // required: true
  },
  password: {
    type: String,
   // required: true
  },
  about:{
    type:String
  },
  address:{
    type:String
  },
  shopName: {
    type: String,
   // required: true
  },
  brandName:{
    type:String,
  },
  companyName:{
    type:String,
  },
  shopUrl:{
    type:String,
  },
  street:{
    type:String,
  },
  city:{
    type:String,
  },
  zipCode:{
    type:Number,
  },
  country:{
    type:String,
  },
  state:{
    type:String,
  },
  companyName:{
    type:String,
  },
  companyId:{
    type:String,
  },
  status:{
    type:String,
  },
  role: {
    type:String,
    default:"vendor"
  }
},
{
    timestamps:true,
});


const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;

