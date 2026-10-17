const Faq = require('../models/Faq');
const Product = require('../models/Product');
const BotSettings = require('../models/BotSettings');
const FAQ_DATA = require('../data/faqData');

// In-memory cache for fast response times
let faqCache = [];
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60000; // 1 minute

async function getFaqs() {
  const now = Date.now();
  if (faqCache.length > 0 && (now - cacheTimestamp) < CACHE_TTL_MS) {
    return faqCache;
  }
  try {
    const dbFaqs = await Faq.find({ isPublished: true }).sort({ order: 1 }).lean();
    if (dbFaqs && dbFaqs.length > 0) {
      faqCache = dbFaqs;
      cacheTimestamp = now;
      return faqCache;
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch FAQs from MongoDB, using fallback data:', err.message);
  }
  faqCache = FAQ_DATA;
  cacheTimestamp = now;
  return faqCache;
}

function invalidateFaqCache() {
  faqCache = [];
  cacheTimestamp = 0;
}

async function getBotSettings() {
  try {
    const settings = await BotSettings.findOne({ key: 'default' }).lean();
    if (settings) return settings;
  } catch (err) {
    console.warn('⚠️ Could not fetch BotSettings from DB, using defaults:', err.message);
  }
  return {
    greeting: "Hii! 👋 Welcome to Arshith Fresh! I'm your AI shopping assistant. How can I help you today?",
    quickActions: [
      { label: 'Shop Products', action: 'chat', value: 'What products do you sell?' },
      { label: 'Product Information', action: 'chat', value: 'What products are available?' },
      { label: 'Orders & Delivery', action: 'chat', value: 'How long does delivery take?' },
      { label: 'Payment Help', action: 'chat', value: 'Which payment methods are supported?' },
      { label: 'Returns & Cancellations', action: 'chat', value: 'What is your return policy?' },
      { label: 'Offers & Discounts', action: 'chat', value: 'Are there any current offers?' },
      { label: 'Talk to Support', action: 'chat', value: 'How can I contact a human support agent?' }
    ],
    storePolicies: {
      freeShippingThreshold: 1000,
      deliveryTimeDays: '3 to 5 business days',
      returnWindowDays: 7,
      supportEmail: 'support@arshithfresh.com',
      supportPhone: '+91 9945676029',
      supportHours: 'Mon-Sat, 9:00 AM - 7:00 PM IST',
      whatsappUrl: 'https://api.whatsapp.com/send/?phone=919945676029&text=Hi%20Arshith%20Fresh!'
    }
  };
}

// Tokenize and normalize input string
function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

// Calculate similarity score between user query and FAQ
function calculateMatchScore(queryText, faq) {
  const queryLower = queryText.toLowerCase().trim();
  const qTokens = tokenize(queryText);
  if (qTokens.length === 0) return 0;

  // Exact question match
  if (faq.question.toLowerCase() === queryLower) return 100;

  let score = 0;

  // Question substring check (only when query has at least 2 words)
  const faqQLower = faq.question.toLowerCase();
  if (qTokens.length >= 2 && (faqQLower.includes(queryLower) || queryLower.includes(faqQLower))) {
    score += 45;
  }

  // Keywords matching
  if (faq.keywords && Array.isArray(faq.keywords)) {
    for (const kw of faq.keywords) {
      const kwLower = kw.toLowerCase().trim();
      if (queryLower === kwLower) {
        score += 55;
      } else if (kwLower.includes(' ') && queryLower.includes(kwLower)) {
        score += 35;
      } else if (!kwLower.includes(' ') && qTokens.includes(kwLower) && kwLower.length >= 3) {
        score += 20;
      } else {
        const kwTokens = tokenize(kwLower);
        const matchCount = kwTokens.filter(t => qTokens.includes(t)).length;
        if (matchCount > 0 && matchCount === kwTokens.length) {
          score += 25;
        } else if (matchCount >= 2 && kwTokens.length >= 3) {
          score += (matchCount / kwTokens.length) * 15;
        }
      }
    }
  }

  // Question word overlap
  const faqQTokens = tokenize(faq.question);
  const matchedTokens = qTokens.filter(t => faqQTokens.includes(t));
  if (matchedTokens.length > 0) {
    const overlapRatio = matchedTokens.length / Math.max(qTokens.length, faqQTokens.length);
    if (overlapRatio >= 0.3) {
      score += overlapRatio * 30;
    }
  }

  return score;
}

// Levenshtein distance calculation for typo tolerance
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Canonical catalog registry for Arshith Fresh (41 items)
const CATALOG_MAP = [
  {
    key: 'mustard_oil',
    nameMatch: /mustard oil/i,
    category: 'Oils',
    canonical: 'Mustard Oil (Premium Quality)',
    synonyms: ['mustard oil', 'mustard', 'musturd oil', 'musturd', 'mustrad oil', 'mustrad', 'mustred oil', 'mustred', 'mustared oil', 'mustared', 'masted oil', 'sarson oil', 'sarson', 'sarso oil', 'sarso', 'avalu noone', 'rai oil', 'ಸಾಸಿವೆ ಎಣ್ಣೆ', 'ಸಾಸಿವೆ', 'सरसों तेल', 'सरसों का तेल', 'सरसों', 'ఆవనూనె', 'கடுகு எண்ணெய்', 'मोहरी तेल']
  },
  {
    key: 'sesame_oil',
    nameMatch: /sesame oil/i,
    category: 'Oils',
    canonical: 'Sesame Oil (Premium Quality)',
    synonyms: ['sesame oil', 'sesame', 'seame oil', 'seame', 'sesme oil', 'sesme', 'sesam oil', 'sesam', 'seseme oil', 'seseme', 'gingelly oil', 'gingelly', 'til oil', 'til', 'nuvvula noone', 'nuvvula oil', 'ಎಳ್ಳೆಣ್ಣೆ', 'ಎಳ್ಳು ಎಣ್ಣೆ', 'ತಿಲ ತೈಲ', 'तिल का तेल', 'तिल तेल', 'నువ్వుల నూనె', 'நல்லெண்ணெய்', 'तीळ तेल']
  },
  {
    key: 'groundnut_oil',
    nameMatch: /groundnut oil/i,
    category: 'Oils',
    canonical: 'Groundnut Oil (Premium Quality)',
    synonyms: ['groundnut oil', 'groundnut', 'ground nut oil', 'ground nut', 'peanut oil', 'peanut', 'peanuts', 'mungfali oil', 'mungfali', 'verusenaga noone', 'palli oil', 'palli noone', 'ಕಡಲೆಕಾಯಿ ಎಣ್ಣೆ', 'ಕಡಲೆಕಾಯಿ', 'ಶೇಂಗಾ ಎಣ್ಣೆ', 'मूंगफली तेल', 'मूंगफली का तेल', 'मूंगफली', 'వేరుశనగ నూనె', 'పల్లీ నూనె', 'கடலை எண்ணெய்', 'வேர்க்கடலை எண்ணெய்', 'शेंगदाणा तेल']
  },
  {
    key: 'coconut_oil',
    nameMatch: /coconut oil/i,
    category: 'Oils',
    canonical: 'Coconut Oil (Premium Quality)',
    synonyms: ['coconut oil', 'coconut', 'coco nut oil', 'coco nut', 'coconet oil', 'coconet', 'cocnut oil', 'cocnut', 'nariyal tel', 'nariyal oil', 'kobbari noone', 'kobbari oil', 'ತೆಂಗಿನ ಎಣ್ಣೆ', 'ತೆಂಗಿನಕಾಯಿ ಎಣ್ಣೆ', 'ನಾರಿಯಲ್ ತೈಲ', 'नारियल तेल', 'नारियल का तेल', 'కొబ్బరి నూనె', 'தேங்காய் எண்ணெய்', 'खोबरेल तेल']
  },
  {
    key: 'sunflower_oil',
    nameMatch: /sunflower oil/i,
    category: 'Oils',
    canonical: 'Sunflower Oil (Premium Quality)',
    synonyms: ['sunflower oil', 'sunflower', 'sun flower oil', 'sun flower', 'sunflour oil', 'sunflour', 'surajmukhi oil', 'ಸೂರ್ಯಕಾಂತಿ ಎಣ್ಣೆ', 'ಸೂರ್ಯಕಾಂತಿ', 'सूरजमुखी तेल', 'सూర్యకాంతి నూనె', 'சூரியகாந்தி எண்ணெய்', 'सूर्यफूल तेल']
  },
  {
    key: 'castor_oil',
    nameMatch: /castor oil/i,
    category: 'Oils',
    canonical: 'Castor Oil (Premium Quality)',
    synonyms: ['castor oil', 'castor', 'caster oil', 'caster', 'amudham', 'amudham noone', 'arandi oil', 'arandi', 'ಹರಳೆಣ್ಣೆ', 'ಔಡಲ ಎಣ್ಣೆ', 'ಆಮುದ', 'अरंडी तेल', 'अरंडी का तेल', 'ఆముదం', 'ஆமணக்கு எண்ணெய்', 'एरंडेल तेल']
  },
  {
    key: 'cow_ghee',
    nameMatch: /cow ghee/i,
    category: 'Ghee',
    canonical: 'Pure Cow Ghee (Premium Quality)',
    synonyms: ['cow ghee', 'cow bilona', 'a2 cow ghee', 'a2 cow', 'desi cow ghee', 'aavu neyyi', 'cow butter', 'ಹಸುವಿನ ತುಪ್ಪ', 'ತುಪ್ಪ', 'ದೇಶಿ ತುಪ್ಪ', 'गाय का घी', 'देशी घी', 'घी', 'ఆవు నెయ్యి', 'నెయ్యి', 'நெய்', 'நாட்டு பசு நெய்', 'गायीचे तूप', 'तूप']
  },
  {
    key: 'buffalo_ghee',
    nameMatch: /buffalo ghee/i,
    category: 'Ghee',
    canonical: 'Pure Buffalo Ghee (Premium Quality)',
    synonyms: ['buffalo ghee', 'buffallo ghee', 'buffelo ghee', 'barre neyyi', 'bhains ghee', 'ಎಮ್ಮೆ ತುಪ್ಪ', 'भैंस का घी', 'గేదె నెయ్యి', 'எருமை நெய்', 'म्हैशीचे तूप']
  },
  {
    key: 'honey',
    nameMatch: /natural honey/i,
    category: 'Honey',
    canonical: 'Pure Natural Honey (Raw Wild Honey) (Premium Quality)',
    synonyms: ['honey', 'raw honey', 'wild honey', 'natural honey', 'theni', 'shahad', 'madhu', 'ಜೇನುತುಪ್ಪ', 'ಜೇನು', 'ಶುದ್ಧ ಜೇನು', 'शहद', 'తేనె', 'தேன்', 'मध']
  },
  {
    key: 'almond',
    nameMatch: /almonds/i,
    category: 'Dry Fruits',
    canonical: 'Almonds (Badam) (Premium Quality)',
    synonyms: ['almond', 'almonds', 'badam', 'baadam', 'almod', 'badampappu', 'badam pappu']
  },
  {
    key: 'cashew',
    nameMatch: /cashew nuts/i,
    category: 'Dry Fruits',
    canonical: 'Cashew Nuts (Kaju) (Premium Quality)',
    synonyms: ['cashew', 'cashews', 'kaju', 'caaju', 'cashewnut', 'cashewnuts', 'jeedipappu', 'jeedi pappu']
  },
  {
    key: 'walnut',
    nameMatch: /walnuts/i,
    category: 'Dry Fruits',
    canonical: 'Walnuts (Akhrot) (Premium Quality)',
    synonyms: ['walnut', 'walnuts', 'akhrot', 'akroot', 'akhroot', 'akhrot giri']
  },
  {
    key: 'pistachio',
    nameMatch: /pistachio/i,
    category: 'Dry Fruits',
    canonical: 'Pistachio (With Shell) (Premium Quality)',
    synonyms: ['pistachio', 'pistachios', 'pista', 'pistas', 'piste']
  },
  {
    key: 'figs',
    nameMatch: /figs/i,
    category: 'Dry Fruits',
    canonical: 'Figs (Dry Anjeer) (Premium Quality)',
    synonyms: ['fig', 'figs', 'anjeer', 'anjir', 'dry anjeer', 'atti pazham']
  },
  {
    key: 'dates',
    nameMatch: /dates/i,
    category: 'Dry Fruits',
    canonical: 'Dates (Khajoor) (Premium Quality)',
    synonyms: ['date', 'dates', 'khajoor', 'khajur']
  },
  {
    key: 'raisins',
    nameMatch: /raisins/i,
    category: 'Dry Fruits',
    canonical: 'Raisins (Kishmish) (Premium Quality)',
    synonyms: ['raisin', 'raisins', 'kishmish', 'kismis', 'kismish', 'endu draksha']
  },
  {
    key: 'chia_seeds',
    nameMatch: /chia seeds/i,
    category: 'Seeds',
    canonical: 'Chia Seeds (Premium Quality)',
    synonyms: ['chia', 'chia seeds', 'cheea']
  },
  {
    key: 'flax_seeds',
    nameMatch: /flax seeds/i,
    category: 'Seeds',
    canonical: 'Flax Seeds (Premium Quality)',
    synonyms: ['flax', 'flax seeds', 'alsi', 'avise', 'avise ginjalu']
  },
  {
    key: 'pumpkin_seeds',
    nameMatch: /pumpkin seeds/i,
    category: 'Seeds',
    canonical: 'Pumpkin Seeds (Premium Quality)',
    synonyms: ['pumpkin seeds', 'pumpkin seed', 'kaddu seeds', 'gummadi ginjalu']
  },
  {
    key: 'sunflower_seeds',
    nameMatch: /sunflower seeds/i,
    category: 'Seeds',
    canonical: 'Sunflower Seeds (Premium Quality)',
    synonyms: ['sunflower seeds', 'sunflower seed']
  },
  {
    key: 'watermelon_seeds',
    nameMatch: /watermelon seeds/i,
    category: 'Seeds',
    canonical: 'Watermelon Seeds (Premium Quality)',
    synonyms: ['watermelon seeds', 'watermelon seed', 'tarbooj', 'puchakaya ginjalu']
  },
  {
    key: 'sabja_seeds',
    nameMatch: /sabja seeds/i,
    category: 'Seeds',
    canonical: 'Sabja Seeds (Basil Seeds) (Premium Quality)',
    synonyms: ['sabja', 'sabja seeds', 'basil seeds', 'tukmaria', 'falooda seeds']
  },
  {
    key: 'sesame_seeds',
    nameMatch: /sesame seeds/i,
    category: 'Seeds',
    canonical: 'Sesame Seeds (Til) (Premium Quality)',
    synonyms: ['sesame seeds', 'til seeds', 'nuvvulu', 'nuvulu']
  },
  {
    key: 'cinnamon',
    nameMatch: /cinnamon/i,
    category: 'Spices',
    canonical: 'Cinnamon (Kerala Style) (Premium Quality)',
    synonyms: ['cinnamon', 'cinamon', 'dalchini', 'dalcheeni', 'lavangapatta']
  },
  {
    key: 'clove',
    nameMatch: /cloves/i,
    category: 'Spices',
    canonical: 'Cloves (Lavangalu) (Premium Quality)',
    synonyms: ['clove', 'cloves', 'lavangalu', 'lavang', 'laung', 'lavangam']
  },
  {
    key: 'cardamom',
    nameMatch: /cardamom/i,
    category: 'Spices',
    canonical: 'Cardamom (Elaichi) (Premium Quality)',
    synonyms: ['cardamom', 'cardamoms', 'cardomom', 'elaichi', 'elachi', 'yelakkai']
  },
  {
    key: 'star_anise',
    nameMatch: /star anise/i,
    category: 'Spices',
    canonical: 'Star Anise (Anasa Puvvu) (Premium Quality)',
    synonyms: ['star anise', 'anasa puvvu', 'chakra phool']
  },
  {
    key: 'pepper_whole',
    nameMatch: /black pepper \(whole\)/i,
    category: 'Spices',
    canonical: 'Black Pepper (Whole) (Premium Quality)',
    synonyms: ['black pepper whole', 'whole pepper', 'sabut kali mirch', 'miriyalu']
  },
  {
    key: 'pepper_powder',
    nameMatch: /black pepper powder/i,
    category: 'Spices',
    canonical: 'Black Pepper Powder (Premium Quality)',
    synonyms: ['black pepper powder', 'pepper powder', 'kali mirch powder', 'miriyala podi']
  },
  {
    key: 'coriander_powder',
    nameMatch: /coriander powder/i,
    category: 'Spices',
    canonical: 'Coriander Powder (Dhania) (Premium Quality)',
    synonyms: ['coriander powder', 'coriander', 'dhania', 'dhaniya', 'dhaniyala podi']
  },
  {
    key: 'garam_masala',
    nameMatch: /garam masala powder/i,
    category: 'Spices',
    canonical: 'Garam Masala Powder (Premium Quality)',
    synonyms: ['garam masala', 'garam masala powder']
  },
  {
    key: 'chilli_powder',
    nameMatch: /^chilli powder \(premium quality\)/i,
    category: 'Spices',
    canonical: 'Chilli Powder (Premium Quality)',
    synonyms: ['chilli powder', 'chili powder', 'mirchi powder', 'red chilli powder', 'karam podi']
  },
  {
    key: 'chilli_powder_soft',
    nameMatch: /chilli powder \(soft grinding\)/i,
    category: 'Spices',
    canonical: 'Chilli Powder (Soft Grinding) (Premium Quality)',
    synonyms: ['soft grinding chilli', 'fine chilli powder']
  },
  {
    key: 'red_chillies_guntur',
    nameMatch: /red chillies \(guntur\)/i,
    category: 'Spices',
    canonical: 'Red Chillies (Guntur) (Premium Quality)',
    synonyms: ['guntur chilli', 'guntur chillies', 'guntur mirchi', 'guntur red chilli', 'guntur']
  },
  {
    key: 'red_chillies_byadgi',
    nameMatch: /red chillies \(byadgi\)/i,
    category: 'Spices',
    canonical: 'Red Chillies (Byadgi) (Premium Quality)',
    synonyms: ['byadgi chilli', 'byadgi chillies', 'byadagi', 'byadgi mirchi', 'byadgi']
  },
  {
    key: 'pappula_podi',
    nameMatch: /pappula podi/i,
    category: 'Traditional Podis',
    canonical: 'Chana Dal Spice Powder / Pappula Podi (Premium Quality)',
    synonyms: ['pappula podi', 'chana dal podi', 'pappula karam', 'roasted gram podi']
  },
  {
    key: 'kobbari_karam',
    nameMatch: /kobbari karam/i,
    category: 'Traditional Podis',
    canonical: 'Kobbari Karam Podi (Premium Quality)',
    synonyms: ['kobbari karam', 'coconut karam', 'kobbari karam podi']
  },
  {
    key: 'nalla_karam',
    nameMatch: /nalla karam/i,
    category: 'Traditional Podis',
    canonical: 'Nalla Karam Podi (Premium Quality)',
    synonyms: ['nalla karam', 'nalla karam podi', 'black karam']
  },
  {
    key: 'garlic_powder',
    nameMatch: /garlic powder/i,
    category: 'Traditional Podis',
    canonical: 'Garlic Powder / Vellulli Karam Podi (Premium Quality)',
    synonyms: ['garlic powder', 'vellulli karam', 'vellulli karam podi', 'garlic karam', 'lahsun podi']
  },
  {
    key: 'karivepaku_karam',
    nameMatch: /karivepaku karam/i,
    category: 'Traditional Podis',
    canonical: 'Karivepaku Karam Podi (Curry Leaves Karam) (Premium Quality)',
    synonyms: ['karivepaku', 'karivepaku karam', 'curry leaf powder', 'curry leaves karam', 'karivepaku podi']
  },
  {
    key: 'besan',
    nameMatch: /besan flour/i,
    category: 'Flours',
    canonical: 'Besan Flour Soft Grinding (Premium Quality)',
    synonyms: ['besan', 'besan flour', 'gram flour', 'senagapindi', 'chana flour']
  }
];

// Helper to format product data for chat frontend
function formatProduct(p) {
  if (!p) return null;
  let img = p.image || (p.images && p.images[0] ? p.images[0].url : '/assets/images/placeholder.svg');
  if (img && !img.startsWith('http://') && !img.startsWith('https://') && !img.startsWith('/')) {
    img = '/' + img;
  }
  return {
    id: p.id || p.handle || (p._id ? p._id.toString() : ''),
    handle: p.handle || p.id || (p._id ? p._id.toString() : ''),
    name: p.name || p.title || 'Arshith Fresh Product',
    price: Number(p.price || 0),
    originalPrice: Number(p.originalPrice || 0),
    unit: p.unit || '',
    image: img,
    countInStock: typeof p.countInStock === 'number' ? p.countInStock : 50,
    category: p.category || 'General'
  };
}

// Resolve user query against catalog taxonomy
function resolveCatalogItem(query) {
  const clean = (query || '').trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ');

  // If the query is an informational question, wellness advice, or cooking guide (and NOT a simple price inquiry), delegate to FAQs
  const isPriceInquiry = /\b(price|cost|how much|rate|buy|order)\b/i.test(clean);
  const isQuestionOrComparison = !isPriceInquiry && /\b(best|good|better|benefit|benefits|health|cooking|fry|frying|deep fry|heart|diabetes|diabetic|hair|skin|cholesterol|bp|weight|store|storage|shelf life|expiry|process|difference|vs|compare|what is|how is|how do|recommend)\b/i.test(clean);
  if (isQuestionOrComparison) {
    return null;
  }

  const tokens = clean.split(/\s+/).filter(t => t.length >= 2 && ![
    'what', 'are', 'the', 'for', 'you', 'have', 'and', 'with', 'from', 'our',
    'items', 'item', 'price', 'cost', 'show', 'buy', 'is', 'there', 'any',
    'tell', 'me', 'about', 'can', 'get', 'how', 'long', 'does', 'take',
    'when', 'where', 'why', 'who', 'which', 'much', 'many', 'will', 'delivery',
    'deliver', 'order', 'orders', 'status', 'track', 'return', 'returns',
    'refund', 'refunds', 'policy', 'cancel', 'shipping'
  ].includes(t));

  const CATEGORY_STOPWORDS = ['oil', 'oils', 'seeds', 'seed', 'powder', 'ghee', 'dry', 'fruit', 'fruits', 'karam', 'podi'];
  const distinctiveTokens = tokens.filter(t => !CATEGORY_STOPWORDS.includes(t));

  let requiredCategory = null;
  if (/\boil\b|\boils\b/i.test(clean)) requiredCategory = 'Oils';
  else if (/\bghee\b/i.test(clean)) requiredCategory = 'Ghee';
  else if (/\bseed\b|\bseeds\b/i.test(clean)) requiredCategory = 'Seeds';
  else if (/\bdry fruits?\b|\bnuts?\b/i.test(clean)) requiredCategory = 'Dry Fruits';
  else if (/\bspices?\b/i.test(clean)) requiredCategory = 'Spices';
  else if (/\bpodis?\b|\bkaram\b/i.test(clean)) requiredCategory = 'Traditional Podis';

  let bestScore = 0;
  let bestCandidate = null;

  for (const item of CATALOG_MAP) {
    // If query strictly specifies category, only evaluate products in that category
    if (requiredCategory && item.category !== requiredCategory) continue;

    for (const syn of item.synonyms) {
      if (clean === syn) {
        return { item, type: 'EXACT_FULL', score: 1000, matchedOn: syn };
      }

      if (clean.includes(syn) && (syn.includes(' ') || (!CATEGORY_STOPWORDS.includes(syn) && syn.length >= 3))) {
        const s = 600 + syn.length * 10;
        if (s > bestScore) {
          bestScore = s;
          bestCandidate = { item, type: 'EXACT_PHRASE', score: s, matchedOn: syn };
        }
      }

      const synDistinctive = syn.split(/\s+/).filter(t => !CATEGORY_STOPWORDS.includes(t));
      if (distinctiveTokens.length > 0 && synDistinctive.length > 0) {
        let matchedTokens = 0;
        for (const uTok of distinctiveTokens) {
          if (synDistinctive.includes(uTok)) {
            matchedTokens += 1.0;
          } else {
            for (const sTok of synDistinctive) {
              // Enforce minimum token length of 5 for fuzzy matching (prevents false positives like 'how' matching 'cow')
              if (uTok.length >= 5 && sTok.length >= 5 && Math.abs(uTok.length - sTok.length) <= 1) {
                const d = levenshtein(uTok, sTok);
                const maxAllowed = sTok.length <= 6 ? 1 : 2;
                if (d <= maxAllowed) {
                  matchedTokens += 0.85;
                  break;
                }
              }
            }
          }
        }

        if (matchedTokens > 0) {
          const overlapRatio = matchedTokens / Math.max(distinctiveTokens.length, synDistinctive.length);
          const score = (matchedTokens * 150) + (overlapRatio * 150);
          if (score > bestScore) {
            bestScore = score;
            bestCandidate = { item, type: 'DISTINCTIVE_TOKEN_SCORE', score, matchedOn: syn };
          }
        }
      }
    }
  }

  if (bestCandidate && bestScore >= 120) {
    return bestCandidate;
  }

  // Check for specific products requested that are NOT available in inventory (e.g. "olive oil", "avocado oil")
  const UNAVAILABLE_OILS = ['olive', 'avocado', 'neem', 'canola', 'soybean', 'soya', 'palm', 'argan', 'jojoba', 'macadamia', 'tea tree', 'rice bran', 'corn oil', 'vegetable oil', 'dalda'];
  for (const unav of UNAVAILABLE_OILS) {
    if (clean.includes(unav)) {
      return { type: 'UNAVAILABLE_SPECIFIC', category: 'Oils', requested: unav };
    }
  }

  const UNAVAILABLE_GHEES = ['goat', 'sheep', 'camel', 'donkey', 'yak'];
  for (const unav of UNAVAILABLE_GHEES) {
    if (clean.includes(unav)) {
      return { type: 'UNAVAILABLE_SPECIFIC', category: 'Ghee', requested: unav };
    }
  }

  // Fallback check for distinctive token with oil if it looks like a requested item name
  if (/\boil\b|\boils\b/i.test(clean) && distinctiveTokens.length > 0 && !/show|available|list|have|types|all/i.test(clean)) {
    return { type: 'UNAVAILABLE_SPECIFIC', category: 'Oils', requested: distinctiveTokens.join(' ') };
  }

  // Broad category requests
  if (/\boil\b|\boils\b/i.test(clean)) return { type: 'CATEGORY', category: 'Oils' };
  if (/dry fruits?|nuts?/i.test(clean)) return { type: 'CATEGORY', category: 'Dry Fruits' };
  if (/spices?|masala/i.test(clean)) return { type: 'CATEGORY', category: 'Spices' };
  if (/seeds?/i.test(clean)) return { type: 'CATEGORY', category: 'Seeds' };
  if (/podis?|karam/i.test(clean)) return { type: 'CATEGORY', category: 'Traditional Podis' };

  return null;
}

// Search live products from MongoDB based on keywords with typo tolerance and relevance ranking
async function findLiveProducts(searchTerm, limit = 4) {
  if (!searchTerm || typeof searchTerm !== 'string') return [];
  const clean = searchTerm.trim().toLowerCase();
  if (!clean) return [];

  try {
    const products = await Product.find({}).lean();
    if (!products || products.length === 0) return [];

    const resolved = resolveCatalogItem(clean);
    if (resolved) {
      if (resolved.item) {
        const exact = products.find(p => resolved.item.nameMatch.test(p.name));
        return exact ? [formatProduct(exact)] : [];
      }
      if (resolved.type === 'CATEGORY') {
        const catProds = products.filter(p => {
          const matchItem = CATALOG_MAP.find(m => m.nameMatch.test(p.name));
          return matchItem && matchItem.category === resolved.category;
        });
        return catProds.slice(0, limit).map(formatProduct);
      }
      if (resolved.type === 'UNAVAILABLE_SPECIFIC') {
        return [];
      }
    }

    // Fallback: token-based match on product names
    const tokens = clean.replace(/[^a-z0-9\s]/gi, ' ').split(/\s+/).filter(t => t.length >= 3);
    const scored = [];
    for (const p of products) {
      const pName = (p.name || '').toLowerCase();
      let score = 0;
      for (const tok of tokens) {
        if (pName.includes(tok)) score += 50;
      }
      if (score >= 50) scored.push({ p, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => formatProduct(s.p));
  } catch (err) {
    console.warn('⚠️ Product query error in chatEngine:', err.message);
    return [];
  }
}

// Detect price & budget queries (e.g. "under 500 cost", "products under 300", "cheapest products", etc.)
function detectPriceFilter(query) {
  const clean = (query || '').toLowerCase().trim();

  let maxPrice = null;
  let minPrice = null;
  let isCheapest = false;
  let isExpensive = false;
  let categoryFilter = null;
  let keywordFilter = null;

  // 1. Check relative budget extremes
  if (/\b(cheapest|lowest price|most affordable|lowest cost|budget friendly|low price|least expensive|cheap items|cheap products|cheaper items|cheaper products|budget options|best value)\b/i.test(clean)) {
    isCheapest = true;
  } else if (/\b(most expensive|highest price|highest cost|costliest|costly|premium range|top price|luxury)\b/i.test(clean)) {
    isExpensive = true;
  }

  // 2. Check Range: between X and Y / from X to Y / X to Y
  const rangeMatch = clean.match(/\b(?:between|from)\s*(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:and|to|-)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
                     clean.match(/\b(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:to|-)\s*(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:rs|rupees|cost|price|budget|inr)?\b/i);
  if (rangeMatch) {
    const val1 = parseInt(rangeMatch[1], 10);
    const val2 = parseInt(rangeMatch[2], 10);
    minPrice = Math.min(val1, val2);
    maxPrice = Math.max(val1, val2);
  }

  // 3. Check Max Price (under, below, less than, up to, within, cheaper than, at most, etc.)
  if (maxPrice === null) {
    const maxPatterns = [
      /\b(?:under|below|less than|cheaper than|within|at most|up to|maximum|max|underneath|not more than|<=?)\s*(?:the\s+)?(?:cost\s+of\s+|price\s+of\s+)?(?:rs\.?|inr|₹)?\s*(\d+)/i,
      /\b(?:cost|price|rate)\s*(?:of\s+)?(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:or\s+less|and\s+below|or\s+below|under|below)\b/i,
      /\b(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:cost|rupees|rs|bucks|inr)?\s*(?:under|below|or less|and less|and below)\b/i,
      /\bunder\s*(?:the\s+)?cost\s*of\s*(\d+)/i,
      /\b(?:buy|get|purchase|have|available)\s*(?:for|under|within|in)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
      /\bbudget\s*(?:of|is|around|under)?\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
      /\bprice\s*around\s*(?:rs\.?|inr|₹)?\s*(\d+)/i
    ];

    for (const pat of maxPatterns) {
      const m = clean.match(pat);
      if (m && m[1]) {
        maxPrice = parseInt(m[1], 10);
        break;
      }
    }
  }

  // 4. Check Min Price (above, over, more than, greater than, at least, etc.)
  if (minPrice === null && maxPrice === null) {
    const minPatterns = [
      /\b(?:above|over|more than|greater than|at least|minimum|min|>=?)\s*(?:the\s+)?(?:cost\s+of\s+|price\s+of\s+)?(?:rs\.?|inr|₹)?\s*(\d+)/i,
      /\b(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:and\s+above|or\s+more|plus|\+)\b/i
    ];
    for (const pat of minPatterns) {
      const m = clean.match(pat);
      if (m && m[1]) {
        minPrice = parseInt(m[1], 10);
        break;
      }
    }
  }

  // 5. Category detection in price query
  if (/\boil\b|\boils\b/i.test(clean)) categoryFilter = 'Oils';
  else if (/\bghee\b|\bhoney\b/i.test(clean)) categoryFilter = 'Ghee and Honey';
  else if (/\bseed\b|\bseeds\b/i.test(clean)) categoryFilter = 'Seeds';
  else if (/\bdry fruits?\b|\bnuts?\b|\balmonds?\b|\bcashews?\b|\bwalnuts?\b|\bpistachio/i.test(clean)) categoryFilter = 'Dry Fruits';
  else if (/\bspices?\b|\bmasala\b|\bchilli\b|\bturmeric\b|\bpodi\b|\bpowders?\b/i.test(clean)) categoryFilter = 'Powders & Masalas';

  // 6. Specific item keywords (e.g. "mustard", "groundnut", "coconut", "almond", etc.)
  const knownKeywords = [
    'groundnut', 'mustard', 'sesame', 'coconut', 'sunflower', 'castor',
    'ghee', 'honey', 'almond', 'cashew', 'walnut', 'pista', 'anjeer', 'raisin',
    'chia', 'flax', 'chilli', 'turmeric', 'coriander', 'pappula'
  ];
  for (const kw of knownKeywords) {
    if (clean.includes(kw)) {
      keywordFilter = kw;
      break;
    }
  }

  const isPriceQuery = maxPrice !== null || minPrice !== null || isCheapest || isExpensive;

  return {
    isPriceQuery,
    maxPrice,
    minPrice,
    isCheapest,
    isExpensive,
    categoryFilter,
    keywordFilter
  };
}

// Main conversation resolver
async function processUserMessage(userMessage, context = {}, cart = []) {
  const text = (userMessage || '').trim();
  const lower = text.toLowerCase();
  const faqs = await getFaqs();
  const settings = await getBotSettings();

  // 1. Check for greeting (Hii, hello, hey, start, good morning)
  if (/^(hi|hii|hello|hey|start|good morning|good evening|good afternoon|namaste|hlo)\b/i.test(lower) && lower.split(/\s+/).length <= 4) {
    return {
      reply: settings.greeting,
      category: 'GREETINGS',
      chips: settings.quickActions.map(a => a.label),
      products: [],
      quickActions: settings.quickActions,
      matchedFaq: 'Hii, hello, good morning, good evening',
      confidence: 1.0,
      context: { ...context, lastIntent: 'greeting' }
    };
  }

  // 2. Explicit Quick Action Handlers for the 7 Main Chatbot Buttons
  if (/^shop products?$|^start shopping$/i.test(lower)) {
    const liveProds = await findLiveProducts('oils', 4);
    return {
      reply: `🛒 **Welcome to Arshith Fresh Store!**\nExplore our curated selection of 100% natural, cold-pressed oils, pure A2 desi cow ghee, stone-ground spices, and organic groceries below. You can add items directly to your cart or click to view details.`,
      category: 'PRODUCTS',
      chips: ['What products are available?', 'Do you sell groceries and food essentials?', 'How do I add a product to my cart?', 'Are there any current offers?'],
      products: liveProds,
      quickActions: [{ label: 'View All Collections', action: 'url', value: '/pages/collections.html' }],
      matchedFaq: 'What products are available?',
      confidence: 1.0,
      context: { ...context, lastIntent: 'PRODUCTS', lastProductSearch: 'oil' }
    };
  }

  if (/^product information$|^product info$/i.test(lower)) {
    const liveProds = await findLiveProducts('oils', 3);
    return {
      reply: `🌿 **Arshith Fresh Product Catalog:**\nWe specialize in 100% pure, farm-fresh essentials:\n• **Cold-Pressed Oils:** Wood-pressed Groundnut, Coconut, Sesame, Mustard, Sunflower, Castor Oil (zero chemicals, zero trans fat)\n• **Pure Bilona Ghee:** Handcrafted A2 Desi Cow Ghee & Buffalo Ghee\n• **Authentic Spices:** Stone-ground Turmeric, Chilli powder, Coriander, Karampodi\n• **Natural Sweeteners:** Raw Honey\n• **Groceries:** Premium Dry Fruits, Nuts & Healthy Seeds`,
      category: 'PRODUCTS',
      chips: ['What products are available?', 'How do I check a product\'s price?', 'How do I check ingredients or product specifications?', 'Is this product currently available?'],
      products: liveProds,
      quickActions: [{ label: 'View All Collections', action: 'url', value: '/pages/collections.html' }],
      matchedFaq: 'What products do you sell?',
      confidence: 1.0,
      context: { ...context, lastIntent: 'PRODUCTS' }
    };
  }

  if (/^orders? & delivery$|^orders? and delivery$/i.test(lower)) {
    return {
      reply: `📦 **Orders & Delivery Information:**\n• **Delivery Timeline:** Orders are dispatched within 24-48 hours and arrive in **3 to 5 business days** across India.\n• **FREE Shipping:** Automatically applied on all orders of **₹1,000** or more!\n• **Live Tracking:** Real-time SMS & WhatsApp updates are sent as soon as your parcel is shipped.\n• **Locations:** We ship pan-India to all serviceable pincodes.`,
      category: 'ORDERS_DELIVERY',
      chips: ['How do I check my order status?', 'How long does delivery take?', 'Do you deliver to my location?', 'Where can I find my order ID?'],
      products: [],
      quickActions: [{ label: 'Track on WhatsApp', action: 'url', value: settings.storePolicies.whatsappUrl }],
      matchedFaq: 'How long does delivery take?',
      confidence: 1.0,
      context: { ...context, lastIntent: 'ORDERS_DELIVERY' }
    };
  }

  if (/^payment help$|^payment assistance$/i.test(lower)) {
    return {
      reply: `💳 **Payment & Billing Help:**\n• **Supported Online Methods:** UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), Net Banking, and Wallets via secure gateway.\n• **Cash on Delivery (COD):** Cash on Delivery is **not available**. All orders must be paid 100% online prior to dispatch.\n• **Failed Payment Protection:** If money was deducted for an unconfirmed order, it automatically reverses within 24-48 bank hours. Reach our team on WhatsApp if you need instant verification!`,
      category: 'PAYMENTS',
      chips: ['Which payment methods are supported?', 'Is cash on delivery available?', 'Why did my payment fail?', 'What should I do if money was deducted but the order was not confirmed?'],
      products: [],
      quickActions: [{ label: 'Payment Support', action: 'url', value: settings.storePolicies.whatsappUrl }],
      matchedFaq: 'Which payment methods are supported?',
      confidence: 1.0,
      context: { ...context, lastIntent: 'PAYMENTS' }
    };
  }

  // Explicit Cash on Delivery / COD Query Handler
  if (/(cash on delivery|cod|pay on delivery|pay cash|pay with cash|cash delivery|want cash|need cash)/i.test(lower)) {
    return {
      reply: `🚫 **Cash on Delivery (COD) is NOT Available**\n\nWe do **not** offer Cash on Delivery. To guarantee priority express packaging, hygienic handling, and fast dispatch, Arshith Fresh accepts **100% secure online payments only**:\n\n• 📱 **UPI**: Google Pay, PhonePe, Paytm, BHIM, and any bank UPI app\n• 💳 **Credit & Debit Cards**: Visa, MasterCard, RuPay, Maestro\n• 🏦 **Net Banking**: All major Indian banks\n• 👛 **Wallets**: Paytm, Mobikwik, Freecharge\n\n✨ **Special Savings**: Apply coupon code **WELCOME10** at checkout for **10% OFF** your online order!`,
      category: 'PAYMENTS',
      chips: ['Which payment methods are supported?', 'Are there any current offers?', 'How long does delivery take?'],
      products: [],
      quickActions: [{ label: 'Shop Products', action: 'url', value: '/pages/collections.html' }],
      matchedFaq: 'Is cash on delivery available?',
      confidence: 1.0,
      context: { ...context, lastIntent: 'PAYMENTS' }
    };
  }

  if (/^returns? & cancellations?$|^returns? and cancellations?$/i.test(lower)) {
    return {
      reply: `🔄 **Returns, Refunds & Cancellations:**\n• **7-Day Guarantee:** We offer hassle-free replacement or full refund if you receive a damaged, leaked, or wrong product.\n• **Cancellations:** You can cancel an order before it is dispatched by contacting our support team with your Order ID.\n• **How to Request:** WhatsApp us at **+91 9945676029** or email **support@arshithfresh.com** with photos of the unboxed package.\n• **Refund Timeline:** Approved refunds process within 3 to 5 business days to your original payment method.`,
      category: 'RETURNS_REFUNDS',
      chips: ['What is your return policy?', 'Can I return a product?', 'How do I request a refund?', 'Can I cancel an order after confirmation?'],
      products: [],
      quickActions: [{ label: 'WhatsApp Return Desk', action: 'url', value: settings.storePolicies.whatsappUrl }],
      matchedFaq: 'What is your return policy?',
      confidence: 1.0,
      context: { ...context, lastIntent: 'RETURNS_REFUNDS' }
    };
  }

  if (/^offers? & discounts?$|^offers? and discounts?$/i.test(lower)) {
    return {
      reply: `🎉 **Current Exclusive Offers & Discounts:**\n• **10% OFF Welcome Coupon:** Use code **WELCOME10** or **SAVE10** at checkout for flat 10% off your order!\n• **FREE Shipping:** Automatically applied on every cart with subtotal of ₹1,000 or more.\n• **Bulk Discounts:** Custom pricing and special discounts available for wholesale, festive, or bulk orders.`,
      category: 'OFFERS',
      chips: ['How do I apply a coupon?', 'Are discounts available for bulk purchases?', 'How do I check the final price after discounts?', 'Shop Products'],
      products: [],
      quickActions: [{ label: 'Shop with WELCOME10', action: 'url', value: '/pages/collections.html' }],
      matchedFaq: 'Are there any current offers?',
      confidence: 1.0,
      context: { ...context, lastIntent: 'OFFERS' }
    };
  }

  if (/^talk to support$|^speak to (human|agent|support)$|^contact support$/i.test(lower)) {
    return {
      reply: `👨‍💼 **Arshith Fresh Customer Care Team:**\nOur dedicated support team is available **Monday through Saturday, 9:00 AM to 7:00 PM IST**.\n\n• **WhatsApp Direct Chat:** [+91 9945676029](https://wa.me/919945676029) or [+91 8618471424](https://wa.me/918618471424)\n• **Email Support:** support@arshithfresh.com\n• **Order Assistance:** Please share your Order ID or registered mobile number for faster resolution.`,
      category: 'ACCOUNT_TECH',
      chips: ['How do I check my order status?', 'What should I do if I receive a damaged product?', 'How long does delivery take?'],
      products: [],
      quickActions: [
        { label: 'Chat on WhatsApp', action: 'url', value: 'https://wa.me/919945676029' },
        { label: 'Email Support', action: 'url', value: 'mailto:support@arshithfresh.com' }
      ],
      matchedFaq: 'How do I contact customer support?',
      confidence: 1.0,
      context: { ...context, lastIntent: 'ACCOUNT_TECH', needsEscalation: true }
    };
  }

  // 2.5 Explicit Cart Query Handler (e.g. "show my cart list", "show my cart", "my cart", "view cart", "what is in my cart")
  const isCartQuery = (
    /\b(cart\s*list|show.*cart|view.*cart|open.*cart|check.*cart|see.*cart|display.*cart|my\s*cart|in\s*(my\s*)?cart|added\s*to\s*(my\s*)?cart|cart\s*items|items\s*in\s*(my\s*)?cart|cart\s*total|cart\s*summary|my\s*bag|shopping\s*cart|what.*in.*cart)\b/i.test(lower) ||
    /^(cart|my cart|show cart|view cart|cart list|show my cart|show my cart list|open cart|see cart|check cart)$/i.test(lower.trim()) ||
    /(ಕಾರ್ಟ್|ಕಾರ್ಟು|ನನ್ನ ಕಾರ್ಟ್|ತೋರಿಸಿ.*ಕಾರ್ಟ್|ನಾವು ಕಾರ್ಟ್ ಮಾಡಿರೋದು|कार्ट|मेरा कार्ट|गाड़ी दिखाओ|కార్ట్|నా కార్ట్|கார்ட்|என் கார்ட்)/i.test(lower)
  ) && !/(how to\s*(add|remove|delete)|how do i\s*(add|remove)|can i return|why|policy|damaged|track)/i.test(lower);

  if (isCartQuery) {
    if (cart && Array.isArray(cart) && cart.length > 0) {
      let subtotal = 0;
      let totalQty = 0;
      const itemsList = [];
      const cartProductCards = [];

      for (const item of cart) {
        const qty = Number(item.quantity || item.qty || 1);
        const price = Number(item.price || 0);
        const lineTotal = price * qty;
        subtotal += lineTotal;
        totalQty += qty;

        const name = (item.title || item.name || 'Arshith Fresh Product').replace(/"/g, '');
        const unit = item.unit ? ` (${item.unit})` : '';
        itemsList.push(`• **${name}${unit}** × ${qty} — **₹${lineTotal}**`);

        let img = item.image || '/assets/images/placeholder.svg';
        if (img && !img.startsWith('http://') && !img.startsWith('https://') && !img.startsWith('/')) {
          img = '/' + img;
        }

        cartProductCards.push({
          id: item.id || item.product || String(Date.now()),
          handle: item.handle || item.id || '',
          name: `${name} (Qty: ${qty})`,
          title: `${name} (Qty: ${qty})`,
          price: lineTotal,
          originalPrice: 0,
          unit: `${qty} × ₹${price}`,
          image: img,
          countInStock: 50,
          category: 'Cart Items'
        });
      }

      const freeShippingThreshold = settings.storePolicies?.freeShippingThreshold || 1000;
      const deliveryStatus = subtotal >= freeShippingThreshold
        ? `✨ **FREE Delivery Unlocked!** (Cart total exceeds ₹${freeShippingThreshold})`
        : `🚚 Add **₹${freeShippingThreshold - subtotal}** more to unlock **FREE Delivery** across India!`;

      return {
        reply: `🛒 **Your Current Shopping Cart (${totalQty} item${totalQty > 1 ? 's' : ''}):**\n\n${itemsList.join('\n')}\n\n💰 **Cart Subtotal: ₹${subtotal}**\n${deliveryStatus}\n\nYou can proceed directly to checkout or edit quantities on your Cart page.`,
        category: 'CART_CHECKOUT',
        chips: ['Are there any current offers?', 'Which payment methods are supported?', 'How long does delivery take?'],
        products: cartProductCards,
        quickActions: [
          { label: `Proceed to Checkout (₹${subtotal})`, action: 'url', value: '/pages/checkout.html' },
          { label: 'Open Cart Page', action: 'url', value: '/pages/cart.html' }
        ],
        matchedFaq: 'Show My Cart',
        confidence: 1.0,
        context: { ...context, lastIntent: 'CART_CHECKOUT' }
      };
    } else {
      const featuredProds = await findLiveProducts('oils', 3);
      return {
        reply: `🛒 **Your shopping cart is currently empty!**\n\nYou haven't added any items to your cart yet.\n\nExplore our farm-fresh, 100% natural cold-pressed oils, pure A2 bilona ghee, authentic spices, and healthy dry fruits below. Tap **"🛒 Add to Cart"** on any product to start shopping!`,
        category: 'CART_CHECKOUT',
        chips: ['Shop Products', 'What oils do you have?', 'Are there any current offers?', 'Talk to Support'],
        products: featuredProds,
        quickActions: [
          { label: 'Explore Collections', action: 'url', value: '/pages/collections.html' },
          { label: 'Open Cart Page', action: 'url', value: '/pages/cart.html' }
        ],
        matchedFaq: 'Empty Cart',
        confidence: 1.0,
        context: { ...context, lastIntent: 'CART_CHECKOUT' }
      };
    }
  }

  // 2.5. Price & Budget Query Filter Engine (e.g. "under 500 cost", "products under the cost of 500", "below 300", "oils under 400", "cheapest products")
  const priceFilter = detectPriceFilter(text);
  if (priceFilter && priceFilter.isPriceQuery) {
    try {
      const allProducts = await Product.find({}).lean();
      if (allProducts && allProducts.length > 0) {
        let matched = allProducts.map(formatProduct).filter(Boolean);

        // Filter by Category if user specified one (e.g. "oils under 400", "seeds under 150")
        if (priceFilter.categoryFilter) {
          const cat = priceFilter.categoryFilter.toLowerCase();
          matched = matched.filter(p => {
            const pCat = (p.category || '').toLowerCase();
            const pName = (p.name || '').toLowerCase();
            if (cat === 'oils') return pCat.includes('oil') || pName.includes('oil');
            if (cat === 'ghee and honey' || cat === 'ghee') return pCat.includes('ghee') || pCat.includes('honey') || pName.includes('ghee') || pName.includes('honey');
            if (cat === 'seeds') return pCat.includes('seed') || pName.includes('seed');
            if (cat === 'dry fruits') return pCat.includes('fruit') || pCat.includes('nut') || pCat.includes('dry') || /almond|cashew|walnut|pista|fig|anjeer|raisin/i.test(pName);
            if (cat === 'powders & masalas' || cat === 'spices') return pCat.includes('powder') || pCat.includes('masala') || pCat.includes('spice') || /chilli|turmeric|coriander|podi|karam|masala/i.test(pName);
            return pCat.includes(cat);
          });
        }

        // Filter by specific keyword if user mentioned an ingredient (e.g. "mustard under 200", "groundnut under 400")
        if (priceFilter.keywordFilter) {
          const kw = priceFilter.keywordFilter.toLowerCase();
          const kwMatched = matched.filter(p => (p.name || '').toLowerCase().includes(kw));
          if (kwMatched.length > 0) {
            matched = kwMatched;
          }
        }

        // Filter by price bounds
        if (priceFilter.maxPrice !== null) {
          matched = matched.filter(p => p.price <= priceFilter.maxPrice);
        }
        if (priceFilter.minPrice !== null) {
          matched = matched.filter(p => p.price >= priceFilter.minPrice);
        }

        // Sort results
        if (priceFilter.isExpensive) {
          matched.sort((a, b) => b.price - a.price);
        } else {
          matched.sort((a, b) => a.price - b.price);
        }

        if (matched.length > 0) {
          const catLabel = priceFilter.categoryFilter ? `**${priceFilter.categoryFilter}** ` : '';
          let headerText = '';

          if (priceFilter.maxPrice !== null && priceFilter.minPrice !== null) {
            headerText = `Here are our verified 100% natural ${catLabel}products between **₹${priceFilter.minPrice}** and **₹${priceFilter.maxPrice}** directly from our inventory:`;
          } else if (priceFilter.maxPrice !== null) {
            headerText = `Here are our verified 100% natural ${catLabel}products under **₹${priceFilter.maxPrice}** directly from our inventory (starting from just **₹${matched[0].price}**):`;
          } else if (priceFilter.minPrice !== null) {
            headerText = `Here are our verified 100% natural ${catLabel}products priced at **₹${priceFilter.minPrice} and above** directly from our inventory:`;
          } else if (priceFilter.isCheapest) {
            headerText = `Here are our most affordable, budget-friendly 100% natural ${catLabel}products directly from our inventory (starting from just **₹${matched[0].price}**):`;
          } else if (priceFilter.isExpensive) {
            headerText = `Here are our premium quality natural ${catLabel}selections directly from our inventory:`;
          }

          const featuredBullets = matched.slice(0, 6).map(p => {
            const unitStr = p.unit ? ` (${p.unit})` : '';
            const mrpStr = p.originalPrice && p.originalPrice > p.price ? ` ~₹${p.originalPrice}~` : '';
            return `• **${p.name}** — **₹${p.price}**${unitStr}${mrpStr}`;
          }).join('\n');

          const freeShipTip = `\n\n💡 *Tip: Add items totaling ₹1,000 or more to get **FREE Delivery** across India! Use coupon **WELCOME10** for 10% off.*`;
          const reply = `${headerText}\n\n${featuredBullets}${freeShipTip}`;

          return {
            reply,
            category: 'PRODUCTS',
            chips: ['What oils do you have?', 'Pure Cow Ghee', 'Are there any current offers?', 'Talk to Support'],
            products: matched.slice(0, 6),
            quickActions: [
              { label: 'View All Collections', action: 'url', value: '/pages/collections.html' },
              { label: 'Open Cart Page', action: 'url', value: '/pages/cart.html' }
            ],
            matchedFaq: `Price Filter (${priceFilter.maxPrice ? 'under ' + priceFilter.maxPrice : 'budget'})`,
            confidence: 0.98,
            context: {
              ...context,
              lastIntent: 'PRODUCTS',
              lastPriceFilter: priceFilter.maxPrice || priceFilter.minPrice || 'budget'
            }
          };
        } else {
          // No products found within the specified constraint (e.g. under ₹20)
          const allSorted = allProducts.map(formatProduct).filter(Boolean).sort((a, b) => a.price - b.price);
          const lowestPrice = allSorted.length > 0 ? allSorted[0].price : 49;
          const lowestSample = allSorted.slice(0, 4);

          const reply = `We currently do not have ${priceFilter.categoryFilter ? priceFilter.categoryFilter.toLowerCase() + ' ' : ''}products under **₹${priceFilter.maxPrice || priceFilter.minPrice}**.\n\nOur most affordable 100% natural, farm-fresh essentials start from **₹${lowestPrice}** (such as stone-ground Chilli Powder at ₹49, Flax Seeds at ₹90, and Castor Oil at ₹95).\n\nHere are our best budget-friendly options available right now:`;

          return {
            reply,
            category: 'PRODUCTS',
            chips: ['What oils do you have?', 'Pure Cow Ghee', 'Are there any current offers?', 'Talk to Support'],
            products: lowestSample,
            quickActions: [
              { label: 'View All Collections', action: 'url', value: '/pages/collections.html' }
            ],
            matchedFaq: 'Price Filter (No Exact Match)',
            confidence: 0.9,
            context: { ...context, lastIntent: 'PRODUCTS' }
          };
        }
      }
    } catch (err) {
      console.warn('⚠️ Price filter query database lookup error:', err.message);
    }
  }

  // 3. Precision Catalog & Product Intent Resolver
  const catalogMatch = resolveCatalogItem(text);

  if (catalogMatch) {
    try {
      const allProducts = await Product.find({}).lean();

      // Case A: Exact Specific Catalog Product Match (e.g. "musturd oil", "sesame oil", "badam", "cow ghee")
      if (catalogMatch.item) {
        const matchedProduct = allProducts.find(p => catalogMatch.item.nameMatch.test(p.name));
        if (matchedProduct) {
          const formatted = formatProduct(matchedProduct);
          const isPriceInquiry = /price|cost|how much|rate/i.test(lower);
          const replyText = isPriceInquiry
            ? `**${formatted.name}** is available for **₹${formatted.price}** (${formatted.unit || ''})${formatted.originalPrice ? ` [MRP: ₹${formatted.originalPrice}]` : ''} and is currently **In Stock** directly from our inventory:`
            : `Here are our verified natural products matching **"${text}"** directly from our inventory:`;

          return {
            reply: replyText,
            category: 'PRODUCTS',
            chips: ['Are there any current offers?', 'How long does delivery take?', 'Which payment methods are supported?'],
            products: [formatted],
            quickActions: [{ label: 'View All Collections', action: 'url', value: '/pages/collections.html' }],
            matchedFaq: 'Live Product Search',
            confidence: 0.95,
            context: {
              ...context,
              lastProductSearch: catalogMatch.item.key.replace(/_/g, ' '),
              lastProductName: formatted.name,
              lastProductId: formatted.id,
              lastIntent: 'PRODUCTS'
            }
          };
        }
      }

      // Case B: Broad Category Inquiry (e.g. "oils", "what oils do you have", "dry fruits", "spices", "seeds")
      if (catalogMatch.type === 'CATEGORY') {
        const catProducts = allProducts
          .filter(p => {
            const m = CATALOG_MAP.find(item => item.nameMatch.test(p.name));
            return m && m.category === catalogMatch.category;
          })
          .map(formatProduct);

        return {
          reply: `Here are our verified 100% natural cold-pressed **${catalogMatch.category.toLowerCase()}** directly from our inventory:`,
          category: 'PRODUCTS',
          chips: ['Are there any current offers?', 'How long does delivery take?', 'Talk to Support'],
          products: catProducts.slice(0, 6),
          quickActions: [{ label: 'View All Collections', action: 'url', value: '/pages/collections.html' }],
          matchedFaq: `Category: ${catalogMatch.category}`,
          confidence: 0.95,
          context: { ...context, lastIntent: 'PRODUCTS', lastProductSearch: catalogMatch.category }
        };
      }

      // Case C: Unavailable Specific Product in Known Category (e.g. "olive oil", "avocado oil", "neem oil")
      if (catalogMatch.type === 'UNAVAILABLE_SPECIFIC') {
        if (catalogMatch.category === 'Oils') {
          return {
            reply: `We currently do not stock **${catalogMatch.requested} oil** in our inventory.\n\nWe specialize in 100% pure, chemical-free cold-pressed traditional oils including:\n• **Groundnut Oil**\n• **Sesame Oil (Gingelly / Til)**\n• **Coconut Oil**\n• **Sunflower Oil**\n• **Mustard Oil**\n• **Castor Oil**\n\nWould you like to explore any of these pure cold-pressed oils?`,
            category: 'PRODUCTS',
            chips: ['Show all oils', 'Shop Products', 'Talk to Support'],
            products: [],
            quickActions: [{ label: 'View Available Oils', action: 'url', value: '/pages/collections.html' }],
            matchedFaq: 'Unavailable Product Inquiry',
            confidence: 0.9,
            context: { ...context, lastIntent: 'PRODUCTS' }
          };
        }
      }
    } catch (err) {
      console.warn('⚠️ Catalog resolution database lookup error:', err.message);
    }
  }

  // 4. Intent matching against the 76 FAQs
  let bestFaq = null;
  let highestScore = 0;

  for (const faq of faqs) {
    if (faq.category === 'GREETINGS' && faq.question.toLowerCase().includes('hii') && !/^(hi|hii|hello|hey|start|good morning|good evening|good afternoon|namaste|hlo|greetings)\b/i.test(lower)) {
      continue;
    }
    const score = calculateMatchScore(text, faq);
    if (score > highestScore) {
      highestScore = score;
      bestFaq = faq;
    }
  }

  // 5. Context resolution: If user asks follow-up like "what is the price?" with product in previous context
  if (context.lastProductSearch && (/price|cost|how much|in stock|available|buy|details/i.test(lower))) {
    const ctxProds = await findLiveProducts(context.lastProductSearch, 1);
    if (ctxProds.length > 0) {
      const p = ctxProds[0];
      return {
        reply: `**${p.name}** is available for **₹${p.price}** (${p.unit || ''})${p.originalPrice ? ` [MRP: ₹${p.originalPrice}]` : ''} and is currently **In Stock**.`,
        category: 'PRODUCTS',
        chips: ['How do I add to cart?', 'How long does delivery take?', 'Talk to Support'],
        products: [p],
        quickActions: [{ label: 'Shop Now', action: 'url', value: '/pages/collections.html' }],
        matchedFaq: 'Context Product Followup',
        confidence: 0.95,
        context: { ...context, lastProductSearch: p.name }
      };
    }
  }

  // 6. High confidence FAQ match (score >= 28)
  if (bestFaq && highestScore >= 28) {
    let relatedProducts = [];
    if (bestFaq.category === 'PRODUCTS' || /product|price|available|buy|shop/i.test(lower)) {
      if (/ghee/i.test(lower) || /ghee/i.test(bestFaq.question)) {
        relatedProducts = await findLiveProducts('ghee', 3);
      } else if (/dry fruit|almond|cashew|walnut|fig|anjeer|nut|pista/i.test(lower) || /dry fruit/i.test(bestFaq.question)) {
        relatedProducts = await findLiveProducts('dry fruits', 3);
      } else if (/seed|chia|flax/i.test(lower) || /seed/i.test(bestFaq.question)) {
        relatedProducts = await findLiveProducts('seeds', 3);
      } else if (/spice|masala|turmeric|chilli|podi|curry/i.test(lower) || /spice|podi|turmeric|chilli/i.test(bestFaq.question)) {
        relatedProducts = await findLiveProducts('spices', 3);
      } else {
        relatedProducts = await findLiveProducts('oils', 3);
      }
    }

    Faq.findByIdAndUpdate(bestFaq._id, { $inc: { viewsCount: 1 } }).catch(() => {});

    return {
      reply: bestFaq.answer,
      category: bestFaq.category,
      chips: bestFaq.followUps && bestFaq.followUps.length > 0 ? bestFaq.followUps : ['Shop Products', 'Orders & Delivery', 'Talk to Support'],
      products: relatedProducts,
      quickActions: bestFaq.quickActions || [],
      matchedFaq: bestFaq.question,
      confidence: Math.min(1.0, highestScore / 100),
      context: {
        ...context,
        lastIntent: bestFaq.category
      }
    };
  }

  // 7. Safe intelligent fallback (Uncertain / Unknown Query)
  const fallbackReply = `I want to make sure you get the exact information! While I couldn't find an exact match for **"${text}"**, I'm constantly learning.\n\nCould you please rephrase your question, or would you like to speak directly with an Arshith Fresh support executive on WhatsApp?`;

  return {
    reply: fallbackReply,
    category: 'UNKNOWN',
    chips: [
      'What products do you sell?',
      'How long does delivery take?',
      'Which payment methods are supported?',
      'Talk to Support'
    ],
    products: [],
    quickActions: [
      { label: 'Chat with Human Support', action: 'url', value: settings.storePolicies.whatsappUrl }
    ],
    matchedFaq: null,
    confidence: 0.0,
    isUnresolved: true,
    unresolvedText: text,
    context: { ...context, lastIntent: 'unknown' }
  };
}

module.exports = {
  getFaqs,
  getBotSettings,
  invalidateFaqCache,
  processUserMessage,
  findLiveProducts
};
