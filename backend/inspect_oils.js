const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch (e) {}
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const Product = require('./models/Product');

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({
        $or: [
            { category: 'Oils' },
            { name: { $regex: /oil/i } }
        ]
    });
    console.log(JSON.stringify(products.map(p => ({
        id: p._id,
        slug: p.slug,
        handle: p.handle,
        name: p.name || p.title,
        price: p.price,
        originalPrice: p.originalPrice,
        unit: p.unit,
        category: p.category
    })), null, 2));
    await mongoose.disconnect();
}
check().catch(console.error);
