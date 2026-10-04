const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';

async function listMulti() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    const products = await Product.find({ 'images.1': { $exists: true } });
    console.log('COUNT OF MULTI-IMAGE PRODUCTS IN DB:', products.length);
    products.forEach((p, i) => {
      console.log(`${i+1}. [${p.handle || 'no-handle'}] ${p.name} -> ${p.images.length} images`);
      p.images.forEach((img, idx) => console.log(`    Image ${idx+1}: ${img.url}`));
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listMulti();
