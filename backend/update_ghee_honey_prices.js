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

    // 1. Buffalo Ghee: 250 gram = 477 (orig 612)
    const bgRes = await Product.updateMany(
      { handle: 'pure-buffalo-ghee-premium' },
      { 
        $set: { 
          price: 477,
          originalPrice: 612,
          unit: '250 gram'
        } 
      }
    );
    console.log(`Updated Buffalo Ghee: ${bgRes.modifiedCount} document(s)`);

    // 2. Cow Ghee: 250 gram = 438 (orig 562)
    const cgRes = await Product.updateMany(
      { handle: 'pure-cow-ghee-premium' },
      { 
        $set: { 
          price: 438,
          originalPrice: 562,
          unit: '250 gram'
        } 
      }
    );
    console.log(`Updated Cow Ghee: ${cgRes.modifiedCount} document(s)`);

    // 3. Honey: 250 gram = 127 (orig 162.50)
    const hRes = await Product.updateMany(
      { handle: 'natural-honey-premium' },
      { 
        $set: { 
          price: 127,
          originalPrice: 162.50,
          unit: '250 gram'
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
