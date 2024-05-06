const express = require('express')
const {createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImage, deleteImage, } = require("../controller/productController")
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImage');
const router = express.Router();

router.post("/",authMiddleware, isAdmin, createProduct);
router.get("/",getAllProduct)
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array('images',50),productImgResize,uploadImage)
router.get("/:slug",getProduct);
router.put("/wishlist",authMiddleware,addToWishlist)
router.put("/rating",rating)
router.put("/:id",authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware,isAdmin,deleteProduct)
router.delete("/delete-img/:id", authMiddleware,isAdmin,deleteImage)

module.exports = router;