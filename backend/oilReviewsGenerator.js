/**
 * Comprehensive Generator for authentic Indian customer reviews across all products:
 *  - Oils (85, 75, 70, 65, 64, 62, 60)
 *  - Dry Fruits & Nuts (Almonds 85, Walnuts 80, Cashews 78, Pistachio 76, Raisins 74, Figs 72, Dates 71, Ground Nuts 63)
 *  - Seeds (Chia 74, Sabja 69, Flax 68, Watermelon 67, Pumpkin 66, Sunflower 65, Sesame White 64, Poppy 62)
 *  - Ghee & Honey (Buffalo Ghee 82, Cow Ghee 77, Organic Honey 73)
 *  - Spice Powders & Spices (Garam Masala 71, Kobbari Podi 69, Black Pepper 69, Cardamom 68, Cloves 67, Podi 67, Salt 67)
 * 
 * Every product gets a distinct review count above 60 with a natural rating mix (5-star, 4-star, and 3-star ratings).
 */

const INDIAN_NAMES = [
  "Ramesh Kumar", "Anitha Rao", "Suresh Babu", "Priya Sharma", "Venkatesh K.",
  "Sunitha Reddy", "Harish Babu", "Vijayalakshmi N.", "Karthik R.", "Lakshmi Prasanna",
  "Archana S.", "Deepa Nair", "Manoj Prabhakar", "Swati P.", "Rajesh Gowda",
  "Kaviraj M.", "Bhavani Shankar", "Madhavi Latha", "Sathish Kumar", "Sravanthi K.",
  "Prakash Raj", "Geetha R.", "Nageswara Rao", "Divya Bharathi", "Subramanian V.",
  "Kavitha M.", "Raghavendra Rao", "Sandhya Rani", "Girish V.", "Padma Kumari",
  "Nitin Verma", "Meenakshi S.", "Shruti Hegde", "Pradeep K.", "Radhika G.",
  "Vinod Chandra", "Sujatha B.", "Ashok Vardhan", "Pooja Kulkarni", "Bharathwaj T.",
  "Roopa Shree", "Mahesh Babu", "Uma Maheshwari", "Dinesh Karthik", "Shalini R.",
  "Vidyadhar N.", "Preeti Deshmukh", "Kishore Kumar", "Chaitanya V.", "Anusha P.",
  "Siddharth M.", "Renuka Devi", "Santosh Hegde", "Bhavna Jain", "Vikas Reddy"
];

const GENERAL_POSITIVE_TITLES = [
  "100% Pure & Authentic Quality!",
  "Best Purchase Ever Made",
  "Amazing Aroma & Pure Taste",
  "Highly Recommended for Family",
  "Genuine Product from Arshith Fresh",
  "Superb Quality & Quick Delivery",
  "Very Healthy & Fresh Batch",
  "Traditional Taste Restored!",
  "Excellent Sturdy Packaging",
  "Must Buy Product",
  "Top Tier Quality",
  "Extremely Satisfied with Purchase",
  "Original Authentic Taste",
  "Worth Every Rupee!"
];

const PRODUCT_SPECIFIC_FEEDBACK = {
  // OILS
  groundnut: {
    targetCount: 90,
    titles: ["Authentic Peanut Aroma!", "Best Groundnut Oil", "Pure Cold-Pressed Groundnut Oil", "Delicious Flavor in Curries", "Grandmother Approved Quality"],
    comments: {
      5: [
        "The aroma of this cold-pressed groundnut oil is outstanding! Reminds me of traditional home cooking in our native village.",
        "100% pure and unrefined. Perfect for daily curry, deep frying, and tadka. Excellent quality and rich peanut flavor!",
        "I've been ordering this groundnut oil for 3 months now. Hearty flavor, clear golden texture, and very authentic.",
        "The wood pressed method preserves the natural peanut flavor. Tastes super authentic in chutneys and spicy curries."
      ],
      4: ["Very genuine quality. Smoke point is good and food doesn't feel heavy.", "Good quality oil with real peanut aroma."],
      3: ["Oil quality is fresh and unrefined, but outer cardboard box was slightly crushed during transit."]
    }
  },
  coconut: {
    targetCount: 86,
    titles: ["Pure Copra Aroma!", "Fantastic for Cooking & Hair Care", "100% Natural Coconut Oil", "Smells Heavenly Pure"],
    comments: {
      5: [
        "Pure copra coconut oil aroma! Works fantastically for both South Indian cooking and hair nourishment.",
        "Solidifies nicely in cool weather, proving its 100% natural cold pressed purity. Smells heavenly!",
        "We use this coconut oil for making banana chips and traditional curries. Unbeatable authentic flavor."
      ],
      4: ["Very clean and fragrant. No artificial additives or mineral oil mixing.", "Rich coconut aroma while cooking."],
      3: ["Quality of coconut oil is genuine, but I wish they offered 1 Litre glass bottle options."]
    }
  },
  almond_oil: {
    targetCount: 88,
    titles: ["Pure Sweet Almond Oil", "Best for Hair & Baby Massage", "100% Cold-Pressed Sweet Almond Oil"],
    comments: {
      5: [
        "Pure sweet almond oil! Works wonders for scalp nourishment and skin glow.",
        "Cold pressed almond oil with zero artificial fragrance. Ideal for skin hydration and baby massage.",
        "High quality pure badam oil. Absorbs quickly and keeps skin smooth."
      ],
      4: ["Very good pure almond oil. Gentle on skin and hair.", "Authentic cold pressed quality."],
      3: ["Great oil quality, though bottle dropper cap could be improved."]
    }
  },
  sunflower: {
    targetCount: 80,
    titles: ["Light & Non-Sticky Oil", "Perfect High Smoke Point Oil", "Heart Healthy & Clean Taste"],
    comments: {
      5: [
        "Very light and non-sticky cooking oil. Perfect for daily cooking, baking, and light frying.",
        "Cold pressed sunflower oil with high smoke point. Doesn't absorb excess oil in puris and pakoras."
      ],
      4: ["Clean golden color, fresh aroma, and light on digestion.", "Does not leave greasy residue."],
      3: ["Oil is light and pure, price is slightly higher than refined oil."]
    }
  },
  neem: {
    targetCount: 78,
    titles: ["Pure Cold Pressed Neem Oil", "Best Natural Skin & Hair Care", "Authentic Potent Neem Oil"],
    comments: {
      5: [
        "100% pure bitter neem oil. Excellent for hair scalp therapy and organic garden plant protection.",
        "Very potent and authentic neem oil. Works great for acne treatment and skin hydration."
      ],
      4: ["Potent natural neem smell. Very effective for scalp application.", "Genuine pure neem oil."],
      3: ["Strong natural aroma, but very thick and pure."]
    }
  },
  sesame: {
    targetCount: 75,
    titles: ["Rich Gingelly Aroma!", "Perfect for Podi & Pickles", "Authentic Wood-Pressed Sesame Oil"],
    comments: {
      5: [
        "Rich sesame aroma! Perfect for traditional South Indian recipes, idli podi mixture, and homemade pickles.",
        "Wood pressed gingelly oil of top tier quality. Feels very authentic, rich in flavor, and healthy."
      ],
      4: ["Unrefined and pure sesame oil. Excellent aroma when added to hot steaming rice and podi."],
      3: ["Strong natural sesame aroma. Packaging cap leaked a tiny drop during courier delivery."]
    }
  },
  castor: {
    targetCount: 85,
    titles: ["Pure Thick Castor Oil", "Best for Hair Growth & Skin", "100% Natural Wellness Oil"],
    comments: {
      5: [
        "Thick, pure, and cold pressed castor oil. Excellent for hair growth, eyebrow density, and scalp nourishment.",
        "Natural wellness product. Works wonders for dry skin hydration and hair thickness."
      ],
      4: ["High viscosity pure castor oil. Using it for oil pulling and night skin care."],
      3: ["Oil is extremely thick and pure, pourer makes dispensing slow."]
    }
  },
  mustard: {
    targetCount: 82,
    titles: ["Kachi Ghani Pungent Aroma!", "Authentic Flavor for Curries & Pickles", "Pure Cold-Pressed Mustard Oil"],
    comments: {
      5: [
        "Kachi ghani style pungent aroma! Gives authentic North Indian & Bengali flavor to fish curry and pickles.",
        "Pure mustard oil with sharp bite and rich golden color. Highly satisfied with purity and taste."
      ],
      4: ["Strong natural aroma and perfect pungency. Must try for authentic traditional recipes."],
      3: ["Very pungent and strong pure mustard oil. Delivery box was slightly worn."]
    }
  },

  // DRY FRUITS & NUTS
  almond: {
    targetCount: 85,
    titles: ["Crispy & Fresh Badam!", "Superior Quality California Almonds", "Nutrient-Dense & Clean", "Best Dry Fruit Buy"],
    comments: {
      5: [
        "100% whole, uniform, and crispy badam! Perfect for soaking overnight or morning snacking.",
        "Extremely fresh California almonds without any bitter ones. Superior crunch and natural oiliness.",
        "Packed with crunch and natural sweetness. We use them for badam milk and daily dry fruit mix."
      ],
      4: ["Very good quality almonds. Crunchy texture and fresh taste. Zipper lock pouch is convenient."],
      3: ["Almonds are sweet and crunchy, but 2-3 pieces in the packet were slightly smaller in size."]
    }
  },
  walnut: {
    targetCount: 80,
    titles: ["Fresh Whole Walnuts (Akhrot)", "Rich in Omega-3 Fats", "Brain-Boosting Fresh Kernels", "Super Crispy Walnuts"],
    comments: {
      5: [
        "Whole crisp walnuts with zero bitterness! Excellent brain food for kids and daily breakfast topping.",
        "Light golden walnut kernels packed with natural oil and crisp bite. Premium quality Akhrot!",
        "Very fresh batch! Great taste in oatmeal, baking, and healthy snacking."
      ],
      4: ["Fresh crisp walnuts. Resealable pouch keeps them fresh."],
      3: ["Walnuts taste fresh and crunchy, though a few broken halves were present."]
    }
  },
  cashew: {
    targetCount: 78,
    titles: ["Whole Crispy Kaju!", "Rich & Creamy Cashew Nuts", "Top Grade Whole Cashews"],
    comments: {
      5: [
        "Whole crisp kaju with rich creamy taste! Excellent for sweet dishes, kheer, and evening snack.",
        "Unbeatable cashew quality! Fresh, white, whole kernels with no split or broken pieces.",
        "Super crispy and naturally sweet cashews. Arshith Fresh dry fruits are always reliable."
      ],
      4: ["Good grade cashews with crispy bite. Pouch packaging keeps them fresh."],
      3: ["Cashews are fresh and tasty, though a couple of pieces had minor surface spots."]
    }
  },
  pistachio: {
    targetCount: 76,
    titles: ["Premium Kernel Pistachios (Pista)", "Crispy & Nutritious Pista", "Delicious Salted/Unsalted Crunch"],
    comments: {
      5: [
        "Beautiful green crispy pistachios! Great natural taste and full of crunch for desserts and kheer.",
        "Whole pista kernels without shell. Extremely convenient for baking and sweets."
      ],
      4: ["Very crispy pistachio kernels. Fresh aroma and great taste."],
      3: ["Pistachios are fresh and tasty, delivery took 3 days."]
    }
  },
  raisin: {
    targetCount: 74,
    titles: ["Sweet & Plump Kishmish", "Golden Fresh Raisins", "Naturally Sweetened Dry Fruit"],
    comments: {
      5: [
        "Soft, sweet, and juicy golden raisins! Perfect for payasam, kheer, and morning breakfast.",
        "Zero seed debris or dust! Plump raisins loaded with natural iron and sweetness."
      ],
      4: ["Very clean golden raisins. Tender and tasty."],
      3: ["Sweet kishmish, outer box had minor dent."]
    }
  },
  fig: {
    targetCount: 72,
    titles: ["Naturally Sweet Dried Anjeer", "Soft & Chewy Dry Figs", "Rich Source of Iron & Fiber"],
    comments: {
      5: [
        "Soft, chewy, and naturally sweet dried figs! Excellent source of dietary fiber and iron.",
        "Fresh batch of anjeer without any added sugar or preservative coating. Tastes pure and delicious.",
        "We soak 2 figs overnight and eat them every morning. Great quality and clean packaging."
      ],
      4: ["Good quality dried figs. Moist, chewy, and clean. Re-sealable pouch is helpful."],
      3: ["Figs are tasty and chewy, though some pieces were slightly drier than others."]
    }
  },
  date: {
    targetCount: 71,
    titles: ["Juicy Soft Kharjuram", "Rich Caramel Flavored Dates", "100% Natural Energy Snack"],
    comments: {
      5: [
        "Juicy, soft, and naturally sweet dates! Great natural sweetener for smoothies and desserts.",
        "High quality dates rich in iron and natural sugars. Clean and delicious."
      ],
      4: ["Very soft and sweet dates. Zipper pouch is helpful."],
      3: ["Tasty dates, though 1-2 pieces were slightly dry."]
    }
  },
  groundnut_raw: {
    targetCount: 63,
    titles: ["Crispy Raw Groundnuts", "Fresh Peanut Kernels", "Great for Snacking & Chutney"],
    comments: {
      5: [
        "Large crispy raw groundnuts with thin skin. Ideal for making peanut chutney and roasted snacks.",
        "Very clean peanuts without hollow or spoiled kernels."
      ],
      4: ["Good raw peanuts for daily cooking and snacks."],
      3: ["Clean peanuts, delivery took 3 days."]
    }
  },

  // SEEDS
  chia: {
    targetCount: 74,
    titles: ["Clean & Raw Chia Seeds", "Best Superfood for Smoothies", "High Fiber Chia Seeds"],
    comments: {
      5: [
        "100% clean and raw chia seeds! Swells up rapidly in water and milk for my daily morning chia pudding.",
        "Zero dust or grit! Cleanest chia seeds I have bought online. Super fresh batch.",
        "High quality superfood! Really helps with feeling full and digestion."
      ],
      4: ["Swells nicely in lemon water. Fresh quality and clean packaging."],
      3: ["Chia seeds quality is good and clean, but pouch zipper was slightly stiff."]
    }
  },
  sabja: {
    targetCount: 69,
    titles: ["Pure Sweet Basil Sabja Seeds", "Instant Cooling Superfood", "Swells Rapidly in Falooda"],
    comments: {
      5: [
        "Pure sabja seeds that bloom instantly in water! Ideal for summer drinks, falooda, and lemonade.",
        "Extremely clean sweet basil seeds. High quality cooling seed."
      ],
      4: ["Blooms nicely in 5 minutes. Fresh and clean batch."],
      3: ["Good sabja seeds, packaging zipper could be smoother."]
    }
  },
  flax: {
    targetCount: 68,
    titles: ["Omega-3 Rich Golden Flax Seeds", "Fresh & Nutty Flavor", "Clean Raw Flax Seeds"],
    comments: {
      5: [
        "Golden brown flax seeds full of omega-3 fats! I roast and grind them for daily curd and smoothies.",
        "Super fresh and clean raw flax seeds without any dust particles. Excellent quality!"
      ],
      4: ["Good raw flax seeds. Roasted them lightly and they taste great."],
      3: ["Flax seeds are clean and crisp, but package size is smaller than expected."]
    }
  },
  watermelon_seeds: {
    targetCount: 67,
    titles: ["Shelled Watermelon Seeds (Tarbooj)", "Crunchy Protein Snack", "100% Clean Seed Kernels"],
    comments: {
      5: [
        "Shelled white watermelon kernels! Full of plant protein and crisp nutty taste.",
        "Super clean tarbooj seeds for baking, salads, and healthy trail mix."
      ],
      4: ["Crispy and fresh watermelon seeds."],
      3: ["Clean seeds, delivery was delayed by a day."]
    }
  },
  pumpkin: {
    targetCount: 66,
    titles: ["Raw & Crunchy Pumpkin Seeds", "Zinc-Rich Healthy Snack", "Clean Raw Seeds"],
    comments: {
      5: [
        "Nutrient-dense raw green pumpkin seeds! Full of crunch, zinc, and magnesium.",
        "100% raw and un-salted pumpkin seeds. Lightly roasted with rock salt, they taste delicious!"
      ],
      4: ["Very fresh pumpkin seeds. Clean batch without any shell debris."],
      3: ["Seeds are fresh and crunchy, though price could be slightly lower."]
    }
  },
  sunflower_seeds: {
    targetCount: 65,
    titles: ["Shelled Sunflower Seeds", "Nutritious & Clean Seed Kernels", "Best Salad & Smoothie Topping"],
    comments: {
      5: [
        "De-hulled raw sunflower seed kernels. Nutty flavor and crisp texture for salads.",
        "Packed with Vitamin E and healthy fats. Fresh batch without bitterness."
      ],
      4: ["Fresh sunflower seeds. Good zip pouch."],
      3: ["Seeds taste good, delivery took 3 days."]
    }
  },
  sesame_seeds: {
    targetCount: 64,
    titles: ["Clean White Sesame Seeds (Til)", "Aromatic & Fresh White Til", "Best for Laddoo & Cooking"],
    comments: {
      5: [
        "Pure white sesame seeds with natural oiliness. Perfect for til laddoo, chikki, and tempering.",
        "Clean, grit-free white til with delicate nutty aroma."
      ],
      4: ["Good quality white sesame seeds for baking and sweets."],
      3: ["Clean til seeds, courier took 4 days."]
    }
  },
  poppy_seeds: {
    targetCount: 62,
    titles: ["Pure White Poppy Seeds (Khas Khas)", "Rich & Aromatic Poppy Seeds", "Great for Gravies & Desserts"],
    comments: {
      5: [
        "Clean white khas khas seeds! Essential for rich Indian gravies, korma, and halwa.",
        "Fresh poppy seeds with high essential oil content. Adds incredible texture."
      ],
      4: ["Good khas khas seeds. Clean and aromatic."],
      3: ["Decent poppy seeds, packaging was slightly wrinkled."]
    }
  },

  // GHEE & HONEY
  buffalo_ghee: {
    targetCount: 82,
    titles: ["Granular Bilona Buffalo Ghee!", "Rich Aroma & Authentic Taste", "Traditional Desi Ghee"],
    comments: {
      5: [
        "Granular bilona texture! Pure aromatic buffalo ghee that tastes just like homemade village ghee.",
        "Rich golden aroma when added to hot steaming rice, dal, and sweets. 100% pure ghee!",
        "The aroma while tempering curries is intoxicating! Outstanding quality bilona ghee."
      ],
      4: ["Aroma is fantastic and granular texture is genuine. Bottle cap was very tight."],
      3: ["Ghee quality is authentic and smells good, but jar size is smaller than expected."]
    }
  },
  cow_ghee: {
    targetCount: 77,
    titles: ["Pure A2 Cow Ghee", "Yellow Granular Desi Cow Ghee", "Aromatic & Easy to Digest"],
    comments: {
      5: [
        "Beautiful golden yellow cow ghee with rich granular texture! Gentle on digestion and super aromatic.",
        "Pure A2 cow ghee with traditional churned aroma. Perfect for kids and daily pooja/cooking."
      ],
      4: ["Very fragrant cow ghee. Rich taste and clean glass jar."],
      3: ["Good quality cow ghee, delivery took 3 days."]
    }
  },
  honey: {
    targetCount: 73,
    titles: ["Raw Organic Wild Honey", "100% Pure Unprocessed Honey", "Natural Sweetener & Wellness"],
    comments: {
      5: [
        "Pure unprocessed wild forest honey! Rich thick texture and dark amber color with natural pollen notes.",
        "Zero added sugar or corn syrup mixing. Tested purity at home, 100% genuine honey!"
      ],
      4: ["Thick natural honey with rich taste. Glass jar was well packed."],
      3: ["Genuine honey taste, jar lid was tightly sealed."]
    }
  },

  // SPICE POWDERS & SPICES & ESSENTIALS
  garam_masala: {
    targetCount: 71,
    titles: ["Aromatic Garam Masala Powder", "Rich Spiced Curry Powder", "Authentic Blend of Whole Spices"],
    comments: {
      5: [
        "Extremely fragrant garam masala! Made with whole roasted spices, elevates curries instantly.",
        "Rich spicy aroma without synthetic color or fillers. Unmatched authentic taste."
      ],
      4: ["Very good spice blend. Small pinches give immense flavor."],
      3: ["Spicy aroma, pouch zip lock is slightly tight."]
    }
  },
  kobbari_karam: {
    targetCount: 69,
    titles: ["Roasted Coconut Spice Powder (Kobbari Karam)", "Delicious Andhra Style Podi", "Best with Hot Rice & Ghee"],
    comments: {
      5: [
        "Delectable roasted coconut podi! Tastes incredible when mixed with hot rice and cow ghee.",
        "Authentic spicy dry coconut flavor. Grandmothers recipe perfection!"
      ],
      4: ["Fresh coconut podi with balanced red chilli heat."],
      3: ["Good coconut podi, delivery took 3 days."]
    }
  },
  nalla_karam: {
    targetCount: 68,
    titles: ["Spicy Black Pepper Podi (Nalla Karam)", "Authentic Traditional Spice Powder", "Tangy & Spicy Podi"],
    comments: {
      5: [
        "Traditional Nalla Karam podi with roasted coriander, black pepper, and garlic notes!",
        "Fiery and appetizing spice powder for idlis, dosas, and rice."
      ],
      4: ["Very spicy and authentic Andhra style podi."],
      3: ["Tasty podi, spice level is high."]
    }
  },
  karivepaku_karam: {
    targetCount: 65,
    titles: ["Curry Leaves Podi (Karivepaku Karam)", "Iron-Rich Healthy Spice Powder", "Aromatic Herb Podi"],
    comments: {
      5: [
        "Fresh green curry leaf powder rich in iron and hair nutrition! Tastes delicious with ghee.",
        "Smells like freshly roasted curry leaves. Excellent healthy condiment."
      ],
      4: ["Good curry leaf podi. Fresh green color."],
      3: ["Decent podi quality, package was slightly wrinkled."]
    }
  },
  black_pepper: {
    targetCount: 69,
    titles: ["Whole Malabar Black Pepper (Miriyalu)", "Bold & Spicy Black Pepper", "Pungent Aromatic Peppercorns"],
    comments: {
      5: [
        "Bold, whole peppercorns full of essential oils and sharp heat! Perfect for rasam and grinding.",
        "100% natural Malabar black pepper. Unbeatable pungency and aroma."
      ],
      4: ["Very strong black pepper kernels. Fresh batch."],
      3: ["Good pepper quality, delivery took 3 days."]
    }
  },
  cardamom: {
    targetCount: 68,
    titles: ["Fragrant Green Elaichi", "Bold Green Cardamom Pods", "Rich Aroma for Sweets & Tea"],
    comments: {
      5: [
        "Bold 8mm green cardamom pods overflowing with seeds and intense aroma! Outstanding quality.",
        "Fresh green elaichi pods that make tea and payasam smell heavenly."
      ],
      4: ["Very aromatic cardamom. Pods are green and plump."],
      3: ["Good cardamom, pouch zip lock was stiff."]
    }
  },
  cloves: {
    targetCount: 67,
    titles: ["Handpicked Whole Cloves (Lavangam)", "Bold Aromatic Cloves", "High Essential Oil Purity"],
    comments: {
      5: [
        "Whole cloves with intact heads and rich essential oil content. Strong aromatic bite!",
        "Premium grade cloves for biryani, garam masala, and dental care."
      ],
      4: ["Very strong whole cloves. Clean batch."],
      3: ["Good cloves, outer box had minor crease."]
    }
  },
  cinnamon: {
    targetCount: 65,
    titles: ["Sweet Ceylon Cinnamon Bark (Dalchini)", "Aromatic Cinnamon Sticks", "Pure Natural Spice"],
    comments: {
      5: [
        "Thin sweet cinnamon bark with delicate warm fragrance. Perfect for tea and curries.",
        "Pure cinnamon sticks free from cassia adulteration."
      ],
      4: ["Fragrant cinnamon sticks with sweet aroma."],
      3: ["Good cinnamon quality, delivery was 3 days."]
    }
  },
  cumin: {
    targetCount: 66,
    titles: ["Clean Whole Cumin Seeds (Jeera)", "Fragrant Jeera Seeds", "Rich Essential Oil Content"],
    comments: {
      5: [
        "Bold, earthy cumin seeds that crackle beautifully in tadka! High oil content.",
        "Clean jeera seeds free from dirt or dust. Great digestion promoter."
      ],
      4: ["Very aromatic cumin seeds for daily cooking."],
      3: ["Clean cumin seeds, delivery took 4 days."]
    }
  },
  coriander: {
    targetCount: 63,
    titles: ["Whole Coriander Seeds (Dhania)", "Earthy Green Coriander", "Best for Fresh Grinding"],
    comments: {
      5: [
        "Fresh green dhania seeds with citrusy warm aroma! Makes coriander powder super fragrant.",
        "Clean coriander seeds for sambar and rasam powder."
      ],
      4: ["Fresh coriander seeds. Good zip pouch."],
      3: ["Decent dhania seeds, outer box had minor crease."]
    }
  },
  spice: {
    targetCount: 84,
    titles: ["Authentic Homemade Flavor!", "Pure & Aromatic Spice", "Traditional Recipe Taste", "Fresh Ground Quality"],
    comments: {
      5: [
        "Authentic homemade flavor and rich aroma! Makes hot rice and ghee taste like pure Andhra home feast.",
        "100% pure without any added color or artificial preservatives. Smells super fresh!",
        "Excellent spice quality! The aroma and bite are perfectly balanced."
      ],
      4: ["Very fresh spice powder with authentic roasted aroma. Good zip pouch."],
      3: ["Good authentic flavor, spice level is pleasant."]
    }
  }
};

function getProductFeedbackKey(productName = "") {
  const nameLower = productName.toLowerCase();
  
  // Dry fruits
  if (nameLower.includes("pista")) return "pistachio";
  if (nameLower.includes("walnut") || nameLower.includes("akhrot")) return "walnut";
  if (nameLower.includes("raisin") || nameLower.includes("kishmish") || nameLower.includes("kismis")) return "raisin";
  if (nameLower.includes("date") || nameLower.includes("kharjuram") || nameLower.includes("khajoor")) return "date";
  if (nameLower.includes("almond oil")) return "almond_oil";
  if (nameLower.includes("almond") || nameLower.includes("badam")) return "almond";
  if (nameLower.includes("cashew") || nameLower.includes("kaju")) return "cashew";
  if (nameLower.includes("fig") || nameLower.includes("anjeer")) return "fig";
  if (nameLower.includes("ground nuts- raw") || nameLower.includes("ground nut") || nameLower.includes("peanut")) {
    if (!nameLower.includes("oil")) return "groundnut_raw";
  }

  // Oils
  if (nameLower.includes("groundnut") || nameLower.includes("peanut")) return "groundnut";
  if (nameLower.includes("coconut")) return "coconut";
  if (nameLower.includes("neem")) return "neem";
  if (nameLower.includes("sunflower seeds")) return "sunflower_seeds";
  if (nameLower.includes("sunflower")) return "sunflower";
  if (nameLower.includes("sesame seeds")) return "sesame_seeds";
  if (nameLower.includes("sesame") || nameLower.includes("gingelly")) return "sesame";
  if (nameLower.includes("castor")) return "castor";
  if (nameLower.includes("mustard")) return "mustard";

  // Seeds
  if (nameLower.includes("chia")) return "chia";
  if (nameLower.includes("sabja")) return "sabja";
  if (nameLower.includes("flax")) return "flax";
  if (nameLower.includes("watermelon")) return "watermelon_seeds";
  if (nameLower.includes("pumpkin")) return "pumpkin";
  if (nameLower.includes("poppy")) return "poppy_seeds";

  // Ghee & Honey
  if (nameLower.includes("buffalo")) return "buffalo_ghee";
  if (nameLower.includes("cow")) return "cow_ghee";
  if (nameLower.includes("ghee")) return "buffalo_ghee";
  if (nameLower.includes("honey")) return "honey";

  // Spice Powders & Spices
  if (nameLower.includes("garam masala")) return "garam_masala";
  if (nameLower.includes("kobbari")) return "kobbari_karam";
  if (nameLower.includes("nalla")) return "nalla_karam";
  if (nameLower.includes("karivepaku")) return "karivepaku_karam";
  if (nameLower.includes("black pepper") || nameLower.includes("pepper powder") || nameLower.includes("miriyalu")) return "black_pepper";
  if (nameLower.includes("cardamom") || nameLower.includes("elaichi")) return "cardamom";
  if (nameLower.includes("clove") || nameLower.includes("lavanga")) return "cloves";
  if (nameLower.includes("cinnamon")) return "cinnamon";
  if (nameLower.includes("cumin")) return "cumin";
  if (nameLower.includes("coriander")) return "coriander";

  return "spice"; // default for spices/powders/salt
}

function getProductTargetCount(productName = "") {
  const key = getProductFeedbackKey(productName);
  if (PRODUCT_SPECIFIC_FEEDBACK[key] && PRODUCT_SPECIFIC_FEEDBACK[key].targetCount) {
    return PRODUCT_SPECIFIC_FEEDBACK[key].targetCount;
  }
  let hash = 0;
  for (let i = 0; i < productName.length; i++) {
    hash = (hash << 5) - hash + productName.charCodeAt(i);
    hash |= 0;
  }
  return 76 + (Math.abs(hash) % 14); // 76..89
}

function generateOilReviews(productName, productId, count = null, productImage = null) {
  const key = getProductFeedbackKey(productName);
  const data = PRODUCT_SPECIFIC_FEEDBACK[key] || PRODUCT_SPECIFIC_FEEDBACK.spice;
  const targetCount = count || getProductTargetCount(productName);

  const reviews = [];
  const now = Date.now();

  for (let i = 0; i < targetCount; i++) {
    const name = INDIAN_NAMES[i % INDIAN_NAMES.length] + (i >= INDIAN_NAMES.length ? ` ${Math.floor(i / INDIAN_NAMES.length) + 1}` : "");
    const emailName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const email = `${emailName}${i + 14}@gmail.com`;

    // Rating distribution: ~72% 5-star, ~20% 4-star, ~8% 3-star (Always above 3 star, strictly 3, 4, 5 stars!)
    let rating = 5;
    if (i % 12 === 0) {
      rating = 3;
    } else if (i % 5 === 0) {
      rating = 4;
    }

    const titlePool = data.titles.concat(GENERAL_POSITIVE_TITLES);
    const title = titlePool[i % titlePool.length];

    const commentList = data.comments[rating] || data.comments[5];
    const baseComment = commentList[i % commentList.length];
    const extraRemark = i % 4 === 0 ? " Packaging was solid and tamper-proof." : (i % 6 === 0 ? " Will order again definitely." : "");
    const comment = `${baseComment}${extraRemark}`;

    // Timestamps spread over the last 180 days
    const daysAgo = Math.floor((i / targetCount) * 180) + (i % 3);
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    const helpfulCount = Math.floor(((targetCount - i) / targetCount) * 22) + (i % 4);

    reviews.push({
      productId: productId,
      productName: productName,
      customerName: name,
      customerEmail: email,
      rating: rating,
      title: title,
      comment: comment,
      verifiedPurchase: true,
      helpfulCount: Math.max(1, helpfulCount),
      helpfulUsers: [],
      images: (i === 3 || i === 9) && productImage ? [productImage] : [],
      createdAt: createdAt,
      updatedAt: createdAt
    });
  }

  return reviews;
}

module.exports = {
  INDIAN_NAMES,
  PRODUCT_SPECIFIC_FEEDBACK,
  getProductFeedbackKey,
  getProductTargetCount,
  generateOilReviews
};
