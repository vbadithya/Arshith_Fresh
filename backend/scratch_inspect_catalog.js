const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const Collection = require('./models/Collection');

async function checkCols() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

    console.log('\n--- ALL COLLECTIONS ---');
    const cols = await Collection.find({}).sort({ sortOrder: 1, createdAt: 1 });
    cols.forEach(c => {
      console.log(`[${c.sortOrder}] Name: "${c.name}" | Title: "${c.title}" | Slug: "${c.slug}"`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkCols();
