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

async function runValidation() {
  const csvHandleMap = extractCsvImageMap(rawContent);
  await mongoose.connect(process.env.MONGO_URI);

  console.log('===========================================================');
  console.log('   MANDATORY PRODUCT IMAGE DATA FLOW VALIDATION REPORT     ');
  console.log('===========================================================\n');

  const dbProducts = await Product.find({});
  console.log(`Total Products in Database: ${dbProducts.length}`);
  console.log(`Total Unique Handles in CSV Export: ${Object.keys(csvHandleMap).length}\n`);

  let appalamTestPassed = false;
  let totalMatchCount = 0;
  let multiImageTestedCount = 0;
  let singleImageTestedCount = 0;
  let noImageTestedCount = 0;

  const sampleReportTable = [];

  for (const p of dbProducts) {
    const handle = p.handle || '';
    const name = p.title || p.name || '';
    const csvUrls = csvHandleMap[handle] || [];
    const dbImages = p.images || [];
    const dbImgUrls = dbImages.map(img => img.url || img).filter(Boolean);

    const isMatch = csvUrls.length === dbImgUrls.length;
    if (isMatch) totalMatchCount++;

    if (csvUrls.length > 1) multiImageTestedCount++;
    else if (csvUrls.length === 1) singleImageTestedCount++;
    else noImageTestedCount++;

    if (handle === 'appalam-papad-premium') {
      console.log('📌 -----------------------------------------------------------');
      console.log('📌 SPECIFIC TEST: Appalam Papad (Apadalu) (Premium Quality)');
      console.log('📌 -----------------------------------------------------------');
      console.log(`   Product Title: "${name}"`);
      console.log(`   Handle: "${handle}"`);
      console.log(`   Source CSV Image Count: ${csvUrls.length}`);
      console.log(`   Database Image Count: ${dbImages.length}`);
      console.log(`   Primary Image URL: ${p.image}`);
      console.log('   Image Gallery Array:');
      dbImages.forEach((img, idx) => console.log(`      Image ${idx + 1}: ${img.url}`));
      
      appalamTestPassed = csvUrls.length === 2 && dbImages.length === 2 && dbImages[0].url === csvUrls[0] && dbImages[1].url === csvUrls[1];
      console.log(`   Result: ${appalamTestPassed ? '✅ PASSED PERFECTLY' : '❌ FAILED'}\n`);
    }

    if (sampleReportTable.length < 15 || csvUrls.length > 1) {
      sampleReportTable.push({
        productName: name,
        handle: handle,
        sourceCsvCount: csvUrls.length,
        dbImageCount: dbImages.length,
        status: isMatch ? '✅ MATCH' : '❌ MISMATCH'
      });
    }
  }

  console.log('--- AUDIT OF TESTED PRODUCTS ---');
  console.table(sampleReportTable.slice(0, 20));

  console.log('\n--- FINAL SUMMARY OF VALIDATION ---');
  console.log(`1. Appalam Papad Validation: ${appalamTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`2. Total Products Audited: ${dbProducts.length}`);
  console.log(`3. Multi-Image Products (>1): ${multiImageTestedCount}`);
  console.log(`4. Single-Image Products (1): ${singleImageTestedCount}`);
  console.log(`5. Products with No CSV Images (0): ${noImageTestedCount}`);
  console.log(`6. Image Mismatches: ${dbProducts.length - totalMatchCount}`);

  mongoose.disconnect();
}

runValidation();
