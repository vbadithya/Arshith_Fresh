const dns = require('dns');
try { dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); } catch(e){}

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('./node_modules/mongoose');
const fs = require('fs');

const CATALOG_DATA = [
  // OILS
  {
    handle: 'groundnut-oil-premium',
    name: 'Groundnut Oil (Premium Quality)',
    category: 'Oils',
    price: 349,
    originalPrice: 471,
    unit: '1 L',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.42_PM_1_3752719d-4e83-4d00-a8be-0c4d13076c23.jpg?v=1757334051&width=533'
  },
  {
    handle: 'sunflower-oil-premium',
    name: 'Sunflower Oil (Premium Quality)',
    category: 'Oils',
    price: 499,
    originalPrice: 608,
    unit: '1 L',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-28_at_4.14.16_PM_1_ee159cd3-c09a-443d-a28c-6c4b116ce904.jpg?v=1757334052&width=533'
  },
  {
    handle: 'sesame-oil-premium',
    name: 'Sesame Oil (Premium Quality)',
    category: 'Oils',
    price: 148,
    originalPrice: 185,
    unit: '500 ml',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533'
  },
  {
    handle: 'castor-oil-premium',
    name: 'Castor Oil (Premium Quality)',
    category: 'Oils',
    price: 95,
    originalPrice: 118,
    unit: '250 ml',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533'
  },
  {
    handle: 'coconut-oil-premium',
    name: 'Coconut Oil (Premium Quality)',
    category: 'Oils',
    price: 165,
    originalPrice: 214,
    unit: '500 ml',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533'
  },
  {
    handle: 'mustard-oil-premium',
    name: 'Mustard Oil (Premium Quality)',
    category: 'Oils',
    price: 115,
    originalPrice: 150,
    unit: '500 ml',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533'
  },

  // GHEE & HONEY
  {
    handle: 'pure-cow-ghee-premium',
    name: 'Pure Cow Ghee (Premium Quality)',
    category: 'Ghee and Honey',
    price: 240,
    originalPrice: 310,
    unit: '250 ml',
    image: '/assets/images/products/cow_ghee_front.jpg',
    hoverImage: '/assets/images/products/cow_ghee_back.jpg'
  },
  {
    handle: 'pure-buffalo-ghee-premium',
    name: 'Pure Buffalo Ghee (Premium Quality)',
    category: 'Ghee and Honey',
    price: 222,
    originalPrice: 288,
    unit: '250 ml',
    image: '/assets/images/products/buffalo_ghee_front.jpg',
    hoverImage: '/assets/images/products/buffalo_ghee_back.jpg'
  },
  {
    handle: 'natural-honey-premium',
    name: 'Pure Natural Honey (Raw Wild Honey) (Premium Quality)',
    category: 'Ghee and Honey',
    price: 130,
    originalPrice: 150,
    unit: '250 g',
    image: '/assets/images/products/natural_honey_front.jpg',
    hoverImage: '/assets/images/products/natural_honey_back.jpg'
  },

  // DRY FRUITS
  {
    handle: 'cashew-nuts-premium',
    name: 'Cashew Nuts (Kaju) (Premium Quality)',
    category: 'Dry Fruits',
    price: 265,
    originalPrice: 340,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b703-43bd-ae6f-6bb812afa6ba.jpg?v=1757334003&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.45.20_AM_2927d0dd-ed7b-43f7-8eb3-0fa0fd2e9a33.jpg?v=1757334004&width=533'
  },
  {
    handle: 'almonds-premium',
    name: 'Almonds (Badam) (Premium Quality)',
    category: 'Dry Fruits',
    price: 225,
    originalPrice: 295,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.36_AM_e4a9990f-ccf1-4aa3-a944-45faa606db78.jpg?v=1757334003&width=533'
  },
  {
    handle: 'figsdry-anjeer-premium',
    name: 'Figs (Dry Anjeer) (Premium Quality)',
    category: 'Dry Fruits',
    price: 375,
    originalPrice: 480,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.33_AM_2_-_Copy_7c457949-8471-48e0-a565-df11eec16963.jpg?v=1757334000&width=533'
  },
  {
    handle: 'walnuts-premium',
    name: 'Walnuts (Akhrot) (Premium Quality)',
    category: 'Dry Fruits',
    price: 320,
    originalPrice: 420,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2_372210ff-499e-4854-b1ba-7ac50bb3a105.jpg?v=1757334002&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.34_AM_bd399ac2-3177-4f8d-b549-0988071161ae.jpg?v=1757334002&width=533'
  },
  {
    handle: 'pistachio-with-shell-premium-quality',
    name: 'Pistachio (With Shell) (Premium Quality)',
    category: 'Dry Fruits',
    price: 340,
    originalPrice: 430,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.30_PM_6c318297-0c92-4757-979e-e2f0cfce82b1.jpg?v=1757333991&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.35_AM_2_-_Copy_6e558aaf-9cbf-4afa-bb29-1d03db66a34d.jpg?v=1757333991&width=533'
  },
  {
    handle: 'raisins-premium',
    name: 'Raisins (Kishmish) (Premium Quality)',
    category: 'Dry Fruits',
    price: 140,
    originalPrice: 185,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-23_at_11.08.13_AM_4544f222-c407-433a-b6a9-1bdaf1c17e70.jpg?v=1757334001&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_4.21.41_PM_51b21c24-d44d-4a17-9cb4-9e8ce025d2e1.jpg?v=1757334001&width=533'
  },
  {
    handle: 'dates-premium',
    name: 'Dates (Khajoor) (Premium Quality)',
    category: 'Dry Fruits',
    price: 180,
    originalPrice: 230,
    unit: '500 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_5.03.23_PM_21ec1f88-8a08-488f-a8ce-1967e45fef85.jpg?v=1757333990&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.44.26_AM_ee10a09d-9a22-4116-ac94-d36c3e989f6e.jpg?v=1757333990&width=533'
  },

  // SPICE POWDERS / PODULU
  {
    handle: 'chilli-powder',
    name: 'Chilli Powder (Premium Quality)',
    category: 'Powders & Masalas',
    price: 49,
    originalPrice: 65,
    unit: '100 g',
    image: 'assets/images/products/chilli-powder.jpg',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_1_aefb0a70-8bbf-4ec8-a727-8494ca7dbf25.jpg?v=1757333964&width=533'
  },
  {
    handle: 'chana-dal-spice-powder-pappula-podi-premium',
    name: 'Chana Dal Spice Powder / Pappula Podi (Premium Quality)',
    category: 'Spice Powders',
    price: 89,
    originalPrice: 115,
    unit: '100 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_2_717030b8-c8a8-40a4-bdf0-7e516dec3029.jpg?v=1757334045&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_c2bafc14-a54c-4d90-ad91-a96218301ccf.jpg?v=1757334045&width=533'
  },
  {
    handle: 'kobbari-karam-podi-premium',
    name: 'Kobbari Karam Podi (Premium Quality)',
    category: 'Spice Powders',
    price: 95,
    originalPrice: 120,
    unit: '100 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.00_PM_33a6719d-7dd6-4772-add2-2a37e2461d57.jpg?v=1757334044&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.38_PM_1_c7c68b45-ca76-4b30-b6dc-d9cc22cbfe3a.jpg?v=1757334044&width=533'
  },
  {
    handle: 'nalla-karam-podi-premium',
    name: 'Nalla Karam Podi (Premium Quality)',
    category: 'Spice Powders',
    price: 98,
    originalPrice: 125,
    unit: '100 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.02_PM_c823be1b-85bf-4371-8236-9e09b3af2ef5.jpg?v=1757334045&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_1_0fc408cf-b6bb-4f12-b4ef-41cfefa89e40.jpg?v=1757334045&width=533'
  },
  {
    handle: 'garlic-powder-velluli-karam-podi-premium',
    name: 'Garlic Powder / Vellulli Karam Podi (Premium Quality)',
    category: 'Spice Powders',
    price: 99,
    originalPrice: 130,
    unit: '100 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_3_6262e177-7c59-4137-afc4-5d486daa9175.jpg?v=1757334046&width=533',
    hoverImage: '/assets/images/products/garlic_powder_back.jpg'
  },
  {
    handle: 'karivepaku-karam-podi-premium',
    name: 'Karivepaku Karam Podi (Curry Leaves Karam) (Premium Quality)',
    category: 'Spice Powders',
    price: 95,
    originalPrice: 120,
    unit: '100 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_1_445e71a6-1753-4790-b36c-6606bfbd7414.jpg?v=1757334043&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.44.36_AM_b473978a-44b3-4da2-a619-4863c0fc1e5b.jpg?v=1757334043&width=533'
  },
  {
    handle: 'garam-masala-powder-premium',
    name: 'Garam Masala Powder (Premium Quality)',
    category: 'Powders & Masalas',
    price: 85,
    originalPrice: 110,
    unit: '100 g',
    image: '/assets/images/products/garam_masala_front.jpg',
    hoverImage: '/assets/images/products/garam_masala_back.jpg'
  },
  {
    handle: 'pepper-powder-premium',
    name: 'Black Pepper Powder (Premium Quality)',
    category: 'Powders & Masalas',
    price: 95,
    originalPrice: 125,
    unit: '100 g',
    image: '/assets/images/products/pepper_powder_front.jpg',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.04.27_AM_fdc73816-1464-4430-93ba-4bde3c52f6ad.jpg?v=1757334023&width=533'
  },
  {
    handle: 'coriander-powder-premium',
    name: 'Coriander Powder (Dhania) (Premium Quality)',
    category: 'Powders & Masalas',
    price: 55,
    originalPrice: 75,
    unit: '100 g',
    image: '/assets/images/products/coriander_powder_front.jpg',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.03.37_AM_ed07471b-5860-4bfe-b13e-b611c8a1ce87.jpg?v=1757334022&width=533'
  },

  // SPICES
  {
    handle: 'red-chillies-guntur-premium',
    name: 'Red Chillies (Guntur) (Premium Quality)',
    category: 'Spices',
    price: 85,
    originalPrice: 115,
    unit: '250 g',
    image: '/assets/images/products/guntur_chillies_front.jpg',
    hoverImage: '/assets/images/products/guntur_chillies_back.jpg'
  },
  {
    handle: 'red-chillies-byadgi-premium',
    name: 'Red Chillies (Byadagi) (Premium Quality)',
    category: 'Spices',
    price: 95,
    originalPrice: 125,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/Byadgi_65ac3367-c79c-48f3-a5e1-af2985ebbd33.png?v=1757333963',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.05.59_PM_1_3e1688f4-b68c-45fb-9217-3872fd18bf23.jpg?v=1757333963'
  },
  {
    handle: 'black-pepper-premium',
    name: 'Black Pepper (Whole) (Premium Quality)',
    category: 'Spices',
    price: 135,
    originalPrice: 175,
    unit: '100 g',
    image: '/assets/images/products/black_pepper_front.jpg',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.11_PM_1_30a1bf5b-4da7-42a6-92d6-9f209d0d91c0.jpg?v=1757333996&width=533'
  },
  {
    handle: 'cinnamon-kerala-style-premium',
    name: 'Cinnamon (Premium Quality)',
    category: 'Spices',
    price: 54,
    originalPrice: 78,
    unit: '100 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/cinnamon_bd2c52bb-d2df-4d09-baca-93aab2223e68.jpg?v=1757333965&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-12_at_11.48.48_AM.jpg?v=1757333965&width=533'
  },
  {
    handle: 'cloves-premium',
    name: 'Cloves (Lavangalu) (Premium Quality)',
    category: 'Spices',
    price: 110,
    originalPrice: 145,
    unit: '100 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.33.17_PM_e7455739-c811-4135-8760-da32b445f0f0.jpg?v=1757333998&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.09_PM_d713ec77-5974-4551-9346-b1e592b0a512.jpg?v=1757333998&width=533'
  },
  {
    handle: 'cardamom-premium',
    name: 'Cardamom (Elaichi) (Premium Quality)',
    category: 'Spices',
    price: 240,
    originalPrice: 310,
    unit: '100 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.41.25_PM_dd385152-2aab-4061-9f20-60f6b9fec186.jpg?v=1757333997&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_c6567ba5-d81e-4691-a4be-331305e3f75c.jpg?v=1757333998&width=533'
  },
  {
    handle: 'star-anise-premium',
    name: 'Star Anise (Anasa Puvvu) (Premium Quality)',
    category: 'Spices',
    price: 95,
    originalPrice: 125,
    unit: '100 g',
    image: '/assets/images/products/star_anise_front.jpg',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.12_PM_2_a7222bbd-81fe-4bd2-8e22-c0f5fb85fadd.jpg?v=1757334019&width=533'
  },

  // SEEDS
  {
    handle: 'flax-seeds-premium',
    name: 'Flax Seeds (Premium Quality)',
    category: 'Seeds',
    price: 65,
    originalPrice: 85,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_2_ce2dcb8e-81dc-46c5-b343-1a14dff25208.jpg?v=1757334052&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.16_PM_2_4f6b641a-6fe0-4060-a49a-3fbd827f8271.jpg?v=1757334053&width=533'
  },
  {
    handle: 'chia-seeds-premium',
    name: 'Chia Seeds (Premium Quality)',
    category: 'Seeds',
    price: 95,
    originalPrice: 125,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.01_PM_6b2e5750-03f7-4a0a-b4e3-9ef639891875.jpg?v=1757333987&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.11_AM_88a83afd-35c7-4178-ad6f-170645b5294e.jpg?v=1757333987&width=533'
  },
  {
    handle: 'pumpkin-seeds-premium',
    name: 'Pumpkin Seeds (Premium Quality)',
    category: 'Seeds',
    price: 135,
    originalPrice: 175,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_75dca399-7bd1-4c42-a209-50572b825bbe.jpg?v=1757334052&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.35_PM_19a86791-951c-43dc-a1d8-a901b4762faf.jpg?v=1757334053&width=533'
  },
  {
    handle: 'sunflower-seeds-premium',
    name: 'Sunflower Seeds (Premium Quality)',
    category: 'Seeds',
    price: 85,
    originalPrice: 115,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.36_PM_65a6bce3-18ec-4f09-a579-a554b2d9e336.jpg?v=1757333989&width=533'
  },
  {
    handle: 'watermelon-seeds-premium',
    name: 'Watermelon Seeds (Premium Quality)',
    category: 'Seeds',
    price: 90,
    originalPrice: 120,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_97f038b4-8e5f-4d8c-92db-2f4ea8bd24c0.jpg?v=1757333989&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.19.19_PM_2cfd8d9f-66d1-4abb-bc5d-edf3a4b587e8.jpg?v=1757333989&width=533'
  },
  {
    handle: 'sabja-seeds-premium',
    name: 'Sabja Seeds (Basil Seeds) (Premium Quality)',
    category: 'Seeds',
    price: 75,
    originalPrice: 95,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_1_50ee6a3f-891c-482c-95cd-e8fb3bace709.jpg?v=1757333999&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.11_PM_1_e1ca0568-b1c3-4aac-87b5-07791bc44e34.jpg?v=1757334000&width=533'
  },
  {
    handle: 'sesame-seeds-premium',
    name: 'Sesame Seeds (Til) (Premium Quality)',
    category: 'Seeds',
    price: 80,
    originalPrice: 105,
    unit: '250 g',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.00_AM_-_Copy_ac6c63f6-9657-46dd-a729-82f10320c447.jpg?v=1757333988&width=533'
  }
];

async function syncAllImages() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

        // 1. Remove duplicate sambar chilli powder so only single Chilli Powder exists
        await Product.deleteMany({
            $or: [
                { handle: 'sambar-chilli-powder-premium' },
                { handle: 'chilli-powder-premium-copy' },
                { handle: 'chilli-powder-softgrindingpremium' }
            ]
        });
        console.log('Deleted duplicate chilli powders from DB');

        // 2. Sync all products in MongoDB with exact 2 distinct matching images
        for (const item of CATALOG_DATA) {
            const updateDoc = {
                name: item.name,
                title: item.name,
                category: item.category,
                price: item.price,
                originalPrice: item.originalPrice,
                unit: item.unit,
                image: item.image,
                hoverImage: item.hoverImage,
                images: [
                    { url: item.image, alt: `${item.name} Front` },
                    { url: item.hoverImage, alt: `${item.name} Detail` }
                ],
                imageUrls: [item.image, item.hoverImage]
            };

            await Product.findOneAndUpdate(
                { handle: item.handle },
                { $set: updateDoc },
                { upsert: true, new: true }
            );
            console.log(`Updated DB: ${item.handle}`);
        }

        console.log('✅ All MongoDB products updated with 2 distinct matching images!');

        // 3. Write clean FALLBACK_STOREFRONT_PRODUCTS to assets/js/script.js
        const baseDir = path.join(__dirname, '..');
        const scriptPath = path.join(baseDir, 'assets', 'js', 'script.js');
        let scriptCode = fs.readFileSync(scriptPath, 'utf8');

        const fallbackFull = CATALOG_DATA.map(item => ({
            _id: item.handle,
            id: item.handle,
            handle: item.handle,
            name: item.name,
            title: item.name,
            category: item.category,
            price: item.price,
            originalPrice: item.originalPrice,
            unit: item.unit,
            image: item.image,
            hoverImage: item.hoverImage,
            description: `100% Pure & authentic ${item.name} freshly packed by Arshith Fresh.`,
            rating: 4.9,
            numReviews: 35,
            isFeatured: true,
            countInStock: 40,
            images: [item.image, item.hoverImage],
            imageUrls: [item.image, item.hoverImage]
        }));

        const fbStart = scriptCode.indexOf('const FALLBACK_STOREFRONT_PRODUCTS = [');
        const fbEnd = scriptCode.indexOf('];', fbStart) + 2;

        if (fbStart !== -1 && fbEnd !== -1) {
            scriptCode = scriptCode.substring(0, fbStart) +
                'const FALLBACK_STOREFRONT_PRODUCTS = ' + JSON.stringify(fallbackFull, null, 2) + ';' +
                scriptCode.substring(fbEnd);
            fs.writeFileSync(scriptPath, scriptCode, 'utf8');
            console.log('✅ Updated FALLBACK_STOREFRONT_PRODUCTS in script.js');
        }

        // 4. Update backend/routes/productRoutes.js
        const routesPath = path.join(baseDir, 'backend', 'routes', 'productRoutes.js');
        let routesCode = fs.readFileSync(routesPath, 'utf8');

        const rStart = routesCode.indexOf('const STOREFRONT_PRODUCTS = [');
        const rEnd = routesCode.indexOf('];', rStart) + 2;

        if (rStart !== -1 && rEnd !== -1) {
            routesCode = routesCode.substring(0, rStart) +
                'const STOREFRONT_PRODUCTS = ' + JSON.stringify(fallbackFull, null, 2) + ';' +
                routesCode.substring(rEnd);
            fs.writeFileSync(routesPath, routesCode, 'utf8');
            console.log('✅ Updated STOREFRONT_PRODUCTS in backend/routes/productRoutes.js');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error in syncAllImages:', err);
        process.exit(1);
    }
}

syncAllImages();
