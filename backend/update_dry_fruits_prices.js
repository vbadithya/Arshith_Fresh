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

const DRY_FRUITS_PRICE_DATA = [
  {
    name: 'Cashew',
    match: /cashew|kaju/i,
    orig250: 329,
    price250: 257,
    orig500: 658,
    price500: 513
  },
  {
    name: 'Almonds',
    match: /almond|badam/i,
    orig250: 285,
    price250: 222,
    orig500: 570,
    price500: 445
  },
  {
    name: 'Figs',
    match: /fig|anjeer/i,
    orig250: 475,
    price250: 371,
    orig500: 950,
    price500: 741
  },
  {
    name: 'Pistachio',
    match: /pistachio|pista/i,
    orig250: 394,
    price250: 307,
    orig500: 788,
    price500: 615
  },
  {
    name: 'Dates',
    match: /date|khajoor|kharjur/i,
    orig250: 256,
    price250: 200,
    orig500: 512,
    price500: 399
  },
  {
    name: 'Walnuts',
    match: /walnut|akhrot/i,
    orig250: 389,
    price250: 303,
    orig500: 778,
    price500: 607
  },
  {
    name: 'Raisins',
    match: /raisin|kishmish/i,
    orig250: 188,
    price250: 147,
    orig500: 376,
    price500: 293
  }
];

async function updateDryFruitPrices() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected!');

    const col = mongoose.connection.collection('products');
    const allProducts = await col.find({}).toArray();

    for (const item of DRY_FRUITS_PRICE_DATA) {
      const matched = allProducts.filter(p => {
        const str = `${p.handle || ''} ${p.slug || ''} ${p.id || ''} ${p.name || ''} ${p.title || ''}`.toLowerCase();
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

    console.log('✅ Finished updating dry fruit prices in MongoDB Atlas!');
  } catch (err) {
    console.error('Error updating dry fruit prices:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateDryFruitPrices();
