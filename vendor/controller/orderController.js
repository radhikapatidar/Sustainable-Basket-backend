const Order = require('../../models/orderModel');

//  get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user orderItems.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// get order by ID
const getOrderById = async (req, res) => {
  const orderId = req.params.orderId;
try {
    const order = await Order.findById(orderId).populate('user').populate('orderItems.product');
    if (!order) {
        console.log(`Order with ID ${orderId} not found`);
        return res.status(404).json({ error: 'Order not found' });
      }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
 getAllOrders,
 getOrderById
}