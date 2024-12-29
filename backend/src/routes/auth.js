const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginLimiter } = require('../middleware/rateLimit');
const { validateRegister, validateLogin, validate } = require('../middleware/sanitizer');

// JWT token oluşturma
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      username: user.username, 
      email: user.email 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE 
    }
  );
};

// Kayıt ol
router.post('/register', validateRegister, validate, async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Bu email adresi zaten kullanımda' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ error: 'Bu kullanıcı adı zaten kullanımda' });
    }

    const user = new User({
      email,
      username,
      password,
      loginAttempts: 0,
      lockUntil: null
    });

    await user.save();
    res.status(201).json({ message: 'Kayıt başarılı' });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Giriş yap
router.post('/login', loginLimiter, validateLogin, validate, async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Giriş denemesi:', { username });

    const user = await User.findOne({
      $or: [
        { email: username.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    console.log('Bulunan kullanıcı:', user ? 'Evet' : 'Hayır');

    if (!user) {
      console.log('Kullanıcı bulunamadı');
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı/email veya şifre' });
    }

    // Hesap kilitli mi kontrol et
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000);
      console.log('Hesap kilitli:', remainingTime, 'saniye');
      return res.status(429).json({
        error: `Hesabınız kilitli. ${remainingTime} saniye sonra tekrar deneyin.`
      });
    }

    // Şifre kontrolü
    if (user.password !== password) {
      console.log('Şifre yanlış');
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      if (user.loginAttempts >= 6) {
        user.lockUntil = Date.now() + (30 * 1000); // 30 saniye
        user.loginAttempts = 0;
        console.log('Hesap kilitlendi');
      }
      
      await user.save();
      
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı/email veya şifre' });
    }

    // Başarılı giriş
    console.log('Giriş başarılı');
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error('Giriş hatası detayları:', error);
    res.status(500).json({ 
      error: 'Sunucu hatası',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 