const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function check() {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MONGO_URI...');
    await mongoose.connect(uri);
    
    const products = await Product.find({ $or: [{ name: /almond/i }, { handle: /almond/i }, { title: /almond/i }] });
    console.log('\n--- ALMOND PRODUCTS IN DB ---');
    products.forEach(p => {
      console.log('ID:', p._id);
      console.log('Handle:', p.handle);
      console.log('Name:', p.name);
      console.log('Image:', p.image);
      console.log('Images:', JSON.stringify(p.images));
      console.log('HoverImage:', p.hoverImage);
      console.log('---------------------------');
    });

    console.log('\n--- ALL PRODUCTS IN DB ---');
    const allProducts = await Product.find({});
    allProducts.forEach(p => {
      console.log(`[${p.handle}] "${p.name}" -> image: ${p.image}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
check();
