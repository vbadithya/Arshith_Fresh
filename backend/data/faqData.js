// 76 Verified FAQs for Arshith Fresh E-Commerce Store & Customer Support
const FAQ_DATA = [
  // =========================================================================
  // CATEGORY A: GREETINGS AND GENERAL ASSISTANCE (8 Questions)
  // =========================================================================
  {
    category: 'GREETINGS',
    question: 'Hii, hello, good morning, good evening',
    answer: "Hii! 👋 Welcome to Arshith Fresh! I'm your AI shopping assistant. How can I help you today? Feel free to ask about our 100% natural cold-pressed oils, pure A2 cow ghee, stone-ground spices, or track your recent orders.",
    keywords: ['hi', 'hii', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon', 'namaste', 'greetings', 'start'],
    followUps: ['What products do you sell?', 'Are there any current offers?', 'How long does delivery take?'],
    quickActions: [
      { label: 'Shop Products', action: 'chat', value: 'What products do you sell?' },
      { label: 'Offers & Discounts', action: 'chat', value: 'Are there any current offers?' }
    ],
    order: 1
  },
  {
    category: 'GREETINGS',
    question: 'What is Arshith Fresh?',
    answer: "Arshith Fresh is your trusted direct-from-source organic food brand dedicated to bringing you 100% pure, unadulterated essentials. We specialize in wooden-pressed (chekku/ghani) oils, hand-churned A2 desi cow & buffalo bilona ghee, stone-ground single-origin spices, raw forest honey, authentic Andhra pickles, and premium dry fruits.",
    keywords: ['what is arshith fresh', 'about arshith fresh', 'who are you', 'about company', 'brand story', 'organic brand'],
    followUps: ['What products do you sell?', 'How do you process your oils and ghee?', 'Do you have quality certifications?'],
    quickActions: [
      { label: 'About Us Page', action: 'url', value: '/pages/about-us.html' },
      { label: 'Shop All Products', action: 'url', value: '/pages/collections.html' }
    ],
    order: 2
  },
  {
    category: 'GREETINGS',
    question: 'What products do you sell?',
    answer: "We offer 6 core categories of pure, chemical-free food essentials:\n1. 🥥 **Cold-Pressed Oils**: Groundnut, Coconut, Sesame/Gingelly, Sunflower, Castor & Deepam Oil.\n2. 🍯 **Ghee & Honey**: Pure A2 Desi Cow Bilona Ghee, Buffalo Ghee & Raw Wild Forest Honey.\n3. 🌶️ **Spices & Podulu**: Turmeric, Guntur Red Chilli, Coriander, Sambar Masala, Pappula Podi & Karampodi.\n4. 🥜 **Dry Fruits & Seeds**: California Almonds, Whole Cashews, Walnuts, Chia & Flax Seeds.\n5. 🥭 **Traditional Pickles**: Avakaya (Mango), Gongura, Lemon & Tomato Pickles.\n6. 🌾 **Cooking Essentials**: Sulphur-free sugar, natural jaggery & premium pulses.",
    keywords: ['what products do you sell', 'product list', 'catalog', 'what do you offer', 'categories', 'items available'],
    followUps: ['Show me cold-pressed oils', 'Tell me about your A2 cow ghee', 'How do I place an order?'],
    quickActions: [
      { label: 'Explore Oils', action: 'url', value: '/pages/collections.html?category=Oils' },
      { label: 'Explore Ghee', action: 'url', value: '/pages/collections.html?category=Ghee%20and%20Honey' }
    ],
    order: 3
  },
  {
    category: 'GREETINGS',
    question: 'How can I shop on your website?',
    answer: "Shopping on Arshith Fresh is simple and convenient:\n1. **Browse or Search**: Browse categories via the top menu or use the search bar to find products.\n2. **Select & Add to Cart**: Choose your preferred pack size (e.g. 500ml, 1L, 250g) and tap **Add to Cart**.\n3. **Review Cart**: Click the cart icon or sticky cart bar at bottom right.\n4. **Checkout**: Enter your delivery address and choose your 100% secure online payment method (UPI, Debit/Credit Cards, or Net Banking).\n5. **Confirmation**: You'll receive instant confirmation via Email and SMS with tracking details.",
    keywords: ['how to shop', 'how can i shop', 'how to buy', 'purchasing guide', 'steps to order', 'shopping instructions'],
    followUps: ['How do I add a product to my cart?', 'Which payment methods are supported?', 'How long does delivery take?'],
    quickActions: [
      { label: 'Start Shopping', action: 'url', value: '/pages/collections.html' },
      { label: 'View Cart', action: 'url', value: '/pages/cart.html' }
    ],
    order: 4
  },
  {
    category: 'GREETINGS',
    question: 'How do I contact customer support?',
    answer: "Our dedicated support team is available Monday through Saturday from 9:00 AM to 7:00 PM IST:\n• 📱 **WhatsApp / Call**: +91 9945676029 or +91 8618471424\n• 📧 **Email**: support@arshithfresh.com\n• 💬 **Live Chat**: Right here through our AI assistant!\n• 📍 **Headquarters**: Arshith Fresh India, Karnataka, India.",
    keywords: ['contact support', 'how do i contact', 'customer service', 'support email', 'phone number', 'helpline', 'care number'],
    followUps: ['Can I speak to a human representative?', 'What are your support working hours?'],
    quickActions: [
      { label: 'Chat on WhatsApp', action: 'url', value: 'https://api.whatsapp.com/send/?phone=919945676029&text=Hi%20Arshith%20Fresh!' }
    ],
    order: 5
  },
  {
    category: 'GREETINGS',
    question: 'Can you help me find a product?',
    answer: "Yes, absolutely! I can help you find any product instantly. Simply type the product name or ingredient (e.g., *'groundnut oil'*, *'A2 ghee'*, *'turmeric powder'*, or *'cashews'*). You can also tell me what you're cooking or your dietary goals (e.g., *'keto cooking'*, *'healthy heart'*), and I will recommend the perfect match with live prices!",
    keywords: ['help me find a product', 'find product', 'search help', 'look for item', 'recommend an item'],
    followUps: ['Show me cold-pressed groundnut oil', 'Show me A2 cow ghee', 'What spices are available?'],
    quickActions: [
      { label: 'Search Catalog', action: 'url', value: '/pages/collections.html' }
    ],
    order: 6
  },
  {
    category: 'GREETINGS',
    question: 'How do I use the website?',
    answer: "Our website is designed for fast, seamless navigation:\n• **Top Header**: Search bar, Category Mega Menu, Account Profile, and Cart Drawer.\n• **Category Circles**: Tap any circular icon on the homepage for quick category browsing.\n• **Sticky Cart Bar**: Displays current items and free shipping progress toward ₹1,000.\n• **Bottom Floating Buttons**: Tap the green WhatsApp button for human chat or this AI Assistant button for 24/7 instant shopping help.",
    keywords: ['how do i use website', 'website navigation', 'how website works', 'features of website'],
    followUps: ['How do I check my order status?', 'How can I view my cart?'],
    order: 7
  },
  {
    category: 'GREETINGS',
    question: 'Can I speak to a human representative?',
    answer: "Yes! While I can handle all product recommendations, store policies, tracking, and cart questions, our human support executives are happy to assist you directly.\n\n👉 Click the green **WhatsApp** button on your screen or message **+91 9945676029** to chat directly with a member of our support team (Available Mon–Sat, 9 AM – 7 PM IST).",
    keywords: ['speak to human', 'human representative', 'real agent', 'talk to support', 'talk to person', 'human assistance', 'executive'],
    followUps: ['What is your support email?', 'Where can I find my order ID?'],
    quickActions: [
      { label: 'Open WhatsApp Support', action: 'url', value: 'https://api.whatsapp.com/send/?phone=919945676029&text=Hi%20Arshith%20Fresh,%20I%20would%20like%20to%20speak%20with%20a%20human%20agent.' }
    ],
    order: 8
  },

  // =========================================================================
  // CATEGORY B: PRODUCTS AND PRODUCT INFORMATION (12 Questions)
  // =========================================================================
  {
    category: 'PRODUCTS',
    question: 'What products are available?',
    answer: "All our active products are sourced directly from verified organic farmers. Our collection includes:\n• **Oils**: Groundnut Oil (₹399/1L), Sunflower Oil (₹559/1L), Sesame Oil (₹115/250ml), Coconut Oil (₹174/250ml), Castor Oil (₹112/250ml).\n• **Ghee & Honey**: Pure A2 Cow Ghee (₹2249/1L), Pure Buffalo Ghee (₹2449/1L), Raw Natural Honey (₹650/1kg).\n• **Spices**: Guntur Chilli, Salem Turmeric, Coriander, Pappula Podi, Karampodi.\n• **Dry Fruits**: California Almonds, Cashew Nuts, Walnuts.\n• **Pickles**: Avakaya Mango, Gongura, Lemon Pickles.\n\nAsk me for any item to view its current live stock and price!",
    keywords: ['what products are available', 'available items', 'list of items in stock', 'what do you have in stock'],
    followUps: ['Show me cold pressed oils', 'Show me pure cow ghee', 'Are there any discounts?'],
    quickActions: [
      { label: 'View All Products', action: 'url', value: '/pages/collections.html' }
    ],
    order: 9
  },
  {
    category: 'PRODUCTS',
    question: 'How do I search for a product?',
    answer: "You can search in three easy ways:\n1. **Search Bar**: Type any keyword (e.g. 'Ghee', 'Castor Oil') into the search box in the top website header.\n2. **Category Directory**: Tap the 'Collections' tab or category circles on the homepage.\n3. **Directly in this Chat**: Tell me what you're looking for, and I'll pull live product cards with photos and 'Add to Cart' buttons right here!",
    keywords: ['how do i search', 'search product', 'how to find item', 'search bar'],
    followUps: ['Can you recommend products?', 'How do I view product details?'],
    order: 10
  },
  {
    category: 'PRODUCTS',
    question: 'Do you sell groceries and food essentials?',
    answer: "Yes! Arshith Fresh focuses exclusively on pure everyday kitchen and culinary essentials: cooking oils, pure desi ghee, natural sweeteners (sulphur-free sugar & jaggery), stone-ground spice powders, whole spices, pickles, and wholesome dry fruits. We do not sell perishable fresh vegetables or chemical-laden packaged snacks.",
    keywords: ['do you sell groceries', 'food essentials', 'grocery store', 'kitchen essentials', 'vegetables'],
    followUps: ['What products do you sell?', 'Is your sugar sulphur free?'],
    order: 11
  },
  {
    category: 'PRODUCTS',
    question: 'How can I view product details?',
    answer: "To view complete product details:\n• Click or tap on any product card or title anywhere on the website.\n• This opens the dedicated product details page showing high-resolution images, exact net weight / pack size options, nutritional benefits, traditional extraction methods, shelf life, and customer reviews.",
    keywords: ['view product details', 'product information', 'product page', 'how to see specifications'],
    followUps: ['How do I check ingredients or product specifications?', 'How do I add a product to my cart?'],
    order: 12
  },
  {
    category: 'PRODUCTS',
    question: "How can I check a product's price?",
    answer: "Current live prices are clearly displayed on every product card with sale prices highlighted in bold and original MRP shown with a strikethrough. If a product has multiple size variants (e.g., 500ml vs 1 Litre, or 250g vs 500g), selecting the variant button will update the price instantly. You can also ask me anytime: *'What is the price of Groundnut Oil?'*",
    keywords: ['check product price', 'how much is this', 'cost of product', 'product rate', 'pricing'],
    followUps: ['Show me Groundnut Oil price', 'Show me A2 Cow Ghee price'],
    order: 13
  },
  {
    category: 'PRODUCTS',
    question: 'Is this product currently available?',
    answer: "Our website inventory syncs in real-time with our warehouse. If an item shows the **'ADD TO CART'** button, it is in stock and ready to dispatch! If an item temporarily runs out, an 'Out of Stock' badge is shown and purchasing is temporarily paused until fresh batches arrive from our mills.",
    keywords: ['is this product currently available', 'in stock', 'stock check', 'out of stock', 'availability'],
    followUps: ['Why is a product unavailable?', 'How do I find similar products?'],
    order: 14
  },
  {
    category: 'PRODUCTS',
    question: 'How do I compare two products?',
    answer: "You can compare products by reviewing their net volume/weight, extraction method, and usage:\n• **Cow Ghee vs. Buffalo Ghee**: Cow Ghee is lighter, golden, and rich in A2 beta-casein, ideal for daily digestion and children. Buffalo Ghee has higher fat content, white granular texture, and is ideal for traditional sweets and richness.\n• **Groundnut Oil vs. Sunflower Oil**: Groundnut oil has a high smoke point and nutty aroma, ideal for deep frying and Indian curries. Sunflower oil is lighter and neutral, ideal for sautéing and baking.",
    keywords: ['compare products', 'difference between products', 'cow ghee vs buffalo ghee', 'which oil is better'],
    followUps: ['Tell me about Cow Ghee', 'Tell me about Groundnut Oil'],
    order: 15
  },
  {
    category: 'PRODUCTS',
    question: 'Can you recommend products?',
    answer: "Here are our top customer favorites:\n1. 🥥 **Wood-Pressed Groundnut Oil (1L)** — Nutty, unrefined, single-origin Telugu groundnuts.\n2. 🍯 **Pure Desi Cow Ghee (A2)** — Golden, fragrant granular bilona ghee made from cultured butter.\n3. 🌶️ **Andhra Pappula Podi (Chana Dal Spice Powder)** — Perfect comforting blend for hot rice and ghee.\n4. 🥜 **California Jumbo Almonds** — Crunch-packed natural nutrition.\n\nTell me your preference (e.g., daily cooking, immunity, diabetic friendly), and I'll tailor a recommendation!",
    keywords: ['recommend products', 'best sellers', 'top products', 'what should i buy', 'popular items'],
    followUps: ['Show me cold pressed oils', 'Show me cow ghee', 'Are there any current offers?'],
    order: 16
  },
  {
    category: 'PRODUCTS',
    question: 'How do I find products within my budget?',
    answer: "On our Collections page, you can sort and filter products by price from Low to High. We offer budget-friendly essentials starting from ₹49 (spices & podulu) up to family value packs. Plus, orders above ₹1,000 automatically get **FREE Shipping**, and coupon code **WELCOME10** gives you an extra 10% discount!",
    keywords: ['budget products', 'low price items', 'filter by price', 'affordable options', 'cheap items'],
    followUps: ['Are there any current offers?', 'How do I apply a coupon?'],
    order: 17
  },
  {
    category: 'PRODUCTS',
    question: 'How do I check ingredients or product specifications?',
    answer: "Every product page features a detailed **'Ingredients & Extraction Method'** section. All Arshith Fresh products contain **100% single-ingredient purity** with zero palm oil, zero mineral oils, zero preservatives, zero artificial colors, and zero chemical additives. What you see on the label is 100% of what's inside.",
    keywords: ['ingredients', 'product specifications', 'nutrition info', 'chemicals', 'preservatives', 'purity'],
    followUps: ['Is your ghee 100% pure?', 'Are your oils cold pressed?'],
    order: 18
  },
  {
    category: 'PRODUCTS',
    question: 'How do I find the correct product size or quantity?',
    answer: "On any product page, look for the **Variant Selection** buttons (e.g. 500ml, 1 Litre, 2 Litre for oils; or 250g, 500g, 1kg for ghee, honey, and dry fruits). Tap your preferred size, and the price will update before you add it to your cart.",
    keywords: ['product size', 'quantity selection', 'pack size', 'volume', 'variants', '500ml vs 1l'],
    followUps: ['How do I change the quantity in cart?', 'How do I add a product to my cart?'],
    order: 19
  },
  {
    category: 'PRODUCTS',
    question: 'Why is a product unavailable?',
    answer: "Because we produce our cold-pressed oils and bilona ghee in small, artisanal batches without factory chemicals, seasonal harvest fluctuations can occasionally cause an item to temporarily sell out. Fresh batches are typically processed and restocked within 2 to 5 business days.",
    keywords: ['why is product unavailable', 'out of stock reason', 'when will it restock', 'item sold out'],
    followUps: ['How do I find similar products?', 'Can you notify me when restocked?'],
    order: 20
  },
  {
    category: 'PRODUCTS',
    question: 'How do I find similar products?',
    answer: "When viewing any product page, scroll down to the **'Related Products'** section. You'll see complementary items from the same category (for example, Coconut Oil and Sesame Oil alongside Groundnut Oil, or Buffalo Ghee alongside Cow Ghee). You can also ask me right here in chat for alternatives!",
    keywords: ['find similar products', 'related products', 'alternatives', 'substitutes'],
    followUps: ['What products are available?', 'Can you recommend products?'],
    order: 21
  },
  {
    category: 'PRODUCTS',
    question: 'How do I know whether a product is suitable for my needs?',
    answer: "We clearly outline the best culinary and wellness uses for each item on its description page:\n• **High Heat Cooking/Frying**: Cold-pressed Groundnut Oil or Pure Ghee (high smoke points).\n• **Skin, Hair & Raw Dressing**: Cold-pressed Virgin Coconut Oil.\n• **Ayurvedic & Oil Pulling**: Cold-pressed Sesame (Gingelly) Oil.\n• **Immunity & Digestion**: A2 Desi Cow Bilona Ghee & Raw Forest Honey.\nIf you have specific dietary requirements, ask me or contact our support team!",
    keywords: ['suitable for my needs', 'which product to choose', 'health benefits', 'usage guide', 'is it good for me'],
    followUps: ['Tell me about Groundnut Oil', 'Tell me about Cow Ghee'],
    order: 22
  },

  // =========================================================================
  // CATEGORY C: SHOPPING CART AND CHECKOUT (10 Questions)
  // =========================================================================
  {
    category: 'CART_CHECKOUT',
    question: 'How do I add a product to my cart?',
    answer: "To add a product:\n1. On any product card, click the **'ADD TO CART'** button.\n2. Or on a product details page, select your preferred pack size and tap **'ADD TO CART'**.\n3. The cart counter in the header updates instantly, and a confirmation toast appears confirming your item has been added.",
    keywords: ['add product to cart', 'add to cart', 'how to add item', 'putting item in cart'],
    followUps: ['How do I change the quantity?', 'How can I view my cart?'],
    order: 23
  },
  {
    category: 'CART_CHECKOUT',
    question: 'How do I remove an item from my cart?',
    answer: "To remove an item:\n1. Open your cart by clicking the cart icon in the top header or opening [pages/cart.html](/pages/cart.html).\n2. Tap the **'✕ Remove'** or trash icon next to the product you wish to delete.\n3. Or reduce its quantity stepper to 0. The item will be immediately removed and your subtotal recalculated.",
    keywords: ['remove item from cart', 'delete from cart', 'remove product', 'clear cart item'],
    followUps: ['How do I change the quantity?', 'How do I proceed to checkout?'],
    quickActions: [
      { label: 'View Cart', action: 'url', value: '/pages/cart.html' }
    ],
    order: 24
  },
  {
    category: 'CART_CHECKOUT',
    question: 'How do I change the quantity?',
    answer: "You can adjust item quantities in two places:\n• On the product card stepper: tap the **'+'** button to increase or **'-'** button to decrease.\n• Inside your Shopping Cart page: use the quantity input or stepper buttons next to each line item. The total updates automatically in real-time.",
    keywords: ['change quantity', 'increase quantity', 'decrease quantity', 'update quantity in cart'],
    followUps: ['How can I view my cart?', 'How do I proceed to checkout?'],
    order: 25
  },
  {
    category: 'CART_CHECKOUT',
    question: 'How can I view my cart?',
    answer: "You can view your shopping cart anytime by:\n• Clicking the **Shopping Bag icon 🛒** at the top right of the page.\n• Clicking the **Sticky Cart Bar** floating at the bottom of the screen.\n• Direct link: [Open Shopping Cart](/pages/cart.html).",
    keywords: ['view my cart', 'open cart', 'see items in cart', 'check cart', 'shopping bag'],
    followUps: ['How do I proceed to checkout?', 'Why is my cart total different?'],
    quickActions: [
      { label: 'Go to Cart', action: 'url', value: '/pages/cart.html' }
    ],
    order: 26
  },
  {
    category: 'CART_CHECKOUT',
    question: 'Why is my cart total different?',
    answer: "Cart totals reflect:\n1. **Item Subtotal**: Sum of products and selected quantities.\n2. **Applied Coupons**: Deductions from discount codes (e.g., WELCOME10, SAVE10).\n3. **Shipping Charges**: **FREE** on all orders above ₹1,000! For orders under ₹1,000, standard carrier shipping (₹49–₹99 depending on distance and weight) is added.\nAll taxes are already included in product prices.",
    keywords: ['cart total different', 'why is total different', 'extra charge', 'taxes', 'delivery charge in cart'],
    followUps: ['How do I apply a coupon?', 'How do I get free shipping?'],
    order: 27
  },
  {
    category: 'CART_CHECKOUT',
    question: 'How do I proceed to checkout?',
    answer: "To checkout:\n1. Open your cart via the header icon or [pages/cart.html](/pages/cart.html).\n2. Review your items and click the prominent **'PROCEED TO CHECKOUT'** button.\n3. Enter your contact details and shipping address.\n4. Apply any promo coupon, choose your payment mode, and click **Place Order**.",
    keywords: ['proceed to checkout', 'how to checkout', 'complete order', 'go to payment'],
    followUps: ['Which payment methods are supported?', 'Can I purchase multiple products together?'],
    quickActions: [
      { label: 'Go to Checkout', action: 'url', value: '/pages/checkout.html' }
    ],
    order: 28
  },
  {
    category: 'CART_CHECKOUT',
    question: 'Why is checkout not working?',
    answer: "If checkout is not loading:\n1. Ensure your cart contains at least 1 valid item.\n2. Verify that all mandatory address fields (Full Name, 10-digit Phone, Street Address, 6-digit PIN code) are filled in correctly.\n3. Clear your browser cache or refresh the page.\n4. If the issue persists, contact our support team on WhatsApp at **+91 9945676029** and we will assist with manual checkout!",
    keywords: ['checkout not working', 'checkout error', 'cannot place order', 'checkout stuck', 'payment button disabled'],
    followUps: ['Can I speak to a human representative?', 'Which payment methods are supported?'],
    order: 29
  },
  {
    category: 'CART_CHECKOUT',
    question: 'Can I purchase multiple products together?',
    answer: "Yes, absolutely! You can add products from any combination of categories (e.g. oils, ghee, pickles, and spices) into a single cart. They will be packed together securely in eco-friendly packaging and shipped in one unified consignment.",
    keywords: ['purchase multiple products', 'buy multiple items', 'combined order', 'combine shipping'],
    followUps: ['How do I get free shipping?', 'How long does delivery take?'],
    order: 30
  },
  {
    category: 'CART_CHECKOUT',
    question: 'What happens if an item becomes unavailable?',
    answer: "If an item in your cart goes out of stock before you complete payment, the checkout system will alert you and prevent payment for that specific item. You can remove the unavailable item or replace it with an alternative variant to proceed with the rest of your order.",
    keywords: ['item becomes unavailable', 'out of stock during checkout', 'sold out item in cart'],
    followUps: ['Why is a product unavailable?', 'How do I find similar products?'],
    order: 31
  },
  {
    category: 'CART_CHECKOUT',
    question: 'How can I verify my order before payment?',
    answer: "On the Checkout page, a comprehensive **'Order Summary'** side panel lists every product, pack size, quantity, subtotal, discount savings, delivery fee, and final payable amount. You can review all details and edit your address before clicking the final payment button.",
    keywords: ['verify order before payment', 'order summary', 'review order', 'check order details'],
    followUps: ['How do I proceed to checkout?', 'Which payment methods are supported?'],
    order: 32
  },

  // =========================================================================
  // CATEGORY D: ORDERS AND DELIVERY (13 Questions)
  // =========================================================================
  {
    category: 'ORDERS_DELIVERY',
    question: 'How do I place an order?',
    answer: "Placing an order takes under 2 minutes:\n1. Add desired organic products to your cart.\n2. Tap the Cart icon and click **'Proceed to Checkout'**.\n3. Enter your delivery address and contact phone number.\n4. Select your payment method (UPI, Cards, Net Banking, or COD where eligible).\n5. Confirm payment. You'll receive your unique Order ID on screen, via SMS, and email!",
    keywords: ['how do i place an order', 'place order', 'how to order', 'ordering process'],
    followUps: ['How do I check my order status?', 'How long does delivery take?'],
    quickActions: [
      { label: 'Shop Now', action: 'url', value: '/pages/collections.html' }
    ],
    order: 33
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'How do I check my order status?',
    answer: "You can track your order easily:\n• Visit our [Track Order page](/pages/track-order.html) and enter your Order ID or phone number.\n• Check the live tracking link sent to your registered Email and WhatsApp after dispatch.\n• Or type your Order ID here in chat, and I'll look it up for you!",
    keywords: ['check order status', 'track order', 'where is my order', 'track package', 'shipping status'],
    followUps: ['Where can I find my order ID?', 'How long does delivery take?'],
    quickActions: [
      { label: 'Track Order Page', action: 'url', value: '/pages/track-order.html' }
    ],
    order: 34
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'Where can I find my order ID?',
    answer: "Your Order ID (format e.g., `#AF-1082` or MongoDB tracking code) is provided in:\n1. The order success confirmation screen immediately after purchase.\n2. The automated confirmation email sent to your registered email address.\n3. The WhatsApp and SMS notification sent to your phone number.",
    keywords: ['where can i find my order id', 'order id', 'order number', 'invoice number', 'tracking id'],
    followUps: ['How do I check my order status?', 'How do I contact support about my order?'],
    order: 35
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'How long does delivery take?',
    answer: "Standard delivery timeline:\n• **Processing & Dispatch**: 24 to 48 hours (we pack freshly in tamper-evident containers).\n• **South India (Karnataka, AP, Telangana, TN, Kerala)**: 2 to 3 business days.\n• **Rest of India**: 3 to 5 business days.\nDeliveries to remote pin codes may take up to 6–7 business days. You will receive live courier tracking updates throughout.",
    keywords: ['how long does delivery take', 'delivery time', 'when will i receive', 'shipping duration', 'delivery days'],
    followUps: ['Do you deliver to my location?', 'Why is my order delayed?'],
    order: 36
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'Do you deliver to my location?',
    answer: "We ship nationwide across all 28 states and union territories in India covering 26,000+ PIN codes via reliable courier partners (BlueDart, Delhivery, Shiprocket, DTDC). You can enter your 6-digit PIN code on any product page or checkout to verify instant coverage.",
    keywords: ['do you deliver to my location', 'pincode check', 'delivery coverage', 'serviceable pin codes', 'all india delivery'],
    followUps: ['How long does delivery take?', 'How do I check delivery availability?'],
    order: 37
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'How can I check delivery availability?',
    answer: "Enter your 6-digit PIN code in the PIN code check box on any product page or at checkout. The system will immediately confirm whether standard shipping is serviceable for your location. Please note: We accept 100% secure online payments only (Cash on Delivery is not available).",
    keywords: ['check delivery availability', 'pincode serviceability', 'check pincode'],
    followUps: ['Do you deliver to my location?', 'Which payment methods are supported?'],
    order: 38
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'Can I change my delivery address?',
    answer: "Yes, provided your order has **not yet been dispatched**. Contact us immediately on WhatsApp at **+91 9945676029** or email **support@arshithfresh.com** with your Order ID and updated address. Once the package has been handed over to the courier partner, address rerouting is subject to courier feasibility.",
    keywords: ['change delivery address', 'update address', 'wrong address', 'modify shipping address'],
    followUps: ['Can I modify an order after placing it?', 'How do I contact support about my order?'],
    order: 39
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'Can I modify an order after placing it?',
    answer: "Orders are processed swiftly to ensure prompt delivery. If you wish to add an item or modify variant sizes, contact our support team on WhatsApp at **+91 9945676029** within 2 hours of placing the order. If the parcel has already been sealed and dispatched, items cannot be edited.",
    keywords: ['modify order', 'change order items', 'edit order after placing', 'add item to order'],
    followUps: ['How do I cancel an order?', 'Can I change my delivery address?'],
    order: 40
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'How do I cancel an order?',
    answer: "You can request order cancellation before dispatch:\n1. WhatsApp our support team at **+91 9945676029** or email **support@arshithfresh.com** with your Order ID.\n2. State your reason for cancellation.\n3. If your order has not been dispatched, we will cancel it immediately and process a 100% refund to your original payment method within 3–5 business days.",
    keywords: ['cancel order', 'how to cancel', 'cancellation request', 'stop order'],
    followUps: ['Can I cancel an order after confirmation?', 'How long does a refund take?'],
    order: 41
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'Why is my order delayed?',
    answer: "While over 95% of orders arrive on schedule, rare courier delays may occur due to adverse weather, local transit restrictions, or public holidays. Check your live tracking link on our [Track Order page](/pages/track-order.html). If there is no tracking scan update for 48 hours, reach out to us on WhatsApp at **+91 9945676029** and we will escalate with the carrier.",
    keywords: ['order delayed', 'why is order late', 'delivery delay', 'late shipment', 'package stuck'],
    followUps: ['How do I check my order status?', 'How do I contact support about my order?'],
    order: 42
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'What should I do if my order is missing?',
    answer: "If your tracking shows 'Delivered' but you haven't received your package:\n1. Check with family members, neighbors, or building security.\n2. If not found, notify us within 24 hours at **support@arshithfresh.com** or WhatsApp **+91 9945676029** with your Order ID.\n3. We will open an immediate dispute with the courier manager and ensure you receive either a fast re-dispatch or a full refund.",
    keywords: ['order missing', 'package not delivered', 'marked delivered but not received', 'lost package'],
    followUps: ['What should I do if I receive a damaged product?', 'How do I contact support about my order?'],
    order: 43
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'What should I do if I receive a damaged product?',
    answer: "We guarantee 100% safe transit with heavy-duty leak-proof packaging. In the rare event of transit damage:\n1. Take clear photos or a short video of the damaged item and outer shipping label.\n2. Send it to **support@arshithfresh.com** or WhatsApp **+91 9945676029** within 7 days of delivery.\n3. We will dispatch a free brand-new replacement immediately or issue a 100% refund. No return of broken glass/oil required!",
    keywords: ['damaged product', 'broken bottle', 'leaking bottle', 'damaged package', 'defective item'],
    followUps: ['What is your return policy?', 'How do I request a refund?'],
    order: 44
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'How can I contact support about my order?',
    answer: "For any order assistance, keep your Order ID handy and contact:\n• 💬 **WhatsApp**: +91 9945676029 (fastest response)\n• 📧 **Email**: support@arshithfresh.com\n• 🌐 **Track Order**: [pages/track-order.html](/pages/track-order.html)\nOur team responds promptly within 1 business hour during working hours.",
    keywords: ['contact support about order', 'help with my order', 'order inquiry', 'order issue'],
    followUps: ['How do I check my order status?', 'Where can I find my order ID?'],
    order: 45
  },

  // =========================================================================
  // CATEGORY E: PAYMENTS AND BILLING (8 Questions)
  // =========================================================================
  {
    category: 'PAYMENTS',
    question: 'Which payment methods are supported?',
    answer: "We support 100% secure, RBI-compliant online payments via Razorpay & Cashfree:\n• **UPI**: Google Pay, PhonePe, Paytm, BHIM, and any bank UPI app.\n• **Cards**: Visa, MasterCard, RuPay, Maestro & American Express (Credit & Debit).\n• **Net Banking**: All major Indian banks (SBI, HDFC, ICICI, Axis, Kotak, etc.).\n• **Wallets**: Paytm, Mobikwik, Freecharge.\n\n⚠️ **Please Note**: Cash on Delivery (COD) is **not available**. All orders must be paid online prior to dispatch to ensure contactless priority shipping.",
    keywords: ['payment methods', 'how to pay', 'supported payments', 'upi', 'credit card', 'debit card', 'google pay', 'phonepe', 'online payment'],
    followUps: ['Is cash on delivery available?', 'Why did my payment fail?', 'How do I proceed to checkout?'],
    order: 46
  },
  {
    category: 'PAYMENTS',
    question: 'Is cash on delivery available?',
    answer: "No, Cash on Delivery (COD) is **not available**. Arshith Fresh accepts **100% secure online payments only** (UPI via Google Pay/PhonePe/Paytm, Debit & Credit Cards, Net Banking, and Wallets).\n\nThis policy ensures freshly packed, hygienic handling and priority express dispatch across India. You can also apply coupon code **WELCOME10** at checkout for **10% OFF** your online order!",
    keywords: ['is cash on delivery available', 'cod available', 'cash on delivery', 'pay on delivery', 'cod', 'i want cash on delivery', 'can i pay cash', 'want cod', 'cash payment'],
    followUps: ['Which payment methods are supported?', 'Are there any current offers?', 'How do I proceed to checkout?'],
    order: 47
  },
  {
    category: 'PAYMENTS',
    question: 'Why did my payment fail?',
    answer: "Common reasons for payment failures include:\n1. Bank server timeout or poor network connectivity.\n2. Incorrect OTP or expired session.\n3. Exceeded daily UPI transaction limits.\n4. International cards without 3D Secure verification.\n\nTip: You can retry using direct UPI (Google Pay / PhonePe) which has the highest success rate, or contact our support for alternative payment links.",
    keywords: ['why did payment fail', 'payment failure', 'transaction failed', 'payment error', 'otp failed'],
    followUps: ['What should I do if money was deducted but order was not confirmed?', 'Was my payment successful?'],
    order: 48
  },
  {
    category: 'PAYMENTS',
    question: 'What should I do if money was deducted but the order was not confirmed?',
    answer: "Don't worry! Your money is completely safe:\n1. If a bank network drops during payment, your bank usually reconciles and automatically reverses the amount within 24 to 48 banking hours.\n2. If our payment gateway (Razorpay) captured the payment, your order will be automatically created.\n3. Send your transaction reference/UTR number or bank SMS screenshot to WhatsApp **+91 9945676029** or email **support@arshithfresh.com**, and we will manually confirm your order immediately.",
    keywords: ['money deducted but order not placed', 'amount debited order failed', 'money cut order not confirmed', 'payment deducted'],
    followUps: ['How do refunds work after a failed payment?', 'Was my payment successful?'],
    order: 49
  },
  {
    category: 'PAYMENTS',
    question: 'How do I check my payment status?',
    answer: "When payment succeeds, you will see an immediate green confirmation checkmark on the screen and receive an instant SMS and Email receipt. If you are unsure, send your phone number or Order ID to our support team on WhatsApp at **+91 9945676029**, and we will check our gateway dashboard in seconds.",
    keywords: ['check payment status', 'payment status', 'is my payment done', 'verify transaction'],
    followUps: ['Was my payment successful?', 'Where can I find my invoice?'],
    order: 50
  },
  {
    category: 'PAYMENTS',
    question: 'Where can I find my invoice?',
    answer: "A digital GST-compliant tax invoice is automatically generated and attached to your order confirmation email. A printed copy is also included inside your physical parcel box. If you need a duplicate GST invoice for company billing, email **support@arshithfresh.com** with your Order ID and GSTIN.",
    keywords: ['where can i find my invoice', 'download invoice', 'bill', 'receipt', 'tax invoice', 'gst bill'],
    followUps: ['Where can I find my order ID?', 'How do I contact support about my order?'],
    order: 51
  },
  {
    category: 'PAYMENTS',
    question: 'Was my payment successful?',
    answer: "If your payment was successful, you will be redirected to the order confirmation page showing your Order ID (e.g. `#AF-1082`), and you will receive an instant confirmation SMS & Email from Arshith Fresh. You can also provide your email or phone number in this chat to confirm.",
    keywords: ['was my payment successful', 'did payment go through', 'is order paid', 'payment confirmation'],
    followUps: ['What should I do if money was deducted but order was not confirmed?', 'Where can I find my invoice?'],
    order: 52
  },
  {
    category: 'PAYMENTS',
    question: 'How do refunds work after a failed payment?',
    answer: "When a payment fails but money is debited from your account, the amount is held by your issuing bank and automatically routed back to your original source account by the banking network within 3 to 5 business days as per RBI guidelines. No manual claim is required.",
    keywords: ['refunds for failed payment', 'failed payment refund timeline', 'money deducted auto refund'],
    followUps: ['How long does a refund take?', 'What should I do if money was deducted but order was not confirmed?'],
    order: 53
  },

  // =========================================================================
  // CATEGORY F: RETURNS, REFUNDS AND CANCELLATIONS (9 Questions)
  // =========================================================================
  {
    category: 'RETURNS_REFUNDS',
    question: 'What is your return policy?',
    answer: "Arshith Fresh maintains a customer-friendly **7-Day Guarantee**:\n• Because our products are edible organic grocery items, opened items cannot be accepted back for resale due to strict hygiene and health safety standards.\n• However, if you receive a damaged, leaked, defective, or incorrect product, we provide an immediate **100% Free Replacement or Full Refund** within 7 days of delivery upon receiving photo proof.\n• You can reach out directly via WhatsApp at **+91 9945676029** or email **support@arshithfresh.com** with package photos for instant processing.",
    keywords: ['return policy', 'what is your return policy', 'can i return', 'return window', 'guarantee'],
    followUps: ['Can I return a product?', 'How do I request a refund?'],
    quickActions: [
      { label: 'Read Refund Policy', action: 'url', value: '/pages/policies/refund-policy.html' }
    ],
    order: 54
  },
  {
    category: 'RETURNS_REFUNDS',
    question: 'Can I return a product?',
    answer: "Unopened items in original sealed condition with tags intact can be returned within 7 days of delivery. If an item arrived damaged or opened during transit, you do not even need to return it—simply share a photo on WhatsApp at **+91 9945676029** and we will process an immediate free replacement or refund.",
    keywords: ['can i return a product', 'return eligibility', 'return items', 'send back product'],
    followUps: ['What is your return policy?', 'How do I request a refund?'],
    order: 55
  },
  {
    category: 'RETURNS_REFUNDS',
    question: 'How do I request a refund?',
    answer: "To request a refund:\n1. Send an email to **support@arshithfresh.com** or WhatsApp **+91 9945676029**.\n2. Mention your **Order ID** and the reason for the refund.\n3. Attach 1–2 photos of the package and shipping label.\n4. Our support team will verify and approve the refund within 2 to 4 business hours.",
    keywords: ['request a refund', 'how do i request a refund', 'claim refund', 'money back'],
    followUps: ['How long does a refund take?', 'How can I check my refund status?'],
    order: 56
  },
  {
    category: 'RETURNS_REFUNDS',
    question: 'How long does a refund take?',
    answer: "Once approved by our team, refunds are routed directly back to your original online payment source:\n• **UPI / Net Banking**: 24 to 48 business hours.\n• **Credit / Debit Cards**: 3 to 5 business days (depending on your bank's billing cycle).\n• **Failed Payments**: Automatically reconciled and reversed by your issuing bank within 24 to 48 hours.",
    keywords: ['how long does a refund take', 'refund timeline', 'when will i get refund', 'refund duration'],
    followUps: ['How can I check my refund status?', 'How do I request a refund?'],
    order: 57
  },
  {
    category: 'RETURNS_REFUNDS',
    question: 'Can I cancel an order after confirmation?',
    answer: "Yes, you can cancel your order free of charge as long as it has **not yet been dispatched** from our processing hub. Contact our team via WhatsApp at **+91 9945676029** as soon as possible with your Order ID for immediate cancellation.",
    keywords: ['cancel order after confirmation', 'cancel confirmed order', 'stop shipment'],
    followUps: ['Why was my cancellation request unsuccessful?', 'How long does a refund take?'],
    order: 58
  },
  {
    category: 'RETURNS_REFUNDS',
    question: 'Why was my cancellation request unsuccessful?',
    answer: "Cancellation requests cannot be honored if the order has already been handed over to the courier partner and generated an active transit manifest. In such cases, please reject the delivery at your doorstep when the delivery partner arrives, and your refund will be processed upon package return.",
    keywords: ['cancellation unsuccessful', 'why cancellation failed', 'could not cancel order'],
    followUps: ['How long does a refund take?', 'How do I contact support about my order?'],
    order: 59
  },
  {
    category: 'RETURNS_REFUNDS',
    question: 'What if I received the wrong product?',
    answer: "We deeply apologize for any packing mix-up! If you received a different item or incorrect size:\n1. WhatsApp photos of the item received and the outer box label to **+91 9945676029**.\n2. We will dispatch the correct item right away with priority delivery at zero extra cost to you.",
    keywords: ['wrong product', 'received wrong item', 'different product received', 'incorrect item delivered'],
    followUps: ['What should I do if I receive a damaged product?', 'How do I contact support about my order?'],
    order: 60
  },
  {
    category: 'RETURNS_REFUNDS',
    question: 'What if a product is damaged or expired?',
    answer: "All Arshith Fresh products are prepared in small, fresh batches with clear manufacturing and expiry dates printed on the seal. If you notice any transit damage or batch discrepancy, share a photo within 7 days to **support@arshithfresh.com** or WhatsApp **+91 9945676029** for an immediate free replacement or full refund.",
    keywords: ['damaged or expired', 'expired product', 'stale product', 'broken seal', 'bad quality'],
    followUps: ['What is your return policy?', 'How do I request a refund?'],
    order: 61
  },
  {
    category: 'RETURNS_REFUNDS',
    question: 'How can I check my refund status?',
    answer: "Once processed, we email and SMS your bank refund reference ARN / UTR number. You can verify this reference with your bank, or send your Order ID to our support team on WhatsApp at **+91 9945676029** to get a live status check.",
    keywords: ['check refund status', 'refund status', 'where is my refund', 'has refund been sent'],
    followUps: ['How long does a refund take?', 'How do I contact support about my order?'],
    order: 62
  },

  // =========================================================================
  // CATEGORY G: OFFERS AND DISCOUNTS (6 Questions)
  // =========================================================================
  {
    category: 'OFFERS_DISCOUNTS',
    question: 'Are there any current offers?',
    answer: "Yes! Here are our active offers today:\n• 🏷️ **WELCOME10**: 10% OFF on your first purchase!\n• 🚚 **FREE Shipping**: Automatically applied to all orders above ₹1,000 across India.\n• 📦 **Volume Tier Coupons**:\n  - **SAVE10**: 10% OFF on orders above ₹1,000\n  - **SAVE15**: 15% OFF on orders above ₹3,000\n  - **SAVE20**: 20% OFF on orders above ₹5,000\n  - **SAVE50**: 50% VIP Bulk Discount on orders above ₹10,000!",
    keywords: ['current offers', 'active discounts', 'promo codes', 'deals today', 'coupons available', 'sale'],
    followUps: ['How do I apply a coupon?', 'Why is my coupon not working?'],
    quickActions: [
      { label: 'Shop & Save', action: 'url', value: '/pages/collections.html' }
    ],
    order: 63
  },
  {
    category: 'OFFERS_DISCOUNTS',
    question: 'How do I apply a coupon?',
    answer: "Applying a coupon is easy:\n1. Proceed to the [Checkout page](/pages/checkout.html).\n2. Locate the **'Apply Discount Code'** box in the Order Summary.\n3. Type your code (e.g. `WELCOME10` or `SAVE10`) and click **Apply**.\n4. Your discount will be subtracted from the payable total immediately.",
    keywords: ['apply coupon', 'how to use coupon code', 'enter promo code', 'use discount code'],
    followUps: ['Why is my coupon not working?', 'Are there any current offers?'],
    order: 64
  },
  {
    category: 'OFFERS_DISCOUNTS',
    question: 'Why is my coupon not working?',
    answer: "Coupons may fail if:\n1. **Minimum Order Criteria**: E.g. `SAVE15` requires a minimum cart subtotal of ₹3,000.\n2. **Typo or Whitespace**: Check that the code is typed in ALL CAPS without trailing spaces.\n3. **Already Applied**: Only one discount coupon can be applied per checkout transaction.\nIf you believe a code should work, message our support team on WhatsApp at **+91 9945676029** and we will assist!",
    keywords: ['coupon not working', 'invalid coupon', 'promo code error', 'discount code rejected'],
    followUps: ['Are there any current offers?', 'How do I apply a coupon?'],
    order: 65
  },
  {
    category: 'OFFERS_DISCOUNTS',
    question: 'How do I check the final price after discounts?',
    answer: "When you enter a coupon code and tap **Apply** at checkout, the Order Summary immediately updates with a green line showing your exact savings (e.g. *'- ₹350.00 (WELCOME10)'*) and displays the final discounted payable total.",
    keywords: ['final price after discounts', 'check discounted price', 'savings breakdown'],
    followUps: ['How do I apply a coupon?', 'Which payment methods are supported?'],
    order: 66
  },
  {
    category: 'OFFERS_DISCOUNTS',
    question: 'Are discounts available for bulk purchases?',
    answer: "Yes! We cater to caterers, sweet makers, corporate gifting, and large families:\n• Orders above ₹5,000 get 20% OFF with code **SAVE20**.\n• Orders above ₹10,000 get 50% wholesale pricing with code **SAVE50**.\nFor 15L oil tins, 15kg ghee containers, or custom B2B bulk orders, please contact our wholesale desk directly at **support@arshithfresh.com** or WhatsApp **+91 9945676029**.",
    keywords: ['bulk purchases', 'wholesale discount', 'large orders', 'commercial supply', 'b2b orders', 'tin pricing'],
    followUps: ['Can I speak to a human representative?', 'Are there any current offers?'],
    order: 67
  },
  {
    category: 'OFFERS_DISCOUNTS',
    question: 'Where can I find special deals?',
    answer: "Special seasonal deals and festive hampers are highlighted directly on our homepage banners and in our [Collections Directory](/pages/collections.html). You can also follow our announcements or check the top banner on our storefront for flash discount codes.",
    keywords: ['special deals', 'find deals', 'festive hampers', 'flash sale', 'seasonal offers'],
    followUps: ['Are there any current offers?', 'Can you recommend products?'],
    order: 68
  },

  // =========================================================================
  // CATEGORY H: ACCOUNT AND TECHNICAL SUPPORT (8 Questions)
  // =========================================================================
  {
    category: 'ACCOUNT_TECH',
    question: 'How do I create an account?',
    answer: "Creating an account is free and takes seconds:\n1. Click the **Profile / Account icon 👤** in the top header or visit [pages/auth/register.html](/pages/auth/register.html).\n2. Enter your Name, Email, Mobile Number, and Password.\n3. Or click **'Sign in with Google'** for instant 1-click registration.\nHaving an account lets you save delivery addresses and track past orders easily!",
    keywords: ['create account', 'register', 'sign up', 'new user', 'join arshith fresh'],
    followUps: ['How do I log in?', 'How can I update my profile?'],
    quickActions: [
      { label: 'Register Now', action: 'url', value: '/pages/auth/register.html' }
    ],
    order: 69
  },
  {
    category: 'ACCOUNT_TECH',
    question: 'How do I log in?',
    answer: "To log in:\n• Tap the **Account icon** in the top header or visit [pages/auth/login.html](/pages/auth/login.html).\n• Enter your registered email and password, or use 1-click Google Sign-In.\nOnce logged in, your saved addresses and cart will sync automatically across all devices.",
    keywords: ['how to login', 'sign in', 'log into my account', 'login page'],
    followUps: ['How do I change my password?', 'Why am I unable to log in?'],
    quickActions: [
      { label: 'Login Page', action: 'url', value: '/pages/auth/login.html' }
    ],
    order: 70
  },
  {
    category: 'ACCOUNT_TECH',
    question: 'How can I update my profile?',
    answer: "After logging in, navigate to [pages/profile.html](/pages/profile.html). From your profile dashboard, you can edit your name, contact phone number, default shipping address, and view order history.",
    keywords: ['update profile', 'change address in profile', 'edit my profile', 'account settings'],
    followUps: ['How do I change my password?', 'How do I check my order status?'],
    quickActions: [
      { label: 'My Profile', action: 'url', value: '/pages/profile.html' }
    ],
    order: 71
  },
  {
    category: 'ACCOUNT_TECH',
    question: 'How do I change my password?',
    answer: "If you forgot your password or wish to update it:\n1. Visit the [Forgot Password page](/pages/auth/forgot-password.html).\n2. Enter your registered email address.\n3. We will send a secure password reset link to your inbox.\n4. Click the link and enter your new password.",
    keywords: ['change password', 'forgot password', 'reset password', 'update password'],
    followUps: ['Why am I unable to log in?', 'How do I log in?'],
    quickActions: [
      { label: 'Reset Password', action: 'url', value: '/pages/auth/forgot-password.html' }
    ],
    order: 72
  },
  {
    category: 'ACCOUNT_TECH',
    question: 'Why am I unable to log in?',
    answer: "Common login issues:\n1. **Incorrect Credentials**: Make sure your email has no typos and Caps Lock is off.\n2. **Registered with Google**: If you originally registered with Google Sign-In, please click the 'Sign in with Google' button.\n3. **Password Forgotten**: Use the [Forgot Password link](/pages/auth/forgot-password.html) to create a new one.\nIf still locked out, WhatsApp our support at **+91 9945676029** for manual verification.",
    keywords: ['unable to login', 'cannot log in', 'login failed', 'account locked', 'wrong credentials'],
    followUps: ['How do I change my password?', 'Can I speak to a human representative?'],
    order: 73
  },
  {
    category: 'ACCOUNT_TECH',
    question: 'Why is the website not loading?',
    answer: "If pages appear slow or not loading properly:\n1. Check your internet connection.\n2. Hard refresh your browser (`Ctrl + F5` on Windows or `Cmd + Shift + R` on Mac).\n3. Try opening in an Incognito / Private browsing window.\nOur servers run with 99.9% uptime on enterprise hosting. If an outage is detected, our engineers resolve it within minutes.",
    keywords: ['website not loading', 'site slow', 'page not opening', 'server down', 'technical issue'],
    followUps: ['How do I report a technical issue?', 'Can I speak to a human representative?'],
    order: 74
  },
  {
    category: 'ACCOUNT_TECH',
    question: 'How do I report a technical issue?',
    answer: "We appreciate your help keeping our store smooth! To report a bug or technical glitch, please take a quick screenshot and email it to **support@arshithfresh.com** or send it to our WhatsApp helpline at **+91 9945676029**. Our technical engineering team will investigate and fix it immediately.",
    keywords: ['report technical issue', 'bug report', 'website glitch', 'technical error', 'broken link'],
    followUps: ['How do I contact customer support?', 'Why is the website not loading?'],
    order: 75
  },
  {
    category: 'ACCOUNT_TECH',
    question: 'How can I contact a human support agent?',
    answer: "We are always here for you! You can reach a human support executive directly through:\n• 📱 **WhatsApp**: Click the green floating icon or message **+91 9945676029** (Fastest, Mon–Sat 9 AM – 7 PM IST)\n• 📞 **Direct Phone Call**: +91 9945676029 / +91 8618471424\n• 📧 **Email**: support@arshithfresh.com\nWe will be delighted to answer any question or take your order manually!",
    keywords: ['contact human support agent', 'talk to human agent', 'customer care executive', 'phone support', 'speak with someone'],
    followUps: ['How do I contact customer support?', 'What products do you sell?'],
    quickActions: [
      { label: 'Chat on WhatsApp', action: 'url', value: 'https://api.whatsapp.com/send/?phone=919945676029&text=Hi%20Arshith%20Fresh,%20I%20would%20like%20to%20speak%20with%20a%20human%20agent.' }
    ],
    order: 76
  },

  // =========================================================================
  // CATEGORY I: HEALTH, CULINARY, PROCESSING & EXPANDED INTELLIGENCE (16 Questions)
  // =========================================================================
  {
    category: 'PRODUCTS',
    question: 'Which oil is best for heart health and cholesterol?',
    answer: "For heart health and maintaining healthy cholesterol levels, cold-pressed oils are ideal because they retain natural plant sterols, monounsaturated fatty acids (MUFA), and polyunsaturated fatty acids (PUFA):\n• **Groundnut Oil**: Rich in resveratrol, oleic acid (MUFA), and vitamin E, helping lower LDL (bad) cholesterol while preserving HDL.\n• **Sesame (Gingelly) Oil**: Packed with sesamol and sesaminol, powerful antioxidants proven to support healthy blood pressure and artery health.\n• **Sunflower Oil**: High in polyunsaturated linoleic acid and vitamin E.\n• **Pure A2 Cow Ghee**: Contains conjugated linoleic acid (CLA) and butyric acid which aid cardiovascular wellness in moderation.\nAll our oils are 100% unrefined and cold-pressed below 45°C without trans fats or chemical solvents.",
    keywords: [
      'best oil for heart', 'oil for cholesterol', 'heart health oil', 'bp oil',
      'cardiac health', 'healthy oil for heart', 'cholesterol free', 'which oil for heart',
      'heart disease', 'good for heart', 'heart', 'cholesterol', 'blood pressure'
    ],
    followUps: ['Show me groundnut oil', 'Show me sesame oil', 'Tell me about A2 cow ghee'],
    quickActions: [
      { label: 'Explore Heart-Healthy Oils', action: 'url', value: '/pages/collections.html?category=Oils' }
    ],
    order: 77
  },
  {
    category: 'PRODUCTS',
    question: 'Which oil is best for diabetes and sugar patients?',
    answer: "For managing blood sugar and diabetic wellness:\n• **Cold-Pressed Sesame Oil & Groundnut Oil**: Naturally rich in magnesium and heart-healthy unsaturated fats, helping improve insulin sensitivity and glycemic control.\n• **Superfood Seeds**: Our **Chia Seeds** and **Flax Seeds** are packed with soluble dietary fiber and omega-3s, which slow carbohydrate absorption.\n• **Natural Sweetener Alternative**: Replace refined white sugar with our **Wild Forest Raw Honey** or **Organic Jaggery** for a gentler glycemic index.",
    keywords: [
      'oil for diabetes', 'diabetic friendly oil', 'sugar patient oil', 'diabetes cooking oil',
      'best oil for diabetics', 'sugar patient', 'diabetic', 'diabetes', 'blood sugar'
    ],
    followUps: ['Show me sesame oil', 'Show me chia seeds', 'Show me raw honey'],
    quickActions: [
      { label: 'View All Collections', action: 'url', value: '/pages/collections.html' }
    ],
    order: 78
  },
  {
    category: 'PRODUCTS',
    question: 'Which oil is best for deep frying, high heat, and daily cooking?',
    answer: "For deep frying and traditional Indian cooking, oils must have a high smoke point and heat stability so they do not break down into harmful free radicals:\n1. 🥥 **Cold-Pressed Groundnut Oil**: Smoke point of ~225°C to 232°C. Excellent heat stability, nutty taste, perfect for puris, pakoras, vadas, and daily curries.\n2. 🍯 **Pure Desi Ghee**: Exceptionally high smoke point of 250°C. Does not produce toxic acrolein during deep frying and imparts incredible flavor.\n3. 🌻 **Cold-Pressed Sunflower Oil**: Light, neutral aroma, and high smoke point (~227°C), ideal for sautéing, stir-fries, and baking.\nUnlike refined industrial oils, our oils undergo zero chemical solvent extraction or bleaching.",
    keywords: [
      'best oil for deep frying', 'high heat cooking oil', 'oil for frying', 'smoke point of oils',
      'frying oil', 'deep fry', 'which oil for cooking', 'cooking oil', 'daily cooking oil',
      'best oil for indian cooking', 'high smoke point', 'deep frying'
    ],
    followUps: ['Show me groundnut oil', 'Show me pure cow ghee', 'Show me sunflower oil'],
    quickActions: [
      { label: 'Shop Cooking Oils', action: 'url', value: '/pages/collections.html?category=Oils' }
    ],
    order: 79
  },
  {
    category: 'PRODUCTS',
    question: 'Which oil is best for hair growth, dandruff, and skin massage?',
    answer: "We offer natural, chemical-free cold-pressed oils ideal for hair and body wellness:\n• 🥥 **Virgin Coconut Oil**: Deep penetration into hair shafts, prevents protein loss, soothes dry scalp, and works as an all-natural body moisturizer.\n• 🌿 **Cold-Pressed Castor Oil**: Extremely rich in ricinoleic acid and essential fatty acids. Stimulates hair follicles, thickens thinning hair, and promotes eyebrow & eyelash density.\n• 🫘 **Pure Sesame Oil (Til Oil)**: The gold standard in Ayurveda for Abhyanga (body massage), joint relief, and daily oil pulling.\nAll oils are 100% pure single-ingredient with zero added perfumes or mineral oils.",
    keywords: [
      'oil for hair growth', 'oil for skin', 'hair oil', 'dandruff oil',
      'coconut oil for hair', 'castor oil for hair', 'massage oil', 'body massage',
      'hair fall', 'thick hair', 'skin care oil', 'abhyanga', 'oil pulling'
    ],
    followUps: ['Show me coconut oil', 'Show me castor oil', 'Show me sesame oil'],
    quickActions: [
      { label: 'View Pure Oils', action: 'url', value: '/pages/collections.html?category=Oils' }
    ],
    order: 80
  },
  {
    category: 'PRODUCTS',
    question: 'What is cold-pressed / wood-pressed (chekku / ghani / kachi ghani) oil?',
    answer: "Cold-pressed (also known as Marachekku, Wooden Ghani, or Kachi Ghani) is the authentic ancient Indian method of extracting oils:\n• **Slow Crushing**: Seeds are slowly crushed inside a traditional wooden pestle (Vaagai wood) at low speeds (under 15-20 RPM).\n• **Low Temperature (< 45°C)**: No external heat is applied, preserving all delicate vitamins (A, D, E, K), natural antioxidants, and rich nutty aromas.\n• **Zero Chemicals**: Unlike refined oils, we never use chemical solvents (hexane), degumming agents, bleaching clays, or artificial deodorizers.\n• **Natural Sedimentation**: The oil is allowed to settle naturally in food-grade tanks and filtered through unbleached cotton fabric.",
    keywords: [
      'what is cold pressed oil', 'what is wood pressed oil', 'wood pressed vs cold pressed',
      'chekku oil', 'ghani oil', 'kachi ghani', 'marachekku', 'unrefined oil',
      'how is oil extracted', 'how do you make oil', 'process of oil', 'what is chekku'
    ],
    followUps: ['What oils do you have?', 'What is Bilona Ghee?', 'Are your products organic?'],
    quickActions: [
      { label: 'Explore Cold Pressed Oils', action: 'url', value: '/pages/collections.html?category=Oils' }
    ],
    order: 81
  },
  {
    category: 'PRODUCTS',
    question: 'What is Bilona Ghee and why is A2 Desi Cow Ghee special?',
    answer: "Our A2 Desi Cow Ghee is crafted using the ancient 5-step Vedic Bilona method:\n1. **A2 Milk**: Sourced exclusively from indigenous Indian Gir and Sahiwal cows.\n2. **Curd Fermentation**: Whole boiled milk is naturally cultured into rich curd overnight.\n3. **Bilona Churning**: The curd is churned bi-directionally with a wooden churner (Bilona) to separate cultured butter (makkhan).\n4. **Slow Simmering**: The cultured butter is slowly simmered on a low flame until the water evaporates and golden, aromatic ghee granules form.\n5. **Purity**: 100% pure A2 beta-casein, lactose-free, easy to digest, rich in butyric acid, and deeply nourishing.",
    keywords: [
      'what is bilona ghee', 'a2 ghee benefits', 'bilona method', 'desi cow ghee',
      'a2 cow ghee', 'why a2 ghee', 'bilona process', 'how is ghee made',
      'vedic ghee', 'bilona churned', 'gir cow ghee'
    ],
    followUps: ['Show me pure cow ghee', 'Cow Ghee vs Buffalo Ghee', 'How to store ghee?'],
    quickActions: [
      { label: 'Shop Pure Ghee', action: 'url', value: '/pages/collections.html?category=Ghee%20and%20Honey' }
    ],
    order: 82
  },
  {
    category: 'PRODUCTS',
    question: 'What is the difference between Cow Ghee and Buffalo Ghee?',
    answer: "Both are pure bilona churned, but cater to different nutritional and culinary preferences:\n• 🐄 **A2 Desi Cow Ghee (Golden Yellow)**:\n  - Lighter in fat (~99.5%), rich in carotenoids and natural vitamin A.\n  - Contains A2 beta-casein for easy digestion, ideal for children, elders, and daily wellness.\n  - Available in 250ml, 500ml, and 1L.\n• 🐃 **Pure Buffalo Ghee (Creamy White)**:\n  - Higher fat density, rich creamy granules, and higher calories.\n  - Best for traditional Indian sweets (halwa, ladoo), building stamina, and muscle gain.\n  - Available in 250ml, 500ml, and 1L.",
    keywords: [
      'cow ghee vs buffalo ghee', 'difference between cow and buffalo ghee',
      'which ghee is better', 'yellow ghee vs white ghee', 'buffalo ghee benefits',
      'compare ghee', 'cow or buffalo ghee'
    ],
    followUps: ['Show me cow ghee', 'Show me buffalo ghee', 'What is Bilona Ghee?'],
    order: 83
  },
  {
    category: 'PRODUCTS',
    question: 'What are the health benefits of Chia Seeds and Flax Seeds?',
    answer: "Both seeds are nutrient-dense plant superfoods:\n• 🌱 **Chia Seeds**: Absorbs 10x its weight in water to keep you hydrated, packed with soluble fiber to support gut health and weight management, rich in calcium and omega-3.\n• 🌾 **Flax Seeds (Alsi)**: Outstanding source of alpha-linolenic acid (ALA omega-3) and lignans (plant antioxidants). Supports cardiovascular health and hormonal balance.\n**How to consume**: Soak chia seeds in water, buttermilk, or smoothies for 15 mins. Roast flax seeds lightly and grind into powders for rotis or curries.",
    keywords: [
      'chia seeds benefits', 'flax seeds benefits', 'how to use chia seeds',
      'seeds benefits', 'superfoods', 'alsi', 'chia seeds', 'flax seeds', 'how to eat seeds'
    ],
    followUps: ['Show me chia seeds', 'Show me flax seeds', 'What dry fruits do you have?'],
    order: 84
  },
  {
    category: 'PRODUCTS',
    question: 'What dry fruits and nuts do you offer and what are their benefits?',
    answer: "Our dry fruits are 100% natural, unpolished, and grade-A premium quality:\n• 🥜 **California Jumbo Almonds (Badam)**: Packed with vitamin E, magnesium, and protein for memory and heart health.\n• 🌰 **Whole Cashews (Kaju)**: Creamy, zero cholesterol, rich in copper and zinc for immune strength.\n• 🧠 **Walnuts (Akhrot)**: High in plant-based omega-3 fatty acids for cognitive and brain function.\n• 🍯 **Dry Figs (Anjeer)**: High in dietary fiber, iron, and calcium, excellent for gut health and hemoglobin.\n• 🟢 **Pistachios (Pista)**: Antioxidant-rich, low-calorie snacking.",
    keywords: [
      'dry fruits list', 'nuts available', 'almonds benefits', 'cashews',
      'walnuts', 'dry fruits benefits', 'badam', 'kaju', 'akhrot', 'anjeer', 'dry fruits'
    ],
    followUps: ['Show me almonds', 'Show me cashews', 'Show me walnuts'],
    order: 85
  },
  {
    category: 'PRODUCTS',
    question: 'What is the shelf life and expiry date of your products?',
    answer: "Because our products are 100% natural with **zero synthetic preservatives**, here are our recommended shelf lives from packing date:\n• 🥥 **Cold-Pressed Oils**: 6 to 9 months (best consumed fresh).\n• 🍯 **Pure Bilona Ghee**: 12 months at room temperature (ghee is naturally self-preserving).\n• 🍯 **Raw Forest Honey**: Virtually indefinite shelf life when kept sealed.\n• 🌶️ **Stone-Ground Spices & Podis**: 9 to 12 months in airtight containers.\n• 🥜 **Dry Fruits & Seeds**: 6 to 9 months.\nEvery jar and pack clearly prints the exact batch manufacturing date, pack date, and best-before window.",
    keywords: [
      'shelf life', 'expiry date', 'best before', 'how long do products last',
      'validity', 'product expiry', 'shelf life of oil', 'shelf life of ghee', 'how long does ghee last'
    ],
    followUps: ['How should I store oils and ghee?', 'Are your products organic?'],
    order: 86
  },
  {
    category: 'PRODUCTS',
    question: 'How should I store cold-pressed oils, ghee, and spices?',
    answer: "Proper storage keeps natural unrefined foods fresh and aromatic:\n• **Cold-Pressed Oils**: Store in a cool, dry place away from direct sunlight and stovetop heat. Always keep the lid tightly sealed.\n• **Bilona Ghee**: Store at room temperature in an airtight glass or stainless-steel jar. **Do NOT refrigerate** (refrigeration creates condensation) and always use a dry, clean spoon.\n• **Stone-Ground Spices & Podis**: Keep in airtight containers away from humidity and moisture.\n• **Honey**: Store at room temperature. Natural honey may crystallize in cooler weather; simply place the jar in warm water to reliquify.",
    keywords: [
      'how to store oils', 'storage instructions', 'how to store ghee',
      'refrigerate ghee', 'storage', 'how to keep products', 'how to store honey'
    ],
    followUps: ['What is the shelf life of products?', 'What products do you sell?'],
    order: 87
  },
  {
    category: 'PRODUCTS',
    question: 'Are your products 100% organic, pure, and chemical-free?',
    answer: "Yes, 100% guaranteed! At Arshith Fresh:\n• **Zero Chemicals**: No synthetic pesticides, no artificial colors, and zero chemical preservatives.\n• **Zero Adulteration**: No mineral oils, no palm oil, and no blended lower-grade oils.\n• **Single-Origin Ingredients**: Direct from certified traditional farmer collectives.\n• **FSSAI Licensed**: Fully tested and compliant with national food safety standards.\nWhat you read on our labels is 100% what you receive in the jar.",
    keywords: [
      'are products organic', 'is it pure', 'chemical free', 'preservatives added',
      'adulteration free', 'fssai certified', 'is it safe', 'natural products', 'pure', 'organic'
    ],
    followUps: ['How do you process your oils and ghee?', 'What products do you sell?'],
    order: 88
  },
  {
    category: 'PRODUCTS',
    question: 'What are your top recommended products and best sellers?',
    answer: "Our customer favorite best-sellers are:\n1. 🥥 **Wood-Pressed Groundnut Oil (1L - ₹349)**: Nutty, unrefined, single-origin staple for daily curries and frying.\n2. 🍯 **Pure A2 Desi Cow Bilona Ghee (250ml - ₹240)**: Aromatic golden granular ghee made from cultured butter.\n3. 🌶️ **Andhra Pappula Podi (₹108)**: Flavorful roasted chana dal podi for hot rice and ghee.\n4. 🥜 **California Jumbo Almonds (₹310)**: Crunchy, nutrient-dense natural almonds.\n5. 🍯 **Raw Wild Forest Honey (₹130)**: Pure unheated forest honey.",
    keywords: [
      'top recommendations', 'best sellers', 'what should i buy', 'popular products',
      'famous products', 'customer favorites', 'recommend something', 'best items', 'recommendation'
    ],
    followUps: ['Show me groundnut oil', 'Show me pure cow ghee', 'Are there any current offers?'],
    quickActions: [
      { label: 'View All Collections', action: 'url', value: '/pages/collections.html' }
    ],
    order: 89
  },
  {
    category: 'PRODUCTS',
    question: 'What spices and traditional podis do you sell?',
    answer: "We offer stone-ground single-origin spices and authentic South Indian podis:\n• **Pure Salem Turmeric Powder**: High natural curcumin, vibrant aroma.\n• **Guntur Red Chilli Powder**: Pure pungent heat without artificial color or brick powder.\n• **Coriander Powder (Dhania)**: Aromatic roasted coriander.\n• **Andhra Pappula Podi (Chana Dal Podi)**: Classic soothing blend for hot rice.\n• **Karivepaku Karam Podi (Curry Leaves Podi)**: Rich in iron and antioxidants for hair and digestion.\n• **Sambar & Rasam Masalas**: Stone-ground traditional recipes.",
    keywords: [
      'what spices do you sell', 'spices list', 'pappula podi', 'karam podi',
      'turmeric powder', 'chilli powder', 'podis', 'traditional podis', 'masalas'
    ],
    followUps: ['Show me turmeric powder', 'Show me pappula podi', 'Are there any current offers?'],
    order: 90
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'Where is your store located? Can I visit physically or buy online?',
    answer: "Arshith Fresh is headquartered in **Karnataka, India**. To deliver the freshest batches directly from our processing mills at honest farm-gate prices, we operate as a direct-to-consumer online store shipping pan-India.\n\nYou can order anytime 24/7 on our website ([www.arshithfresh.com](http://localhost:5000/pages/collections.html)) with fast door delivery across 19,000+ pin codes. For urgent queries, reach us on WhatsApp at **+91 9945676029**.",
    keywords: [
      'where is your shop', 'where is shop', 'store location', 'where is your store', 'physical shop', 'shop address',
      'bangalore store', 'karnataka address', 'store address', 'where is arshith fresh',
      'headquarters', 'shop location', 'where are you located'
    ],
    followUps: ['Do you deliver to my location?', 'How long does delivery take?', 'Talk to Support'],
    quickActions: [
      { label: 'Shop Online', action: 'url', value: '/pages/collections.html' },
      { label: 'WhatsApp Support', action: 'url', value: 'https://api.whatsapp.com/send/?phone=919945676029&text=Hi%20Arshith%20Fresh!' }
    ],
    order: 91
  },
  {
    category: 'ORDERS_DELIVERY',
    question: 'Do you deliver to my city / state across India?',
    answer: "Yes! We ship across **all states and union territories in India**, covering over 19,000+ pincodes via trusted courier partners (Shiprocket, Bluedart, Delhivery, DTDC):\n• **Southern States** (Karnataka, Andhra Pradesh, Telangana, Tamil Nadu, Kerala): Usually 2-3 business days.\n• **Rest of India** (Maharashtra, Gujarat, Delhi NCR, UP, West Bengal, etc.): 3-5 business days.\n• **Free Shipping**: Automatically unlocked on all orders of ₹1,000 or more!",
    keywords: [
      'do you deliver to my city', 'delivery locations', 'pin codes', 'ship across india',
      'delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata',
      'all india delivery', 'delivery areas', 'shipping coverage'
    ],
    followUps: ['How long does delivery take?', 'How do I check my order status?'],
    order: 92
  }
];

module.exports = FAQ_DATA;
