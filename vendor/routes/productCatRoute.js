const express = require("express");
const { createCategory, getCategory, getallCategory, updateCategory } = require("../controller/productCategoryCtrl");
const router = express.Router();

router.post("/", createCategory);
router.get('/',getallCategory);
router.get('/:id',getCategory);
router.put('/:id',updateCategory)


module.exports = router;