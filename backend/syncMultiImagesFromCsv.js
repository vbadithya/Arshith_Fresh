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

// Simple CSV parser for Shopify export
function parseShopifyCsv(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  if (lines.length === 0) return {};

  const handleImagesMap = {};

  let currentHandle = '';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Extract handle and image src using regex / comma splitting
    // Shopify CSV columns: col 0 is Handle, col 32 is Image Src (or we search for https://cdn.shopify.com...)
    const cols = line.split(',');
    let handle = cols[0] ? cols[0].trim().replace(/^"|"$/g, '') : '';
    
    if (handle) {
      currentHandle = handle;
    } else {
      handle = currentHandle; // row inherits handle from top row of variant group
    }

    if (!handle) continue;

    // Search line for any shopify CDN image URL
    const imgMatches = line.match(/https:\/\/cdn\.shopify\.com\/s\/files\/[^"\,\s\)]+/g);
    if (imgMatches && imgMatches.length > 0) {
      if (!handleImagesMap[handle]) {
        handleImagesMap[handle] = [];
      }
      imgMatches.forEach(url => {
        const cleanUrl = url.trim().replace(/^"|"$/g, '');
        if (cleanUrl && !handleImagesMap[handle].includes(cleanUrl)) {
          handleImagesMap[handle].push(cleanUrl);
        }
      });
    }
  }

  return handleImagesMap;
}

async function syncImages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB!');

    const csvPath = path.join(__dirname, 'shopify_export.csv');
    const handleImagesMap = parseShopifyCsv(csvPath);

    console.log(`Parsed ${Object.keys(handleImagesMap).length} handles with image URLs from CSV.`);

    let updatedCount = 0;
    let multiImageCount = 0;

    for (const [handle, urls] of Object.entries(handleImagesMap)) {
      if (urls.length === 0) continue;

      if (urls.length > 1) {
        multiImageCount++;
      }

      // Find product in DB by handle or matching name
      const product = await Product.findOne({
        $or: [
          { handle: handle },
          { name: new RegExp('^' + handle.replace(/-/g, ' '), 'i') }
        ]
      });

      if (product) {
        // Construct images array
        const imagesObjArray = urls.map(url => ({ url, alt: product.name || '' }));
        product.images = imagesObjArray;
        product.image = urls[0]; // set primary image to first valid URL

        await product.save();
        updatedCount++;
        console.log(`✅ Synced ${urls.length} images for product [${product.handle || handle}]: ${product.name}`);
      }
    }

    console.log(`\n🎉 CSV IMAGE SYNC COMPLETED SUCCESSFULLY!`);
    console.log(`- Total products updated in DB: ${updatedCount}`);
    console.log(`- Products with multiple images (>1): ${multiImageCount}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Sync error:', err);
    process.exit(1);
  }
}

syncImages();
