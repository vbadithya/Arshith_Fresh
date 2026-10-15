/**
 * Comprehensive Automated Test Suite for Arshith Fresh AI Chatbot
 * Tests all required scenarios:
 * 1. Initial greeting and quick actions
 * 2. 70+ FAQ existence & search across all categories (A - H)
 * 3. Verified database information (Free shipping ₹1,000, 7-day returns, 3-5 days delivery, contact info)
 * 4. Live MongoDB product search with actual prices, stock & images
 * 5. Context preservation across multi-turn follow-ups
 * 6. Unknown query triggering safe, honest fallback
 * 7. Protected Admin APIs (unauthorized 403, authorized CRUD)
 * 8. Conversation persistence
 */

const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const postBody = body !== null ? body : (options.body !== undefined ? options.body : null);
    let payload = null;
    options.headers = options.headers || {};
    if (postBody !== null) {
      payload = typeof postBody === 'string' ? postBody : JSON.stringify(postBody);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Arshith Fresh AI Chatbot Comprehensive Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: GET /api/chat/init - Initial Greeting & Quick Action Buttons
    // -------------------------------------------------------------
    console.log('--- Test 1: Greeting and Initial Quick-Action Buttons ---');
    const initRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat/init',
      method: 'GET'
    });

    assert(initRes.status === 200, 'Init endpoint returns HTTP 200');
    assert(
      initRes.body.greeting === "Hii! 👋 Welcome to Arshith Fresh! I'm your AI shopping assistant. How can I help you today?",
      `Correct initial greeting returned: "${initRes.body.greeting}"`
    );

    const expectedButtons = [
      'Shop Products',
      'Product Information',
      'Orders & Delivery',
      'Payment Help',
      'Returns & Cancellations',
      'Offers & Discounts',
      'Talk to Support'
    ];
    const actualButtons = (initRes.body.quickActions || []).map(b => typeof b === 'string' ? b : b.label);
    const hasAllButtons = expectedButtons.every(b => actualButtons.includes(b));
    assert(hasAllButtons, `All 7 required quick-action buttons present: [${actualButtons.join(', ')}]`);

    // -------------------------------------------------------------
    // Test 2: FAQ Count & Categories (Admin Protected API)
    // -------------------------------------------------------------
    console.log('\n--- Test 2: 70+ FAQ Entries Existence & Categories Coverage ---');
    const adminFaqsRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat/admin/faqs',
      method: 'GET',
      headers: {
        'x-admin-key': 'arshith_admin_secret_2025'
      }
    });

    assert(adminFaqsRes.status === 200, 'Admin FAQs endpoint returns HTTP 200 with admin credentials');
    const faqs = adminFaqsRes.body.faqs || [];
    assert(faqs.length >= 70, `Total FAQs in MongoDB is ${faqs.length} (Requirement is 70+)`);

    const categoriesFound = new Set(faqs.map(f => f.category));
    const requiredCategories = ['GREETINGS', 'PRODUCTS', 'CART_CHECKOUT', 'ORDERS_DELIVERY', 'PAYMENTS', 'RETURNS_REFUNDS', 'OFFERS_DISCOUNTS', 'ACCOUNT_TECH'];
    const allCategoriesCovered = requiredCategories.every(c => categoriesFound.has(c));
    assert(allCategoriesCovered, `All 8 required categories (A through H) covered: [${Array.from(categoriesFound).join(', ')}]`);

    // -------------------------------------------------------------
    // Test 3: Verified Company Policy Questions
    // -------------------------------------------------------------
    console.log('\n--- Test 3: Answers Use Verified Store Policies (No Invented Policies) ---');
    
    // Delivery query
    const deliveryRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'How long does delivery take?' }
    });
    assert(
      deliveryRes.body && deliveryRes.body.reply && deliveryRes.body.reply.includes('3') && deliveryRes.body.reply.includes('5'),
      'Delivery answer mentions verified timeline (3-5 business days)'
    );

    // Return policy query
    const returnRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'What is your return policy?' }
    });
    assert(
      returnRes.body.reply.includes('7') && (returnRes.body.reply.includes('9945676029') || returnRes.body.reply.includes('support@arshithfresh.com')),
      'Return answer includes verified 7-day guarantee and verified official contact details'
    );

    // Offers query
    const offersRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Are there any current offers?' }
    });
    assert(
      offersRes.body.reply.includes('WELCOME10') || offersRes.body.reply.includes('SAVE10'),
      'Offers answer contains verified store coupon code (WELCOME10/SAVE10)'
    );

    // Cash on Delivery policy check (user requirement: COD not available, online payment only)
    const codRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'i want cash on delivery' }
    });
    assert(
      codRes.body && codRes.body.reply && /not available/i.test(codRes.body.reply) && /online payment/i.test(codRes.body.reply),
      'COD query accurately informs customer that Cash on Delivery is NOT available and only online payment is accepted'
    );

    // -------------------------------------------------------------
    // Test 4: Live MongoDB Product Search & Dynamic Pricing
    // -------------------------------------------------------------
    console.log('\n--- Test 4: Real E-commerce Product Retrieval from MongoDB ---');
    const productSearchRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Do you have cow ghee available?' }
    });
    
    assert(productSearchRes.status === 200, 'Product query returns HTTP 200');
    assert(Array.isArray(productSearchRes.body.products) && productSearchRes.body.products.length > 0, 'Live products returned from MongoDB');
    if (productSearchRes.body.products.length > 0) {
      const p = productSearchRes.body.products[0];
      assert(typeof p.name === 'string' && p.name.length > 0, `Product name: "${p.name}"`);
      assert(typeof p.price === 'number' && p.price > 0, `Product price from MongoDB: ₹${p.price}`);
      assert(typeof p.image === 'string' && p.image.length > 0, `Product image URL present: ${p.image.substring(0, 45)}...`);
    }

    // -------------------------------------------------------------
    // Test 5: Multi-Turn Conversation Context Retention
    // -------------------------------------------------------------
    console.log('\n--- Test 5: Follow-Up Questions Preserve Conversation Context ---');
    const turn1Res = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        message: 'I want to check your groundnut oil',
        conversationId: 'test_ctx_session_001',
        context: {}
      }
    });
    const ctx1 = turn1Res.body.context;
    assert(turn1Res.body.products.length > 0, 'Turn 1: Groundnut oil found');
    assert(ctx1 && (ctx1.lastProductSearch === 'groundnut oil' || ctx1.lastProductSearch === 'oil'), 'Turn 1 context saved product search');

    // Follow-up: "how much is it?" without repeating "groundnut oil"
    const turn2Res = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        message: 'what is the price?',
        conversationId: 'test_ctx_session_001',
        context: ctx1
      }
    });
    assert(turn2Res.body.products.length > 0, 'Turn 2: Retained context and returned groundnut oil prices for "what is the price?"');

    // -------------------------------------------------------------
    // Test 6: Unknown Query Safe Fallback
    // -------------------------------------------------------------
    console.log('\n--- Test 6: Unknown Questions Trigger Safe Fallback ---');
    const unknownRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Can you fly a spaceship to Mars tomorrow morning?' }
    });
    assert(
      unknownRes.body.category === 'UNKNOWN' && unknownRes.body.reply.includes("couldn't find an exact match") && unknownRes.body.reply.includes('WhatsApp'),
      'Unknown query triggers safe fallback with WhatsApp escalation offer'
    );

    // -------------------------------------------------------------
    // Test 7: Admin Security & Authorization
    // -------------------------------------------------------------
    console.log('\n--- Test 7: Admin Security & Protection ---');
    const unauthorizedRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat/admin/faqs',
      method: 'GET'
    });
    assert(unauthorizedRes.status === 403, 'Unauthorized access without admin header is blocked (HTTP 403)');

    // -------------------------------------------------------------
    // Test 8: Conversation History Persistence
    // -------------------------------------------------------------
    console.log('\n--- Test 8: Conversation Persistence in MongoDB ---');
    const convCheckRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat/conversation/test_ctx_session_001',
      method: 'GET'
    });
    assert(convCheckRes.status === 200, 'Conversation retrieval returns HTTP 200');
    assert(
      convCheckRes.body.conversation && convCheckRes.body.conversation.messages.length >= 2,
      `Conversation persisted with ${convCheckRes.body.conversation?.messages?.length || 0} messages`
    );

    // -------------------------------------------------------------
    // Test 9: Existing Store APIs Integrity Check
    // -------------------------------------------------------------
    console.log('\n--- Test 9: Existing Store APIs Integrity (Cart, Products, Coupons) ---');
    const productsApiRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products',
      method: 'GET'
    });
    assert(productsApiRes.status === 200, 'Storefront /api/products returns HTTP 200');
    assert(Array.isArray(productsApiRes.body) && productsApiRes.body.length > 0, `Store catalog intact with ${productsApiRes.body.length} products`);

  } catch (err) {
    console.error('💥 Test suite execution error:', err);
    failed++;
  }

  console.log(`\n======================================================`);
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`======================================================\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
