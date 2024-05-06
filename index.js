// Required modules
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const axios = require('axios');
const uniqid = require("uniqid");
const sha256 = require("sha256");
const dotenv = require("dotenv").config();
const Order = require('./models/orderModel')

// Custom modules
const dbConnect = require("./config/dbConnect");
const {notFound,errorHandler} = require("./middlewares/errorHandler")
const authRouter = require("./routes/authRoute");
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const blogcategoryRouter = require('./routes/blogCatRoute');
const brandRouter = require('./routes/brandRoute');
const colorRouter = require('./routes/colorRoute');
const couponRouter = require('./routes/couponRoute');
const vendorRouter = require('./vendor/routes/vendorRouter');
const adminRouter = require('./admin/routes/adminRoute');
const productRoute = require('./vendor/routes/productRoute');
const enqRouter = require('./routes/enqRoute');
const vendorAttribute = require('./vendor/routes/attributeRoute');
const masterDocumentRouter = require('./admin/routes/masterDocumentRoute');
const ProductCategoryRouter = require('./vendor/routes/productCatRoute');
const OrderRouter = require('./vendor/routes/orderRoute');
const MediaRouter = require('./vendor/routes/mediaRoute');
const paymentRoute =require('./routes/paymentRoute');

// Constants
const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const Merchant_ID = "PGTESTPAYUAT";
const SALT_INDEX = 1;
const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const PORT = 5000;

// Initialize Express app
const app = express();

// Database connection
dbConnect();

// Middlewares
// Middleware to handle CORS headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// const corsOptions ={
//   origin:'http://localhost:3000',
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/api/paymentGatwayResponse", (req, res) => {
  res.send("Payment app is working");
  console.log(res);
});

// Routes
// app.get("/api", (req, res) => {
//   res.send("Phonepe app is working");
// });

// app.get("/api/pay", async (req, res) => {
//   const payEndpoint = "/pg/v1/pay";
//   const merchantTransactionId = uniqid();
//   const userId = 123;
//   const { totalPrice,orderId  } = req.query;
//   console.log(orderId);
//   // Payload for PhonePe
//   const payload = {
//     merchantId:Merchant_ID,
//     merchantTransactionId: merchantTransactionId,
//     amount:  totalPrice*100,
//     merchantUserId:userId,
//     redirectUrl:`http://localhost:5000/api/redirect-url/${merchantTransactionId}?orderId=${orderId}`,
//     redirectMode: "REDIRECT",
//     callbackUrl:  "http://localhost:5000/api/paymentGatwayResponse",
//     paymentInstrument: {
//       type: "PAY_PAGE"
//     },
//     mobileNumber: "9999999999",
//   };
  
//   // Generate X-VERIFY header
//   const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
//   const base64EncodedPayload = bufferObj.toString("base64");
//   const xVerify = sha256(base64EncodedPayload + payEndpoint + SALT_KEY) + "###" + SALT_INDEX;

//   // Axios request to PhonePe API
//   const options = {
//     method: 'post',
//     url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
//     headers: {
//       accept: 'application/json',
//       'Content-Type': 'application/json',
//       "X-VERIFY" : xVerify,
//     },
//     data: {
//       request: base64EncodedPayload,
//     }
//   };

//   axios.request(options)
//     .then(function (response) {

//   const url = response.data.data.instrumentResponse.redirectInfo.url;
//     res.redirect(url);
//     })
//     .catch(function (error) {
//       console.error("Error making request to PhonePe API:", error);
//     });
// });

// app.get("/api/redirect-url/:merchantTransactionId", async (req, res) => {
//   const { merchantTransactionId } = req.params;
//   const orderId = req.query.orderId; // Get orderId from query parameters

//   console.log("orderId:", orderId);
//   console.log(req.query);
//   if (!merchantTransactionId) {
//     return res.status(400).json({ error: "Missing merchantTransactionId" });
//   }

//   try {
//     const xVerify = sha256(`/pg/v1/status/${Merchant_ID}/${merchantTransactionId}` + SALT_KEY) + "###" + SALT_INDEX;
//     const options = {
//       method: 'get',
//       url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${Merchant_ID}/${merchantTransactionId}`,
//       headers: {
//         accept: 'application/json',
//         'Content-Type': 'application/json',
//         "X-MERCHANT-ID": Merchant_ID,
//         "X-VERIFY": xVerify,
//       },
//     };

//     const response = await axios.request(options);
//     console.log(response.data);
//     if (response.data.success === true) {
//       const paymentInfo = {
//         code:response.data.code,
//         message:response.data.message,
//         merchantId: response.data.data.marchantId,
//         merchantTransactionId: response.data.data.marchantTransactionId,
//         transactionId: response.data.data.transactionId,
//         amount: response.data.data.amount,
//         paymentInstrument: {
//           type: response.data.data.paymentInstrument.type,
//           cardType: response.data.data.paymentInstrument.cardType,
//           pgTransactionId: response.data.data.paymentInstrument.pgTransactionId,
//           pgServiceTransactionId: response.data.data.paymentInstrument.pgServiceTransactionId,
//           bankTransactionId: response.data.data.paymentInstrument.bankTransactionId,
//           bankId: response.data.data.paymentInstrument.bankId,
//           arn: response.data.data.paymentInstrument.arn,
//           brn: response.data.data.paymentInstrument.brn,
//         }
//       };

//     const updatedOrder = await Order.findOneAndUpdate(
//         { _id: orderId },
//         { $set: { paymentInfo: paymentInfo } },
//         { new: true }
//       );
//       return res.json(updatedOrder); // Changed to return res.json()

//     } else {
//       console.error("Error from PhonePe API:", response.data);
//       return res.status(500).json({ error: "Error processing payment" });
//     }

//   } catch (error) {
//     console.error("Error processing payment:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// API routes
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api", paymentRoute);

// Vendor API routes
app.use("/api/vendor", vendorRouter);
app.use("/api/vendor/product", productRoute);
app.use("/api/attribute", vendorAttribute);
app.use("/api/category", ProductCategoryRouter);
app.use("/api/order", OrderRouter);
app.use("/api/media-library", MediaRouter);

// Admin API routes
app.use("/api/admin", adminRouter);
app.use('/api/admin/title', masterDocumentRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
