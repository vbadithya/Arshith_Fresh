const path = require('path');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

require('dotenv').config({ path: path.join(__dirname, 'utils', '.env') });
if (!process.env.MONGO_URI) {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

const mongoose = require('mongoose');

const DRY_SEEDS_PRICE_DATA = [
  {
    name: 'Flax Seeds',
    match: /flax/i,
    orig250: 149,
    price250: 116,
    orig500: 298,
    price500: 232
  },
  {
    name: 'Chia Seeds',
    match: /chia/i,
    orig250: 189,
    price250: 147,
    orig500: 378,
    price500: 295
  },
  {
    name: 'Pumpkin Seeds',
    match: /pumpkin/i,
    orig250: 224,
    price250: 175,
    orig500: 448,
    price500: 349
  },
  {
    name: 'Sunflower Seeds',
    match: /sunflower\s*seed/i,
    orig250: 195,
    price250: 152,
    orig500: 390,
    price500: 304
  },
  {
    name: 'Watermelon Seeds',
    match: /watermelon/i,
    orig250: 225,
    price250: 176,
    orig500: 450,
    price500: 351
  },
  {
    name: 'Sabja Seeds',
    match: /sabja|basil\s*seed/i,
    orig250: 189,
    price250: 147,
    orig500: 378,
    price500: 295
  },
  {
    name: 'Sesame Seeds',
    match: /sesame\s*seed|til\b/i,
    orig250: 179,
    price250: 140,
    orig500: 358,
    price500: 279
  }
];

async function updateDrySeedPrices() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected!');

    const col = mongoose.connection.collection('products');
    const allProducts = await col.find({}).toArray();

    for (const item of DRY_SEEDS_PRICE_DATA) {
      const matched = allProducts.filter(p => {
        const str = `${p.handle || ''} ${p.slug || ''} ${p.id || ''} ${p.name || ''} ${p.title || ''}`.toLowerCase();
        if (str.includes('oil')) return false;
        return item.match.test(str);
      });

      console.log(`Matching docs for ${item.name}: ${matched.length}`);
      for (const doc of matched) {
        await col.updateOne(
          { _id: doc._id },
          {
            $set: {
              originalPrice: item.orig250,
              price: item.price250,
              unit: '250 g'
            }
          }
        );
        console.log(`  Updated ${doc.name} (${doc.handle || doc.id}) -> 250g: orig ${item.orig250}, price ${item.price250}`);
      }
    }

    console.log('✅ Finished updating dry seeds prices in MongoDB Atlas!');
  } catch (err) {
    console.error('Error updating dry seed prices:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateDrySeedPrices();
