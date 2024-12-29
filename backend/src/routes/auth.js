const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Email ve kullanıcı adı kontrolü
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Bu email adresi zaten kullanımda' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ error: 'Bu kullanıcı adı zaten kullanımda' });
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      email,
      username,
      password // Gerçek uygulamada şifre hash'lenmelidir
    });

    await user.save();

    res.status(201).json({ message: 'Kayıt başarılı' });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Giriş yap
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Email veya kullanıcı adı ile giriş
    const user = await User.findOne({
      $or: [
        { email: username },
        { username: username }
      ]
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı/email veya şifre' });
    }

    const token = generateToken(user);

    res.json({ token });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router; 