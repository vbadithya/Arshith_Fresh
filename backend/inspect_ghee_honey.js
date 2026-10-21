const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Product = require('./models/Product');

async function inspect() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    const all = await Product.find({});
    const gheeHoney = all.filter(p => /ghee|honey/i.test(p.category) || /ghee|honey/i.test(p.name));
    console.log(`Found ${gheeHoney.length} products:`);
    gheeHoney.forEach(p => {
      console.log(JSON.stringify({
        id: p._id,
        handle: p.handle,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        unit: p.unit,
        variants: p.variants,
        options: p.options,
        description: p.description
      }, null, 2));
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

inspect();
