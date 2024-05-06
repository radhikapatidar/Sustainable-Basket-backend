const express = require('express');
const paymentController = require('../controller/paymentController')
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Phonepe app is working");
  });
  
  router.get('/pay', paymentController.pay);
  
  router.get('/redirect-url/:merchantTransactionId', paymentController.redirectURL);
  

module.exports = router;