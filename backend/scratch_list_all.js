const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch (e) {}

const mongoose = require('mongoose');
const Product = require('./models/Product');

async function listAll() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

    const prods = await Product.find({}).sort({ category: 1, name: 1 });
    console.log(`TOTAL PRODUCTS IN DB: ${prods.length}\n`);
    prods.forEach(p => {
      console.log(`ID: ${p._id} | Handle: "${p.handle}" | Name: "${p.name}" | Category: "${p.category}"`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

listAll();
