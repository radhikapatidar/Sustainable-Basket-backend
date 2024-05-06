const axios = require('axios');
const sha256 = require('sha256');
const uniqid = require('uniqid');
const Order = require('../models/orderModel');

// Constants
const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const Merchant_ID = "PGTESTPAYUAT";
const SALT_INDEX = 1;
const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";

// Controller functions
exports.pay = async (req, res) => {
  const payEndpoint = "/pg/v1/pay";
  const merchantTransactionId = uniqid();
  const userId = 123;
  const { totalPrice, orderId } = req.query;
  console.log(orderId);
  
  // Payload for PhonePe
  const payload = {
    merchantId: Merchant_ID,
    merchantTransactionId: merchantTransactionId,
    amount: totalPrice * 100,
    merchantUserId: userId,
    redirectUrl: `http://localhost:5000/api/redirect-url/${merchantTransactionId}?orderId=${orderId}`,
    redirectMode: "REDIRECT",
    callbackUrl: "http://localhost:5000/api/paymentGatwayResponse",
    paymentInstrument: {
      type: "PAY_PAGE"
    },
    mobileNumber: "9999999999",
  };

  // Generate X-VERIFY header
  const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
  const base64EncodedPayload = bufferObj.toString("base64");
  const xVerify = sha256(base64EncodedPayload + payEndpoint + SALT_KEY) + "###" + SALT_INDEX;

  // Axios request to PhonePe API
  const options = {
    method: 'post',
    url: `${PHONEPE_HOST_URL}${payEndpoint}`,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      "X-VERIFY": xVerify,
    },
    data: {
      request: base64EncodedPayload,
    }
  };

  try {
    const response = await axios.request(options);
    const url = response.data.data.instrumentResponse.redirectInfo.url;
    res.redirect(url);
  } catch (error) {
    console.error("Error making request to PhonePe API:", error);
    res.status(500).json({ error: "Error making payment" });
  }
};

exports.redirectURL = async (req, res) => {
  const { merchantTransactionId } = req.params;
  const orderId = req.query.orderId;

  if (!merchantTransactionId) {
    return res.status(400).json({ error: "Missing merchantTransactionId" });
  }

  try {
    const xVerify = sha256(`/pg/v1/status/${Merchant_ID}/${merchantTransactionId}` + SALT_KEY) + "###" + SALT_INDEX;
    const options = {
      method: 'get',
      url: `${PHONEPE_HOST_URL}/pg/v1/status/${Merchant_ID}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        "X-MERCHANT-ID": Merchant_ID,
        "X-VERIFY": xVerify,
      },
    };

    const response = await axios.request(options);

    if (response.data.success === true) {
      const paymentInfo = {
        code: response.data.code,
        message: response.data.message,
        merchantId: response.data.data.marchantId,
        merchantTransactionId: response.data.data.marchantTransactionId,
        transactionId: response.data.data.transactionId,
        amount: response.data.data.amount,
        paymentInstrument: {
          type: response.data.data.paymentInstrument.type,
          cardType: response.data.data.paymentInstrument.cardType,
          pgTransactionId: response.data.data.paymentInstrument.pgTransactionId,
          pgServiceTransactionId: response.data.data.paymentInstrument.pgServiceTransactionId,
          bankTransactionId: response.data.data.paymentInstrument.bankTransactionId,
          bankId: response.data.data.paymentInstrument.bankId,
          arn: response.data.data.paymentInstrument.arn,
          brn: response.data.data.paymentInstrument.brn,
        }
      };

      const updatedOrder = await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: { paymentInfo: paymentInfo } },
        { new: true }
      );
      return res.json(updatedOrder);
    } else {
      console.error("Error from PhonePe API:", response.data);
      return res.status(500).json({ error: "Error processing payment" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
