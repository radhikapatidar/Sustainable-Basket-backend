const express = require('express');
const { getAllVendors, updateVendor, adminLogin, adminUser, getVendorById } = require('../controller/adminController');
const router = express.Router();

router.post('/admin-register',adminUser)
router.post('/admin-login',adminLogin)
router.get('/vendor-list',getAllVendors);
router.put('/update-vendor', updateVendor);
router.get('/vendor/:id', getVendorById);


//router.get('/vendorlist',getAllVendors);

module.exports = router;
