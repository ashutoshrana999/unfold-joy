const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  showUnder99: { type: Boolean, default: false },
  showUnder199: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
