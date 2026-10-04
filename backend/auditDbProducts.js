const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Parse CSV robustly
const csvPath = path.join(__dirname, 'shopify_export.csv');
const fileContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV lines handling quoted multiline text
function parseCSV(text) {
  const lines = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') inQuotes = !inQuotes;
    if (c === '\n' && !inQuotes) {
      lines.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  if (cur.trim()) lines.push(cur);
  return lines;
}

const lines = parseCSV(fileContent);

function splitCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQuotes = !inQuotes; cur += c; }
    else if (c === ',' && !inQuotes) { result.push(cur.trim().replace(/^"|"$/g, '')); cur = ''; }
    else { cur += c; }
  }
  result.push(cur.trim().replace(/^"|"$/g, ''));
  return result;
}

const headerCols = splitCSVLine(lines[0]);
const handleIdx = headerCols.indexOf('Handle');
const titleIdx = headerCols.indexOf('Title');
const imageSrcIdx = headerCols.indexOf('Image Src');

const csvProducts = {};

for (let i = 1; i < lines.length; i++) {
  const cols = splitCSVLine(lines[i]);
  const handle = cols[handleIdx];
  const title = cols[titleIdx];
  const imageSrc = cols[imageSrcIdx];

  if (!handle) continue;

  if (!csvProducts[handle]) {
    csvProducts[handle] = {
      handle,
      title: title || '',
      images: []
    };
  }

  if (title && !csvProducts[handle].title) {
    csvProducts[handle].title = title;
  }

  if (imageSrc && imageSrc.startsWith('http')) {
    if (!csvProducts[handle].images.includes(imageSrc)) {
      csvProducts[handle].images.push(imageSrc);
    }
  }
}

async function runAudit() {
  await mongoose.connect(process.env.MONGO_URI);
  const dbProducts = await Product.find({});
  console.log(`Total DB Products: ${dbProducts.length}`);
  console.log(`Total CSV Handles: ${Object.keys(csvProducts).length}\n`);

  let count = 0;
  dbProducts.forEach(p => {
    const handle = p.handle || '';
    const name = p.title || p.name || '';
    const imagesCount = Array.isArray(p.images) ? p.images.length : (p.image ? 1 : 0);
    const csvMatch = csvProducts[handle] || Object.values(csvProducts).find(c => c.title.toLowerCase() === name.toLowerCase());

    count++;
    console.log(`${count}. ID: ${p._id} | Handle: "${handle}" | Title: "${name}" | DB Images: ${imagesCount} | CSV Images: ${csvMatch ? csvMatch.images.length : 0}`);
    if (csvMatch && csvMatch.images.length !== imagesCount) {
      console.log(`   ⚠️ MISMATCH! CSV Images:`);
      csvMatch.images.forEach(img => console.log(`      - ${img}`));
      console.log(`   DB Images in record:`);
      (p.images || []).forEach(img => console.log(`      - ${img.url || img}`));
    }
  });

  mongoose.disconnect();
}

runAudit();
