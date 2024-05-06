const express = require("express");
const {createUser, loginUserCtrl, getallUser, getUser, deleteUser, updateUser,
 blockUser, unblockUser, handleRefreshToken,forgotPasswordToken, logout,updatePassword, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart,createOrder, removeProductFromCart, updateProductQuantity, getMyOrders, deleteOrder, updateOrderById,
 } = require("../controller/userController");
const { authMiddleware,isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post('/forgot-password-token',forgotPasswordToken)
router.put('/reset-password/:token',resetPassword)
router.put('/password',authMiddleware, updatePassword);
//router.put("/update-order/:id",authMiddleware,isAdmin,updateOrderStatus)
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart",authMiddleware, userCart);
//router.post("/cart/applycoupon", authMiddleware, applyCoupon)
router.post("/cart/create-order",authMiddleware,createOrder)
router.get('/all-users',getallUser);
//  router.get('/:orderId',getUserOrderById)
router.get('/getmyorders',authMiddleware,getMyOrders)
//router.get('/all-orders',authMiddleware,getOrders)
router.get('/refrash',handleRefreshToken);
router.get('/logout',logout);
router.get('/wishlist',getWishlist);
router.get('/cart',getUserCart);
router.get('/cart/:id',getUser);
router.put('/cart/updateOrder/:id',updateOrderById);
router.delete('/delete-product-cart/:cartItemId', authMiddleware,removeProductFromCart);
router.delete('/update-product-cart/:cartItemId/:newQuantity', authMiddleware,updateProductQuantity);
//router.delete('/empty-cart', authMiddleware,emptyCart);

router.delete("/cart/delete-order/:id",authMiddleware,deleteOrder);
router.delete('/:id',deleteUser);
router.put('/edit-user',authMiddleware,updateUser)
router.put('/save-address',authMiddleware,saveAddress)
router.put('/block-user/:id',authMiddleware,isAdmin,blockUser)
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);



module.exports = router;
