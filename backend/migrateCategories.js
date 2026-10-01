const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';

const Product = require('./models/Product');
const Collection = require('./models/Collection');

const CATEGORIES_META = [
  {
    title: 'Pickles',
    slug: 'pickles',
    description: 'Authentic homemade pickles prepared with natural spices and pure cold-pressed oil.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-20_at_12.12.10_PM_1_7e869e3d-6430-4313-8bcd-0f07e53ad1ed.jpg?v=1757333951',
    subcategories: ['Veg Pickles', 'Non-Veg Pickles', 'Pickles & Chutneys']
  },
  {
    title: 'Powders & Masalas',
    slug: 'powders-masalas',
    description: 'Traditional aromatic podulu, red chilli powders, sambar masalas & authentic spice blends.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-31_at_7.42.30_PM_1_92dd0928-e3ea-4b36-84ec-ea82c7efd33f.jpg?v=1758619712',
    subcategories: ['Chilli Powders', 'Karam Podulu', 'Masala Powders', 'Dal Powders']
  },
  {
    title: 'Spices',
    slug: 'spices',
    description: '100% pure whole spices handpicked for rich aroma and flavor.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/spice_200x200_crop_center.png?v=1746963495',
    subcategories: ['Whole Spices', 'Cardamom & Cloves', 'Cinnamon & Cumin', 'Chillies']
  },
  {
    title: 'Flours & Rava',
    slug: 'flours-rava',
    description: 'Freshly milled wholesome flours, soft-ground wheat, besan & semiya.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-29_at_6.10.09_PM.jpg?v=1757333959',
    subcategories: ['Wheat Flours', 'Millet Flours', 'Besan & Rice Flour', 'Rava & Semiya']
  },
  {
    title: 'Dry Fruits & Nuts',
    slug: 'dry-fruits-nuts',
    description: 'Premium handpicked almonds, cashews, pistachios, dates & nutrient-dense dried fruits.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/seeds_dry_fruits_nuts_webp_200x200_crop_center.jpg?v=1746963459',
    subcategories: ['Almonds & Cashews', 'Pistachios & Walnuts', 'Dates & Figs', 'Dry Fruit Combos']
  },
  {
    title: 'Seeds',
    slug: 'seeds',
    description: 'Nutritious superfood seeds including chia, flax, pumpkin, sunflower & sesame seeds.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/dry_seeds_200x200_crop_center.jpg?v=1746963515',
    subcategories: ['Chia & Flax Seeds', 'Pumpkin & Sunflower Seeds', 'Sesame & Sabja Seeds']
  },
  {
    title: 'Oils & Natural Extracts',
    slug: 'oils-natural-extracts',
    description: 'Cold-pressed & wood-pressed natural oils extracted from pure seeds.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=400',
    subcategories: ['Groundnut Oil', 'Sesame Oil', 'Coconut Oil', 'Mustard & Almond Oil']
  },
  {
    title: 'Ghee & Honey',
    slug: 'ghee-honey',
    description: 'Pure Desi cow ghee, buffalo ghee & raw organic forest honey.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/ghee_1_200x200_crop_center.jpg?v=1746964905',
    subcategories: ['Cow Ghee', 'Buffalo Ghee', 'Organic Honey']
  },
  {
    title: 'Cooking Essentials',
    slug: 'cooking-essentials',
    description: 'Daily kitchen essentials, unpolished dals, pulses, pink salt & monthly grocery packs.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/groceries_200x200_crop_center.jpg?v=1746965740',
    subcategories: ['Dals & Pulses', 'Salts & Sugars', 'Monthly Combos', 'Poha & Sago']
  },
  {
    title: 'Beverages & Instant Mixes',
    slug: 'beverages-instant-mixes',
    description: 'Pure green tea, premium coffee, badam powder & milk powders.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.42.12_AM_f7566d9e-a9e4-4ac2-b2ae-a3a41b1033db.jpg?v=1757333974',
    subcategories: ['Tea & Green Tea', 'Coffee Powder', 'Badam & Milk Powders']
  },
  {
    title: 'Papads & Snacks',
    slug: 'papads-snacks',
    description: 'Crispy traditional appalams, papads & authentic South Indian snacks.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.47.09_AM_55bb1b27-9dda-427f-90cc-db75f714c870.jpg?v=1757333973',
    subcategories: ['Appalam Papads', 'Traditional Snacks']
  },
  {
    title: 'Household & Care',
    slug: 'household-care',
    description: 'Quality cleaning soaps, detergent powders, brushes & personal care products.',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.41.14_AM_-_Copy_7a3212fa-1309-48b9-9d15-33e4e0074631.jpg?v=1757333964',
    subcategories: ['Detergents & Soaps', 'Personal Care', 'Cleaning Tools']
  }
];

function determineCategory(p) {
  const name = (p.name || '').toLowerCase();

  // 1. Pickles
  if (name.includes('pickle') || name.includes('bitter gourd')) {
    return 'Pickles';
  }

  // 2. Household & Personal Care
  if (name.includes('detergent') || name.includes('soap(') || name.includes('brush') || name.includes('tooth paste') || (name.includes('powder') && name.includes('premium') && !name.includes('chilli') && !name.includes('sambar') && !name.includes('garlic') && !name.includes('coriander') && !name.includes('pepper') && !name.includes('karam') && !name.includes('masala') && !name.includes('podi') && !name.includes('milk') && !name.includes('tea') && !name.includes('coffee') && !name.includes('badam') && !name.includes('coconut') && !name.includes('prawns'))) {
    return 'Household & Care';
  }

  // 3. Beverages & Instant Mixes
  if (name.includes('tea') || name.includes('coffee') || name.includes('milk powder') || name.includes('badam powder') || name.includes('coconut powder')) {
    return 'Beverages & Instant Mixes';
  }

  // 4. Oils & Natural Extracts
  if (name.includes('oil')) {
    return 'Oils & Natural Extracts';
  }

  // 5. Ghee & Honey
  if (name.includes('ghee') || name.includes('honey')) {
    return 'Ghee & Honey';
  }

  // 6. Powders & Masalas
  if (name.includes('podi') || name.includes('karam') || name.includes('masala') || (name.includes('powder') && (name.includes('chilli') || name.includes('sambar') || name.includes('garlic') || name.includes('coriander') || name.includes('pepper') || name.includes('chana dal') || name.includes('prawns') || name.includes('spice')))) {
    return 'Powders & Masalas';
  }

  // 7. Flours & Rava
  if (name.includes('flour') || name.includes('rava') || name.includes('semiya') || name.includes('sewai') || name.includes('vermicelli')) {
    return 'Flours & Rava';
  }

  // 8. Spices
  if (name.includes('cumin') || name.includes('star anise') || name.includes('cinnamon') || name.includes('clove') || name.includes('lavanga') || name.includes('cardamom') || name.includes('elaichi') || (name.includes('pepper') && !name.includes('powder')) || (name.includes('coriander') && !name.includes('powder') && !name.includes('pickle')) || name.includes('mix masala') || name.includes('chillies')) {
    return 'Spices';
  }

  // 9. Seeds
  if (name.includes('seed') || name.includes('chia') || name.includes('flax') || name.includes('sabja') || name.includes('poppy') || name.includes('pumpkin') || name.includes('vammu')) {
    return 'Seeds';
  }

  // 10. Dry Fruits & Nuts
  if (name.includes('dry fruit') || name.includes('almond') || name.includes('cashew') || name.includes('kaju') || name.includes('badam') || name.includes('walnut') || name.includes('raisin') || name.includes('kishmish') || name.includes('fig') || name.includes('anjeer') || name.includes('pistachio') || name.includes('date') || name.includes('kharjuram') || name.includes('makhana') || name.includes('blackberries') || name.includes('tutti frutti') || name.includes('ground nuts')) {
    return 'Dry Fruits & Nuts';
  }

  // 11. Papads & Snacks
  if (name.includes('papad') || name.includes('apadalu') || name.includes('fryum')) {
    return 'Papads & Snacks';
  }

  // 12. Cooking Essentials (default for dal, salt, combos, sugar, rice, millets, sago, meal maker, etc.)
  return 'Cooking Essentials';
}

async function runMigration() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB!');

    // 1. Audit and Update all Products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to audit.`);

    let updatedProductCount = 0;
    const categoryCounts = {};

    for (const p of products) {
      const correctCategory = determineCategory(p);
      categoryCounts[correctCategory] = (categoryCounts[correctCategory] || 0) + 1;

      if (p.category !== correctCategory) {
        p.category = correctCategory;
        await p.save();
        updatedProductCount++;
      }
    }

    console.log(`✅ Updated ${updatedProductCount} products with corrected category assignments.`);
    console.log('Final Category Counts:', JSON.stringify(categoryCounts, null, 2));

    // 2. Sync Collections Collection in MongoDB
    console.log('\nSyncing Collection model entries...');
    // Delete obsolete / duplicate collections
    await Collection.deleteMany({});

    for (const meta of CATEGORIES_META) {
      const pCount = categoryCounts[meta.title] || 0;
      await Collection.create({
        title: meta.title,
        slug: meta.slug,
        description: meta.description,
        image: meta.image,
        subcategories: meta.subcategories,
        collectionType: 'automated',
        conditionsSummary: `Category is ${meta.title}`,
        productsCount: pCount
      });
    }

    console.log(`🎉 Created ${CATEGORIES_META.length} normalized Category/Collection entries in MongoDB!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
