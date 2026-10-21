const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Product = require('./models/Product');

async function updateDbOils() {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB Atlas!');

    // 1. Sesame Oil: 250ml base = 115, unit = 250 ml
    const sesRes = await Product.updateMany(
      { handle: 'sesame-oil-premium' },
      {
        $set: {
          price: 115,
          unit: '250 ml'
        }
      }
    );
    console.log(`Updated Sesame Oil: ${sesRes.modifiedCount} doc(s)`);

    // 2. Coconut Oil: 250ml base = 174, unit = 250 ml
    const cocRes = await Product.updateMany(
      { handle: 'coconut-oil-premium' },
      {
        $set: {
          price: 174,
          unit: '250 ml'
        }
      }
    );
    console.log(`Updated Coconut Oil: ${cocRes.modifiedCount} doc(s)`);

    // 3. Castor Oil: 250ml = 112, image = /assets/images/products/castor_oil_250ml.png
    const casRes = await Product.updateMany(
      { handle: 'castor-oil-premium' },
      {
        $set: {
          price: 112,
          unit: '250 ml',
          image: '/assets/images/products/castor_oil_250ml.png',
          hoverImage: '/assets/images/products/castor_oil_250ml.png',
          images: [{ url: '/assets/images/products/castor_oil_250ml.png', alt: 'Cold Pressed Castor Oil 250ml' }]
        }
      }
    );
    console.log(`Updated Castor Oil: ${casRes.modifiedCount} doc(s)`);

    // 4. Remove Mustard Oil completely
    const musRes = await Product.deleteMany({
      $or: [
        { handle: 'mustard-oil-premium' },
        { slug: 'mustard-oil-premium' },
        { name: { $regex: /mustard oil/i } }
      ]
    });
    console.log(`Deleted Mustard Oil: ${musRes.deletedCount} doc(s)`);

    // Verify remaining oils
    const prods = await Product.find({
      $or: [{ category: 'Oils' }, { name: { $regex: /oil/i } }]
    });
    console.log('\n--- VERIFIED OILS IN MONGODB ---');
    prods.forEach(p => {
      console.log(`  ✅ "${p.name}" (${p.handle}): ₹${p.price} / ${p.unit}`);
    });

  } catch (err) {
    console.error('Error updating DB oils:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateDbOils();
