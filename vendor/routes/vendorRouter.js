
const express = require('express');
const {  vendorUser, vendorLogin, getAllVendors, getVendorById, updateVendor, updatePassword } = require('../controller/vendorController');
const router = express.Router();


router.post('/register',vendorUser);
router.post('/login',vendorLogin);
router.get('/get',getAllVendors);
router.get('/:id',getVendorById)
router.put('/update/:id',updateVendor)
router.put('/update/password/:id',updatePassword)

module.exports = router;
