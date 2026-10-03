const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('./node_modules/mongoose');

const BADAM_FRONT_IMAGE = 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533';
const BADAM_HOVER_IMAGE = 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.36_AM_e4a9990f-ccf1-4aa3-a944-45faa606db78.jpg?v=1757334003&width=533';

async function cleanCatalog() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

        // 1. Remove Sugar Sulphur Free
        const delSugar = await Product.deleteMany({
            $or: [
                { handle: 'sugar-sulphur-free-premium' },
                { name: /sugar sulphur free/i },
                { title: /sugar sulphur free/i }
            ]
        });
        console.log('Deleted Sugar Sulphur Free products:', delSugar.deletedCount);

        // 2. Remove duplicate Badam (almonds-medium)
        const delMediumAlmonds = await Product.deleteMany({
            $or: [
                { handle: 'almonds-medium' },
                { name: /almonds medium/i }
            ]
        });
        console.log('Deleted Almonds Medium products:', delMediumAlmonds.deletedCount);

        // 3. Update single Badam (almonds-premium) with authentic Arshith pouch image
        const updateBadam = await Product.updateMany(
            {
                $or: [
                    { handle: 'almonds-premium' },
                    { name: /^Almonds \(Badam\)/i }
                ]
            },
            {
                $set: {
                    name: 'Almonds (Badam) (Premium Quality)',
                    title: 'Almonds (Badam) (Premium Quality)',
                    category: 'Dry Fruits',
                    image: BADAM_FRONT_IMAGE,
                    hoverImage: BADAM_HOVER_IMAGE,
                    images: [
                        { url: BADAM_FRONT_IMAGE, alt: 'Almonds (Badam) Front' },
                        { url: BADAM_HOVER_IMAGE, alt: 'Almonds (Badam) Back' }
                    ],
                    imageUrls: [BADAM_FRONT_IMAGE, BADAM_HOVER_IMAGE]
                }
            }
        );
        console.log('Updated Badam images in MongoDB:', updateBadam.modifiedCount);

        // 4. Remove Ground Nuts Raw from DB/Dry fruits
        const delGroundnuts = await Product.deleteMany({
            $or: [
                { handle: 'ground-nutsraw-premium' },
                { handle: 'ground-nuts-raw-premium' },
                { name: /ground nuts.*raw/i }
            ]
        });
        console.log('Deleted Ground Nuts Raw from DB:', delGroundnuts.deletedCount);

        // 5. Delete other duplicate / unused products
        const delDupes = await Product.deleteMany({
            $or: [
                { handle: 'cashew-nuts-medium' },
                { handle: 'chilli-powder-premium-copy' },
                { handle: 'chilli-powder-softgrindingpremium' },
                { handle: 'milk-powder-premium' },
                { handle: 'tea-powder-premium' },
                { handle: 'dried-prawns-spicy-powder-premium' }
            ]
        });
        console.log('Deleted extra duplicate/unused products:', delDupes.deletedCount);

        const allProds = await Product.find({}, { name: 1, handle: 1, category: 1, image: 1 });
        console.log('\n--- Remaining Active Products in DB (' + allProds.length + ') ---');
        allProds.forEach(p => console.log(`• ${p.handle} | ${p.name} | [${p.category}] | ${p.image ? p.image.substring(0, 60) + '...' : 'no-img'}`));

        process.exit(0);
    } catch (err) {
        console.error('Error cleaning catalog:', err);
        process.exit(1);
    }
}

cleanCatalog();
