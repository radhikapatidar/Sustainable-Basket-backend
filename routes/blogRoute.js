const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog, uploadImage } = require("../controller/blogController");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImage");
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createBlog)
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array('images',2),blogImgResize,uploadImage)
router.put('/likes',authMiddleware,likeBlog)
router.put('/dislikes',authMiddleware,dislikeBlog)
router.put('/:id',authMiddleware,isAdmin,updateBlog)
router.get('/:id', getBlog)
router.get('/',getAllBlog)
router.delete('/:id',authMiddleware,isAdmin, deleteBlog);


module.exports = router;