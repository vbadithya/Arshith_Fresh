const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch(e) {}
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function updateCastor() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  const filter = {
    $or: [
      { handle: 'castor-oil-premium' },
      { name: /castor/i },
      { slug: 'castor-oil-premium' }
    ]
  };

  const update = {
    $set: {
      image: '/assets/images/products/castor_oil_250ml.png',
      hoverImage: '/assets/images/products/castor_oil_250ml.png',
      images: [
        {
          url: '/assets/images/products/castor_oil_250ml.png',
          alt: 'Castor Oil (Premium Quality) 250ml'
        }
      ],
      imageUrls: [
        '/assets/images/products/castor_oil_250ml.png'
      ],
      unit: '250 ml'
    }
  };

  const res = await Product.updateMany(filter, update);
  console.log('Update result:', res);

  const updatedDocs = await Product.find(filter);
  for (const doc of updatedDocs) {
    console.log('Doc:', {
      _id: doc._id,
      name: doc.name,
      unit: doc.unit,
      image: doc.image,
      hoverImage: doc.hoverImage,
      images: doc.images,
      imageUrls: doc.imageUrls
    });
  }

  await mongoose.disconnect();
  console.log('Disconnected');
}

updateCastor().catch(err => {
  console.error('Error updating castor:', err);
  process.exit(1);
});
