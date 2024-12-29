const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 saniye
  max: 6, // 6 deneme hakkı
  message: {
    error: 'Çok fazla başarısız giriş denemesi. Lütfen 30 saniye bekleyin.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // 100 istek
  message: {
    error: 'Çok fazla istek yapıldı. Lütfen daha sonra tekrar deneyin.'
  }
});

module.exports = { loginLimiter, generalLimiter }; 