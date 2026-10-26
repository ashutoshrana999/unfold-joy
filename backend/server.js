require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const { apiLimiter } = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Disable express fingerprint header
app.disable('x-powered-by');

// Security: HTTP headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        connectSrc: ["'self'", 'http://localhost:5000', 'http://localhost:5173', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Security: Dynamic CORS Configuration (supports unfoldjoy.in, Vercel & custom domains)
const configuredClientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((u) => u.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
  'https://unfoldjoy.in',
  'http://unfoldjoy.in',
  'https://www.unfoldjoy.in',
  'http://www.unfoldjoy.in',
  'https://unfoldjoy.vercel.app',
  ...configuredClientUrls
];

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser requests (mobile apps, server-to-server)
  const cleanOrigin = origin.trim().replace(/\/+$/, '');
  if (allowedOrigins.includes(cleanOrigin)) return true;

  try {
    const url = new URL(cleanOrigin);
    const hostname = url.hostname.toLowerCase();

    // Automatically allow custom domain unfoldjoy.in and all subdomains (e.g. www.unfoldjoy.in)
    if (hostname === 'unfoldjoy.in' || hostname.endsWith('.unfoldjoy.in')) {
      return true;
    }

    // Automatically allow Vercel production & preview deployments
    if (hostname.endsWith('.vercel.app')) {
      return true;
    }
  } catch (e) {
    // invalid URL format
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      console.warn(`Blocked origin by CORS: ${origin}`);
      return callback(new Error('Blocked by CORS security policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 204
  })
);

// Security: Request body size limits to prevent Denial-of-Service memory attacks
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Security: Rate limiting across all API endpoints
app.use('/api', apiLimiter);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/unfoldjoy')
  .then(() => console.log('MongoDB connected securely'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/admin', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/admin/products', require('./routes/adminProducts'));
app.use('/api/admin/categories', require('./routes/adminCategories'));
app.use('/api/admin/orders', require('./routes/adminOrders'));
app.use('/api/admin/dashboard', require('./routes/adminDashboard'));
app.use('/api/whatsapp-click', require('./routes/whatsappClick'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/admin/settings', require('./routes/settings'));

// Serve static frontend if present (monolithic build), otherwise render API health status (Render)
const distPath = path.join(__dirname, '../frontend/dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  // Default Render Health Check route
  app.get('/', (req, res) => {
    res.json({
      status: 'active',
      name: 'UnfoldJoy Backend API',
      message: 'Server is running securely on Render',
      version: '1.0.0'
    });
  });
}

// Centralized Security Error Handler (Do not leak internal stack traces)
app.use((err, req, res, next) => {
  console.error('Handled Error:', err.message);
  
  if (err.message === 'Blocked by CORS security policy') {
    return res.status(403).json({ message: 'Access denied: origin not allowed by CORS' });
  }

  res.status(err.status || 500).json({
    message: 'An internal error occurred. Please contact administrator.'
  });
});

app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});
