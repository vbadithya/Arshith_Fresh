const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://valavalabalaadithya_db_user:arshith@cluster0.hwgf3hh.mongodb.net/arshith_Fresh?appName=Cluster0';

const rawProductsList = [
  // 1-8
  {
    name: 'Chilli Powder Premium',
    handle: 'chilli-powder-premium-copy',
    category: 'Spice Powders',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-31_at_7.42.30_PM_1_92dd0928-e3ea-4b36-84ec-ea82c7efd33f.jpg?v=1758619712',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/ChiliPowder1img.jpg?v=1758707697',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/ChiliPowder_img2.jpg?v=1758707711'
    ]
  },
  {
    name: 'Chilli Powder (Premium)',
    handle: 'chilli-powder-softgrindingpremium',
    category: 'Spice Powders',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-31_at_7.42.30_PM_1_92dd0928-e3ea-4b36-84ec-ea82c7efd33f.jpg?v=1758619712',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/ChiliPowder1img_fcb89557-d7f7-4978-b739-055e63849348.jpg?v=1759208024'
    ]
  },
  {
    name: 'Dry-Seeds-Combo (Premium Quality)',
    handle: 'dry-seeds-combo-premium',
    category: 'Seeds',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-16_at_3.13.52_PM_1_f1abe8f0-6ec4-44b9-989b-388f1cc1e0df.jpg?v=1758530727',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-16_at_3.14.17_PM_1_0538c765-1890-43f4-8dc2-bbc405e04b8f.jpg?v=1758530727'
    ]
  },
  {
    name: 'Dry-Fruits-Combo (Premium Quality)',
    handle: 'dry-fruits-combo-premium',
    category: 'Dry Fruits',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/DryFruiyscombo1_820790fe-9e19-481a-b05c-d0515fbacb81.webp?v=1758530723',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/Dry_Fruits_combo2_01fed5fc-7854-4ad2-bd22-907c904711fe.webp?v=1758530723'
    ]
  },
  {
    name: 'Besan Flour Soft Grinding  (Premium Quality)',
    handle: 'besan-flour-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_3.42.36_PM_1_7c653edc-bb65-4021-a1c7-dc7344582896.jpg?v=1757933032',
    additionalImages: []
  },
  {
    name: 'Kabuli Chana Dal Unpolished (Premium Quality)',
    handle: 'kabuli-chana-dal-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsAppImage2025-08-20at7.38.11PM.jpg?v=1757333950',
    additionalImages: []
  },
  {
    name: 'Red Chilli Pickle  (Premium Quality)',
    handle: 'redchilli-pickle-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-20_at_12.12.10_PM_1_7e869e3d-6430-4313-8bcd-0f07e53ad1ed.jpg?v=1757333951',
    additionalImages: []
  },
  {
    name: 'Cashew Nuts Medium (Kaju)',
    handle: 'cashew-nuts-medium',
    category: 'Dry Fruits',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/7_9e23c1eb-8582-4468-a067-245a3a551cf7.png?v=1757333951',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_10.01.43_AM_b728ac29-cf49-4398-aa11-e74c4ac7ae81.jpg?v=1757333951'
    ]
  },
  // 9-48
  {
    name: 'Almonds Medium (Badam)',
    handle: 'almonds-medium',
    category: 'Dry Fruits',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/9_4034b7a6-21de-420a-888c-cdfee56cece7.png?v=1757333952',
    additionalImages: ['https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-22_at_9.47.07_AM_2_58a584d5-4afa-4663-9d5a-e74e8795f267.jpg?v=1757333952']
  },
  {
    name: 'Dried Prawns Spicy-powder (Premium Quality)',
    handle: 'dried-prawns-spicy-powder-premium',
    category: 'Spice Powders',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-10_at_3.02.27_PM_879a1343-4d17-4471-be02-2ecd36831c85.jpg?v=1757333953',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.11.39_PM_1d2ed5b9-2ca1-40d2-b19f-c065e388bdd7.jpg?v=1757333953',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.08.41_PM_038e1d28-16c4-4f10-ac41-b4f4e10aca0e.jpg?v=1757333953'
    ]
  },
  {
    name: 'Sambar Chilli Powder Soft Grinding (Premium Quality)',
    handle: 'sambar-chilli-powder-premium',
    category: 'Spice Powders',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.56.02_AM_06f0f63d-689b-44be-9f6c-140d2429204e.jpg?v=1757333953',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.25.55_AM_c05c19a1-776e-4b5f-b0d4-8f5e6b1e9086.jpg?v=1757333953',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.25.49_AM_2_91608663-d963-46d9-9c62-6f8ca7a6583c.jpg?v=1757333953'
    ]
  },
  {
    name: 'Mixed Rice Flour  (Premium Quality)',
    handle: 'mixed-rice-flour-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-08-13_at_2.27.40_PM_1.jpg?v=1757333954',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.38.47_AM_8b55ef67-d7f6-4e6f-b57e-5de57af32519.jpg?v=1757333954',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.38.48_AM_90d7121d-003f-4d9c-9e33-4693efe51661.jpg?v=1757333954'
    ]
  },
  {
    name: 'Makhana  (Premium Quality)',
    handle: 'makhana-premium',
    category: 'Dry Fruits',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_11.23.38_AM_a083a4ab-fc9f-434e-873b-dda7680b197e.jpg?v=1757333955',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.46.27_AM_3939b9f0-035f-4b0c-a788-68dc666882a4.jpg?v=1757333955',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.46.27_AM_1_8413ea5b-52d2-4fe7-9c29-2a7f2d38f372.jpg?v=1757333955'
    ]
  },
  {
    name: 'Urad Dal (Premium Quality)',
    handle: 'urad-dal-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-07_at_7.40.44_PM_b661456d-8521-43af-9406-a1c401b760ba.jpg?v=1757333955',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_10.26.50_PM_c90fb35e-e6f0-4f19-8f74-dba37bbc3e29.jpg?v=1757333955',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.39.47_AM_17481d08-911d-4048-ac53-99844cca0a91.jpg?v=1757333955'
    ]
  },
  {
    name: 'Chana Dal Unpolished (Premium Quality)',
    handle: 'chana-dal-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-08_at_5.37.04_PM_eba91759-9945-4780-adc1-5db5aef88138.jpg?v=1757333956',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.09_PM_2_67fdf3a7-ec9a-468b-92e3-75a9cab0b785.jpg?v=1757333956',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.05.59_PM_4603194c-d8ff-4d3d-8fa9-ef906bd3eb48.jpg?v=1757333956'
    ]
  },
  {
    name: 'Monthly Groceries Combo - For 2 Members',
    handle: 'monthly-groceries-2-members',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_12.16.43_PM.jpg?v=1757921007',
    additionalImages: []
  },
  {
    name: 'Monthly Groceries Combo - For 4 Members',
    handle: 'monthly-groceries-4-members',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-09-15_at_12.16.43_PM_1.jpg?v=1757920978',
    additionalImages: []
  },
  {
    name: 'Pistachio (With Shell) (Premium Quality)',
    handle: 'pistachio-with-shell-premium-quality',
    category: 'Dry Fruits',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-05_at_15.57.56_1.jpg?v=1757333959',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.34_AM_1_7da0c30c-76ef-462c-910a-399b22f43b39.jpg?v=1757333959',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_1.18.36_PM_edbfbfb6-be0e-4e6d-ba19-4c0dea0da0ce.jpg?v=1757333959'
    ]
  },
  {
    name: 'Kapil Wheat Flour  (Premium Quality)',
    handle: 'kapil-wheat-flour-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-29_at_6.10.09_PM.jpg?v=1757333959',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.10_PM_2_3157f494-f395-4e0b-91ad-8402fd9a7375.jpg?v=1757333959',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.05.52_PM_bd0ec17e-42ad-42a0-bd34-ee5cf95357fd.jpg?v=1757333959'
    ]
  },
  {
    name: 'Multi Grain Wheat Flour Soft Grinding  (Premium Quality)',
    handle: 'multi-grain-wheat-flour-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-29_at_6.10.08_PM_1.jpg?v=1757333960',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.10_PM_1_c32bc225-bcb3-444c-a352-c39804996664.jpg?v=1757333960',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.06.02_PM_2_933df3e3-05e3-4f18-8563-60fe3dd8e8f8.jpg?v=1757333960'
    ]
  },
  {
    name: 'Sarabathi Wheat Flour Soft Grinding  (Premium Quality)',
    handle: 'sarabathi-wheat-flour-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-29_at_6.10.08_PM_2.jpg?v=1757333961',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.10_PM_4b41c916-12d1-4272-a467-1ed317e792d7.jpg?v=1757333961'
    ]
  },
  {
    name: 'Bombay Rava  (Premium Quality)',
    handle: 'bombay-rava-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-29_at_6.10.08_PM.jpg?v=1757333961',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.12_PM_2_e2ba49d3-869b-41c8-8750-7c638b705fa7.jpg?v=1757333961',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-12_at_12.55.03_PM.jpg?v=1757333961'
    ]
  },
  {
    name: 'Dry-Fruits-Mix',
    handle: 'dry-fruits-mix',
    category: 'Dry Fruits',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/dry_fruit_mix_46840a26-eb12-4532-b38f-bdbbf48a7edd.jpg?v=1757333962',
    additionalImages: []
  },
  {
    name: 'Bengal Gram Dal  (Premium Quality)',
    handle: 'bengal-gram-dal-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/bengal_gram_dal_25af9c5f-427e-49f6-979f-4fff94ef5e7b.png?v=1757333962',
    additionalImages: []
  },
  {
    name: 'Red Chillies   (Guntur) (Premium Quality)',
    handle: 'red-chillies-guntur-premium',
    category: 'Spices',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/guntur_chilli_5fa91aba-e83a-4f4f-8c4f-90141bc948ca.png?v=1757333963',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_6.03.46_PM_33da64ca-671f-493c-8775-95820bd0edf7.jpg?v=1757333963',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.06.00_PM_1_71309fc2-b7d7-4e4c-bce8-d48af9d9b31e.jpg?v=1757333963'
    ]
  },
  {
    name: 'Red Chillies   (Byadagi) (Premium Quality)',
    handle: 'red-chillies-byadgi-premium',
    category: 'Spices',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/Byadgi_65ac3367-c79c-48f3-a5e1-af2985ebbd33.png?v=1757333963',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_10.58.16_PM_a6296513-4724-4486-bd5d-0dd338d1f494.jpg?v=1757333963',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.05.59_PM_1_3e1688f4-b68c-45fb-9217-3872fd18bf23.jpg?v=1757333963'
    ]
  },
  {
    name: 'Sugar Sulphur Free (Premium Quality)',
    handle: 'sugar-sulphur-free-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/ChatGPT_Image_Jun_5_2025_11_43_32_AM_80ddc3db-806f-42b4-ab3c-31a34f823041.png?v=1757333964',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.41.14_AM_-_Copy_7a3212fa-1309-48b9-9d15-33e4e0074631.jpg?v=1757333964',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.41.06_AM_-_Copy_10304d21-403c-4df0-8813-fd25357e6865.jpg?v=1757333964'
    ]
  },
  {
    name: 'Jowar Flour jonna (Premium Quality)',
    handle: 'jowar-flour-jonna-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.17.58_AM_2896809e-aefe-4373-87c4-885dfb02ebc0.jpg?v=1757333965',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.25.49_AM_40890132-e3a0-4c80-9008-948a94493df4.jpg?v=1757333965',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_10.25.49_AM_1_39db9412-3fa5-4799-926b-44004c9ed521.jpg?v=1757333965'
    ]
  },
  {
    name: 'Cinnamon  (Premium Quality)',
    handle: 'cinnamon-kerala-style-premium',
    category: 'Spices',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/cinnamon_bd2c52bb-d2df-4d09-baca-93aab2223e68.jpg?v=1757333965',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-12_at_11.48.48_AM.jpg?v=1757333965',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_8.50.21_PM_cb8a1a86-0c4a-447d-81c3-8a3f1d049eca.jpg?v=1757333965'
    ]
  },
  {
    name: 'Dry BlackBerries  (Premium Quality)',
    handle: 'dried-blackberries-premium',
    category: 'Dry Fruits',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-16_at_4.19.42_PM.jpg?v=1757333966',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_9.53.35_AM_1_004cb691-d6e9-4487-8e3e-e78db542cef2.jpg?v=1757333966',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-05_at_10.53.15_AM_f10acb69-94e4-4033-b4ae-2150b91660c3.jpg?v=1757333966'
    ]
  },
  {
    name: 'Mix Tutti Frutti  (Premium Quality)',
    handle: 'mix-tutti-frutti-premium',
    category: 'Dry Fruits',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-06_at_15.31.46.jpg?v=1757333967',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_4.47.50_PM_05384ebf-0380-4aa7-949b-4f6c935f6021.jpg?v=1757333967',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.59.48_AM_be34b09a-8461-49c5-8b34-8c4178665ce5.jpg?v=1757333967',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-06_at_15.31.46_a4a7e9a7-741a-45ca-af4b-4b4e4b625011.jpg?v=1757333967'
    ]
  },
  {
    name: 'Dry Fish-combo',
    handle: 'dry-fish-combo',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsAppImage2025-06-06at09.29.13.jpg?v=1757333967',
    additionalImages: []
  },
  {
    name: 'Dry Fish-combo  (Premium Quality)',
    handle: 'dry-fish-combo-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsAppImage2025-06-06at09.28.06.jpg?v=1757333968',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.38.38_AM_a9c2d9cd-d691-47b8-9174-e4fb4fe40661.jpg?v=1757333968',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.09.17_PM_b127f534-695a-4dc5-ae1c-b23c26c5e6da.jpg?v=1757333968'
    ]
  },
  {
    name: 'Spice Powders(Podulu)-Combo  (Premium Quality)',
    handle: 'spice-powderspodulu-combo',
    category: 'Spice Powders',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-29_at_8.13.47_PM_9d75c8a7-4082-4f3e-8cb3-37047b7dd27e.jpg?v=1757333968',
    additionalImages: []
  },
  {
    name: 'Dry-Fruits-Combo',
    handle: 'dry-fruits-combo',
    category: 'Dry Fruits',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/DryFruiyscombo1.webp?v=1758016605',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/Dry_Fruits_combo2.webp?v=1758016627'
    ]
  },
  {
    name: 'Charoli (Sai MinaPappu)   (Premium Quality)',
    handle: 'charoli-saimina-pappu-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-23_at_12.20.47_AM_1_cbc998e7-1d7d-48c5-b96d-ab389584602d.jpg?v=1757333970',
    additionalImages: []
  },
  {
    name: 'Green Peas (Green Batani)   (Premium Quality)',
    handle: 'green-peas-green-batani-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_12.03.51_PM_b34ec950-dbff-4cfc-9f03-77350f0aaa3c.jpg?v=1757333971',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.06_PM_e73807bf-76a6-4c52-a3c2-ccf39608b9bc.jpg?v=1757333971',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.05.49_PM_1_0ad39d4f-5e76-4749-9bf1-6372198711fa.jpg?v=1757333971'
    ]
  },
  {
    name: 'Atukulu   (Premium Quality)',
    handle: 'atukulu-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-29_at_4.51.43_PM.jpg?v=1757333971',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.05_PM_1_f9e60b25-9363-4d5b-a406-26e5e2903542.jpg?v=1757333971',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.06.01_PM_5af74e19-a995-44cc-aa41-551fdb1935a6.jpg?v=1757333971'
    ]
  },
  {
    name: 'Patika (Kalakanda)  (Premium Quality)',
    handle: 'patika-kalakanda-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.59.02_AM_3058d14e-25a8-42f8-9885-340edcf36387.jpg?v=1757333972',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.05_PM_276b0987-123b-47c5-841f-45b997ce14e2.jpg?v=1757333972',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.06.01_PM_1_352fb564-481f-4983-97fd-14eb44eb95d6.jpg?v=1757333972'
    ]
  },
  {
    name: 'Sago (Saggubiyyam)   (Premium Quality)',
    handle: 'sago-saggubiyyam-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.52.52_AM_512b9ebc-8e89-4ae6-a44e-ded089f3f44d.jpg?v=1757333972',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_10.37.32_PM_d4233577-3512-46b7-a40a-87daa1ecfa7b.jpg?v=1757333972',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.06.00_PM_7c0e828f-4966-40a0-a23a-50df146e6a1e.jpg?v=1757333972'
    ]
  },
  {
    name: 'Appalam Papad (Apadalu)   (Premium Quality)',
    handle: 'appalam-papad-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.47.09_AM_55bb1b27-9dda-427f-90cc-db75f714c870.jpg?v=1757333973',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.04_PM_549e9e28-a2d6-4c35-8174-457897833fc9.jpg?v=1757333973'
    ]
  },
  {
    name: 'Meal Maker  (Premium Quality)',
    handle: 'meal-maker-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_6.17.40_PM_924d56e5-5e83-4eab-a053-7ccb913dd95c.jpg?v=1757333973',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-01_at_11.35.21_AM_c953c781-4f5e-4cc4-86eb-6d4553eaf300.jpg?v=1757333973',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.06.03_PM_1_7d13f124-a4c5-4007-861d-4d055866724a.jpg?v=1757333973'
    ]
  },
  {
    name: 'Milk Powder  (Premium Quality)',
    handle: 'milk-powder-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.43.42_AM_39f8bd4b-4a4d-4322-a9a7-83100f096d5f.jpg?v=1757333974',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-03_at_6.41.50_PM_1_3467678d-b795-49d9-890b-191de23de508.jpg?v=1757333974',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.06.02_PM_d3141654-f9f5-4b66-9590-4bd54bbe3337.jpg?v=1757333974'
    ]
  },
  {
    name: 'Green Tea  (Premium Quality)',
    handle: 'green-tea-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.42.12_AM_f7566d9e-a9e4-4ac2-b2ae-a3a41b1033db.jpg?v=1757333974',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.16_PM_f628e310-979c-40b1-9c32-316c5bc09624.jpg?v=1757333974',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.06.04_PM_f12b62ea-ae7f-4116-9cea-ac0aa7da0342.jpg?v=1757333974'
    ]
  },
  {
    name: 'Badam Powder  (Premium Quality)',
    handle: 'badam-powder-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.40.12_AM_4fad3873-d7f5-4047-ade6-34045dd1f94e.jpg?v=1757333975',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.15_PM_2_25bb42bb-14dc-433a-ac61-3ce57b4d667d.jpg?v=1757333975',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.05.51_PM_1_4d0f534f-0750-4a82-9e5f-8c73caf9278b.jpg?v=1757333975'
    ]
  },
  {
    name: 'Tea Powder  (Premium Quality)',
    handle: 'tea-powder-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.38.38_AM_e7456933-5170-44cf-8dcd-cd907fe8ef9d.jpg?v=1757333975',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.15_PM_1_6757d3c7-734c-4fe2-9b09-b369612f2de7.jpg?v=1757333975',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-02_at_2.05.53_PM_32bc2b74-2a7e-4cb7-9349-2e21cbce81a9.jpg?v=1757333975'
    ]
  },
  {
    name: 'Coffee Powder  (Premium Quality)',
    handle: 'coffee-powder-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.33.18_AM_f46cfc79-7cda-4584-abd1-11a8d05b665c.jpg?v=1757333976',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.15_PM_7582d57b-d0a8-4ed5-94c1-04083aaa23c4.jpg?v=1757333976',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_5.30.31_PM_0f36b3e9-fe07-469e-b7a8-a28540d42df0.jpg?v=1757333976'
    ]
  },
  {
    name: 'Coconut Powder (Premium Quality)',
    handle: 'coconut-powder-premium',
    category: 'Cooking Essentials',
    image: 'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-05-28_at_11.31.03_AM_bae262cd-0f63-4eb2-9588-0577106a6308.jpg?v=1757333976',
    additionalImages: [
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-06-30_at_8.41.14_PM_2_0a141697-c616-4872-af49-96f6ab268c76.jpg?v=1757333976',
      'https://cdn.shopify.com/s/files/1/0858/0772/6869/files/WhatsApp_Image_2025-07-04_at_9.47.32_AM_02da2da3-085b-4d1d-974f-e8e9aa868e97.jpg?v=1757333976'
    ]
  }
];

const noImageProducts = [
  { name: 'Chilli Powder', handle: 'chilli-powder', category: 'Spice Powders' },
  { name: 'Monthly Grocery 6 Members', handle: 'monthly-grocery-6-members', category: 'Cooking Essentials' },
  { name: 'Vermicelli Keer Semiya', handle: 'vermicelli-keer-semiya', category: 'Cooking Essentials' },
  { name: 'Sewai (Keer Semiya) (Premium Quality)', handle: 'sewai-keer-semiya-premium', category: 'Cooking Essentials' },
  { name: 'Mango Pickle  (Premium Quality)', handle: 'mango-pickle-premium', category: 'Cooking Essentials' },
  { name: 'Amla Pickle  (Premium Quality)', handle: 'amla-pickle-premium', category: 'Cooking Essentials' },
  { name: 'Cauliflower Pickle  (Premium Quality)', handle: 'cauliflower-pickle-premium', category: 'Cooking Essentials' },
  { name: 'Drumstick Pickle  (Premium Quality)', handle: 'drumstick-pickle-premium', category: 'Cooking Essentials' },
  { name: 'Garlic Pickle  (Premium Quality)', handle: 'garlic-pickle-premium', category: 'Cooking Essentials' },
  { name: 'Coriander Pickle  (Premium Quality)', handle: 'coriander-pickle-premium', category: 'Cooking Essentials' },
  { name: 'Chicken Pickle(Bone)  (Premium Quality)', handle: 'chicken-picklebone-premium', category: 'Cooking Essentials' },
  { name: 'Chicken Pickle(Boneless)  (Premium Quality)', handle: 'chicken-pickleboneless-premium', category: 'Cooking Essentials' },
  { name: 'Prawns Pickle  (Premium Quality)', handle: 'prawns-pickle-premium', category: 'Cooking Essentials' },
  { name: 'Mutton Pickle  (Premium Quality)', handle: 'mutton-pickle-premium', category: 'Cooking Essentials' },
  { name: 'Carom/Thymol Seed(Vammu)  Premium Quality', handle: 'carom-thymol-seedvammu-premium', category: 'Seeds' },
  { name: 'Rice+Millets', handle: 'rice-millets', category: 'Cooking Essentials' },
  { name: 'Detergent Powder   (Premium Quality)', handle: 'detergent-powder', category: 'Cooking Essentials' },
  { name: 'Powder   (Premium Quality)', handle: 'powder', category: 'Cooking Essentials' },
  { name: 'Soap(Bath,Clothes,Dish)   (Premium Quality)', handle: 'soapbathclothesdish', category: 'Cooking Essentials' },
  { name: 'Brush   (Premium Quality)', handle: 'brush', category: 'Cooking Essentials' },
  { name: 'Tooth Paste   (Premium Quality)', handle: 'tooth-paste', category: 'Cooking Essentials' },
  { name: 'Mutton Pickle', handle: 'mutton-pickle', category: 'Cooking Essentials' },
  { name: 'Prawns Pickle', handle: 'prawns-pickle', category: 'Cooking Essentials' },
  { name: 'Chicken Pickle(Boneless)', handle: 'chicken-pickleboneless', category: 'Cooking Essentials' },
  { name: 'Chicken Pickle(Bone)', handle: 'chicken-picklebone', category: 'Cooking Essentials' },
  { name: 'Coriander Pickle', handle: 'coriander-pickle', category: 'Cooking Essentials' },
  { name: 'Ginger Pickle', handle: 'ginger-pickle', category: 'Cooking Essentials' },
  { name: 'Garlic Pickle', handle: 'garlic-pickle', category: 'Cooking Essentials' },
  { name: 'Lemon Pickle', handle: 'lemon-pickle', category: 'Cooking Essentials' },
  { name: 'Bitter Gourd', handle: 'bitter-gourd', category: 'Cooking Essentials' },
  { name: 'Drumstick Pickle', handle: 'drumstick-pickle', category: 'Cooking Essentials' },
  { name: 'Cauliflower Pickle', handle: 'cauliflower-pickle', category: 'Cooking Essentials' },
  { name: 'Tamarind Pickle', handle: 'tamarind-pickle', category: 'Cooking Essentials' },
  { name: 'Amla Pickle', handle: 'amla-pickle', category: 'Cooking Essentials' },
  { name: 'Gongura Pickle', handle: 'gongura-pickle', category: 'Cooking Essentials' },
  { name: 'Tomato Pickle', handle: 'tomato-pickle', category: 'Cooking Essentials' },
  { name: 'Mango Pickle', handle: 'mango-pickle', category: 'Cooking Essentials' }
];

async function runUpsert() {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB!');

    let updatedCount = 0;
    let createdCount = 0;

    // Process items with images
    for (const item of rawProductsList) {
      const allUrls = [item.image, ...(item.additionalImages || [])].filter(Boolean);
      const imagesArr = allUrls.map(url => ({ url }));

      const docData = {
        name: item.name,
        handle: item.handle,
        category: item.category || 'Cooking Essentials',
        price: item.price || 150,
        originalPrice: item.originalPrice || 190,
        unit: item.unit || '1 pack',
        countInStock: 25,
        brand: 'Arshith Fresh',
        image: item.image || '',
        images: imagesArr,
        description: `Premium quality authentic ${item.name} from Arshith Fresh.`,
        rating: 4.8,
        numReviews: 20,
        isFeatured: false
      };

      const existing = await Product.findOne({
        $or: [{ handle: item.handle }, { name: item.name }]
      });

      if (existing) {
        Object.assign(existing, docData);
        await existing.save();
        updatedCount++;
      } else {
        await Product.create(docData);
        createdCount++;
      }
    }

    // Process items with NO images (leave image empty)
    for (const item of noImageProducts) {
      const docData = {
        name: item.name,
        handle: item.handle,
        category: item.category || 'Cooking Essentials',
        price: 99,
        originalPrice: 130,
        unit: '1 pack',
        countInStock: 15,
        brand: 'Arshith Fresh',
        image: '',
        images: [],
        description: `Natural ${item.name} from Arshith Fresh.`,
        rating: 4.5,
        numReviews: 10,
        isFeatured: false
      };

      const existing = await Product.findOne({
        $or: [{ handle: item.handle }, { name: item.name }]
      });

      if (existing) {
        existing.handle = item.handle;
        if (!existing.image) existing.image = '';
        await existing.save();
        updatedCount++;
      } else {
        await Product.create(docData);
        createdCount++;
      }
    }

    console.log(`🎉 Operation completed! Updated ${updatedCount} products, Created ${createdCount} products in MongoDB.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error running product upsert:', err);
    process.exit(1);
  }
}

runUpsert();
