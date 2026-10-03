const express = require('express');
const router = express.Router();

const FALLBACK_CATALOG = [
  {
    "_id": "oil_groundnut_01",
    "id": "groundnut-oil-premium",
    "handle": "groundnut-oil-premium",
    "name": "Groundnut Oil (Premium Quality)",
    "title": "Groundnut Oil (Premium Quality)",
    "category": "Oils",
    "price": 349,
    "originalPrice": 471,
    "unit": "1 L",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.42_PM_1_3752719d-4e83-4d00-a8be-0c4d13076c23.jpg?v=1757334051&width=533",
    "description": "100% Cold-Pressed Wooden Chekku Groundnut Oil.",
    "rating": 4.9,
    "numReviews": 29,
    "isFeatured": true,
    "countInStock": 50,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.42_PM_1_3752719d-4e83-4d00-a8be-0c4d13076c23.jpg?v=1757334051&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.42_PM_1_3752719d-4e83-4d00-a8be-0c4d13076c23.jpg?v=1757334051&width=533"
    ]
  },
  {
    "_id": "oil_sunflower_01",
    "id": "sunflower-oil-premium",
    "handle": "sunflower-oil-premium",
    "name": "Sunflower Oil (Premium Quality)",
    "title": "Sunflower Oil (Premium Quality)",
    "category": "Oils",
    "price": 499,
    "originalPrice": 608,
    "unit": "1 L",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-28_at_4.14.16_PM_1_ee159cd3-c09a-443d-a28c-6c4b116ce904.jpg?v=1757334052&width=533",
    "description": "Pure unrefined wooden-pressed sunflower oil.",
    "rating": 4.9,
    "numReviews": 35,
    "isFeatured": true,
    "countInStock": 45,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-28_at_4.14.16_PM_1_ee159cd3-c09a-443d-a28c-6c4b116ce904.jpg?v=1757334052&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-28_at_4.14.16_PM_1_ee159cd3-c09a-443d-a28c-6c4b116ce904.jpg?v=1757334052&width=533"
    ]
  },
  {
    "_id": "oil_sesame_01",
    "id": "sesame-oil-premium",
    "handle": "sesame-oil-premium",
    "name": "Sesame Oil (Premium Quality)",
    "title": "Sesame Oil (Premium Quality)",
    "category": "Oils",
    "price": 148,
    "originalPrice": 185,
    "unit": "500 ml",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533",
    "description": "Traditional wooden pressed gingelly sesame oil.",
    "rating": 4.9,
    "numReviews": 37,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533"
    ]
  },
  {
    "_id": "oil_castor_01",
    "id": "castor-oil-premium",
    "handle": "castor-oil-premium",
    "name": "Castor Oil (Premium Quality)",
    "title": "Castor Oil (Premium Quality)",
    "category": "Oils",
    "price": 95,
    "originalPrice": 118,
    "unit": "250 ml",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533",
    "description": "100% Pure & Organic Cold Pressed Castor Oil.",
    "rating": 4.9,
    "numReviews": 41,
    "isFeatured": true,
    "countInStock": 30,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.40_PM_1_73d71147-06da-4205-b360-66ad1642a18c.jpg?v=1757334049&width=533"
    ]
  },
  {
    "_id": "oil_coconut_01",
    "id": "coconut-oil-premium",
    "handle": "coconut-oil-premium",
    "name": "Coconut Oil (Premium Quality)",
    "title": "Coconut Oil (Premium Quality)",
    "category": "Oils",
    "price": 165,
    "originalPrice": 214,
    "unit": "500 ml",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533",
    "description": "Pure virgin cold-pressed coconut oil.",
    "rating": 4.9,
    "numReviews": 26,
    "isFeatured": true,
    "countInStock": 35,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.28.41_PM_887d3105-a7d1-45a3-b1b0-e0054291d902.jpg?v=1757334050&width=533"
    ]
  },
  {
    "_id": "oil_mustard_01",
    "id": "mustard-oil-premium",
    "handle": "mustard-oil-premium",
    "name": "Mustard Oil (Premium Quality)",
    "title": "Mustard Oil (Premium Quality)",
    "category": "Oils",
    "price": 115,
    "originalPrice": 150,
    "unit": "500 ml",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533",
    "description": "Pungent cold-pressed raw kachi ghani mustard oil.",
    "rating": 4.9,
    "numReviews": 22,
    "isFeatured": true,
    "countInStock": 25,
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.00.57_PM_64984681-9604-4e2d-9310-2e3b9187bec1.jpg?v=1757334050&width=533"
    ]
  },
  {
    "_id": "ghee_cow_01",
    "id": "pure-cow-ghee-premium",
    "handle": "pure-cow-ghee-premium",
    "slug": "pure-cow-ghee-premium",
    "aliases": ["cow-ghee", "desi-cow-ghee", "a2-cow-ghee"],
    "name": "Pure Cow Ghee (Premium Quality)",
    "title": "Pure Cow Ghee (Premium Quality)",
    "category": "Ghee and Honey",
    "price": 240,
    "originalPrice": 310,
    "unit": "250 ml",
    "image": "/assets/images/products/cow_ghee_front.jpg",
    "hoverImage": "/assets/images/products/cow_ghee_back.jpg",
    "description": "Rich traditional A2 Gir cow ghee made using Vedic bilona method.",
    "rating": 4.9,
    "numReviews": 42,
    "isFeatured": true,
    "countInStock": 45,
    "images": [
      "/assets/images/products/cow_ghee_front.jpg",
      "/assets/images/products/cow_ghee_back.jpg"
    ],
    "imageUrls": [
      "/assets/images/products/cow_ghee_front.jpg",
      "/assets/images/products/cow_ghee_back.jpg"
    ]
  },
  {
    "_id": "ghee_buffalo_01",
    "id": "pure-buffalo-ghee-premium",
    "handle": "pure-buffalo-ghee-premium",
    "name": "Pure Buffalo Ghee (Premium Quality)",
    "title": "Pure Buffalo Ghee (Premium Quality)",
    "category": "Ghee and Honey",
    "price": 222,
    "originalPrice": 288,
    "unit": "250 ml",
    "image": "/assets/images/products/buffalo_ghee_front.jpg",
    "hoverImage": "/assets/images/products/buffalo_ghee_back.jpg",
    "description": "Rich traditional A2 buffalo ghee made using Vedic bilona method.",
    "rating": 4.9,
    "numReviews": 34,
    "isFeatured": true,
    "countInStock": 40,
    "images": [
      "/assets/images/products/buffalo_ghee_front.jpg",
      "/assets/images/products/buffalo_ghee_back.jpg"
    ],
    "imageUrls": [
      "/assets/images/products/buffalo_ghee_front.jpg",
      "/assets/images/products/buffalo_ghee_back.jpg"
    ]
  },
  {
    "_id": "honey_wild_01",
    "id": "natural-honey-premium",
    "handle": "natural-honey-premium",
    "slug": "natural-honey-premium",
    "aliases": ["natural-honey", "raw-wild-honey", "honey"],
    "name": "Pure Natural Honey / Raw Wild Honey (Premium Quality)",
    "title": "Pure Natural Honey / Raw Wild Honey (Premium Quality)",
    "category": "Ghee and Honey",
    "price": 130,
    "originalPrice": 150,
    "unit": "250 g",
    "image": "/assets/images/products/natural_honey_front.jpg",
    "hoverImage": "/assets/images/products/natural_honey_back.jpg",
    "description": "100% pure raw unprocessed wild forest honey naturally harvested.",
    "rating": 4.9,
    "numReviews": 45,
    "isFeatured": true,
    "countInStock": 50,
    "images": [
      "/assets/images/products/natural_honey_front.jpg",
      "/assets/images/products/natural_honey_back.jpg"
    ],
    "imageUrls": [
      "/assets/images/products/natural_honey_front.jpg",
      "/assets/images/products/natural_honey_back.jpg"
    ]
  },
  {
    "_id": "dry_cashew_01",
    "id": "cashew-nuts-premium",
    "handle": "cashew-nuts-premium",
    "name": "Cashew Nuts (Kaju) (Premium Quality)",
    "title": "Cashew Nuts (Kaju) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 265,
    "originalPrice": 340,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b703-43bd-ae6f-6bb812afa6ba.jpg?v=1757334003&width=533",
    "description": "Whole crispy premium cashew nuts rich in antioxidants.",
    "rating": 4.8,
    "numReviews": 39,
    "isFeatured": true,
    "countInStock": 35,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.45.20_AM_2927d0dd-ed7b-43f7-8eb3-0fa0fd2e9a33.jpg?v=1757334004&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b703-43bd-ae6f-6bb812afa6ba.jpg?v=1757334003&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.45.20_AM_2927d0dd-ed7b-43f7-8eb3-0fa0fd2e9a33.jpg?v=1757334004&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b703-43bd-ae6f-6bb812afa6ba.jpg?v=1757334003&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.45.20_AM_2927d0dd-ed7b-43f7-8eb3-0fa0fd2e9a33.jpg?v=1757334004&width=533"
    ]
  },
  {
    "_id": "dry_almonds_01",
    "id": "almonds-premium",
    "handle": "almonds-premium",
    "name": "Almonds (Badam) (Premium Quality)",
    "title": "Almonds (Badam) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 225,
    "originalPrice": 295,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533",
    "description": "Hand-picked California almonds packed with protein.",
    "rating": 4.9,
    "numReviews": 45,
    "isFeatured": true,
    "countInStock": 40,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.36_AM_e4a9990f-ccf1-4aa3-a944-45faa606db78.jpg?v=1757334003&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.36_AM_e4a9990f-ccf1-4aa3-a944-45faa606db78.jpg?v=1757334003&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.36_AM_e4a9990f-ccf1-4aa3-a944-45faa606db78.jpg?v=1757334003&width=533"
    ]
  },
  {
    "_id": "dry_figs_01",
    "id": "figsdry-anjeer-premium",
    "handle": "figsdry-anjeer-premium",
    "name": "Figs (Dry Anjeer) (Premium Quality)",
    "title": "Figs (Dry Anjeer) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 375,
    "originalPrice": 480,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533",
    "description": "Rich, chewy dried figs naturally packed with iron.",
    "rating": 4.9,
    "numReviews": 37,
    "isFeatured": true,
    "countInStock": 20,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.33_AM_2_-_Copy_7c457949-8471-48e0-a565-df11eec16963.jpg?v=1757334000&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.33_AM_2_-_Copy_7c457949-8471-48e0-a565-df11eec16963.jpg?v=1757334000&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.33_AM_2_-_Copy_7c457949-8471-48e0-a565-df11eec16963.jpg?v=1757334000&width=533"
    ]
  },
  {
    "_id": "dry_walnuts_01",
    "id": "walnuts-premium",
    "handle": "walnuts-premium",
    "name": "Walnuts (Akhrot) (Premium Quality)",
    "title": "Walnuts (Akhrot) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 320,
    "originalPrice": 420,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2_372210ff-499e-4854-b1ba-7ac50bb3a105.jpg?v=1757334002&width=533",
    "description": "Raw shelled California walnut halves.",
    "rating": 4.8,
    "numReviews": 30,
    "isFeatured": true,
    "countInStock": 35,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.34_AM_bd399ac2-3177-4f8d-b549-0988071161ae.jpg?v=1757334002&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2_372210ff-499e-4854-b1ba-7ac50bb3a105.jpg?v=1757334002&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.34_AM_bd399ac2-3177-4f8d-b549-0988071161ae.jpg?v=1757334002&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2_372210ff-499e-4854-b1ba-7ac50bb3a105.jpg?v=1757334002&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.34_AM_bd399ac2-3177-4f8d-b549-0988071161ae.jpg?v=1757334002&width=533"
    ]
  },
  {
    "_id": "dry_pistachio_01",
    "id": "pistachio-premium",
    "handle": "pistachio-premium",
    "name": "Pistachio (With Shell) (Premium Quality)",
    "title": "Pistachio (With Shell) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 340,
    "originalPrice": 430,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.30_PM_6c318297-0c92-4757-979e-e2f0cfce82b1.jpg?v=1757333991&width=533",
    "description": "Roasted salted pistachio in shell.",
    "rating": 4.9,
    "numReviews": 28,
    "countInStock": 30,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.35_AM_2_-_Copy_6e558aaf-9cbf-4afa-bb29-1d03db66a34d.jpg?v=1757333991&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.30_PM_6c318297-0c92-4757-979e-e2f0cfce82b1.jpg?v=1757333991&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.35_AM_2_-_Copy_6e558aaf-9cbf-4afa-bb29-1d03db66a34d.jpg?v=1757333991&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.30_PM_6c318297-0c92-4757-979e-e2f0cfce82b1.jpg?v=1757333991&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.35_AM_2_-_Copy_6e558aaf-9cbf-4afa-bb29-1d03db66a34d.jpg?v=1757333991&width=533"
    ]
  },
  {
    "_id": "dry_raisins_01",
    "id": "raisins-premium",
    "handle": "raisins-premium",
    "name": "Raisins (Kishmish) (Premium Quality)",
    "title": "Raisins (Kishmish) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 140,
    "originalPrice": 185,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-23_at_11.08.13_AM_4544f222-c407-433a-b6a9-1bdaf1c17e70.jpg?v=1757334001&width=533",
    "description": "Sweet golden green raisins.",
    "rating": 4.8,
    "numReviews": 25,
    "countInStock": 35,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_4.21.41_PM_51b21c24-d44d-4a17-9cb4-9e8ce025d2e1.jpg?v=1757334001&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-23_at_11.08.13_AM_4544f222-c407-433a-b6a9-1bdaf1c17e70.jpg?v=1757334001&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_4.21.41_PM_51b21c24-d44d-4a17-9cb4-9e8ce025d2e1.jpg?v=1757334001&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-23_at_11.08.13_AM_4544f222-c407-433a-b6a9-1bdaf1c17e70.jpg?v=1757334001&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_4.21.41_PM_51b21c24-d44d-4a17-9cb4-9e8ce025d2e1.jpg?v=1757334001&width=533"
    ]
  },
  {
    "_id": "dry_dates_01",
    "id": "dates-premium",
    "handle": "dates-premium",
    "name": "Dates (Khajoor) (Premium Quality)",
    "title": "Dates (Khajoor) (Premium Quality)",
    "category": "Dry Fruits",
    "price": 180,
    "originalPrice": 230,
    "unit": "500 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_5.03.23_PM_21ec1f88-8a08-488f-a8ce-1967e45fef85.jpg?v=1757333990&width=533",
    "description": "Soft juicy seedless dates.",
    "rating": 4.9,
    "numReviews": 40,
    "countInStock": 40,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.44.26_AM_ee10a09d-9a22-4116-ac94-d36c3e989f6e.jpg?v=1757333990&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_5.03.23_PM_21ec1f88-8a08-488f-a8ce-1967e45fef85.jpg?v=1757333990&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.44.26_AM_ee10a09d-9a22-4116-ac94-d36c3e989f6e.jpg?v=1757333990&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_5.03.23_PM_21ec1f88-8a08-488f-a8ce-1967e45fef85.jpg?v=1757333990&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.44.26_AM_ee10a09d-9a22-4116-ac94-d36c3e989f6e.jpg?v=1757333990&width=533"
    ]
  },
  
  {
    "_id": "podi_chana_01",
    "id": "chana-dal-spice-powder-pappula-podi-premium",
    "handle": "chana-dal-spice-powder-pappula-podi-premium",
    "slug": "chana-dal-spice-powder-pappula-podi-premium",
    "aliases": [
      "chana-dal-spice-powderpappula-podi-premium",
      "chana-dal-spice-powder-pappula-podi-premium",
      "chana-dal-spice-powder",
      "pappula-podi",
      "chana-dal-powder",
      "chana-dal"
    ],
    "name": "Chana Dal Spice Powder / Pappula Podi (Premium Quality)",
    "title": "Chana Dal Spice Powder / Pappula Podi (Premium Quality)",
    "category": "Spice Powders",
    "price": 89,
    "originalPrice": 115,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_2_717030b8-c8a8-40a4-bdf0-7e516dec3029.jpg?v=1757334045&width=533",
    "description": "Authentic homemade Andhra Pappula Podi made with roasted chana dal and spices.",
    "rating": 4.9,
    "numReviews": 32,
    "isFeatured": true,
    "countInStock": 40,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_c2bafc14-a54c-4d90-ad91-a96218301ccf.jpg?v=1757334045&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_2_717030b8-c8a8-40a4-bdf0-7e516dec3029.jpg?v=1757334045&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_c2bafc14-a54c-4d90-ad91-a96218301ccf.jpg?v=1757334045&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_2_717030b8-c8a8-40a4-bdf0-7e516dec3029.jpg?v=1757334045&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_c2bafc14-a54c-4d90-ad91-a96218301ccf.jpg?v=1757334045&width=533"
    ]
  },
  {
    "_id": "podi_kobbari_01",
    "id": "kobbari-karam-podi-premium",
    "handle": "kobbari-karam-podi-premium",
    "slug": "kobbari-karam-podi-premium",
    "aliases": [
      "kobbari-karam-podi-premium",
      "kobbari-karam-podi",
      "kobbari-karam",
      "kobbari-podi"
    ],
    "name": "Kobbari Karam Podi (Premium Quality)",
    "title": "Kobbari Karam Podi (Premium Quality)",
    "category": "Spice Powders",
    "price": 95,
    "originalPrice": 120,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.00_PM_33a6719d-7dd6-4772-add2-2a37e2461d57.jpg?v=1757334044&width=533",
    "description": "Traditional roasted dry coconut karam podi for hot rice and ghee.",
    "rating": 4.9,
    "numReviews": 28,
    "isFeatured": true,
    "countInStock": 35,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.38_PM_1_c7c68b45-ca76-4b30-b6dc-d9cc22cbfe3a.jpg?v=1757334044&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.00_PM_33a6719d-7dd6-4772-add2-2a37e2461d57.jpg?v=1757334044&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.38_PM_1_c7c68b45-ca76-4b30-b6dc-d9cc22cbfe3a.jpg?v=1757334044&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.00_PM_33a6719d-7dd6-4772-add2-2a37e2461d57.jpg?v=1757334044&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.38_PM_1_c7c68b45-ca76-4b30-b6dc-d9cc22cbfe3a.jpg?v=1757334044&width=533"
    ]
  },
  {
    "_id": "podi_nalla_01",
    "id": "nalla-karam-podi-premium",
    "handle": "nalla-karam-podi-premium",
    "slug": "nalla-karam-podi-premium",
    "aliases": [
      "nalla-karam-podi-premium",
      "nalla-karam-podi",
      "nalla-karam"
    ],
    "name": "Nalla Karam Podi (Premium Quality)",
    "title": "Nalla Karam Podi (Premium Quality)",
    "category": "Spice Powders",
    "price": 98,
    "originalPrice": 125,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.02_PM_c823be1b-85bf-4371-8236-9e09b3af2ef5.jpg?v=1757334045&width=533",
    "description": "Spicy authentic black karam podi for idli, dosa, and rice.",
    "rating": 4.9,
    "numReviews": 31,
    "isFeatured": true,
    "countInStock": 30,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_1_0fc408cf-b6bb-4f12-b4ef-41cfefa89e40.jpg?v=1757334045&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.02_PM_c823be1b-85bf-4371-8236-9e09b3af2ef5.jpg?v=1757334045&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_1_0fc408cf-b6bb-4f12-b4ef-41cfefa89e40.jpg?v=1757334045&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.02_PM_c823be1b-85bf-4371-8236-9e09b3af2ef5.jpg?v=1757334045&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.37_PM_1_0fc408cf-b6bb-4f12-b4ef-41cfefa89e40.jpg?v=1757334045&width=533"
    ]
  },
  {
    "_id": "podi_garlic_01",
    "id": "garlic-powder-velluli-karam-podi-premium",
    "handle": "garlic-powder-velluli-karam-podi-premium",
    "slug": "garlic-powder-velluli-karam-podi-premium",
    "aliases": [
      "garlic-powdervelluli-karam-podi-premium",
      "garlic-powder-velluli-karam-podi-premium",
      "garlic-powder",
      "velluli-karam-podi",
      "garlic-powdervelluli"
    ],
    "name": "Garlic Powder / Vellulli Karam Podi (Premium Quality)",
    "title": "Garlic Powder / Vellulli Karam Podi (Premium Quality)",
    "category": "Spice Powders",
    "price": 99,
    "originalPrice": 130,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_3_6262e177-7c59-4137-afc4-5d486daa9175.jpg?v=1757334046&width=533",
    "description": "Aromatic roasted garlic karam podi infused with authentic spices.",
    "rating": 4.9,
    "numReviews": 42,
    "isFeatured": true,
    "countInStock": 45,
    "hoverImage": "/assets/images/products/garlic_powder_back.jpg",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_3_6262e177-7c59-4137-afc4-5d486daa9175.jpg?v=1757334046&width=533",
      "/assets/images/products/garlic_powder_back.jpg"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_3_6262e177-7c59-4137-afc4-5d486daa9175.jpg?v=1757334046&width=533",
      "/assets/images/products/garlic_powder_back.jpg"
    ]
  },
  {
    "_id": "podi_karivepaku_01",
    "id": "karivepaku-karam-podi-premium",
    "handle": "karivepaku-karam-podi-premium",
    "slug": "karivepaku-karam-podi-premium",
    "aliases": [
      "karivepaku-karam-podi-premium",
      "karivepaku-karam-podi",
      "karivepaku-karam"
    ],
    "name": "Karivepaku Karam Podi (Curry Leaves Karam) (Premium Quality)",
    "title": "Karivepaku Karam Podi (Curry Leaves Karam) (Premium Quality)",
    "category": "Spice Powders",
    "price": 95,
    "originalPrice": 125,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_1_445e71a6-1753-4790-b36c-6606bfbd7414.jpg?v=1757334043&width=533",
    "description": "Fresh curry leaves karam podi rich in iron and aroma.",
    "rating": 4.9,
    "numReviews": 27,
    "countInStock": 30,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.44.36_AM_b473978a-44b3-4da2-a619-4863c0fc1e5b.jpg?v=1757334043&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_1_445e71a6-1753-4790-b36c-6606bfbd7414.jpg?v=1757334043&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.44.36_AM_b473978a-44b3-4da2-a619-4863c0fc1e5b.jpg?v=1757334043&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.19.01_PM_1_445e71a6-1753-4790-b36c-6606bfbd7414.jpg?v=1757334043&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.44.36_AM_b473978a-44b3-4da2-a619-4863c0fc1e5b.jpg?v=1757334043&width=533"
    ]
  },
  {
    "_id": "spice_garam_masala_01",
    "id": "garam-masala-powder-premium",
    "handle": "garam-masala-powder-premium",
    "name": "Garam Masala Powder (Premium Quality)",
    "title": "Garam Masala Powder (Premium Quality)",
    "category": "Spice Powders",
    "price": 110,
    "originalPrice": 145,
    "unit": "100 g",
    "image": "/assets/images/products/garam_masala_front.jpg",
    "description": "Rich roasted aromatic garam masala powder.",
    "rating": 4.9,
    "numReviews": 35,
    "countInStock": 40,
    "hoverImage": "/assets/images/products/garam_masala_back.jpg",
    "images": [
      "/assets/images/products/garam_masala_front.jpg",
      "/assets/images/products/garam_masala_back.jpg"
    ],
    "imageUrls": [
      "/assets/images/products/garam_masala_front.jpg",
      "/assets/images/products/garam_masala_back.jpg"
    ]
  },
  {
    "_id": "spice_pepper_01",
    "id": "pepper-powder-premium",
    "handle": "pepper-powder-premium",
    "name": "Black Pepper Powder (Premium Quality)",
    "title": "Black Pepper Powder (Premium Quality)",
    "category": "Spice Powders",
    "price": 95,
    "originalPrice": 125,
    "unit": "100 g",
    "image": "/assets/images/products/pepper_powder_front.jpg",
    "description": "Pure freshly ground black pepper powder.",
    "rating": 4.9,
    "numReviews": 24,
    "countInStock": 30,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.04.27_AM_fdc73816-1464-4430-93ba-4bde3c52f6ad.jpg?v=1757334023&width=533",
    "images": [
      "/assets/images/products/pepper_powder_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.04.27_AM_fdc73816-1464-4430-93ba-4bde3c52f6ad.jpg?v=1757334023&width=533"
    ],
    "imageUrls": [
      "/assets/images/products/pepper_powder_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_11.04.27_AM_fdc73816-1464-4430-93ba-4bde3c52f6ad.jpg?v=1757334023&width=533"
    ]
  },
  {
    "_id": "spice_black_pepper_01",
    "id": "black-pepper-premium",
    "handle": "black-pepper-premium",
    "name": "Black Pepper (Whole) (Premium Quality)",
    "title": "Black Pepper (Whole) (Premium Quality)",
    "category": "Spices",
    "price": 120,
    "originalPrice": 160,
    "unit": "100 g",
    "image": "/assets/images/products/black_pepper_front.jpg",
    "description": "Whole aromatic black pepper corns.",
    "rating": 4.9,
    "numReviews": 29,
    "countInStock": 35,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.11_PM_1_30a1bf5b-4da7-42a6-92d6-9f209d0d91c0.jpg?v=1757333996&width=533",
    "images": [
      "/assets/images/products/black_pepper_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.11_PM_1_30a1bf5b-4da7-42a6-92d6-9f209d0d91c0.jpg?v=1757333996&width=533"
    ],
    "imageUrls": [
      "/assets/images/products/black_pepper_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.11_PM_1_30a1bf5b-4da7-42a6-92d6-9f209d0d91c0.jpg?v=1757333996&width=533"
    ]
  },
  {
    "_id": "spice_cloves_01",
    "id": "cloves-premium",
    "handle": "cloves-premium",
    "name": "Cloves (Lavangalu) (Premium Quality)",
    "title": "Cloves (Lavangalu) (Premium Quality)",
    "category": "Spices",
    "price": 135,
    "originalPrice": 175,
    "unit": "50 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.33.17_PM_e7455739-c811-4135-8760-da32b445f0f0.jpg?v=1757333998&width=533",
    "description": "Aromatic whole cloves.",
    "rating": 4.9,
    "numReviews": 26,
    "countInStock": 30,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.09_PM_d713ec77-5974-4551-9346-b1e592b0a512.jpg?v=1757333998&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.33.17_PM_e7455739-c811-4135-8760-da32b445f0f0.jpg?v=1757333998&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.09_PM_d713ec77-5974-4551-9346-b1e592b0a512.jpg?v=1757333998&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.33.17_PM_e7455739-c811-4135-8760-da32b445f0f0.jpg?v=1757333998&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.09_PM_d713ec77-5974-4551-9346-b1e592b0a512.jpg?v=1757333998&width=533"
    ]
  },
  {
    "_id": "spice_cardamom_01",
    "id": "cardamom-premium",
    "handle": "cardamom-premium",
    "name": "Cardamom (Elaichi) (Premium Quality)",
    "title": "Cardamom (Elaichi) (Premium Quality)",
    "category": "Spices",
    "price": 195,
    "originalPrice": 250,
    "unit": "50 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.41.25_PM_dd385152-2aab-4061-9f20-60f6b9fec186.jpg?v=1757333997&width=533",
    "description": "Green whole cardamom pods.",
    "rating": 4.9,
    "numReviews": 30,
    "countInStock": 35,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_c6567ba5-d81e-4691-a4be-331305e3f75c.jpg?v=1757333998&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.41.25_PM_dd385152-2aab-4061-9f20-60f6b9fec186.jpg?v=1757333997&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_c6567ba5-d81e-4691-a4be-331305e3f75c.jpg?v=1757333998&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-12_at_12.41.25_PM_dd385152-2aab-4061-9f20-60f6b9fec186.jpg?v=1757333997&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.10_PM_c6567ba5-d81e-4691-a4be-331305e3f75c.jpg?v=1757333998&width=533"
    ]
  },
  {
    "_id": "spice_cinnamon_01",
    "id": "cinnamon-premium",
    "handle": "cinnamon-premium",
    "name": "Cinnamon Sticks (Kerala Style) (Premium Quality)",
    "title": "Cinnamon Sticks (Kerala Style) (Premium Quality)",
    "category": "Spices",
    "price": 115,
    "originalPrice": 150,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/cinnamon_bd2c52bb-d2df-4d09-baca-93aab2223e68.jpg?v=1757333965&width=533",
    "description": "Pure aromatic cinnamon bark.",
    "rating": 4.9,
    "numReviews": 22,
    "countInStock": 40,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-12_at_11.48.48_AM.jpg?v=1757333965&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/cinnamon_bd2c52bb-d2df-4d09-baca-93aab2223e68.jpg?v=1757333965&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-12_at_11.48.48_AM.jpg?v=1757333965&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/cinnamon_bd2c52bb-d2df-4d09-baca-93aab2223e68.jpg?v=1757333965&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-12_at_11.48.48_AM.jpg?v=1757333965&width=533"
    ]
  },
  {
    "_id": "spice_mix_masala_01",
    "id": "mix-masala-premium",
    "handle": "mix-masala-premium",
    "name": "Mix Masala Powder (Premium Quality)",
    "title": "Mix Masala Powder (Premium Quality)",
    "category": "Spice Powders",
    "price": 105,
    "originalPrice": 135,
    "unit": "100 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/biriyani_masala_mix_0ea70b9d-998e-45e0-88e4-dd70361ffe2e.jpg?v=1757333993&width=533",
    "description": "Traditional curry mix masala.",
    "rating": 4.9,
    "numReviews": 25,
    "countInStock": 35,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_10.16.09_PM_758e91ab-7cdb-4df9-823b-34809ffe2742.jpg?v=1757333993&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/biriyani_masala_mix_0ea70b9d-998e-45e0-88e4-dd70361ffe2e.jpg?v=1757333993&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_10.16.09_PM_758e91ab-7cdb-4df9-823b-34809ffe2742.jpg?v=1757333993&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/biriyani_masala_mix_0ea70b9d-998e-45e0-88e4-dd70361ffe2e.jpg?v=1757333993&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_10.16.09_PM_758e91ab-7cdb-4df9-823b-34809ffe2742.jpg?v=1757333993&width=533"
    ]
  },
  {
    "_id": "spice_star_anise_01",
    "id": "star-anise-premium",
    "handle": "star-anise-premium",
    "name": "Star Anise (Anasa Puvvu) (Premium Quality)",
    "title": "Star Anise (Anasa Puvvu) (Premium Quality)",
    "category": "Spices",
    "price": 125,
    "originalPrice": 160,
    "unit": "50 g",
    "image": "/assets/images/products/star_anise_front.jpg",
    "description": "Aromatic whole star anise.",
    "rating": 4.9,
    "numReviews": 19,
    "countInStock": 30,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.12_PM_2_a7222bbd-81fe-4bd2-8e22-c0f5fb85fadd.jpg?v=1757334019&width=533",
    "images": [
      "/assets/images/products/star_anise_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.12_PM_2_a7222bbd-81fe-4bd2-8e22-c0f5fb85fadd.jpg?v=1757334019&width=533"
    ],
    "imageUrls": [
      "/assets/images/products/star_anise_front.jpg",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.12_PM_2_a7222bbd-81fe-4bd2-8e22-c0f5fb85fadd.jpg?v=1757334019&width=533"
    ]
  },
  {
    "_id": "seed_flax_01",
    "id": "flax-seeds-premium",
    "handle": "flax-seeds-premium",
    "name": "Flax Seeds (Premium Quality)",
    "title": "Flax Seeds (Premium Quality)",
    "category": "Dry Seeds",
    "price": 75,
    "originalPrice": 95,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_2_ce2dcb8e-81dc-46c5-b343-1a14dff25208.jpg?v=1757334052&width=533",
    "description": "Raw organic flax seeds rich in Omega-3 fatty acids.",
    "rating": 4.8,
    "numReviews": 24,
    "isFeatured": true,
    "countInStock": 50,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.16_PM_2_4f6b641a-6fe0-4060-a49a-3fbd827f8271.jpg?v=1757334053&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_2_ce2dcb8e-81dc-46c5-b343-1a14dff25208.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.16_PM_2_4f6b641a-6fe0-4060-a49a-3fbd827f8271.jpg?v=1757334053&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_2_ce2dcb8e-81dc-46c5-b343-1a14dff25208.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.16_PM_2_4f6b641a-6fe0-4060-a49a-3fbd827f8271.jpg?v=1757334053&width=533"
    ]
  },
  {
    "_id": "seed_chia_01",
    "id": "chia-seeds-premium",
    "handle": "chia-seeds-premium",
    "name": "Chia Seeds (Premium Quality)",
    "title": "Chia Seeds (Premium Quality)",
    "category": "Dry Seeds",
    "price": 145,
    "originalPrice": 180,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.01_PM_6b2e5750-03f7-4a0a-b4e3-9ef639891875.jpg?v=1757333987&width=533",
    "description": "Nutritious raw black chia seeds packed with fiber.",
    "rating": 4.9,
    "numReviews": 38,
    "isFeatured": true,
    "countInStock": 40,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.11_AM_88a83afd-35c7-4178-ad6f-170645b5294e.jpg?v=1757333987&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.01_PM_6b2e5750-03f7-4a0a-b4e3-9ef639891875.jpg?v=1757333987&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.11_AM_88a83afd-35c7-4178-ad6f-170645b5294e.jpg?v=1757333987&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.01_PM_6b2e5750-03f7-4a0a-b4e3-9ef639891875.jpg?v=1757333987&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.11_AM_88a83afd-35c7-4178-ad6f-170645b5294e.jpg?v=1757333987&width=533"
    ]
  },
  {
    "_id": "seed_pumpkin_01",
    "id": "pumpkin-seeds-premium",
    "handle": "pumpkin-seeds-premium",
    "name": "Pumpkin Seeds (Premium Quality)",
    "title": "Pumpkin Seeds (Premium Quality)",
    "category": "Dry Seeds",
    "price": 160,
    "originalPrice": 210,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_75dca399-7bd1-4c42-a209-50572b825bbe.jpg?v=1757334052&width=533",
    "description": "Raw shelled green pumpkin seeds rich in zinc and magnesium.",
    "rating": 4.9,
    "numReviews": 29,
    "isFeatured": true,
    "countInStock": 35,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.35_PM_19a86791-951c-43dc-a1d8-a901b4762faf.jpg?v=1757334053&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_75dca399-7bd1-4c42-a209-50572b825bbe.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.35_PM_19a86791-951c-43dc-a1d8-a901b4762faf.jpg?v=1757334053&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_75dca399-7bd1-4c42-a209-50572b825bbe.jpg?v=1757334052&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.35_PM_19a86791-951c-43dc-a1d8-a901b4762faf.jpg?v=1757334053&width=533"
    ]
  },
  {
    "_id": "seed_sunflower_01",
    "id": "sunflower-seeds-premium",
    "handle": "sunflower-seeds-premium",
    "name": "Sunflower Seeds (Premium Quality)",
    "title": "Sunflower Seeds (Premium Quality)",
    "category": "Dry Seeds",
    "price": 135,
    "originalPrice": 175,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533",
    "description": "Raw peeled sunflower seeds.",
    "rating": 4.8,
    "numReviews": 25,
    "countInStock": 40,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.36_PM_65a6bce3-18ec-4f09-a579-a554b2d9e336.jpg?v=1757333989&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.36_PM_65a6bce3-18ec-4f09-a579-a554b2d9e336.jpg?v=1757333989&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_1_6a153ddd-2028-47c7-8388-3b9f9c660240.jpg?v=1757333989&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_7.43.36_PM_65a6bce3-18ec-4f09-a579-a554b2d9e336.jpg?v=1757333989&width=533"
    ]
  },
  {
    "_id": "seed_watermelon_01",
    "id": "watermelon-seeds-premium",
    "handle": "watermelon-seeds-premium",
    "name": "Watermelon Seeds (Premium Quality)",
    "title": "Watermelon Seeds (Premium Quality)",
    "category": "Dry Seeds",
    "price": 150,
    "originalPrice": 195,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_97f038b4-8e5f-4d8c-92db-2f4ea8bd24c0.jpg?v=1757333989&width=533",
    "description": "Raw shelled watermelon kernels.",
    "rating": 4.9,
    "numReviews": 22,
    "countInStock": 35,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.19.19_PM_2cfd8d9f-66d1-4abb-bc5d-edf3a4b587e8.jpg?v=1757333989&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_97f038b4-8e5f-4d8c-92db-2f4ea8bd24c0.jpg?v=1757333989&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.19.19_PM_2cfd8d9f-66d1-4abb-bc5d-edf3a4b587e8.jpg?v=1757333989&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.03_PM_97f038b4-8e5f-4d8c-92db-2f4ea8bd24c0.jpg?v=1757333989&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.19.19_PM_2cfd8d9f-66d1-4abb-bc5d-edf3a4b587e8.jpg?v=1757333989&width=533"
    ]
  },
  {
    "_id": "seed_sabja_01",
    "id": "sabja-seeds-premium",
    "handle": "sabja-seeds-premium",
    "name": "Sabja Seeds (Basil Seeds) (Premium Quality)",
    "title": "Sabja Seeds (Basil Seeds) (Premium Quality)",
    "category": "Dry Seeds",
    "price": 110,
    "originalPrice": 145,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_1_50ee6a3f-891c-482c-95cd-e8fb3bace709.jpg?v=1757333999&width=533",
    "description": "Natural cooling sweet basil seeds.",
    "rating": 4.8,
    "numReviews": 31,
    "countInStock": 45,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.11_PM_1_e1ca0568-b1c3-4aac-87b5-07791bc44e34.jpg?v=1757334000&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_1_50ee6a3f-891c-482c-95cd-e8fb3bace709.jpg?v=1757333999&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.11_PM_1_e1ca0568-b1c3-4aac-87b5-07791bc44e34.jpg?v=1757334000&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.04.02_PM_1_50ee6a3f-891c-482c-95cd-e8fb3bace709.jpg?v=1757333999&width=533",
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.00.11_PM_1_e1ca0568-b1c3-4aac-87b5-07791bc44e34.jpg?v=1757334000&width=533"
    ]
  },
  {
    "_id": "seed_sesame_01",
    "id": "sesame-seeds-premium",
    "handle": "sesame-seeds-premium",
    "name": "Sesame Seeds (Til) (Premium Quality)",
    "title": "Sesame Seeds (Til) (Premium Quality)",
    "category": "Dry Seeds",
    "price": 95,
    "originalPrice": 125,
    "unit": "250 g",
    "image": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.00_AM_-_Copy_ac6c63f6-9657-46dd-a729-82f10320c447.jpg?v=1757333988&width=533",
    "description": "Cleaned white sesame til seeds.",
    "rating": 4.8,
    "numReviews": 27,
    "countInStock": 45,
    "hoverImage": "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.00_AM_-_Copy_ac6c63f6-9657-46dd-a729-82f10320c447.jpg?v=1757333988&width=533",
    "images": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.00_AM_-_Copy_ac6c63f6-9657-46dd-a729-82f10320c447.jpg?v=1757333988&width=533"
    ],
    "imageUrls": [
      "https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.43.00_AM_-_Copy_ac6c63f6-9657-46dd-a729-82f10320c447.jpg?v=1757333988&width=533"
    ]
  }
];

const Product = require('../models/Product');
const { sendStockAlertNotification } = require('../utils/notificationService');

// Helper to format product consistently for both frontend storefront & admin dashboards
function formatProduct(p) {
  if (!p || typeof p !== 'object') return p;
  const obj = p.toObject ? p.toObject() : { ...p };
  if (obj._id) obj._id = obj._id.toString();
  obj.title = obj.title || obj.name || 'Untitled Product';
  obj.name = obj.name || obj.title || 'Untitled Product';
  obj.handle = obj.handle || obj.slug || (obj.name ? obj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : (obj.id || obj._id || ''));
  obj.id = obj.id || obj.handle || obj._id;
  obj.slug = obj.slug || obj.handle;

  const extracted = [];
  const addCandidate = (val) => {
    if (!val) return;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed && !trimmed.includes('placeholder.svg') && !extracted.includes(trimmed)) extracted.push(trimmed);
    } else if (typeof val === 'object') {
      const url = (val.url || val.src || val.path || val.location || '').trim();
      if (url && !url.includes('placeholder.svg') && !extracted.includes(url)) extracted.push(url);
    }
  };

  if (Array.isArray(obj.images)) obj.images.forEach(addCandidate);
  if (Array.isArray(obj.imageUrls)) obj.imageUrls.forEach(addCandidate);
  if (Array.isArray(obj.photos)) obj.photos.forEach(addCandidate);

  addCandidate(obj.image);
  addCandidate(obj.imageUrl);
  addCandidate(obj.image_url);
  addCandidate(obj.img);
  addCandidate(obj.thumbnail);
  addCandidate(obj.thumb);
  addCandidate(obj.photo);
  addCandidate(obj.src);

  // If no candidates, lookup in FALLBACK_CATALOG or keyword map
  if (extracted.length === 0) {
    const pId = String(obj.id || obj._id || obj.handle || obj.slug || '').toLowerCase();
    const pName = String(obj.name || obj.title || '').toLowerCase();
    const pCategory = String(obj.category || '').toLowerCase();

    if (typeof FALLBACK_CATALOG !== 'undefined' && Array.isArray(FALLBACK_CATALOG)) {
      const catMatch = FALLBACK_CATALOG.find(item => {
        const itemId = String(item.id || item._id || item.handle || item.slug || '').toLowerCase();
        const itemAliases = Array.isArray(item.aliases) ? item.aliases.map(a => String(a).toLowerCase()) : [];
        const itemName = String(item.name || item.title || '').toLowerCase();

        if (pId && (itemId === pId || itemAliases.includes(pId))) return true;
        if (pId && itemId && (itemId.includes(pId) || pId.includes(itemId))) return true;
        if (pName && itemName && (itemName === pName || itemName.includes(pName) || pName.includes(itemName))) return true;
        return false;
      });

      if (catMatch) {
        addCandidate(catMatch.image);
        addCandidate(catMatch.imageUrl);
        if (Array.isArray(catMatch.images)) catMatch.images.forEach(addCandidate);
      }
    }

    if (extracted.length === 0) {
      const combinedText = `${pId} ${pName} ${pCategory}`.toLowerCase();
      const KEYWORD_IMAGE_MAP = [
        { keys: ['flax'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_3_18ce6eb7-bb03-4cc0-843e-c6e0bf3e0a29.jpg?v=1757334005&width=533' },
        { keys: ['chia'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_1_5a2dd782-b7e9-4467-9bb3-93cfc319c5c2.jpg?v=1757334005&width=533' },
        { keys: ['pumpkin'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_1_a2bcbc97-5a21-4f36-93a8-6f6a78248a3c.jpg?v=1757334006&width=533' },
        { keys: ['sunflower seed', 'sunflower-seed'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_1_a2bcbc97-5a21-4f36-93a8-6f6a78248a3c.jpg?v=1757334006&width=533' },
        { keys: ['watermelon seed', 'watermelon-seed'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_1_a2bcbc97-5a21-4f36-93a8-6f6a78248a3c.jpg?v=1757334006&width=533' },
        { keys: ['sabja', 'basil seed'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_1_5a2dd782-b7e9-4467-9bb3-93cfc319c5c2.jpg?v=1757334005&width=533' },
        { keys: ['poppy', 'khasa'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_1_5a2dd782-b7e9-4467-9bb3-93cfc319c5c2.jpg?v=1757334005&width=533' },
        { keys: ['groundnut oil', 'groundnut-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533' },
        { keys: ['sunflower oil', 'sunflower-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM.jpg?v=1757334052&width=533' },
        { keys: ['sesame oil', 'sesame-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533' },
        { keys: ['castor'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533' },
        { keys: ['coconut oil', 'coconut-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_2.jpg?v=1757334050&width=533' },
        { keys: ['mustard oil', 'mustard-oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-06_at_4.24.45_PM.jpg?v=1757334050&width=533' },
        { keys: ['neem'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_3.jpg?v=1757334049&width=533' },
        { keys: ['ghee', 'honey'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_4.34.52_PM.jpg?v=1757934372&width=533' },
        { keys: ['cashew', 'kaju'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b7e9-4467-9bb3-93cfc319c5c2.jpg?v=1757334003&width=533' },
        { keys: ['almond', 'badam'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533' },
        { keys: ['fig', 'anjeer'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533' },
        { keys: ['walnut', 'akhrot'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2_372210ff-499e-4854-b1ba-7ac50bb3a105.jpg?v=1757334002&width=533' },
        { keys: ['pistachio', 'pista'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_7.45.38_PM_83923da9-b7e9-4467-9bb3-93cfc319c5c2.jpg?v=1757334003&width=533' },
        { keys: ['raisin', 'kishmish'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_2112456d-40bc-4ca8-a380-52828943ee32.jpg?v=1757334003&width=533' },
        { keys: ['date', 'khajoor'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-16_at_6.03.06_PM_34ff0f49-adf5-47c3-979c-8e5ab7a6db71.jpg?v=1757334000&width=533' },
        { keys: ['chana', 'pappula'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-10_at_3.02.27_PM_4.jpg?v=1757333956&width=533' },
        { keys: ['nalla'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-10_at_3.02.27_PM_2_ad9e67d2-ec10-4ed3-89ef-fa55c91be8df.jpg?v=1757333955&width=533' },
        { keys: ['kobbari'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-31_at_7.42.30_PM_1_92dd0928-e3ea-4b36-84ec-ea82c7efd33f.jpg?v=1758619712&width=533' },
        { keys: ['karivepaku', 'garlic', 'velluli'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-10_at_3.02.27_PM_1_a625cb73-82ef-4d39-b9ee-eebfb4a8b7ea.jpg?v=1757333954&width=533' },
        { keys: ['podi', 'karam', 'powder', 'masala', 'chilli'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_7.59.11_PM_1_30a1bf5b-4da7-42a6-92d6-9f209d0d91c0.jpg?v=1757333996&width=533' },
        { keys: ['pickle', 'avakai'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-20_at_12.12.10_PM_1_7e869e3d-6430-4313-8bcd-0f07e53ad1ed.jpg?v=1757333951' },
        { keys: ['seed'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_4.52.28_PM_3_18ce6eb7-bb03-4cc0-843e-c6e0bf3e0a29.jpg?v=1757334005&width=533' },
        { keys: ['oil'], url: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-22_at_11.41.18_AM_1.jpg?v=1757334051&width=533' }
      ];

      for (const mapItem of KEYWORD_IMAGE_MAP) {
        if (mapItem.keys.some(k => combinedText.includes(k))) {
          addCandidate(mapItem.url);
          break;
        }
      }
    }
  }

  const formattedImages = extracted.map(url => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/')) {
      return url;
    }
    if (url.startsWith('//')) {
      return 'https:' + url;
    }
    return url.startsWith('/') ? url : '/' + url;
  }).filter(Boolean);

  obj.images = formattedImages.map(url => ({ url, alt: obj.name }));
  obj.image = formattedImages.length > 0 ? formattedImages[0] : '';
  obj.imageUrls = formattedImages;

  return obj;
}

// @route   GET /api/products
// @desc    Get all products (with optional keyword search & category filter)
router.get('/', async (req, res) => {
  try {
    const { keyword, category } = req.query;
    let filter = {};

    if (category && category !== 'All') {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter);

    // Canonical display priority order matching original homepage layout
    const PRIORITY_ORDER = [
      'groundnut oil',
      'sunflower oil',
      'sesame oil',
      'castor oil',
      'coconut oil',
      'mustard oil',
      'buffalo ghee',
      'cashew',
      'almond',
      'fig',
      'flax',
      'chia',
      'pumpkin',
      'chana dal',
      'garlic powder',
      'kandi podi',
      'cloves',
      'cardamom',
      'rock salt'
    ];

    products.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();

      let idxA = PRIORITY_ORDER.findIndex(p => nameA.includes(p));
      let idxB = PRIORITY_ORDER.findIndex(p => nameB.includes(p));

      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;

      return idxA - idxB;
    });

    res.json(products.map(formatProduct));
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID, _id, handle, slug, or title search
router.get('/:id', async (req, res) => {
  try {
    const rawParam = (req.params.id || '').trim();
    if (!rawParam) {
      return res.status(400).json({ message: 'Product ID required' });
    }

    let product = null;

    // 1. Try finding by Mongoose ObjectId if 24-char hex string
    if (rawParam.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        product = await Product.findById(rawParam);
      } catch (e) {}
    }

    // 2. Try finding by exact handle, slug, or id in MongoDB
    if (!product) {
      product = await Product.findOne({
        $or: [
          { handle: rawParam },
          { slug: rawParam },
          { id: rawParam }
        ]
      });
    }

    // 3. Try finding by exact normalized alphanumeric key in MongoDB
    if (!product) {
      const cleanKey = rawParam.toLowerCase().replace(/[^a-z0-9]/g, '');
      const allDocs = await Product.find({});
      product = allDocs.find(p => {
        const pIdKey = String(p.id || p._id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const pHandleKey = String(p.handle || p.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const pNameKey = String(p.name || p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return (pIdKey && pIdKey === cleanKey) || (pHandleKey && pHandleKey === cleanKey) || (pNameKey && pNameKey === cleanKey);
      });
    }

    // 4. Fallback search in FALLBACK_CATALOG
    if (!product && typeof FALLBACK_CATALOG !== 'undefined' && Array.isArray(FALLBACK_CATALOG)) {
      const target = rawParam.toLowerCase();
      const cleanTarget = target.replace(/[^a-z0-9]/g, '');
      const match = FALLBACK_CATALOG.find(p => {
        const pId = String(p.id || p._id || p.handle || p.slug || '').toLowerCase();
        const pName = String(p.name || p.title || '').toLowerCase();
        const pCleanId = pId.replace(/[^a-z0-9]/g, '');
        const pCleanName = pName.replace(/[^a-z0-9]/g, '');
        return pId === target || pName === target || (pCleanId && pCleanId === cleanTarget) || (pCleanName && pCleanName === cleanTarget);
      });
      if (match) return res.json(formatProduct(match));
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(formatProduct(product));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a new product (Admin)
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };

    // Support field aliases
    if (!data.name && data.title) {
      data.name = data.title;
    }
    if (!data.name) {
      data.name = 'New Product';
    }
    if (!data.category) {
      data.category = data.type || data.productType || 'General';
    }
    if (data.price === undefined || data.price === null || isNaN(Number(data.price))) {
      data.price = 0;
    } else {
      data.price = Number(data.price);
    }

    // Normalize images array
    if (Array.isArray(data.images)) {
      data.images = data.images.map(img => {
        if (typeof img === 'string') return { url: img.trim(), alt: '' };
        if (img && typeof img === 'object') return { url: (img.url || '').trim(), alt: (img.alt || '').trim() };
        return null;
      }).filter(img => img && img.url);

      const seen = new Set();
      data.images = data.images.filter(img => {
        if (seen.has(img.url)) return false;
        seen.add(img.url);
        return true;
      });

      if (data.images.length > 0) {
        data.image = data.images[0].url;
      }
    } else if (data.image && typeof data.image === 'string' && data.image.trim()) {
      data.images = [{ url: data.image.trim(), alt: '' }];
    }

    const newProduct = new Product(data);
    const savedProduct = await newProduct.save();
    res.status(201).json(formatProduct(savedProduct));
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message || 'Error creating product', error: error.message });
  }
});

// =========================================================================
// BULK OPERATIONS (MUST BE DEFINED BEFORE /:id ROUTES)
// =========================================================================

// @route   POST /api/products/bulk-delete
// @desc    Bulk delete products (Admin)
router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of product IDs' });
    }
    const result = await Product.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `Successfully deleted ${result.deletedCount} products`, count: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error performing bulk product delete', error: error.message });
  }
});

// @route   PUT /api/products/bulk-stock
// @desc    Bulk update stock quantities (Admin)
router.put('/bulk-stock', async (req, res) => {
  try {
    const { ids, quantity, operation } = req.body; // operation: 'set' | 'add'
    if (!Array.isArray(ids) || ids.length === 0 || quantity === undefined) {
      return res.status(400).json({ message: 'Please provide product IDs and quantity' });
    }

    const targetQty = Number(quantity);
    let updatedCount = 0;

    const products = await Product.find({ _id: { $in: ids } });
    for (const p of products) {
      const cur = Number(p.countInStock || 0);
      const newSt = operation === 'add' ? Math.max(0, cur + targetQty) : Math.max(0, targetQty);
      p.countInStock = newSt;
      await p.save();
      updatedCount++;

      // Trigger low stock / out of stock email alert to admin if stock <= 10
      if (newSt <= 10) {
        sendStockAlertNotification({ product: p, newStock: newSt }).catch(err => {
          console.error('Error sending stock alert notification on bulk stock update:', err.message);
        });
      }
    }

    res.json({ success: true, message: `Updated stock for ${updatedCount} products`, count: updatedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bulk stock', error: error.message });
  }
});

// @route   PUT /api/products/bulk-category
// @desc    Bulk update category / subcategory (Admin)
router.put('/bulk-category', async (req, res) => {
  try {
    const { ids, category, subcategory } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !category) {
      return res.status(400).json({ message: 'Please provide product IDs and a category' });
    }
    const updateFields = { category };
    if (subcategory !== undefined) updateFields.subcategory = subcategory;

    const result = await Product.updateMany(
      { _id: { $in: ids } },
      { $set: updateFields }
    );
    res.json({ success: true, message: `Updated category for ${result.modifiedCount} products`, count: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bulk category', error: error.message });
  }
});

// @route   PUT /api/products/bulk-status
// @desc    Bulk update status (Active, Draft, Archived) (Admin)
router.put('/bulk-status', async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !status) {
      return res.status(400).json({ message: 'Please provide product IDs and a status' });
    }
    const result = await Product.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );
    res.json({ success: true, message: `Updated status to "${status}" for ${result.modifiedCount} products`, count: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bulk status', error: error.message });
  }
});

// =========================================================================
// PARAMETERIZED /:id ROUTES
// =========================================================================

// @route   GET /api/products/:id/reviews
// @desc    Get all reviews for a product
router.get('/:id/reviews', async (req, res) => {
  try {
    const rawId = (req.params.id || '').trim();
    let product = null;

    if (rawId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(rawId);
    }
    if (!product && rawId) {
      const cleanSlug = rawId.replace(/-/g, ' ').trim();
      product = await Product.findOne({ name: { $regex: cleanSlug, $options: 'i' } });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = (product.reviews && product.reviews.length > 0) ? product.reviews : [];
    res.json({
      success: true,
      productId: product._id,
      rating: product.rating || 0,
      numReviews: (product.reviews && product.reviews.length > 0) ? product.reviews.length : 0,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create a new review for a product
router.post('/:id/reviews', async (req, res) => {
  try {
    const { name, rating, title, comment } = req.body;
    const rawId = (req.params.id || '').trim();

    if (!rating || !comment || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, star rating, and review description'
      });
    }

    let product = null;
    if (rawId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(rawId);
    }
    if (!product && rawId) {
      const cleanSlug = rawId.replace(/-/g, ' ').trim();
      product = await Product.findOne({ name: { $regex: cleanSlug, $options: 'i' } });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const newReview = {
      name: name.trim(),
      rating: Number(rating),
      title: (title || '').trim() || `${Number(rating)} Star Rating`,
      comment: comment.trim(),
      createdAt: new Date()
    };

    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }

    product.reviews.unshift(newReview);
    product.numReviews = product.reviews.length;
    
    // Recalculate average rating
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;

    await product.save();

    res.status(201).json({
      success: true,
      message: '🎉 Review submitted successfully! Thank you for your feedback.',
      review: newReview,
      product: {
        _id: product._id,
        rating: product.rating,
        numReviews: product.numReviews,
        reviews: product.reviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding review', error: error.message });
  }
});

module.exports = router;
