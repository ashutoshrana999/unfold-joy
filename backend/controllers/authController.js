const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey';
  return jwt.sign({ id }, secret, {
    expiresIn: '7d', // 7 days expiration for improved security
  });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Type and existence check (NoSQL injection prevention)
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid credentials format' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(cleanPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Authentication error occurred' });
  }
};

const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid input data format' });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanName || !cleanEmail || !cleanPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (cleanPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const adminExists = await Admin.findOne({ email: cleanEmail });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(cleanPassword, salt);

    const admin = await Admin.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create administrator' });
  }
};

module.exports = { loginAdmin, registerAdmin };
