const http = require('http');

async function testQuery(msg) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ message: msg });
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  const queries = [
    'seame oil',
    'sesame oil',
    'groundnut oil',
    'coconut oil',
    'cinnamon',
    'red chillies'
  ];

  for (const q of queries) {
    console.log(`=== QUERY: "${q}" ===`);
    const res = await testQuery(q);
    console.log(`Bot Reply: ${res.reply}`);
    console.log(`Products Returned (${res.products.length}):`);
    res.products.forEach(p => {
      console.log(`  • [${p.category}] ${p.name} — ₹${p.price}`);
      console.log(`    Image: ${p.image}`);
    });
    console.log('');
  }
}

run();
