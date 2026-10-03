const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch (e) {}

const mongoose = require('mongoose');
const Product = require('./models/Product');

// 1. Target removal patterns
const REMOVE_REGEX = /almond-oil|neem-oil|coriander|coriender|dhania|cumin|jeera|poppy|gasa|coconut-powder|coffee-powder/i;
const REMOVE_NAME_REGEX = /Almond Oil|Neem Oil|Coriander|Coriender|Dhania|Cumin|Jeera|Poppy|Khasa Khasa|Coconut Powder|Coffee Powder/i;

async function purge() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB!');

    // Delete matching products from MongoDB Atlas
    const deleteQuery = {
      $or: [
        { handle: REMOVE_REGEX },
        { name: REMOVE_NAME_REGEX },
        { title: REMOVE_NAME_REGEX }
      ]
    };

    const toDeleteDB = await Product.find(deleteQuery);
    console.log(`Found ${toDeleteDB.length} product(s) in MongoDB to purge:`);
    toDeleteDB.forEach(p => console.log(`  ❌ DB DELETE: "${p.name}" (${p.handle})`));

    const delRes = await Product.deleteMany(deleteQuery);
    console.log(`\n🗑️ Deleted ${delRes.deletedCount} products from MongoDB Atlas.`);

    // Update backend/routes/productRoutes.js to remove them from FALLBACK_CATALOG
    const routesFilePath = path.join(__dirname, 'routes', 'productRoutes.js');
    let routesContent = fs.readFileSync(routesFilePath, 'utf8');

    // Parse array fallback in productRoutes.js
    // We will clean FALLBACK_CATALOG entries matching REMOVE_REGEX or REMOVE_NAME_REGEX
    console.log('\nCleaning FALLBACK_CATALOG in productRoutes.js...');

    // Regex to match individual objects in FALLBACK_CATALOG array
    // We can filter out lines or objects
    const productRoutesFile = fs.readFileSync(routesFilePath, 'utf8');
    
    // Find FALLBACK_CATALOG block
    const catalogMatch = productRoutesFile.match(/const FALLBACK_CATALOG = (\[[\s\S]*?\n\];)/);
    if (catalogMatch) {
      const arrayStr = catalogMatch[1];
      let catalogArray = [];
      try {
        catalogArray = eval(arrayStr); // Evaluate the fallback array
      } catch (e) {
        console.error('Error evaluating FALLBACK_CATALOG:', e.message);
      }

      if (catalogArray.length > 0) {
        console.log(`Original FALLBACK_CATALOG length: ${catalogArray.length}`);
        const filteredCatalog = catalogArray.filter(item => {
          const matchHandle = item.handle && REMOVE_REGEX.test(item.handle);
          const matchName = item.name && REMOVE_NAME_REGEX.test(item.name);
          const matchTitle = item.title && REMOVE_NAME_REGEX.test(item.title);
          if (matchHandle || matchName || matchTitle) {
            console.log(`  ❌ FALLBACK REMOVE: "${item.name}" (${item.handle})`);
            return false;
          }
          return true;
        });

        console.log(`Filtered FALLBACK_CATALOG length: ${filteredCatalog.length}`);

        const newCatalogStr = 'const FALLBACK_CATALOG = ' + JSON.stringify(filteredCatalog, null, 2) + ';';
        routesContent = routesContent.replace(/const FALLBACK_CATALOG = \[[\s\S]*?\n\];/, newCatalogStr);
        fs.writeFileSync(routesFilePath, routesContent, 'utf8');
        console.log('✅ Updated productRoutes.js with clean FALLBACK_CATALOG!');
      }
    }

    console.log('\n--- VERIFYING ALL PRODUCTS IN DB ---');
    const remaining = await Product.find({}).sort({ category: 1, name: 1 });
    console.log(`Total remaining products in DB: ${remaining.length}`);
    remaining.forEach(p => console.log(`  ✅ [${p.category}] "${p.name}" (${p.handle})`));

  } catch (err) {
    console.error('Error during purge:', err);
  } finally {
    process.exit(0);
  }
}

purge();
