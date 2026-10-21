const SiteSettings = require('../models/SiteSettings');

// Public: Get homepage section settings
const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        showUnder99: false,
        showUnder199: false
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving settings' });
  }
};

// Admin: Update homepage section settings
const updateSettings = async (req, res) => {
  try {
    const { showUnder99, showUnder199 } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }
    if (typeof showUnder99 === 'boolean') {
      settings.showUnder99 = showUnder99;
    }
    if (typeof showUnder199 === 'boolean') {
      settings.showUnder199 = showUnder199;
    }
    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings' });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
