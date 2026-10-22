const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'utils', '.env') });
if (!process.env.MONGO_URI) {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Product = require('./models/Product');

async function updateDbOilImages() {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('Connected to MongoDB Atlas!');

    // 1. Update Sesame Oil: Exactly ONE 250ml bottle, ONE 500ml bottle, bottle back, lifestyle bowl
    const sesImages = [
      { url: '/assets/images/products/sesame_oil_250ml.jpg', alt: 'Sesame Oil 250ml' },
      { url: '/assets/images/products/sesame_oil_500ml.jpg', alt: 'Sesame Oil 500ml' },
      { url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533', alt: 'Sesame Oil Bottle Back' },
      { url: '/assets/images/products/sesame_oil_bowl.jpg', alt: 'Sesame Oil Lifestyle Bowl' }
    ];
    const sesUrls = sesImages.map(img => img.url);

    const sesRes = await Product.updateMany(
      { $or: [{ handle: 'sesame-oil-premium' }, { id: 'sesame-oil-premium' }, { slug: 'sesame-oil-premium' }] },
      {
        $set: {
          image: '/assets/images/products/sesame_oil_250ml.jpg',
          hoverImage: '/assets/images/products/sesame_oil_500ml.jpg',
          images: sesImages,
          imageUrls: sesUrls
        },
        $unset: {
          photos: 1
        }
      }
    );
    console.log(`Updated Sesame Oil: ${sesRes.modifiedCount} doc(s)`);

    // 2. Update Coconut Oil: Exactly ONE 250ml bottle, ONE 500ml bottle, infographic, lifestyle bowl
    const cocImages = [
      { url: '/assets/images/products/coconut_oil_250ml.jpg', alt: 'Coconut Oil 250ml' },
      { url: '/assets/images/products/coconut_oil_500ml.jpg', alt: 'Coconut Oil 500ml' },
      { url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533', alt: 'Coconut Oil Infographic' },
      { url: '/assets/images/products/coconut_oil_bowl.jpg', alt: 'Coconut Oil Lifestyle Bowl' }
    ];
    const cocUrls = cocImages.map(img => img.url);

    const cocRes = await Product.updateMany(
      { $or: [{ handle: 'coconut-oil-premium' }, { id: 'coconut-oil-premium' }, { slug: 'coconut-oil-premium' }] },
      {
        $set: {
          image: '/assets/images/products/coconut_oil_250ml.jpg',
          hoverImage: '/assets/images/products/coconut_oil_500ml.jpg',
          images: cocImages,
          imageUrls: cocUrls
        },
        $unset: {
          photos: 1
        }
      }
    );
    console.log(`Updated Coconut Oil: ${cocRes.modifiedCount} doc(s)`);

    console.log('✅ Finished updating DB oil images cleanly without duplicates!');
  } catch (err) {
    console.error('Error updating DB oil images:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateDbOilImages();
