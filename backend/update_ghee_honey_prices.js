const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Product = require('./models/Product');

async function updateGheeHoney() {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB Atlas!');

    // 1. Buffalo Ghee: 1 Litre = 2449
    const bgRes = await Product.updateMany(
      { handle: 'pure-buffalo-ghee-premium' },
      { 
        $set: { 
          price: 2449,
          originalPrice: 3060,
          unit: '1 Litre'
        } 
      }
    );
    console.log(`Updated Buffalo Ghee: ${bgRes.modifiedCount} document(s)`);

    // 2. Cow Ghee: 1 Litre = 2249
    const cgRes = await Product.updateMany(
      { handle: 'pure-cow-ghee-premium' },
      { 
        $set: { 
          price: 2249,
          originalPrice: 2810,
          unit: '1 Litre'
        } 
      }
    );
    console.log(`Updated Cow Ghee: ${cgRes.modifiedCount} document(s)`);

    // 3. Honey: 1 kg = 650
    const hRes = await Product.updateMany(
      { handle: 'natural-honey-premium' },
      { 
        $set: { 
          price: 650,
          originalPrice: 810,
          unit: '1 kg'
        } 
      }
    );
    console.log(`Updated Honey: ${hRes.modifiedCount} document(s)`);

    // Verification
    const prods = await Product.find({
      handle: { $in: ['pure-buffalo-ghee-premium', 'pure-cow-ghee-premium', 'natural-honey-premium'] }
    });
    console.log('\n--- VERIFIED GHEE & HONEY IN MONGODB ---');
    prods.forEach(p => {
      console.log(`  ✅ "${p.name}" (${p.handle}): ₹${p.price} / ${p.unit} (Orig: ₹${p.originalPrice})`);
    });

  } catch (err) {
    console.error('Error updating Ghee & Honey:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateGheeHoney();
