const rateLimit = require('express-rate-limit');

// Strict rate limiter for admin login to prevent brute force and credential stuffing
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
  }
});

// General API rate limiter to protect against denial of service
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again later'
  }
});

// Click logger rate limiter to prevent database spamming
const clickLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 clicks per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Rate limit exceeded for analytics events'
  }
});

module.exports = {
  loginLimiter,
  apiLimiter,
  clickLimiter
};
