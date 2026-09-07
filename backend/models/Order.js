const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String },
  customerPhone: { type: String },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String },
    price: { type: Number },
    qty: { type: Number },
    variant: { type: String }
  }],
  totalAmount: { type: Number },
  status: {
    type: String,
    enum: ['New Lead', 'Confirmed', 'Fulfilled', 'Cancelled'],
    default: 'New Lead'
  },
  source: {
    type: String,
    enum: ['WhatsApp Click', 'Manual'],
    default: 'Manual'
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
