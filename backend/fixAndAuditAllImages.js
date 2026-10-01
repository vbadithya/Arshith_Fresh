const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const csvPath = path.join(__dirname, 'shopify_export.csv');
const rawContent = fs.readFileSync(csvPath, 'utf8');

function extractAllProductImageMap(csvText) {
  const lines = csvText.split('\n');
  const handleMap = {};
  let currentHandle = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Check if line starts with a handle (alphanumeric with hyphens before comma)
    const handleMatch = line.match(/^"?([a-z0-9\-]+)"?,/);
    if (handleMatch && handleMatch[1] && handleMatch[1] !== 'handle') {
      currentHandle = handleMatch[1];
    }

    if (!currentHandle) continue;

    if (!handleMap[currentHandle]) {
      handleMap[currentHandle] = [];
    }

    // Extract all shopify cdn URLs anywhere in line
    const urlMatches = line.match(/https:\/\/cdn\.shopify\.com\/s\/files\/[^\s",'\)\>]+/g);
    if (urlMatches) {
      urlMatches.forEach(rawUrl => {
        // Clean URL trailing quotes/commas
        const url = rawUrl.replace(/["',]+$/, '').trim();
        if (url && !handleMap[currentHandle].includes(url)) {
          handleMap[currentHandle].push(url);
        }
      });
    }
  }

  return handleMap;
}

async function runSync() {
  const handleMap = extractAllProductImageMap(rawContent);
  console.log(`Parsed ${Object.keys(handleMap).length} handles from CSV.`);

  await mongoose.connect(process.env.MONGO_URI);
  const dbProducts = await Product.find({});
  console.log(`Found ${dbProducts.length} products in MongoDB.\n`);

  let totalUpdated = 0;
  let multiImageUpdated = 0;

  for (const p of dbProducts) {
    const handle = p.handle || '';
    const urls = handleMap[handle] || [];

    if (urls.length > 0) {
      const formattedImages = urls.map((u, idx) => ({
        url: u,
        alt: `${p.title || p.name} image ${idx + 1}`
      }));

      p.images = formattedImages;
      p.image = urls[0]; // primary thumbnail
      p.hoverImage = urls.length > 1 ? urls[1] : urls[0];

      await p.save();
      totalUpdated++;
      if (urls.length > 1) {
        multiImageUpdated++;
        console.log(`📸 Saved ${urls.length} images for "${p.title || p.name}" (Handle: ${handle})`);
        urls.forEach((u, i) => console.log(`   Img ${i + 1}: ${u}`));
      }
    } else {
      console.log(`ℹ️ [No CSV images found] for "${p.title || p.name}" (Handle: ${handle})`);
    }
  }

  console.log(`\n✅ Database Image Sync Complete!`);
  console.log(`Total Products Updated: ${totalUpdated}`);
  console.log(`Products with >1 Image: ${multiImageUpdated}`);

  // Test specifically Appalam Papad
  const appalam = await Product.findOne({ handle: 'appalam-papad-premium' });
  console.log(`\n--- Appalam Papad Record in DB ---`);
  console.log(`Name: ${appalam ? appalam.name : 'NOT FOUND'}`);
  console.log(`Handle: ${appalam ? appalam.handle : 'N/A'}`);
  console.log(`Primary Image: ${appalam ? appalam.image : 'N/A'}`);
  console.log(`Images Array (${appalam ? appalam.images.length : 0}):`, appalam ? appalam.images : []);

  mongoose.disconnect();
}

runSync();
