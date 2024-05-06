const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const {generateRefreshToken} = require("../config/refrashtoken");
const validateMongoDbId = require("../utils/validateMongodbId");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController");
const crypto = require('crypto');

// Create user
const createUser = asyncHandler(async (req, res) =>{
  const email = req.body.email;
  const findUser = await User.findOne({email: email});
  if(!findUser){
//create new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

//login user
const loginUserCtrl = asyncHandler(async (req, res)=>{
  const {email, password} = req.body;
  //check if user exists or not
  console.log(email, password)
  const findUser = await User.findOne({email});
  if(findUser && await findUser.isPasswordMatched(password)){
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {new: true}
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
     _id   : findUser?._id,
     name  : findUser?.name,
     email : findUser?.email,
     mobile: findUser?.mobile,
     token : generateToken(findUser?._id)
    }); 
  }else{
    throw new Error("Invalid Cardentials");
  }
});

//Admin login
const loginAdmin = asyncHandler(async (req, res)=>{
  const {email, password} = req.body;
  //check if user exists or not
  console.log(email, password)
  const findAdmin = await User.findOne({email});
  if(findAdmin.role !== 'admin') throw new Error("Not Authorized")
  if(findAdmin && await findAdmin.isPasswordMatched(password)){
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      {new: true}
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
     _id   : findAdmin ?._id,
     name  : findAdmin?.name,
     email : findAdmin?.email,
     mobile: findAdmin?.mobile,
     token : generateToken(findAdmin?._id)
    }); 
  }else{
    throw new Error("Invalid Cardentials");
  }
});



// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie)
   if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
   const refreshToken = cookie.refreshToken;
   const user = await User.findOne({ refreshToken });
   if (!user) throw new Error(" No Refresh token present in db or not matched");
   jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
   const cookie = req.cookies;
   if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
   const refreshToken = cookie.refreshToken;
   const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
   return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

//Get all users

const getallUser = asyncHandler(async (req, res) => {
  try{
    const getUser = await User.find();
    res.json(getUser);
  }
  catch(error){
    throw new Error(error);
  }
});

// get a single user

const getUser = asyncHandler(async (req, res)=>{
  validateMongoDbId(id);
  const {id} = req.params;
 
  try{
    const getUser = await User.findById(id);
    res.json({
      getUser,
    })
  } catch (error){
    throw new Error(error);
  }
})
// Delete a user

const deleteUser = asyncHandler(async (req, res)=>{
  const {id} = req.params;
  console.log(req.params)
  try{
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      deleteUser,
    })
  } catch (error){
    throw new Error(error);
  }
})

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
 try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message:"User Blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Updatde a user

const updateUser = asyncHandler(async (req, res)=>{
  const {_id} = req.user;
  validateMongoDbId(_id);
  try{
    const updateUser = await User.findByIdAndUpdate(_id,{
      name   : req?.body?.name,
      email  : req?.body?.email,
      mobile : req?.body?.mobile,
      address : req?.body?.address,
    },{
      new: true,
    });
    res.json(updateUser)
  }catch(error){
    throw new Error(error);
  }
})


  //UPDATE Password
  const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const {password}  = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  });

  //gENRATE FORGATE TOKEN
  const forgotPasswordToken = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) throw new Error("User Not Found With This Email");
    try{
      const token =await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi Please follow this link to reset your password.This link is valid till 10 minutes from now. <a href='http://localhost:3000/reset-password/${token}'>Click Here</a> `
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        html: resetURL,
      }
      sendEmail(data);
      res.json(token)
    } catch(error){
      throw new Error(error);
    }
  });

  // Reset Password
    const resetPassword = asyncHandler(async(req,res)=>{
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {$gt: Date.now()},
    });
    if(!user) throw new Error("Token Expired, please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  });

  const getWishlist = asyncHandler(async(req,res) => {
    const { _id } = req.user;
    try{
      const findUser = await User.findById(_id).populate("wishlist");
      res.json(findUser)
    }catch (error){
      throw new Error(error);
    }
  })

  //save user Address
const saveAddress = asyncHandler(async (req,res,next) =>{
  const { _id } = req.user;
  validateMongoDbId(_id);
  try{
    const updateUser = await User.findByIdAndUpdate(_id,{
      address : req?.body?.address,
    },{
      new: true,
    });
    res.json(updateUser)
  }catch(error){
    throw new Error(error);
  }
});

// User Cart
const userCart = asyncHandler(async(req, res)=>{
  const { productId, images, quantity, price} = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
  
  let newCart = await new Cart({
    userId:_id,
    productId,
    images,
    price,
    quantity,
  }).save();
  res.json(newCart);
  } catch (error) {
    throw new Error(error)
  }
})

// Get all Cart Details
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try{
    const cart = await Cart.find({userId: _id}).populate("productId");
    res.json(cart);
  } catch (error){
    throw new Error(error);
  }
});

const removeProductFromCart = asyncHandler(async (req, res)=>{
  const {_id} = req.user;
  const {cartItemId} = req.params;
  validateMongoDbId(_id);
  try{
    const deleteProductFromCart = await Cart.deleteOne({userId:_id,_id:cartItemId});
    res.json(deleteProductFromCart);
  } catch (error){
    throw new Error(error);
  }
})

const updateProductQuantity = asyncHandler(async (req,res) => {
  const {_id} = req.user;
  const {cartItemId,newQuantity} = req.params;
  validateMongoDbId(_id);
  try{
    const cartItem = await Cart.findOne({userId:_id,_id:cartItemId});
    cartItem.quantity = newQuantity
    cartItem.save()
    res.json(cartItem);
  } catch (error){
    throw new Error(error);
  }
})

const createOrder = asyncHandler(async (req, res) => {
  const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount } = req.body;
  const { paymentInfo } = req.body; 
  const { _id, vendorId } = req.user; 

  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      paymentInfo,
      user: _id,
      vendorId 
    });
    res.json({
      order,
      success: true
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get orders
const getMyOrders = asyncHandler(async (req,res) => {
  const { _id } = req.user;
  try{
    const orders = await Order.find({user:_id}).populate("user").populate("orderItems.product")
    res.json({
      orders
    })
  }catch(error){
    throw new Error(error)
  }
});

// get order by ID
// const getUserOrderById = async (req, res) => {
//   const userId = req.params.userId;
//   try {
//     const orders = await Order.find({ userId }).populate('customer').populate('orderItems.product');
//     if (!orders) {
//       console.log(`Orders for user with ID ${userId} not found`);
//       return res.status(404).json({ error: 'Orders not found' });
//     }
//     res.json(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


const updateOrderById = asyncHandler(async(req,res)=>{
  console.log("Update api run")
  const { id } = req.params; 
  validateMongoDbId(id);
   const updatedOrder = await Order.findOneAndUpdate({ _id: id }, req.body, {
          new: true,
      });
      res.json(updatedOrder);
})

// Delete order by Id 
const deleteOrder = asyncHandler(async (req,res) => {
  const orderId = req.params.id;
  try{
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
      deletedOrder: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
})



// empty cart 
// const emptyCart = asyncHandler(async (req, res)=> {
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try{
//     const user = await User.findOne({_id});
//     const cart =  await Cart.findOneAndDelete({orderby: user._id});
//     res.json(cart);
//   } catch (error){
//     throw new Error(error);
//   }
// })

// // Apply coupan
// const applyCoupon = asyncHandler(async (req, res) => {
//   const { coupon } = req.body;
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   const validCoupon = await Coupon.findOne({ name: coupon });
//   if (validCoupon === null) {
//     throw new Error("Invalid Coupon");
//   }
//   const user = await User.findOne({ _id });
//   let {cartTotal } = await Cart.findOne({
//     orderby: user._id,
//   }).populate("products.product");
//   let totalAfterDiscount = (
//     cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
//   await Cart.findOneAndUpdate(
//     { orderby: user._id },
//     { totalAfterDiscount },
//     { new: true }
//   );
//   res.json(totalAfterDiscount);
// });

// // create order
// const createOrder = asyncHandler(async(req, res)=> {
//   const {COD, couponApplied} = req.body;
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try{
//     if(!COD) throw new Error("Create cash order failed");
//     const user = await User.findById(_id);
//     let userCart = await Cart.findOne({orderby: user._id});
//     let finalAmount = 0;
//     if(couponApplied && userCart.totalAfterDiscount){
//       finalAmount = userCart.totalAfterDiscount;
//     } else{
//       finalAmount = userCart.cartTotal;
//     }
//     let newOrder = await new Order({
//       products: userCart.products,
//       paymentIntent: {
//         id: uniqid(),
//         method: "COD",
//         amount : finalAmount,
//         status: "Cash on Delivery",
//         created : Date.now(),
//         currency: "usd",
//       },
//       orderby: user._id,
//       orderStatus: "Cash On Delivery",
//     }).save();
//     let update = userCart.products.map((item)=> {
//       return{
//         updateOne:{
//           filter: {_id:item.product._id},
//           update:{$inc: {quantity: -item.count, sold: +item.count}},
//         },
//       }
//     });
//     const updated = await Product.bulkWrite(update, {});
//     res.json({message: "success"})
//   } catch(error){
//     throw new Error(error);
//   }
// })

// const getOrders = asyncHandler(async (req, res)=> {
//   const { _id} = req.user;
//   validateMongoDbId(_id);
//   try{
//     const userorders = await Order.findOne({orderby: _id})
//        .populate('products.product').exec();
//     res.json(userorders)
//   } catch{
//     throw new Error(error);
//   }
// })

// // update order status
// const updateOrderStatus = asyncHandler(async (req, res) => {
//   const { status } = req.body;
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const updateOrderStatus = await Order.findByIdAndUpdate(
//       id,
//       {
//         orderStatus: status,
//         paymentIntent: {
//           status: status,
//         },
//       },
//       { new: true }
//     );
//     res.json(updateOrderStatus);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
module.exports = {
   createUser,
   loginUserCtrl, 
   getallUser,
   getUser, 
   deleteUser,
   updateUser,
   blockUser,
   unblockUser,
   handleRefreshToken,
   logout,
   updatePassword,
   forgotPasswordToken,
   resetPassword,
   loginAdmin,
   getWishlist,
   saveAddress,
   userCart,
   getUserCart,
  createOrder,
  removeProductFromCart,
  updateProductQuantity,
  getMyOrders,
  deleteOrder,
  updateOrderById
  }