const Vendor = require('../model/vendorModel'); 
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {generateToken} = require('../../config/jwtToken');
const validateMongoDbId = require('../../utils/validateMongodbId');
//Vendor register

const vendorUser = asyncHandler(async (req, res) =>{
  const email = req.body.email;
  console.log(email);
  const findUser = await Vendor.find({email: email});
  console.log(findUser);
  // if(!findUser){
    if(findUser.length===0){
//create new user
    const newUser = await Vendor.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

// Vendor Login
const vendorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const vendor = await Vendor.findOne({ email: email });

  if (vendor) {
    if (vendor.password === password) {
      if (vendor.role === 'vendor') { // Check the role before allowing login
        // Generate JWT token
        const token = generateToken(vendor._id); // Assuming vendor has _id property

        // Return JWT token along with vendor data
        res.json({ message: 'Login successful', token, vendor: vendor });
      } else {
        res.status(401).json({ error: 'Unauthorized access' });
      }
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get all vendors
const getAllVendors = asyncHandler(async (req, res) => {
  const allVendors = await Vendor.find();
  console.log(allVendors);
  res.json(allVendors);
});

// Get vendor by ID
const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (vendor) {
    res.json(vendor);
  } else {
    res.status(404);
    throw new Error('Vendor not found');
  }
});
// Update vendor information
const updateVendor = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const vendor = await Vendor.findOne({ email: email });

  if (vendor) {
    const updatedVendor = await Vendor.findOneAndUpdate({ email: email }, req.body, { new: true });
    res.json({ message: 'Vendor information updated', vendor: updatedVendor });
  } else {
    res.status(404).json({ error: 'Vendor not found' });
  }
});


// Update vendor password
const updatePassword = asyncHandler(async (req, res) => {
  const { email, password, newPassword } = req.body;
  const vendor = await Vendor.findOne({ email: email });

  if (vendor) {
    if (vendor.password === password) {
      // Update password
      vendor.password = newPassword;
      await vendor.save();

      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ error: 'Invalid current password' });
    }
  } else {
    res.status(404).json({ error: 'Vendor not found' });
  }
});

module.exports = {
  vendorUser,
  vendorLogin,
  getAllVendors,
  getVendorById,
  updateVendor,
  updatePassword
};
