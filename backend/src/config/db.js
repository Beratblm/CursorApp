const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI.replace(
      '${MONGODB_USERNAME}',
      process.env.MONGODB_USERNAME
    ).replace(
      '${MONGODB_PASSWORD}',
      process.env.MONGODB_PASSWORD
    ).replace(
      '${MONGODB_CLUSTER}',
      process.env.MONGODB_CLUSTER
    );

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Bağlantı Hatası: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 