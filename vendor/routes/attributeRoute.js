const express = require('express');
const { createVendorAttribute, getAllVendorAttributes, deleteVendorAttribute, getVendorAttributeById, updateVendorAttributeById } = require('../controller/attributeController');
const router = express.Router();

router.post('/',createVendorAttribute);
router.get('/get',getAllVendorAttributes);
router.get('/:id',getVendorAttributeById);
router.put("/update/:id",updateVendorAttributeById)
router.delete('/:id',deleteVendorAttribute)


module.exports = router;