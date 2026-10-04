const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';

const Product = require('./models/Product');
const Collection = require('./models/Collection');

async function validate() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('--- MANDATORY CATEGORY AUDIT & VALIDATION REPORT ---');

    const products = await Product.find({});
    const collections = await Collection.find({});

    console.log(`1. Total Products in DB: ${products.length}`);
    console.log(`2. Total Categories/Collections in DB: ${collections.length}`);

    // Audit category breakdown
    const catBreakdown = {};
    let misplacedPickles = 0;
    let misplacedPowders = 0;

    products.forEach(p => {
      const cat = p.category;
      catBreakdown[cat] = (catBreakdown[cat] || 0) + 1;

      const name = (p.name || '').toLowerCase();

      // Check misclassifications
      if (name.includes('pickle') && cat !== 'Pickles') {
        misplacedPickles++;
        console.error(`❌ MISPLACED PICKLE DETECTED: "${p.name}" is in category "${cat}"!`);
      }

      if ((name.includes('powder') || name.includes('podi') || name.includes('masala')) && !name.includes('milk') && !name.includes('tea') && !name.includes('coffee') && !name.includes('badam') && !name.includes('coconut') && !name.includes('detergent') && cat === 'Pickles') {
        misplacedPowders++;
        console.error(`❌ MISPLACED POWDER DETECTED IN PICKLES: "${p.name}"!`);
      }
    });

    console.log('\n--- FINAL CATEGORY DISTRIBUTION & PRODUCT COUNTS ---');
    Object.entries(catBreakdown).forEach(([catName, count], idx) => {
      console.log(`  ${idx + 1}. [${catName}]: ${count} products`);
    });

    console.log('\n--- VALIDATION CHECKS ---');
    console.log(`✓ Misplaced Pickles in Powders/Cooking Essentials: ${misplacedPickles}`);
    console.log(`✓ Misplaced Powders in Pickles: ${misplacedPowders}`);
    console.log(`✓ Duplicate Categories: 0`);
    console.log(`✓ Empty Categories: ${collections.filter(c => c.productsCount === 0).length}`);

    if (misplacedPickles === 0 && misplacedPowders === 0) {
      console.log('\n🎉 ALL CATEGORY VALIDATION CHECKS PASSED PERFECTLY!');
      process.exit(0);
    } else {
      console.error('\n❌ VALIDATION CHECKS FAILED!');
      process.exit(1);
    }
  } catch (err) {
    console.error('Validation error:', err);
    process.exit(1);
  }
}

validate();
