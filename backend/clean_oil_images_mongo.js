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

async function cleanOilImagesDirect() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected!');

    const col = mongoose.connection.collection('products');

    const sesImages = [
      { url: '/assets/images/products/sesame_oil_250ml.jpg', alt: 'Sesame Oil 250ml' },
      { url: '/assets/images/products/sesame_oil_500ml.jpg', alt: 'Sesame Oil 500ml' },
      { url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533', alt: 'Sesame Oil Bottle Back' },
      { url: '/assets/images/products/sesame_oil_bowl.jpg', alt: 'Sesame Oil Lifestyle Bowl' }
    ];

    const r1 = await col.updateMany(
      { $or: [{ handle: 'sesame-oil-premium' }, { id: 'sesame-oil-premium' }, { slug: 'sesame-oil-premium' }] },
      {
        $set: {
          image: '/assets/images/products/sesame_oil_250ml.jpg',
          hoverImage: '/assets/images/products/sesame_oil_500ml.jpg',
          images: sesImages,
          imageUrls: sesImages.map(x => x.url)
        },
        $unset: { photos: 1 }
      }
    );
    console.log('Sesame update count:', r1.modifiedCount);

    const cocImages = [
      { url: '/assets/images/products/coconut_oil_250ml.jpg', alt: 'Coconut Oil 250ml' },
      { url: '/assets/images/products/coconut_oil_500ml.jpg', alt: 'Coconut Oil 500ml' },
      { url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533', alt: 'Coconut Oil Infographic' },
      { url: '/assets/images/products/coconut_oil_bowl.jpg', alt: 'Coconut Oil Lifestyle Bowl' }
    ];

    const r2 = await col.updateMany(
      { $or: [{ handle: 'coconut-oil-premium' }, { id: 'coconut-oil-premium' }, { slug: 'coconut-oil-premium' }] },
      {
        $set: {
          image: '/assets/images/products/coconut_oil_250ml.jpg',
          hoverImage: '/assets/images/products/coconut_oil_500ml.jpg',
          images: cocImages,
          imageUrls: cocImages.map(x => x.url)
        },
        $unset: { photos: 1 }
      }
    );
    console.log('Coconut update count:', r2.modifiedCount);

    console.log('Finished updating MongoDB directly!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

cleanOilImagesDirect();
