const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';

async function check() {
  await mongoose.connect(MONGO_URI);
  const total = await Product.countDocuments();
  const multiImage = await Product.countDocuments({ 'images.1': { $exists: true } });
  const singleImage = await Product.countDocuments({ 'images.0': { $exists: true }, 'images.1': { $exists: false } });
  const noImage = await Product.countDocuments({ $or: [{ image: '' }, { image: { $exists: false } }] });

  console.log('--- DATABASE VERIFICATION SUMMARY ---');
  console.log('Total Products in DB:', total);
  console.log('Products with Multiple Images (>1):', multiImage);
  console.log('Products with Single Image (=1):', singleImage);
  console.log('Products with No Image (=0):', noImage);

  // Sample multi-image product verification
  const sampleMulti = await Product.find({ 'images.1': { $exists: true } }).limit(5);
  console.log('\n--- VERIFYING 5 SAMPLE MULTI-IMAGE PRODUCTS ---');
  sampleMulti.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.handle || p._id}] ${p.name}`);
    console.log(`   Primary Image: ${p.image}`);
    console.log(`   Images Count: ${p.images.length}`);
    p.images.forEach((img, i) => {
      console.log(`     Image ${i + 1}: ${img.url}`);
    });
  });

  process.exit(0);
}

check();
