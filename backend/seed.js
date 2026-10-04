const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const Product = require('./models/Product');
const Collection = require('./models/Collection');
const User = require('./models/User');
const Review = require('./models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[i+1] === '\n') i++;
      row.push(current.trim());
      if (row.length > 1) lines.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (row.length > 1) lines.push(row);
  return lines;
}

function cleanTitle(title) {
  if (!title) return '';
  return title.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function determineCategory(title, type, tags) {
  const t = (title + ' ' + (type || '') + ' ' + (tags || '')).toLowerCase();
  
  if (t.includes('pickle') || t.includes('pachadi')) return 'Pickles';
  if (t.includes('oil') && !t.includes('spoil')) return 'Oils & Natural Extracts';
  if (t.includes('ghee') || t.includes('honey')) return 'Ghee & Honey';
  if (t.includes('podi') || t.includes('karam') || t.includes('powder') || t.includes('masala')) return 'Powders & Masalas';
  if (t.includes('clove') || t.includes('cardamom') || t.includes('elaichi') || t.includes('cinnamon') || t.includes('star anise') || t.includes('coriander') || t.includes('cumin') || t.includes('chilli') || t.includes('pepper') || t.includes('spice')) return 'Spices';
  if (t.includes('seed') || t.includes('khas khas') || t.includes('til')) return 'Seeds';
  if (t.includes('almond') || t.includes('badam') || t.includes('cashew') || t.includes('kaju') || t.includes('fig') || t.includes('anjeer') || t.includes('pistachio') || t.includes('walnut') || t.includes('raisin') || t.includes('kishmish') || t.includes('date') || t.includes('nut') || t.includes('berry')) return 'Dry Fruits & Nuts';
  if (t.includes('flour') || t.includes('dal') || t.includes('rava') || t.includes('rice') || t.includes('wheat') || t.includes('sugar') || t.includes('sago') || t.includes('papad') || t.includes('atukulu') || t.includes('grom') || t.includes('combo')) return 'Flours & Rava';
  
  return 'Cooking Essentials';
}

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB.');

    const csvPath = path.join(__dirname, 'shopify_export.csv');
    let itemsToInsert = [];

    if (fs.existsSync(csvPath)) {
      const csvContent = fs.readFileSync(csvPath, 'utf8');
      const rows = parseCSV(csvContent);
      const headers = rows[0];

      const handleIdx = headers.indexOf('Handle');
      const titleIdx = headers.indexOf('Title');
      const bodyIdx = headers.indexOf('Body (HTML)');
      const typeIdx = headers.indexOf('Type');
      const tagsIdx = headers.indexOf('Tags');
      const priceIdx = headers.indexOf('Variant Price');
      const comparePriceIdx = headers.indexOf('Variant Compare At Price');
      const imageIdx = headers.indexOf('Image Src');

      const productMap = {};
      let currentHandle = '';

      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        let handle = r[handleIdx];
        if (handle) currentHandle = handle;
        else handle = currentHandle;

        if (!handle) continue;

        const title = cleanTitle(r[titleIdx]);
        const body = r[bodyIdx] ? r[bodyIdx].replace(/<[^>]*>?/gm, '').trim() : '';
        const type = r[typeIdx];
        const tags = r[tagsIdx];
        const price = parseFloat(r[priceIdx]) || 99;
        const comparePrice = parseFloat(r[comparePriceIdx]) || Math.round(price * 1.25);
        const img = r[imageIdx];

        if (!productMap[handle]) {
          productMap[handle] = {
            handle: handle,
            title: title || handle,
            description: body || `Premium quality ${title || handle} sourced fresh from traditional farms.`,
            category: determineCategory(title || handle, type, tags),
            price: price,
            originalPrice: comparePrice > price ? comparePrice : Math.round(price * 1.25),
            images: []
          };
        } else {
          if (title && !productMap[handle].title) productMap[handle].title = title;
          if (body && (!productMap[handle].description || productMap[handle].description.length < body.length)) {
            productMap[handle].description = body;
          }
        }

        if (img && !productMap[handle].images.includes(img)) {
          productMap[handle].images.push(img);
        }
      }

      for (const h in productMap) {
        const p = productMap[h];
        const primaryImg = p.images.length > 0 ? p.images[0] : 'assets/images/placeholder.svg';
        const hoverImg = p.images.length > 1 ? p.images[1] : '';

        itemsToInsert.push({
          name: p.title,
          handle: p.handle,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice,
          unit: 'Pack',
          countInStock: 50,
          brand: 'Arshith Fresh',
          image: primaryImg,
          hoverImage: hoverImg,
          images: p.images.map(url => ({ url, alt: p.title })),
          description: p.description,
          rating: +(4.5 + Math.random() * 0.4).toFixed(2),
          numReviews: Math.floor(Math.random() * 40) + 20,
          isFeatured: p.images.length > 1 || Math.random() > 0.5
        });
      }
    }

    await Product.deleteMany({});
    const created = await Product.insertMany(itemsToInsert);
    console.log(`Successfully seeded ${created.length} products into MongoDB from Shopify CSV.`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();
