const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const Product = require('./models/Product');
const Collection = require('./models/Collection');
const User = require('./models/User');
const Review = require('./models/Review');
const { generateOilReviews } = require('./oilReviewsGenerator');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';

const sampleProducts = [
  // OILS
  {
    name: 'Groundnut Oil (Premium Quality)',
    category: 'Oils',
    price: 349,
    originalPrice: 471,
    unit: '1 Litre',
    countInStock: 25,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.42_PM_1_3752719d-4e83-4d00-a8be-0c4d13076c23.jpg?v=1757334051&width=533',
    description: '100% pure cold-pressed groundnut oil, ideal for healthy everyday cooking.',
    rating: 4.64,
    numReviews: 85,
    isFeatured: true,
  },
  {
    name: 'Coconut Oil (Premium Quality)',
    category: 'Oils',
    price: 165,
    originalPrice: 214,
    unit: '500 ml',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533',
    description: 'Unrefined, fragrant cold-pressed coconut oil from sun-dried copra.',
    rating: 4.64,
    numReviews: 75,
    isFeatured: true,
  },
  {
    name: 'Sunflower Oil (Premium Quality)',
    category: 'Oils',
    price: 499,
    originalPrice: 608,
    unit: '1 Litre',
    countInStock: 18,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533',
    description: 'Light, nutrient-dense cold-pressed sunflower oil for light frying and baking.',
    rating: 4.65,
    numReviews: 65,
    isFeatured: true,
  },
  {
    name: 'Sesame Oil (Premium Quality)',
    category: 'Oils',
    price: 148,
    originalPrice: 185,
    unit: '500 ml',
    countInStock: 25,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533',
    description: 'Traditional cold pressed gingelly sesame oil packed with nutrients and pure flavor.',
    rating: 4.65,
    numReviews: 60,
    isFeatured: true,
  },
  {
    name: 'Castor Oil (Premium Quality)',
    category: 'Oils',
    price: 95,
    originalPrice: 118,
    unit: '250 ml',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533',
    description: 'Cold-pressed 100% natural castor oil for hair, skin, and wellness.',
    rating: 4.65,
    numReviews: 65,
    isFeatured: false,
  },
  {
    name: 'Mustard Oil (Premium Quality)',
    category: 'Oils',
    price: 115,
    originalPrice: 150,
    unit: '500 ml',
    countInStock: 25,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533',
    description: 'Traditional kachi ghani cold pressed mustard oil with authentic sharp aroma.',
    rating: 4.63,
    numReviews: 62,
    isFeatured: false,
  },
  {
    name: 'Neem Oil (Premium Quality)',
    category: 'Oils',
    price: 135,
    originalPrice: 170,
    unit: '250 ml',
    countInStock: 20,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533',
    description: '100% pure cold pressed unrefined neem oil for natural hair and skin therapy.',
    rating: 4.64,
    numReviews: 64,
    isFeatured: false,
  },
  {
    name: 'Almond Oil (Premium Quality)',
    category: 'Oils',
    price: 249,
    originalPrice: 310,
    unit: '200 ml',
    countInStock: 20,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533',
    description: 'Pure sweet almond oil pressed from top-tier sweet almonds.',
    rating: 4.65,
    numReviews: 70,
    isFeatured: true,
  },

  // DRY FRUITS & NUTS
  {
    name: 'Cashew nuts (Kaju) (Premium Quality)',
    category: 'Dry Fruits',
    price: 368,
    originalPrice: 491,
    unit: '250 g',
    countInStock: 35,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b703-43bd-ae6f-6bb812afa6ba.jpg?v=1757334003&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.45.20_AM_2927d0dd-ed7b-43f7-8eb3-0fa0fd2e9a33.jpg?v=1757334004&width=533',
    description: 'Whole crispy premium cashew nuts rich in antioxidants and healthy fats.',
    rating: 4.64,
    numReviews: 78,
    isFeatured: true,
  },
  {
    name: 'Almonds (Badam) (Premium Quality)',
    category: 'Dry Fruits',
    price: 347,
    originalPrice: 438,
    unit: '250 g',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.36_AM_e4a9990f-ccf1-4aa3-a944-45faa606db78.jpg?v=1757334003&width=533',
    description: 'Hand-picked California almonds packed with protein and dietary fiber.',
    rating: 4.64,
    numReviews: 85,
    isFeatured: true,
  },
  {
    name: 'Figs (Dry Anjeer) (Premium Quality)',
    category: 'Dry Fruits',
    price: 579,
    originalPrice: 734,
    unit: '250 g',
    countInStock: 20,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.33_AM_2_-_Copy_7c457949-8471-48e0-a565-df11eec16963.jpg?v=1757334000&width=533',
    description: 'Rich, chewy dried figs naturally packed with iron and calcium.',
    rating: 4.65,
    numReviews: 72,
    isFeatured: true,
  },
  {
    name: 'Pistachio (Without Shell) (Premium)',
    category: 'Dry Fruits',
    price: 757,
    originalPrice: 941,
    unit: '250 g',
    countInStock: 25,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.30_PM_6c318297-0c92-4757-979e-e2f0cfce82b1.jpg?v=1757333991&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.35_AM_2_-_Copy_6e558aaf-9cbf-4afa-bb29-1d03db66a34d.jpg?v=1757333991&width=533',
    description: 'Whole crispy green pistachio kernels rich in vitamins and protein.',
    rating: 4.65,
    numReviews: 76,
    isFeatured: true,
  },
  {
    name: 'Walnuts (Premium Quality)',
    category: 'Dry Fruits',
    price: 516,
    originalPrice: 728,
    unit: '250 g',
    countInStock: 25,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2_372210ff-499e-4854-b1ba-7ac50bb3a105.jpg?v=1757334002&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.34_AM_bd399ac2-3177-4f8d-b549-0988071161ae.jpg?v=1757334002&width=533',
    description: 'Whole crisp walnut kernels high in DHA omega-3 fatty acids for brain health.',
    rating: 4.65,
    numReviews: 80,
    isFeatured: true,
  },
  {
    name: 'Raisins (Kishmish) (Premium Quality)',
    category: 'Dry Fruits',
    price: 144,
    originalPrice: 154,
    unit: '250 g',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-23_at_11.08.13_AM_4544f222-c407-433a-b6a9-1bdaf1c17e70.jpg?v=1757334001&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_4.21.41_PM_51b21c24-d44d-4a17-9cb4-9e8ce025d2e1.jpg?v=1757334001&width=533',
    description: 'Golden sweet plump raisins naturally dried without preservatives.',
    rating: 4.64,
    numReviews: 74,
    isFeatured: true,
  },
  {
    name: 'Dates (Kharjuram) (Premium Quality)',
    category: 'Dry Fruits',
    price: 199,
    originalPrice: 240,
    unit: '250 g',
    countInStock: 35,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_5.03.23_PM_21ec1f88-8a08-488f-a8ce-1967e45fef85.jpg?v=1757333990&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.44.26_AM_ee10a09d-9a22-4116-ac94-d36c3e989f6e.jpg?v=1757333990&width=533',
    description: 'Soft caramel-flavored natural dates full of iron and clean energy.',
    rating: 4.65,
    numReviews: 71,
    isFeatured: false,
  },
  {
    name: 'Ground Nuts- Raw (Premium Quality)',
    category: 'Dry Fruits',
    price: 125,
    originalPrice: 155,
    unit: '500 g',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_1_18442075-b578-4cf6-9c7a-04955b5197b7.jpg?v=1757334056&width=533',
    description: 'Crispy raw peanut kernels with intact red skin for snacks and chutney.',
    rating: 4.63,
    numReviews: 63,
    isFeatured: false,
  },

  // SEEDS
  {
    name: 'Flax Seeds (Premium Quality)',
    category: 'Seeds',
    price: 29,
    originalPrice: 36,
    unit: '100 g',
    countInStock: 50,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_2_ce2dcb8e-81dc-46c5-b343-1a14dff25208.jpg?v=1757334052&width=533',
    description: 'Omega-3 rich golden brown flax seeds for everyday smoothies and bowls.',
    rating: 4.65,
    numReviews: 68,
    isFeatured: false,
  },
  {
    name: 'Chia Seeds (Premium Quality)',
    category: 'Seeds',
    price: 49,
    originalPrice: 53,
    unit: '100 g',
    countInStock: 45,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.01_PM_6b2e5750-03f7-4a0a-b4e3-9ef639891875.jpg?v=1757333987&width=533',
    description: 'High-fiber superfood chia seeds, 100% natural and clean.',
    rating: 4.64,
    numReviews: 74,
    isFeatured: false,
  },
  {
    name: 'Pumpkin Seeds (Premium Quality)',
    category: 'Seeds',
    price: 56,
    originalPrice: 65,
    unit: '100 g',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_75dca399-7bd1-4c42-a209-50572b825bbe.jpg?v=1757334052&width=533',
    description: 'Nutrient-rich raw pumpkin seeds loaded with zinc and magnesium.',
    rating: 4.64,
    numReviews: 66,
    isFeatured: false,
  },
  {
    name: 'Sunflower Seeds (Premium Quality)',
    category: 'Seeds',
    price: 45,
    originalPrice: 55,
    unit: '100 g',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_2_ce2dcb8e-81dc-46c5-b343-1a14dff25208.jpg?v=1757334052&width=533',
    description: 'Shelled raw sunflower seed kernels full of Vitamin E and antioxidants.',
    rating: 4.65,
    numReviews: 65,
    isFeatured: false,
  },
  {
    name: 'Watermelon Seeds (Premium Quality)',
    category: 'Seeds',
    price: 52,
    originalPrice: 65,
    unit: '100 g',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_75dca399-7bd1-4c42-a209-50572b825bbe.jpg?v=1757334052&width=533',
    description: 'Clean shelled watermelon kernels rich in plant proteins and minerals.',
    rating: 4.64,
    numReviews: 67,
    isFeatured: false,
  },
  {
    name: 'Sabja Seeds (Premium Quality)',
    category: 'Seeds',
    price: 39,
    originalPrice: 48,
    unit: '100 g',
    countInStock: 45,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.01_PM_6b2e5750-03f7-4a0a-b4e3-9ef639891875.jpg?v=1757333987&width=533',
    description: 'Pure sweet basil sabja seeds that bloom rapidly for instant cooling drinks.',
    rating: 4.65,
    numReviews: 69,
    isFeatured: false,
  },
  {
    name: 'Poppy Seeds (Premium Quality)',
    category: 'Seeds',
    price: 89,
    originalPrice: 110,
    unit: '100 g',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_2.34.06_PM_a31b633d-23d9-4314-9b5b-8dcdd932dab6.jpg?v=1757334024&width=533',
    description: 'Clean white khas khas seeds for rich gravies and traditional sweets.',
    rating: 4.63,
    numReviews: 62,
    isFeatured: false,
  },
  {
    name: 'Sesame Seeds (White) (Premium Quality)',
    category: 'Seeds',
    price: 45,
    originalPrice: 58,
    unit: '100 g',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.00_AM_-_Copy_ac6c63f6-9657-46dd-a729-82f10320c447.jpg?v=1757333988&width=533',
    description: 'Clean white til seeds with delicate nutty aroma for laddoo and tempering.',
    rating: 4.64,
    numReviews: 64,
    isFeatured: false,
  },

  // GHEE & HONEY
  {
    name: 'Pure Buffalo Ghee (Premium Quality)',
    category: 'Ghee & Honey',
    price: 222,
    originalPrice: 288,
    unit: '250 ml',
    countInStock: 20,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_4.34.52_PM.jpg?v=1757934372&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.32.29_PM_2_eb23ab0e-a49c-457d-9dad-00ce2758289c.jpg?v=1757934372&width=533',
    description: 'Traditional granular bilona buffalo ghee with rich aroma and taste.',
    rating: 4.65,
    numReviews: 82,
    isFeatured: true,
  },
  {
    name: 'Pure Cow Ghee (Premium Quality)',
    category: 'Ghee & Honey',
    price: 265,
    originalPrice: 340,
    unit: '250 ml',
    countInStock: 20,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_4.34.52_PM.jpg?v=1757934372&width=533',
    description: 'Golden yellow A2 cow ghee with traditional granular churned texture.',
    rating: 4.65,
    numReviews: 77,
    isFeatured: true,
  },
  {
    name: 'Raw Organic Honey (Premium Quality)',
    category: 'Ghee & Honey',
    price: 195,
    originalPrice: 250,
    unit: '250 g',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_4.34.52_PM.jpg?v=1757934372&width=533',
    description: '100% pure unprocessed wild forest honey packed with natural enzymes.',
    rating: 4.64,
    numReviews: 73,
    isFeatured: true,
  },

  // SPICE POWDERS
  {
    name: 'Chana Dal Spice Powder (Pappula Podi)',
    category: 'Spice Powders',
    price: 59,
    originalPrice: 80,
    unit: '100 g',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_2_717030b8-c8a8-40a4-bdf0-7e516dec3029.jpg?v=1757334045&width=533',
    description: 'Authentic Andhra style homemade roasted chana dal podi with ghee flavor.',
    rating: 4.64,
    numReviews: 67,
    isFeatured: true,
  },
  {
    name: 'Garlic Powder (Velluli Karam)',
    category: 'Spice Powders',
    price: 59,
    originalPrice: 80,
    unit: '100 g',
    countInStock: 35,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_3_6262e177-7c59-4137-afc4-5d486daa9175.jpg?v=1757334046&width=533',
    description: 'Spicy, pungent country garlic podi blended with red chillies and cumin.',
    rating: 4.64,
    numReviews: 67,
    isFeatured: true,
  },
  {
    name: 'Garlic Powder (Velluli Karam Podi)',
    category: 'Spice Powders',
    price: 59,
    originalPrice: 80,
    unit: '100 g',
    countInStock: 35,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_3_6262e177-7c59-4137-afc4-5d486daa9175.jpg?v=1757334046&width=533',
    description: 'Pungent country garlic powder with roasted chillies and sea salt.',
    rating: 4.64,
    numReviews: 66,
    isFeatured: false,
  },
  {
    name: 'Kandi Podi (Toor Dal Powder)',
    category: 'Spice Powders',
    price: 65,
    originalPrice: 85,
    unit: '100 g',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_1_68bbbe8e-1768-45a1-9657-3a87f174ee0f.jpg?v=1757334047&width=533',
    description: 'Traditional spiced roasted lentil powder for hot steaming rice and ghee.',
    rating: 4.64,
    numReviews: 67,
    isFeatured: true,
  },
  {
    name: 'Kobbari Karam Podi (Premium Quality)',
    category: 'Spice Powders',
    price: 65,
    originalPrice: 85,
    unit: '100 g',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.00_PM_33a6719d-7dd6-4772-add2-2a37e2461d57.jpg?v=1757334044&width=533',
    description: 'Roasted dry coconut podi with traditional red chillies and cumin.',
    rating: 4.65,
    numReviews: 69,
    isFeatured: false,
  },
  {
    name: 'Nalla Karam Podi (Premium Quality)',
    category: 'Spice Powders',
    price: 65,
    originalPrice: 85,
    unit: '100 g',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.02_PM_c823be1b-85bf-4371-8236-9e09b3af2ef5.jpg?v=1757334045&width=533',
    description: 'Fiery black pepper and roasted coriander podi for idli, dosa, and rice.',
    rating: 4.64,
    numReviews: 68,
    isFeatured: false,
  },
  {
    name: 'Karivepaku Karam Podi (Premium Quality)',
    category: 'Spice Powders',
    price: 65,
    originalPrice: 85,
    unit: '100 g',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_1_445e71a6-1753-4790-b36c-6606bfbd7414.jpg?v=1757334043&width=533',
    description: 'Healthy roasted fresh curry leaves podi high in natural iron.',
    rating: 4.65,
    numReviews: 65,
    isFeatured: false,
  },
  {
    name: 'Garam Masala Powder (Premium Quality)',
    category: 'Spice Powders',
    price: 75,
    originalPrice: 95,
    unit: '100 g',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.48.34_AM_09536c73-bd98-4941-8a08-584934747509.jpg?v=1757334043&width=533',
    description: 'Aromatic royal blend of whole roasted spices finely ground.',
    rating: 4.65,
    numReviews: 71,
    isFeatured: false,
  },
  {
    name: 'Pepper Powder (Premium Quality)',
    category: 'Spice Powders',
    price: 69,
    originalPrice: 85,
    unit: '100 g',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.04.27_AM_fdc73816-1464-4430-93ba-4bde3c52f6ad.jpg?v=1757334023&width=533',
    description: 'Pure freshly ground Malabar black pepper powder.',
    rating: 4.64,
    numReviews: 64,
    isFeatured: false,
  },
  {
    name: 'Coriander Powder (Premium Quality)',
    category: 'Spice Powders',
    price: 49,
    originalPrice: 65,
    unit: '100 g',
    countInStock: 35,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.03.37_AM_ed07471b-5860-4bfe-b13e-b611c8a1ce87.jpg?v=1757334022&width=533',
    description: 'Fragrant ground coriander seeds for gravies and curries.',
    rating: 4.63,
    numReviews: 63,
    isFeatured: false,
  },

  // SPICES & ESSENTIALS
  {
    name: 'Cloves (lavanga) (Premium Quality)',
    category: 'Spices',
    price: 119,
    originalPrice: 150,
    unit: '100 g',
    countInStock: 35,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.33.17_PM_e7455739-c811-4135-8760-da32b445f0f0.jpg?v=1757333998&width=533',
    description: 'Aromatic handpicked whole cloves full of essential oils.',
    rating: 4.64,
    numReviews: 67,
    isFeatured: true,
  },
  {
    name: 'Cloves (Lavangam)',
    category: 'Spices',
    price: 119,
    originalPrice: 150,
    unit: '100 g',
    countInStock: 35,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.33.17_PM_e7455739-c811-4135-8760-da32b445f0f0.jpg?v=1757333998&width=533',
    description: 'Whole aromatic cloves full of essential oil and rich fragrance.',
    rating: 4.64,
    numReviews: 66,
    isFeatured: false,
  },
  {
    name: 'Cardamom (Elaichi) (Premium Quality)',
    category: 'Spices',
    price: 199,
    originalPrice: 260,
    unit: '50 g',
    countInStock: 25,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.41.25_PM_dd385152-2aab-4061-9f20-60f6b9fec186.jpg?v=1757333997&width=533',
    description: 'Bold 8mm green cardamom pods sourced from traditional spice estates.',
    rating: 4.64,
    numReviews: 68,
    isFeatured: true,
  },
  {
    name: 'Green Cardamom (Elaichi)',
    category: 'Spices',
    price: 199,
    originalPrice: 260,
    unit: '50 g',
    countInStock: 25,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.41.25_PM_dd385152-2aab-4061-9f20-60f6b9fec186.jpg?v=1757333997&width=533',
    description: 'Fragrant green cardamom pods sourced from traditional spice estates.',
    rating: 4.64,
    numReviews: 67,
    isFeatured: false,
  },
  {
    name: 'Mix Masala Items (Premium Quality)',
    category: 'Spices',
    price: 149,
    originalPrice: 190,
    unit: '150 g',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/biriyani_masala_mix_0ea70b9d-998e-45e0-88e4-dd70361ffe2e.jpg?v=1757333993&width=533',
    description: 'Whole biryani and curry spice mix including cardamom, cloves, and bay leaf.',
    rating: 4.63,
    numReviews: 62,
    isFeatured: false,
  },
  {
    name: 'Cinnamon (Premium Quality)',
    category: 'Spices',
    price: 99,
    originalPrice: 130,
    unit: '100 g',
    countInStock: 35,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/cinnamon_bd2c52bb-d2df-4d09-baca-93aab2223e68.jpg?v=1757333965&width=533',
    description: 'Pure sweet Ceylon cinnamon bark sticks.',
    rating: 4.65,
    numReviews: 65,
    isFeatured: false,
  },
  {
    name: 'Star Anise (Premium Quality)',
    category: 'Spices',
    price: 110,
    originalPrice: 140,
    unit: '100 g',
    countInStock: 30,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.12_PM_2_a7222bbd-81fe-4bd2-8e22-c0f5fb85fadd.jpg?v=1757334019&width=533',
    description: 'Aromatic whole star anise flowers for biryani and curries.',
    rating: 4.64,
    numReviews: 64,
    isFeatured: false,
  },
  {
    name: 'Coriander (Premium Quality)',
    category: 'Spices',
    price: 55,
    originalPrice: 70,
    unit: '200 g',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_8.01.42_PM_54cc4ece-2494-45d1-b46e-b7eab45e48bd.jpg?v=1757333995&width=533',
    description: 'Whole green dhania seeds for spice mixes and seasoning.',
    rating: 4.63,
    numReviews: 63,
    isFeatured: false,
  },
  {
    name: 'Cumin (Premium Quality)',
    category: 'Spices',
    price: 79,
    originalPrice: 99,
    unit: '100 g',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_2_603e588c-f12a-4d13-9d05-e88fdbaf0106.jpg?v=1757333994&width=533',
    description: 'Bold earthy jeera seeds for daily tempering.',
    rating: 4.64,
    numReviews: 66,
    isFeatured: false,
  },
  {
    name: 'Black Pepper (Premium Quality)',
    category: 'Spices',
    price: 135,
    originalPrice: 175,
    unit: '100 g',
    countInStock: 35,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.11_PM_1_30a1bf5b-4da7-42a6-92d6-9f209d0d91c0.jpg?v=1757333996&width=533',
    description: 'Whole Malabar black peppercorns with intense aroma.',
    rating: 4.65,
    numReviews: 69,
    isFeatured: false,
  },
  {
    name: 'Himalayan Pink Rock Salt',
    category: 'Cooking Essentials',
    price: 89,
    originalPrice: 120,
    unit: '1 kg',
    countInStock: 40,
    brand: 'Arshith Fresh',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/groceries_200x200_crop_center.jpg?v=1746965740',
    description: '100% natural, unrefined pure mineral Himalayan rock salt.',
    rating: 4.64,
    numReviews: 67,
    isFeatured: true,
  }
];

const sampleCollections = [
  { 
    title: 'Oils', 
    description: 'Wood Pressed & Cold Pressed Oils', 
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/oil_n_natural_extract_200x200_crop_center.jpg?v=1746964936',
    conditionsSummary: 'Tag includes Oils',
    subcategories: ['Cold-Pressed Groundnut Oil', 'Wood-Pressed Sesame Oil', 'Coconut Oil', 'Sunflower Oil', 'Mustard Oil', 'Castor Oil']
  },
  { 
    title: 'Dry Fruits', 
    description: 'Almonds, Cashews, Walnuts & Raisins', 
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/seeds_dry_fruits_nuts_webp_200x200_crop_center.jpg?v=1746963459',
    conditionsSummary: 'Tag includes Dry Fruits',
    subcategories: ['Almonds (Badam)', 'Cashews (Kaju)', 'Dates (Khajoor)', 'Walnuts (Akhrot)', 'Pistachios (Pista)', 'Raisins (Kismis)', 'Dry Figs (Anjeer)']
  },
  { 
    title: 'Seeds', 
    description: 'Chia, Flax, Pumpkin & Sunflower Seeds', 
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/dry_seeds_200x200_crop_center.jpg?v=1746963515',
    conditionsSummary: 'Tag includes Seeds',
    subcategories: ['Chia Seeds', 'Flax Seeds', 'Pumpkin Seeds', 'Sunflower Seeds', 'Watermelon Seeds', 'Sesame Seeds (Til)']
  },
  { 
    title: 'Ghee & Honey', 
    description: 'Pure Buffalo Ghee & Wild Forest Honey', 
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/ghee_1_200x200_crop_center.jpg?v=1746964905',
    conditionsSummary: 'Tag includes Ghee',
    subcategories: ['Pure Desi Cow Ghee', 'Pure Buffalo Ghee', 'Raw Wild Forest Honey', 'Organic Honeycomb']
  },
  { 
    title: 'Cooking Essentials', 
    description: 'Daily Kitchen Essentials', 
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/groceries_200x200_crop_center.jpg?v=1746965740',
    conditionsSummary: 'Tag includes Essentials',
    subcategories: ['Cold-Pressed Cooking Oils', 'Rock Salt / Himalayan Pink Salt', 'Natural Organic Jaggery / Bellam', 'Country Tamarind / Chintapandu']
  },
  { 
    title: 'Spices', 
    description: 'Whole authentic spices', 
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/spice_200x200_crop_center.png?v=1746963495',
    conditionsSummary: 'Tag includes Spices',
    subcategories: ['Whole Spices', 'Black Pepper', 'Green Cardamom (Elaichi)', 'Cloves (Lavangam)', 'Cinnamon (Dalchina Chekka)', 'Cumin Seeds (Jeera)', 'Mustard Seeds (Avalu)']
  },
  { 
    title: 'Spice Powders', 
    description: 'Traditional homemade Andhra podulu', 
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/collections/powders_200x200_crop_center.jpg?v=1743477019',
    conditionsSummary: 'Tag includes Powders',
    subcategories: ['Chana Dal Podi (Pappula Podi)', 'Garlic Podi (Vellulli Karam)', 'Kandi Podi', 'Karivepaku Podi (Curry Leaf)', 'Flax Seed Podi', 'Sambar & Rasam Powder']
  }
];

async function seedDatabase() {
  const primaryUri = MONGO_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/arshith_fresh';
  let connected = false;

  if (primaryUri) {
    try {
      console.log(`Connecting to Primary MongoDB (Atlas)...`);
      await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 4000 });
      console.log('✅ Connected to Primary MongoDB!');
      connected = true;
    } catch (err) {
      console.warn(`⚠️ Atlas connection failed (${err.message.substring(0, 60)}...).`);
    }
  }

  if (!connected) {
    try {
      console.log(`Connecting to Local MongoDB (${fallbackUri})...`);
      await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 3000 });
      console.log('✅ Connected to Local MongoDB!');
      connected = true;
    } catch (err) {
      console.error('❌ Error connecting to Local MongoDB:', err.message);
      process.exit(1);
    }
  }

  try {
    console.log('Resetting collections...');

    // Clear old data
    await Product.deleteMany({});
    await Collection.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({ role: 'admin' });

    // Insert Products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${insertedProducts.length} starter products.`);

    // Generate & insert customer reviews for ALL products across all categories
    let allReviews = [];
    for (const prod of insertedProducts) {
      const revs = generateOilReviews(prod.name, prod._id);
      allReviews = allReviews.concat(revs);

      const totalScore = revs.reduce((sum, r) => sum + r.rating, 0);
      prod.numReviews = revs.length;
      prod.rating = Math.round((totalScore / revs.length) * 100) / 100;
      await prod.save();
    }

    if (allReviews.length > 0) {
      await Review.insertMany(allReviews);
      console.log(`✅ Seeded ${allReviews.length} customer reviews across all ${insertedProducts.length} products into MongoDB.`);
    }

    // Insert Collections
    const insertedCollections = await Collection.insertMany(sampleCollections);
    console.log(`✅ Inserted ${insertedCollections.length} starter collections.`);

    // Insert Admin User
    const adminUser = await User.create({
      name: 'Admin Arshith',
      email: 'admin@arshithfresh.com',
      password: 'adminpassword123',
      role: 'admin',
      phone: '9876543210',
    });
    console.log(`✅ Created default Admin account: ${adminUser.email}`);

    console.log('\n🎉 MongoDB database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
