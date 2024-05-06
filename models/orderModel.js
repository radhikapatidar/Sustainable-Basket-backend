const mongoose = require('mongoose');

// Define embedded schema for paymentInstrument
const paymentInstrumentSchema = new mongoose.Schema({
    type: String,
    cardType: String,
    pgTransactionId: String,
    pgServiceTransactionId: String,
    bankTransactionId: String,
    bankId: String
});

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
 
   
    shippingInfo: {
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        state: String,
        other: String,
        pincode: Number
    },
    paymentInfo: {
        code: String,
        message:String,
        transactionId: String,
        amount: Number,
        merchantId: String,
        merchantTransactionId: String,
        paymentInstrument: paymentInstrumentSchema // Embed paymentInstrument schema
    },
    orderItems: [
        {
          product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            vendorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vendor"
            },
            quantity: Number,
            price: Number,
        }
    ],
    paidAt: {
        type: Date,
        default: Date.now
    },
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    orderStatus: {
        type: String,
        default: "Ordered"
    }
}, {
    timestamps: true
});

// Export the model
module.exports = mongoose.model('Order', orderSchema);
