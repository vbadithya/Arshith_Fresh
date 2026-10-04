const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

// Parse CSV robustly
const csvPath = path.join(__dirname, 'shopify_export.csv');
const rawContent = fs.readFileSync(csvPath, 'utf8');

function extractCsvImageMap(csvText) {
  const lines = csvText.split('\n');
  const handleMap = {};
  let currentHandle = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const handleMatch = line.match(/^"?([a-z0-9\-]+)"?,/);
    if (handleMatch && handleMatch[1] && handleMatch[1] !== 'handle') {
      currentHandle = handleMatch[1];
    }

    if (!currentHandle) continue;

    if (!handleMap[currentHandle]) {
      handleMap[currentHandle] = [];
    }

    const urlMatches = line.match(/https:\/\/cdn\.shopify\.com\/s\/files\/[^\s",'\)\>]+/g);
    if (urlMatches) {
      urlMatches.forEach(rawUrl => {
        const url = rawUrl.replace(/["',]+$/, '').trim();
        if (url && !handleMap[currentHandle].includes(url)) {
          handleMap[currentHandle].push(url);
        }
      });
    }
  }

  return handleMap;
}

async function runCleanup() {
  const csvHandleMap = extractCsvImageMap(rawContent);
  await mongoose.connect(process.env.MONGO_URI);

  const dbProducts = await Product.find({});
  console.log(`Cleaning up handles & image fallbacks for ${dbProducts.length} MongoDB products...`);

  let updatedHandles = 0;
  let clearedImages = 0;

  for (const p of dbProducts) {
    const name = p.name || p.title || '';
    if (!p.handle) {
      p.handle = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      updatedHandles++;
    }

    const csvUrls = csvHandleMap[p.handle] || [];
    if (csvUrls.length === 0) {
      // Product has NO source image in CSV export. Clear any legacy default/shared images
      p.image = '';
      p.images = [];
      p.hoverImage = '';
      clearedImages++;
    }
    await p.save();
  }

  console.log(`✅ Handles Assigned to Products: ${updatedHandles}`);
  console.log(`✅ Cleared Legacy Default Images for 0-Image Products: ${clearedImages}`);

  mongoose.disconnect();
}

runCleanup();
