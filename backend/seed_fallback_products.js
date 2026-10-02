
const mongoose = require('mongoose');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch(e) {}
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const Product = require('./models/Product');
const Review = require('./models/Review');
const { generateOilReviews, getProductTargetCount } = require('./oilReviewsGenerator');

const primaryUri = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';

const FALLBACK_ITEMS = [
  { id: 'groundnut-oil-premium', handle: 'groundnut-oil-premium', slug: 'groundnut-oil-premium', name: 'Groundnut Oil (Premium Quality)', category: 'Oils', price: 349, originalPrice: 471, rating: 4.9, numReviews: 90, countInStock: 50, isFeatured: true, description: '100% Cold-Pressed Wooden Chekku Groundnut Oil.', image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533', hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.42_PM_1_3752719d-4e83-4d00-a8be-0c4d13076c23.jpg?v=1757334051&width=533', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533', 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.42_PM_1_3752719d-4e83-4d00-a8be-0c4d13076c23.jpg?v=1757334051&width=533'] },
  { id: 'sunflower-oil-premium', handle: 'sunflower-oil-premium', slug: 'sunflower-oil-premium', name: 'Sunflower Oil (Premium Quality)', category: 'Oils', price: 499, originalPrice: 608, rating: 4.8, numReviews: 80, countInStock: 45, isFeatured: true, description: 'Pure unrefined wooden-pressed sunflower oil.', image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533', hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-28_at_4.14.16_PM_1_ee159cd3-c09a-443d-a28c-6c4b116ce904.jpg?v=1757334052&width=533', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533', 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-28_at_4.14.16_PM_1_ee159cd3-c09a-443d-a28c-6c4b116ce904.jpg?v=1757334052&width=533'] },
  { id: 'sesame-oil-premium', handle: 'sesame-oil-premium', slug: 'sesame-oil-premium', name: 'Sesame Oil (Premium Quality)', category: 'Oils', price: 148, originalPrice: 185, rating: 4.8, numReviews: 75, countInStock: 40, isFeatured: true, description: 'Traditional wooden pressed gingelly sesame oil.', image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533', hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533', 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533'] },
  { id: 'castor-oil-premium', handle: 'castor-oil-premium', slug: 'castor-oil-premium', name: 'Castor Oil (Premium Quality)', category: 'Oils', price: 95, originalPrice: 118, rating: 4.9, numReviews: 85, countInStock: 30, isFeatured: true, description: '100% Pure & Organic Cold Pressed Castor Oil.', image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533', hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533', 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533'] },
  { id: 'neem-oil-premium', handle: 'neem-oil-premium', slug: 'neem-oil-premium', name: 'Neem Oil (Premium Quality)', category: 'Oils', price: 149, originalPrice: 199, rating: 4.9, numReviews: 78, countInStock: 30, isFeatured: true, description: 'Pure unrefined cold-pressed neem oil.', image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533', hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533', 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533'] },
  { id: 'almond-oil-premium', handle: 'almond-oil-premium', slug: 'almond-oil-premium', name: 'Almond Oil (Premium Quality)', category: 'Oils', price: 249, originalPrice: 320, rating: 4.9, numReviews: 88, countInStock: 25, isFeatured: true, description: '100% Pure cold-pressed sweet almond oil.', image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533', hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533', 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533'] },
  { id: 'pure-buffalo-ghee-premium', handle: 'pure-buffalo-ghee-premium', slug: 'pure-buffalo-ghee-premium', name: 'Pure Buffalo Ghee (Premium Quality)', category: 'Ghee and Honey', price: 222, originalPrice: 288, rating: 4.9, numReviews: 82, countInStock: 40, isFeatured: true, description: 'Rich traditional A2 buffalo ghee made using Vedic bilona method.', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_4.34.52_PM.jpg?v=1757934372&width=533'] },
  { id: 'cashew-nuts-premium', handle: 'cashew-nuts-premium', slug: 'cashew-nuts-premium', name: 'Cashew Nuts (Kaju) (Premium Quality)', category: 'Dry Fruits', price: 265, originalPrice: 340, rating: 4.8, numReviews: 78, countInStock: 25, description: 'Whole crispy premium cashew nuts rich in antioxidants.', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b703-43bd-ae6f-6bb812afa6ba.jpg?v=1757334003&width=533'] },
  { id: 'almonds-premium', handle: 'almonds-premium', slug: 'almonds-premium', name: 'Almonds (Badam) (Premium Quality)', category: 'Dry Fruits', price: 299, originalPrice: 380, rating: 4.8, numReviews: 85, countInStock: 30, description: 'Premium California almonds, whole and crispy.', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_2_717030b8-c8a8-40a4-bdf0-7e516dec3029.jpg?v=1757334045&width=533'] },
  { id: 'raisins-premium', handle: 'raisins-premium', slug: 'raisins-premium', name: 'Raisins (Kishmish) (Premium Quality)', category: 'Dry Fruits', price: 149, originalPrice: 185, rating: 4.8, numReviews: 74, countInStock: 35, description: 'Plump golden raisins, naturally sweet.', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_717030b8.jpg?v=1757334045&width=533'] },
  { id: 'dates-premium', handle: 'dates-premium', slug: 'dates-premium', name: 'Dates (Khajoor) (Premium Quality)', category: 'Dry Fruits', price: 199, originalPrice: 250, rating: 4.8, numReviews: 71, countInStock: 25, description: 'Juicy, soft and naturally sweet premium dates.', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_717030b8.jpg?v=1757334045&width=533'] },
  { id: 'black-pepper-premium', handle: 'black-pepper-premium', slug: 'black-pepper-premium', name: 'Black Pepper (Whole) (Premium Quality)', category: 'Spices', price: 249, originalPrice: 310, rating: 4.9, numReviews: 69, countInStock: 20, description: 'Bold whole black peppercorns, farm fresh.', images: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533'] }
];

mongoose.connect(primaryUri).then(async () => {
  console.log('Connected to MongoDB Atlas!');
  let addedCount = 0;

  for (const item of FALLBACK_ITEMS) {
    const exists = await Product.findOne({ handle: item.handle });
    if (!exists) {
      // Convert string images to schema-compatible {url, alt} objects
      const docToInsert = Object.assign({}, item, {
        images: (item.images || []).map(img =>
          typeof img === 'string' ? { url: img, alt: item.name } : img
        )
      });
      await Product.create(docToInsert);
      console.log('INSERTED: ' + item.name);
      addedCount++;
    } else {
      console.log('EXISTS: ' + item.name);
    }
  }
  console.log('Added ' + addedCount + ' fallback products to MongoDB.');

  // Seed reviews for all newly inserted products
  const handles = FALLBACK_ITEMS.map(f => f.handle);
  const items = await Product.find({ handle: { $in: handles } });

  for (const p of items) {
    const revCount = await Review.countDocuments({ productId: p._id });
    const targetCount = getProductTargetCount(p.name);
    if (revCount === 0) {
      const generated = generateOilReviews(p.name, p._id, targetCount);
      await Review.insertMany(generated);
      p.numReviews = generated.length;
      const totalScore = generated.reduce((sum, r) => sum + r.rating, 0);
      p.rating = Math.round((totalScore / generated.length) * 10) / 10;
      await p.save();
      console.log('SEEDED ' + generated.length + ' reviews for: ' + p.name + ' (avg: ' + p.rating + ')');
    } else {
      console.log('Already has ' + revCount + ' reviews: ' + p.name);
    }
  }

  console.log('ALL DONE!');
  mongoose.disconnect();
}).catch(err => console.error('Error:', err.message));
