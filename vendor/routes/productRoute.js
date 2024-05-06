const express = require('express');
const { createProduct, getAllProducts, deleteProduct, updateProduct, getProductById, uploadImage } = require('../controller/productctrl');
const { uploadPhoto, productImgResize } = require('../../middlewares/uploadImage');
const router = express.Router();

router.post("/create", createProduct);
router.get("/get",getAllProducts);
router.get('/:id', getProductById);
router.put("/:id",updateProduct);
router.put("/upload/:id",uploadPhoto.array("images",50),productImgResize,uploadImage);
router.delete("/:id", deleteProduct)


module.exports = router;