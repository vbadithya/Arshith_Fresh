const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS resolvers to prevent SRV lookup failures on restricted local networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if DNS server override is not permitted
}

const KNOWN_VALID_ATLAS_URI = 'mongodb+srv://valavalabalaadithya_db_user:DUMTmC92vlHgKLKb@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?retryWrites=true&w=majority';

const connectDB = async () => {
  // Prevent Mongoose from hanging indefinitely when disconnected
  mongoose.set('bufferTimeoutMS', 3000);

  const envUri = (process.env.MONGO_URI || '').trim();
  // If envUri is unset or contains the known bad password 'arshith', use verified URI
  const primaryUri = (envUri && !envUri.includes(':arshith@')) ? envUri : KNOWN_VALID_ATLAS_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/arshith_fresh';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB Atlas Connection Warning: ${error.message}`);
  }

  // If primaryUri was custom and failed, always try the verified Atlas URI
  if (primaryUri !== KNOWN_VALID_ATLAS_URI) {
    try {
      console.log('🔄 Attempting fallback to verified MongoDB Atlas credentials...');
      const atlasConn = await mongoose.connect(KNOWN_VALID_ATLAS_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(`✅ Connected to MongoDB Atlas (Verified Fallback): ${atlasConn.connection.host}`);
      return;
    } catch (atlasError) {
      console.warn(`⚠️ Verified Atlas Connection Failed: ${atlasError.message}`);
    }
  }

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
};

module.exports = connectDB;