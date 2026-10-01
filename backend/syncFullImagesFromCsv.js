const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';

const Product = require('./models/Product');

function parseCompleteCsvImages(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');

  const handleImagesMap = {};
  let currentHandle = '';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split line cleanly using CSV regex
    const cols = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
    let handle = cols[0] ? cols[0].trim().replace(/^"|"$/g, '') : '';

    if (handle) {
      currentHandle = handle;
    } else {
      handle = currentHandle;
    }

    if (!handle) continue;

    if (!handleImagesMap[handle]) {
      handleImagesMap[handle] = [];
    }

    // Extract all shopify image URLs in this line
    const matches = line.match(/https:\/\/cdn\.shopify\.com\/s\/files\/[^"\,\s\)]+/g);
    if (matches) {
      matches.forEach(rawUrl => {
        const url = rawUrl.trim().replace(/^"|"$/g, '');
        if (url && !handleImagesMap[handle].includes(url)) {
          handleImagesMap[handle].push(url);
        }
      });
    }
  }

  return handleImagesMap;
}

async function runFullSync() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB!');

    const csvPath = path.join(__dirname, 'shopify_export.csv');
    const handleMap = parseCompleteCsvImages(csvPath);

    console.log(`Parsed ${Object.keys(handleMap).length} distinct product handles from CSV.`);

    let updatedCount = 0;
    let multiCount = 0;

    for (const [handle, urls] of Object.entries(handleMap)) {
      if (!urls || urls.length === 0) continue;

      // Find product in MongoDB
      const product = await Product.findOne({
        $or: [
          { handle: handle },
          { name: new RegExp('^' + handle.replace(/-/g, ' '), 'i') }
        ]
      });

      if (product) {
        // Construct full images array
        const imagesArr = urls.map(url => ({ url, alt: product.name }));
        product.images = imagesArr;
        product.image = urls[0]; // primary thumbnail

        await product.save();
        updatedCount++;
        if (urls.length > 1) {
          multiCount++;
          console.log(`📸 [${handle}] -> ${urls.length} images saved for "${product.name}"`);
        }
      }
    }

    console.log(`\n🎉 FULL IMAGE RE-CHECK & SYNC COMPLETE!`);
    console.log(`Total Products Updated: ${updatedCount}`);
    console.log(`Products with Multi-Images (>1): ${multiCount}`);

    process.exit(0);
  } catch (err) {
    console.error('Error in full sync:', err);
    process.exit(1);
  }
}

runFullSync();
