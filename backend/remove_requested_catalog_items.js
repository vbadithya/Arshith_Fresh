const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Collection = require('./models/Collection');
const Product = require('./models/Product');

async function removeItems() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas!');

    // 1. Collections to delete
    const collectionsToRemoveSlugs = [
      'household-care',
      'cooking-essentials',
      'pickles',
      'flours-rava',
      'beverages-instant-mixes',
      'papads-snacks'
    ];

    const delColsRes = await Collection.deleteMany({
      $or: [
        { slug: { $in: collectionsToRemoveSlugs } },
        { title: { $in: [/household/i, /cooking essential/i, /pickle/i, /flour/i, /beverage/i, /papad/i] } }
      ]
    });
    console.log(`\n🗑️  Deleted ${delColsRes.deletedCount} Collection(s) from MongoDB!`);

    // 2. Specific product deletion criteria
    // - Almond oil, Neem oil
    // - Badam powder
    // - Combo items / monthly combos
    // - Coriander / Coriender
    // - Cumin seeds
    // - Poppy / Poppy seeds
    // - Green tea
    // - Mix tuti / Tutti frutti
    // - Products belonging to deleted categories ("Household & Care", "Cooking Essentials", "Pickles", "Flours & Rava", "Beverages & Instant Mixes", "Papads & Snacks", "Flours", "Beverages", "Papads")

    const productDeleteQuery = {
      $or: [
        { handle: /almond-oil/i },
        { name: /almond oil/i },
        { handle: /neem-oil/i },
        { name: /neem oil/i },
        { handle: /badam-powder/i },
        { name: /badam powder/i },
        { handle: /combo/i },
        { name: /combo/i },
        { handle: /coriander/i },
        { name: /coriander/i },
        { handle: /coriender/i },
        { name: /coriender/i },
        { handle: /cumin/i },
        { name: /cumin/i },
        { handle: /jeera/i },
        { name: /jeera/i },
        { handle: /poppy/i },
        { name: /poppy/i },
        { handle: /gasa/i },
        { name: /gasa/i },
        { handle: /green-tea/i },
        { name: /green tea/i },
        { handle: /tuti/i },
        { name: /tuti/i },
        { handle: /tutti/i },
        { name: /tutti/i },
        { category: { $in: [/household/i, /cooking essential/i, /pickle/i, /flour/i, /beverage/i, /papad/i] } }
      ]
    };

    const toDeleteProducts = await Product.find(productDeleteQuery);
    console.log(`\nFound ${toDeleteProducts.length} Product(s) to remove:`);
    toDeleteProducts.forEach(p => {
      console.log(`  ❌ [${p.category}] "${p.name}" (${p.handle})`);
    });

    const delProdsRes = await Product.deleteMany(productDeleteQuery);
    console.log(`\n🗑️  Deleted ${delProdsRes.deletedCount} Product(s) from MongoDB!`);

    console.log('\n==========================================');
    console.log('--- REMAINING COLLECTIONS IN MONGODB ---');
    const remainingCols = await Collection.find({}).sort({ sortOrder: 1 });
    remainingCols.forEach(c => {
      console.log(`  ✅ [Order ${c.sortOrder}] "${c.title}" (${c.slug})`);
    });

    console.log('\n--- REMAINING PRODUCTS IN MONGODB ---');
    const remainingProds = await Product.find({}).sort({ category: 1, name: 1 });
    console.log(`Total remaining products: ${remainingProds.length}`);
    remainingProds.forEach(p => {
      console.log(`  ✅ [${p.category}] "${p.name}" (${p.handle})`);
    });
    console.log('==========================================\n');

  } catch (err) {
    console.error('Error removing catalog items:', err);
  } finally {
    process.exit(0);
  }
}

removeItems();
