const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function updateGheeImages() {
  const uploadedPath = 'C:/Users/KRANTI/.gemini/antigravity-ide/brain/825c2531-0eff-4b78-80d4-3401ae54cf02/.user_uploaded/';
  const buffaloUpload = path.join(uploadedPath, 'media_1791018814042.jpg');
  const cowUpload = path.join(uploadedPath, 'media_1791018832595.png');

  // Convert and optimize to target jpg
  const buffaloBuf = await sharp(buffaloUpload).jpeg({ quality: 98 }).toBuffer();
  const cowBuf = await sharp(cowUpload).jpeg({ quality: 98 }).toBuffer();

  const targetDirs = [
    'c:/Users/KRANTI/Downloads/Arshith_Fresh-main (2)/Arshith_Fresh-main/assets/images/products',
    'c:/Users/KRANTI/Downloads/Arshith_Fresh-main (2)/Arshith_Fresh-main/frontend/assets/images/products',
  ];

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'buffalo_ghee_front.jpg'), buffaloBuf);
    fs.writeFileSync(path.join(dir, 'cow_ghee_front.jpg'), cowBuf);
    console.log(`Saved buffalo_ghee_front.jpg & cow_ghee_front.jpg to ${dir}`);
  }

  // Connect to MongoDB and ensure products have front and back images set correctly
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const buffalo = await Product.findOne({ slug: 'pure-buffalo-ghee-premium' });
    if (buffalo) {
      buffalo.images = [
        'assets/images/products/buffalo_ghee_front.jpg',
        'assets/images/products/buffalo_ghee_back.jpg'
      ];
      await buffalo.save();
      console.log('Updated Buffalo Ghee in MongoDB:', buffalo.images);
    }

    const cow = await Product.findOne({ slug: 'pure-cow-ghee-premium' });
    if (cow) {
      cow.images = [
        'assets/images/products/cow_ghee_front.jpg',
        'assets/images/products/cow_ghee_back.jpg'
      ];
      await cow.save();
      console.log('Updated Cow Ghee in MongoDB:', cow.images);
    }

    const honey = await Product.findOne({ slug: 'natural-honey-premium' });
    if (honey) {
      honey.images = [
        'assets/images/products/natural_honey_front.jpg',
        'assets/images/products/natural_honey_back.jpg'
      ];
      await honey.save();
      console.log('Updated Honey in MongoDB:', honey.images);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('MongoDB update error:', err);
  }

  console.log('All Ghee product images updated successfully!');
}

updateGheeImages().catch(console.error);
