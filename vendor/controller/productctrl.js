const Product = require('../../models/productModel');
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require('../../utils/validateMongodbId');
const {cloudinaryUploadImg} = require('../../utils/cloudinary')
const path = require('path')
const fs = require('fs')


// Create product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
      }
  
    if (!req.body.type) {
          req.body.type = "Simple Product"; // Set default value if not provided
      }
     
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
  } catch (error) {
      throw new Error(error);
  }
})

//Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      res.json(deletedProduct);
  } catch (error) {
      throw new Error(error);
  }
});


// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      throw new Error(error);
    }
  });

  // Get product by ID
  const getProductById = asyncHandler(async (req, res) => {
    try {
        const productId = req.params.id;
        validateMongoDbId(productId);
        const product = await Product.findById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        throw new Error(error);
    }
});
//Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
      if (req.body.title) {
          req.body.slug = slugify(req.body.title);
      }
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedProduct);
  } catch (error) {
      throw new Error(error);
  }
});
const uploadImage = asyncHandler(async (req,res) =>{
  console.log(req.files);
 const { id } = req.params;
  validateMongoDbId(id);
 try{
 const uploader = async (path) => cloudinaryUploadImg(path,"images");
 const urls = [];
 const files = req.files;
  for(const file of files){
  const {path} = file;
 const newpath = await uploader(path);
 console.log(newpath)
 urls.push(newpath);
  // fs.unlinkSync(path);
  }
 const findProduct = await Product.findByIdAndUpdate(id, {
   images: urls.map(file=> {
        return file;
   }),
   },
  {
      new:true,
 }
    );
  res.json(findProduct)
} catch(error){
   throw new Error(error)
  }
});
module.exports = {
    createProduct,
    deleteProduct,
    getAllProducts,
    updateProduct,
    getProductById,
    uploadImage
  };