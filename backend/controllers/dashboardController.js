const Order = require('../models/Order');
const WhatsAppClickLog = require('../models/WhatsAppClickLog');

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const confirmedOrders = await Order.countDocuments({ status: { $in: ['Confirmed', 'Fulfilled'] } });
    const clicks = await WhatsAppClickLog.countDocuments();
    
    const orders = await Order.find({ status: { $in: ['Confirmed', 'Fulfilled'] } });
    const revenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    res.json({
      totalOrders,
      confirmedOrders,
      totalRevenue: revenue,
      whatsappClicks: clicks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats };
