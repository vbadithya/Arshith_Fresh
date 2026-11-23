const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS resolvers to prevent SRV lookup failures on restricted local networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if DNS server override is not permitted
}

const connectDB = async () => {
  // Prevent Mongoose from hanging indefinitely when disconnected
  mongoose.set('bufferTimeoutMS', 3000);

  const primaryUri = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:DUMTmC92vlHgKLKb@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?retryWrites=true&w=majority';
  const fallbackUri = 'mongodb://127.0.0.1:27017/arshith_fresh';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB Atlas Connection Warning: ${error.message}`);
    console.log(`🔄 Connecting to Local MongoDB (${fallbackUri})...`);
    try {
      await mongoose.disconnect();
    } catch (e) {}

    try {
      const localConn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`✅ Connected to Local MongoDB: ${localConn.connection.host}`);
    } catch (localError) {
      console.error(`❌ Local MongoDB Connection Failed: ${localError.message}`);
      console.log('⚡ Running server with in-memory retry mode...');
    }
  }
};

module.exports = connectDB;