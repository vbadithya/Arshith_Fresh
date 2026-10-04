const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Collection = require('./models/Collection');
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';

async function runPicklesCheck() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB!');

    // 1. Ensure Pickles collection exists
    let pickleCol = await Collection.findOne({ title: 'Pickles' });
    if (!pickleCol) {
      pickleCol = await Collection.create({
        title: 'Pickles',
        slug: 'pickles',
        description: 'Authentic homemade pickles prepared with natural spices and pure cold-pressed oil.',
        image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-20_at_12.12.10_PM_1_7e869e3d-6430-4313-8bcd-0f07e53ad1ed.jpg?v=1757333951',
        subcategories: ['Veg Pickles', 'Non-Veg Pickles', 'Traditional Pickles'],
        collectionType: 'automated',
        conditionsSummary: 'Category is Pickles'
      });
      console.log('✨ Created new "Pickles" category in Collection model!');
    } else {
      console.log('✅ "Pickles" category already exists in Collection model.');
    }

    // 2. Audit and update all products related to pickles
    const allProducts = await Product.find({});
    let updatedPickles = 0;
    let totalPickles = 0;

    for (const p of allProducts) {
      const nameLower = (p.name || '').toLowerCase();
      const handleLower = (p.handle || '').toLowerCase();

      const isPickle = nameLower.includes('pickle') || 
                       handleLower.includes('pickle') || 
                       nameLower.includes('bitter gourd');

      if (isPickle) {
        totalPickles++;
        if (p.category !== 'Pickles') {
          p.category = 'Pickles';
          await p.save();
          updatedPickles++;
          console.log(`📌 Reassigned product to "Pickles": "${p.name}"`);
        }
      }
    }

    // Update count in Collection model
    pickleCol.productsCount = totalPickles;
    await pickleCol.save();

    console.log(`\n🎉 PICKLES CATEGORY VERIFICATION & RE-ASSIGNMENT COMPLETE!`);
    console.log(`- Total Pickles Products under "Pickles" Category: ${totalPickles}`);
    console.log(`- Re-assigned Products: ${updatedPickles}`);

    process.exit(0);
  } catch (err) {
    console.error('Error in pickles check:', err);
    process.exit(1);
  }
}

runPicklesCheck();
