const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('MongoDB bağlantısı başlatılıyor...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Bağlantı Hatası:');
    console.error('Hata Mesajı:', error.message);
    console.error('Hata Detayları:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 