const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Product = require('./models/Product');

// Verified base prices explicitly established with 22% discount
const VERIFIED_PRODUCTS = {
  'groundnut-oil-premium': { price: 399, originalPrice: 512, discount: 22 },
  'sunflower-oil-premium': { price: 559, originalPrice: 699, discount: 20 },
  'sesame-oil-premium': { price: 115, originalPrice: 147, discount: 22 },
  'castor-oil-premium': { price: 112, originalPrice: 147, discount: 24 },
  'coconut-oil-premium': { price: 174, originalPrice: 223, discount: 22 },
  'pure-buffalo-ghee-premium': { price: 612, originalPrice: 785, discount: 22 },
  'pure-cow-ghee-premium': { price: 562, originalPrice: 721, discount: 22 },
  'natural-honey-premium': { price: 162.50, originalPrice: 208.50, discount: 22 },
  'cashew-nuts-premium': { price: 329, originalPrice: 422, discount: 22 },
  'almonds-premium': { price: 285, originalPrice: 365, discount: 22 },
  'figsdry-anjeer-premium': { price: 475, originalPrice: 609, discount: 22 },
  'pistachio-with-shell-premium-quality': { price: 394, originalPrice: 505, discount: 22 },
  'dates-khajoor-premium': { price: 256, originalPrice: 328, discount: 22 },
  'walnuts-akhrot-premium': { price: 389, originalPrice: 499, discount: 22 },
  'raisins-premium': { price: 188, originalPrice: 241, discount: 22 },
  'flax-seeds-premium': { price: 149, originalPrice: 191, discount: 22 },
  'chia-seeds-premium': { price: 189, originalPrice: 242, discount: 22 },
  'pumpkin-seeds-premium': { price: 224, originalPrice: 287, discount: 22 },
  'sunflower-seeds-premium': { price: 195, originalPrice: 250, discount: 22 },
  'watermelon-seeds-premium': { price: 225, originalPrice: 288, discount: 22 },
  'sabja-seeds-premium': { price: 189, originalPrice: 242, discount: 22 },
  'sesame-seeds-premium': { price: 179, originalPrice: 230, discount: 22 },
  'chilli-powder-softgrindingpremium': { price: 699, originalPrice: 896, discount: 22 },
  'coriander-powder-premium': { price: 59, originalPrice: 76, discount: 22 },
  'garam-masala-powder-premium': { price: 39, originalPrice: 50, discount: 22 },
  'chana-dal-spice-powder-pappula-podi-premium': { price: 79, originalPrice: 101, discount: 22 },
  'garlic-powder-velluli-karam-podi-premium': { price: 79, originalPrice: 101, discount: 22 },
  'kobbari-karam-podi-premium': { price: 79, originalPrice: 101, discount: 22 },
  'nalla-karam-podi-premium': { price: 79, originalPrice: 101, discount: 22 },
  'karivepaku-karam-podi-premium': { price: 79, originalPrice: 101, discount: 22 }
};

async function updatePricing() {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB Atlas!');

    const products = await Product.find({});
    console.log(`Processing ${products.length} products...`);

    let updatedCount = 0;

    for (const p of products) {
      const handle = p.handle || p.slug || p.id;
      let newPrice = p.price;
      let newOriginalPrice = p.originalPrice;

      if (VERIFIED_PRODUCTS[handle]) {
        // Keep verified selling price and verified original price (22% OFF)
        newPrice = VERIFIED_PRODUCTS[handle].price;
        newOriginalPrice = VERIFIED_PRODUCTS[handle].originalPrice;
      } else {
        // Keep current selling price UNCHANGED!
        // Mathematically compute strikethrough original price for default 25% discount:
        // Formula: Original Price = Current Selling Price ÷ (1 - 25 / 100) = Selling Price ÷ 0.75
        newPrice = p.price;
        newOriginalPrice = Math.round(newPrice / 0.75);
      }

      await Product.updateOne(
        { _id: p._id },
        { 
          $set: { 
            price: newPrice,
            originalPrice: newOriginalPrice
          } 
        }
      );
      updatedCount++;
    }

    console.log(`✅ Successfully updated ${updatedCount} products in MongoDB Atlas!`);

    // Verify all products
    const verified = await Product.find({}).sort({ category: 1, name: 1 });
    console.log('\n--- VERIFIED PRICING IN MONGODB ATLAS ---');
    verified.forEach(p => {
      const disc = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      const save = (p.originalPrice - p.price).toFixed(2);
      console.log(`• ${p.name}: Selling ₹${p.price} (Bold) | Orig ₹${p.originalPrice} (Strikethrough) | Save ₹${save} | ${disc}% OFF`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error updating pricing:', err);
    process.exit(1);
  }
}

updatePricing();
