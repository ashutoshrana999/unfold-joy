const Order = require('../models/Order');
const mongoose = require('mongoose');

// Admin: Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('items.productId', 'name images').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders' });
  }
};

// Admin: Create manual order
const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Admin: Update order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrder
};
