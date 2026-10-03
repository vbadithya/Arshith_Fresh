const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Product = require('./models/Product');

const FRONT_ALMOND_IMAGE = 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/9_4034b7a6-21de-420a-888c-cdfee56cece7.png?v=1757333952';
const BACK_ALMOND_IMAGE = 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_9.47.07_AM_2_58a584d5-4afa-4663-9d5a-e74e8795f267.jpg?v=1757333952';

const OIL_FRONT = 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533';
const OIL_BACK = 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533';

async function fixAlmonds() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

    // 1. Fix Almond Dry Fruits (Almonds / Badam)
    await Product.updateMany(
      { 
        $or: [{ handle: 'almonds-premium' }, { handle: 'almonds-medium' }, { name: /^Almonds \(Badam\)/i }]
      },
      {
        $set: {
          image: FRONT_ALMOND_IMAGE,
          hoverImage: BACK_ALMOND_IMAGE,
          images: [
            { url: FRONT_ALMOND_IMAGE, alt: 'Almonds (Badam) Front' },
            { url: BACK_ALMOND_IMAGE, alt: 'Almonds (Badam) Back' }
          ],
          imageUrls: [FRONT_ALMOND_IMAGE, BACK_ALMOND_IMAGE]
        }
      }
    );

    // 2. Ensure Almond Oil retains oil bottle images
    await Product.updateMany(
      { handle: 'almond-oil-premium' },
      {
        $set: {
          image: OIL_FRONT,
          hoverImage: OIL_BACK,
          images: [
            { url: OIL_FRONT, alt: 'Almond Oil Front' },
            { url: OIL_BACK, alt: 'Almond Oil Back' }
          ],
          imageUrls: [OIL_FRONT, OIL_BACK]
        }
      }
    );

    console.log('✅ Updated Almond Dry Fruit and Almond Oil images in MongoDB Atlas!');

    const updated = await Product.find({ $or: [{ name: /almond/i }, { handle: /almond/i }] });
    updated.forEach(p => {
      console.log(`[VERIFIED] Name: "${p.name}" | Handle: "${p.handle}"`);
      console.log('  Image:', p.image);
      console.log('  HoverImage:', p.hoverImage);
    });

  } catch (err) {
    console.error('Error fixing almonds in DB:', err);
  } finally {
    process.exit(0);
  }
}

fixAlmonds();
