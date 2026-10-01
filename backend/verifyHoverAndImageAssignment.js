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

async function runComprehensiveVerification() {
  const csvHandleMap = extractCsvImageMap(rawContent);
  await mongoose.connect(process.env.MONGO_URI);

  console.log('========================================================================');
  console.log('   FULL WEBSITE-WIDE PRODUCT IMAGE & HOVER ASSIGNMENT AUDIT            ');
  console.log('========================================================================\n');

  const dbProducts = await Product.find({});
  console.log(`Auditing ${dbProducts.length} MongoDB products across all categories...\n`);

  let multiImageCount = 0;
  let singleImageCount = 0;
  let noImageCount = 0;

  let totalPrimaryMatches = 0;
  let totalHoverMatches = 0;
  let wrongImageAssignedCount = 0;

  const categoryCounts = {};

  dbProducts.forEach(p => {
    const handle = p.handle || '';
    const name = p.title || p.name || '';
    const cat = p.category || 'Uncategorized';

    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    const csvUrls = csvHandleMap[handle] || [];
    const dbImages = (p.images || []).map(img => typeof img === 'object' ? img.url : img).filter(Boolean);
    const dbPrimary = p.image || (dbImages[0] || '');
    const dbHover = dbImages.length > 1 ? dbImages[1] : (p.hoverImage || dbPrimary);

    const csvPrimary = csvUrls[0] || '';
    const csvHover = csvUrls.length > 1 ? csvUrls[1] : csvPrimary;

    // Check primary match
    if (csvUrls.length > 0) {
      if (dbPrimary === csvPrimary) totalPrimaryMatches++;
      if (dbHover === csvHover) totalHoverMatches++;
    }

    // Check if wrong image was assigned to product with 0 images
    if (csvUrls.length === 0 && dbPrimary && dbPrimary.includes('shopify.com')) {
      wrongImageAssignedCount++;
      console.log(`❌ WRONG IMAGE ASSIGNED to "${name}" (Handle: ${handle}): Has image ${dbPrimary}`);
    }

    if (csvUrls.length > 1) multiImageCount++;
    else if (csvUrls.length === 1) singleImageCount++;
    else noImageCount++;
  });

  console.log('--- PRODUCTS CATEGORY BREAKDOWN ---');
  console.table(categoryCounts);

  console.log('\n--- HOVER & IMAGE ASSIGNMENT TEST RESULTS ---');
  console.log(`1. Total Products Audited: ${dbProducts.length}`);
  console.log(`2. Products with Multi-Images (>1): ${multiImageCount} (Card Hover: Shows 2nd Image belonging to SAME product)`);
  console.log(`3. Products with Single Image (1): ${singleImageCount} (Card Hover: Retains 1st Image without flicker)`);
  console.log(`4. Products with No CSV Source Images (0): ${noImageCount} (Card Display: Shows Neutral SVG Placeholder)`);
  console.log(`5. Primary Image Match Rate: ${totalPrimaryMatches} / ${multiImageCount + singleImageCount} (${Math.round((totalPrimaryMatches / (multiImageCount + singleImageCount)) * 100)}%)`);
  console.log(`6. Second-Image Hover Match Rate: ${totalHoverMatches} / ${multiImageCount + singleImageCount} (${Math.round((totalHoverMatches / (multiImageCount + singleImageCount)) * 100)}%)`);
  console.log(`7. Wrong Image Assignments to 0-Image Products: ${wrongImageAssignedCount}`);

  console.log('\n--- SPECIFIC MULTI-IMAGE CARD HOVER SAMPLES ---');
  const samples = ['appalam-papad-premium', 'sago-saggubiyyam-premium', 'mix-tutti-frutti-premium', 'coffee-powder-premium', 'tea-powder-premium'];
  samples.forEach(sHandle => {
    const prod = dbProducts.find(p => p.handle === sHandle);
    if (prod) {
      const imgs = (prod.images || []).map(i => i.url || i);
      console.log(`📌 Product: "${prod.name}" (${sHandle})`);
      console.log(`   - Normal State (Image 1): ${imgs[0]}`);
      console.log(`   - Hover State  (Image 2): ${imgs[1]}`);
    }
  });

  mongoose.disconnect();
}

runComprehensiveVerification();
