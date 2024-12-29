const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

const sanitizeInput = (value) => {
  try {
    // Eğer değer null veya undefined ise boş string döndür
    if (value == null) {
      return '';
    }

    // Değeri string'e çevir
    const strValue = String(value);

    // HTML temizleme
    let sanitized = sanitizeHtml(strValue, {
      allowedTags: [],
      allowedAttributes: {},
      allowedIframeHostnames: []
    });

    // Özel karakterleri temizle
    sanitized = sanitized
      .replace(/[;'"\\]/g, '') // SQL injection karakterleri
      .replace(/[<>]/g, '') // HTML tags
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized;
  } catch (error) {
    console.error('Sanitization error:', error);
    return '';
  }
};

const validateRegister = [
  body('email')
    .trim()
    .isEmail().withMessage('Geçerli bir email adresi giriniz')
    .normalizeEmail()
    .customSanitizer((value) => sanitizeInput(value)),
  
  body('username')
    .trim()
    .isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalıdır')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir')
    .customSanitizer((value) => sanitizeInput(value)),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/).withMessage('Şifre en az bir harf ve bir rakam içermelidir'),
];

const validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Kullanıcı adı gereklidir')
    .customSanitizer((value) => sanitizeInput(value)),
  
  body('password')
    .notEmpty().withMessage('Şifre gereklidir'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validasyon hatası',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validate,
  sanitizeInput
}; 