const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const csvPath = path.join(__dirname, 'shopify_export.csv');
const rawContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV handling quoted multiline fields
function parseCSV(text) {
  const lines = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      cur += char;
    } else if (char === '\n' && !inQuotes) {
      lines.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  if (cur.trim()) lines.push(cur);
  return lines;
}

const lines = parseCSV(rawContent);
console.log(`Total CSV lines parsed: ${lines.length}`);

// Split line by commas respecting quotes
function splitCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      cur += c;
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim().replace(/^"|"$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim().replace(/^"|"$/g, ''));
  return result;
}

const headerCols = splitCSVLine(lines[0]);
console.log('CSV Header Columns:', headerCols.slice(0, 10));

const handleIdx = headerCols.indexOf('Handle');
const titleIdx = headerCols.indexOf('Title');
const imageSrcIdx = headerCols.indexOf('Image Src');

console.log(`Indices -> Handle: ${handleIdx}, Title: ${titleIdx}, Image Src: ${imageSrcIdx}`);

const productsMap = {};

for (let i = 1; i < lines.length; i++) {
  const cols = splitCSVLine(lines[i]);
  const handle = cols[handleIdx];
  const title = cols[titleIdx];
  const imageSrc = cols[imageSrcIdx];

  if (!handle) continue;

  if (!productsMap[handle]) {
    productsMap[handle] = {
      handle,
      title: title || '',
      images: []
    };
  }

  if (title && !productsMap[handle].title) {
    productsMap[handle].title = title;
  }

  if (imageSrc && imageSrc.startsWith('http')) {
    if (!productsMap[handle].images.includes(imageSrc)) {
      productsMap[handle].images.push(imageSrc);
    }
  }
}

console.log('\n--- Shopify CSV Product Image Summary ---');
const handles = Object.keys(productsMap);
console.log(`Total unique product handles in CSV: ${handles.length}`);

let multiImageCount = 0;
let noImageCount = 0;
const noImageProducts = [];

handles.forEach(h => {
  const p = productsMap[h];
  if (p.images.length > 1) {
    multiImageCount++;
    console.log(`📸 [${p.images.length} images] Handle: "${h}" | Title: "${p.title}"`);
    p.images.forEach((img, idx) => console.log(`   Img ${idx + 1}: ${img}`));
  } else if (p.images.length === 0) {
    noImageCount++;
    noImageProducts.push(p.title || h);
  }
});

console.log(`\nSummary: Total Handles: ${handles.length}, Multi-Image Products: ${multiImageCount}, No-Image Products: ${noImageCount}`);

// Now compare with MongoDB!
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const dbProducts = await Product.find({});
  console.log(`\n--- MongoDB Product Audit ---`);
  console.log(`Total products in MongoDB DB: ${dbProducts.length}`);

  let missingInDb = 0;
  handles.forEach(h => {
    const csvP = productsMap[h];
    // Find in DB by title or handle
    const dbP = dbProducts.find(p => p.handle === h || (p.title && csvP.title && p.title.toLowerCase() === csvP.title.toLowerCase()));
    if (!dbP) {
      missingInDb++;
      console.log(`❌ MISSING IN MONGOBD: Handle: "${h}" | Title: "${csvP.title}"`);
    } else {
      const dbImgCount = Array.isArray(dbP.images) ? dbP.images.length : (dbP.image ? 1 : 0);
      if (csvP.images.length !== dbImgCount) {
        console.log(`⚠️ IMAGE MISMATCH for "${dbP.title}" (Handle: ${h}): CSV has ${csvP.images.length} images, DB has ${dbImgCount} images.`);
      }
    }
  });

  console.log(`\nTotal Missing in MongoDB: ${missingInDb}`);
  mongoose.disconnect();
});
