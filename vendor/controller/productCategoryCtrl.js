const validateMongoDbId = require('../../utils/validateMongodbId');
const Category = require('../model/productCatModel');
const asyncHandler = require("express-async-handler");



// Create category
const createCategory = asyncHandler(async (req,res) =>{
    try{
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch(error){
        throw new Error(error);
    }
});
// Fetch category
const getCategory = asyncHandler(async (req,res) =>{
    const {id }= req.params;
    validateMongoDbId(id);
    try{
        const getCategory = await Category.findById(id);
        res.json(getCategory);
    } catch(error){
        throw new Error(error);
    }
});

// Get All category
const getallCategory = asyncHandler(async (req,res) =>{
    try{
        const getallCategory = await Category.find();
        res.json(getallCategory);
    } catch(error){
        throw new Error(error);
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  
    try {
      // Find the category by ID and update its fields
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true } // Returns the modified document and runs validation
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: 'Error updating category' });
    }
  });

module.exports = {
    createCategory,
    getCategory,
    getallCategory,
    updateCategory
}