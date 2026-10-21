const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Product = require('./models/Product');

async function updateOilPrices() {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB Atlas!');

    // 1. Groundnut Oil: 399 per litre, MRP 499
    const gnRes = await Product.updateMany(
      {
        $or: [
          { handle: 'groundnut-oil-premium' },
          { slug: 'groundnut-oil-premium' },
          { name: /Groundnut Oil/i }
        ]
      },
      {
        $set: {
          price: 399,
          originalPrice: 499,
          unit: '1 L'
        }
      }
    );
    console.log(`Updated Groundnut Oil: ${gnRes.modifiedCount} document(s)`);

    // 2. Sunflower Oil: 559 per litre, MRP 699
    const sfRes = await Product.updateMany(
      {
        $or: [
          { handle: 'sunflower-oil-premium' },
          { slug: 'sunflower-oil-premium' },
          { name: /Sunflower Oil/i }
        ]
      },
      {
        $set: {
          price: 559,
          originalPrice: 699,
          unit: '1 L'
        }
      }
    );
    console.log(`Updated Sunflower Oil: ${sfRes.modifiedCount} document(s)`);

    // Verification
    const prods = await Product.find({
      $or: [
        { handle: { $in: ['groundnut-oil-premium', 'sunflower-oil-premium'] } },
        { name: { $regex: /groundnut oil|sunflower oil/i } }
      ]
    });
    console.log('\n--- VERIFIED OILS IN MONGODB ---');
    prods.forEach(p => {
      console.log(`  ✅ "${p.name}" (${p.handle}): ₹${p.price} / ${p.unit} (Orig: ₹${p.originalPrice})`);
    });

  } catch (err) {
    console.error('Error updating Oil prices:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateOilPrices();
