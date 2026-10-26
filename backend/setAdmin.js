const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const setAdmin = async () => {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = (args[1] || process.env.ADMIN_PASSWORD || '').trim();

  if (!email || !password) {
    console.error('❌ Missing credentials.');
    console.error('Usage: node setAdmin.js <email> <password>');
    console.error('Example: node setAdmin.js admin@unfoldjoy.com myStrongPassword123');
    console.error('Or set ADMIN_EMAIL and ADMIN_PASSWORD in your backend/.env file and run "npm run set-admin"');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('❌ Error: Password must be at least 6 characters long.');
    process.exit(1);
  }

  if (!MONGO_URI) {
    console.error('❌ Error: MONGO_URI is not defined in backend/.env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await Admin.findOneAndUpdate(
      { email },
      { name: 'Admin', email, passwordHash },
      { upsert: true, new: true }
    );

    console.log(`\n✅ Administrator account successfully saved!`);
    console.log(`👤 Email: ${admin.email}`);
    console.log(`🔒 Password updated securely in MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update administrator account:', error.message);
    process.exit(1);
  }
};

setAdmin();
