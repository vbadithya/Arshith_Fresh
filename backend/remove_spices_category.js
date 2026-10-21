const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Collection = require('./models/Collection');
const Product = require('./models/Product');

async function removeSpices() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected to MongoDB Atlas!');

    // 1. Delete Spices Collection
    const delColResult = await Collection.deleteMany({
      $or: [
        { slug: 'spices' },
        { title: /^spices$/i }
      ]
    });
    console.log(`\n🗑️  Deleted ${delColResult.deletedCount} Spices Collection(s) from MongoDB!`);

    // 2. Find and delete Spices Products (Whole Spices only)
    const spicesProducts = await Product.find({ category: 'Spices' });
    console.log(`\nFound ${spicesProducts.length} Spices Product(s) to remove:`);
    spicesProducts.forEach(p => {
      console.log(`  ❌ [${p.category}] "${p.name}" (${p.handle})`);
    });

    const delProdsResult = await Product.deleteMany({ category: 'Spices' });
    console.log(`\n🗑️  Deleted ${delProdsResult.deletedCount} Spices Product(s) from MongoDB!`);

    // 3. Verify Remaining Collections
    console.log('\n==========================================');
    console.log('--- REMAINING COLLECTIONS IN MONGODB ---');
    const remainingCols = await Collection.find({}).sort({ sortOrder: 1 });
    remainingCols.forEach(c => {
      console.log(`  ✅ "${c.title}" (${c.slug})`);
    });

    // 4. Verify Remaining Categories
    const allProds = await Product.find({});
    const distinctCategories = [...new Set(allProds.map(p => p.category))];
    console.log(`\n--- REMAINING CATEGORIES IN MONGODB (${allProds.length} total products) ---`);
    distinctCategories.forEach(cat => {
      const count = allProds.filter(p => p.category === cat).length;
      console.log(`  ✅ [${cat}]: ${count} products`);
    });
    console.log('==========================================\n');

  } catch (err) {
    console.error('Error removing Spices:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

removeSpices();
