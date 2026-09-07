const WhatsAppClickLog = require('../models/WhatsAppClickLog');

const logClick = async (req, res) => {
  try {
    const { productId } = req.body;
    if (productId) {
      await WhatsAppClickLog.create({ productId });
    }
    res.status(201).json({ message: 'Click logged' });
  } catch (error) {
    // Fail silently so user isn't blocked from ordering
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { logClick };
