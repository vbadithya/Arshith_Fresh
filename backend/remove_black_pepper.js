const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Product = require('./models/Product');

async function removeBlackPepper() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB Atlas!');

    // Find any pepper products
    const prods = await Product.find({
      name: /pepper/i
    });
    console.log(`Found ${prods.length} pepper product(s) in DB:`);
    prods.forEach(p => {
      console.log(`  - [${p.category}] "${p.name}" (${p.handle}, ID: ${p._id})`);
    });

    const delRes = await Product.deleteMany({
      name: /pepper/i
    });
    console.log(`\n🗑️ Deleted ${delRes.deletedCount} pepper product(s) from DB!`);

    // Verify remaining Powders & Masalas products
    const remaining = await Product.find({ category: 'Powders & Masalas' });
    console.log(`\n--- Remaining Powders & Masalas in DB (${remaining.length} products) ---`);
    remaining.forEach(p => {
      console.log(`  ✅ "${p.name}" (${p.handle})`);
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

removeBlackPepper();
