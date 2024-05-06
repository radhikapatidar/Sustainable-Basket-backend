const Brand = require('../models/brandModel');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require('../utils/validateMongodbId');

// Create category
const createBrand = asyncHandler(async (req,res) =>{
    try{
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch(error){
        throw new Error(error);
    }
});

// Update Category
const updateBrand = asyncHandler(async (req,res) =>{
    const {id }= req.params;
    validateMongoDbId(id);
    try{
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body,{
            new: true,
        });
        res.json(updatedBrand);
    } catch(error){
        throw new Error(error);
    }
});

// delete Category
const deleteBrand = asyncHandler(async (req,res) =>{
    const {id }= req.params;
    validateMongoDbId(id);
    try{
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json(deletedBrand);
    } catch(error){
        throw new Error(error);
    }
});

// Fetch category
const getBrand = asyncHandler(async (req,res) =>{
    const {id }= req.params;
    validateMongoDbId(id);
    try{
        const getBrand = await Brand.findById(id);
        res.json(getBrand);
    } catch(error){
        throw new Error(error);
    }
});

// Get All category
const getallBrand = asyncHandler(async (req,res) =>{
    try{
        const getallBrand = await Brand.find();
        res.json(getallBrand);
    } catch(error){
        throw new Error(error);
    }
});



module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand
}