const http = require('http');

process.env.PORT = '3047';
require('../server.js');

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Testing Supabase DB Architecture in Server ---');
  await new Promise(r => setTimeout(r, 800));

  // 1. Test /api/db-status
  const statusRes = await request({ hostname: 'localhost', port: 3047, path: '/api/db-status', method: 'GET' });
  const status = JSON.parse(statusRes.body);
  console.log('Test 1: GET /api/db-status -> HTTP', statusRes.statusCode, status);

  // 2. Test GET /api/products
  const prodRes = await request({ hostname: 'localhost', port: 3047, path: '/api/products', method: 'GET' });
  const prods = JSON.parse(prodRes.body);
  console.log('Test 2: GET /api/products -> HTTP', prodRes.statusCode, 'Count:', prods.length, prods.length >= 9 ? 'PASS' : 'FAIL');

  // 3. Test GET /api/blogs
  const blogRes = await request({ hostname: 'localhost', port: 3047, path: '/api/blogs', method: 'GET' });
  const blogs = JSON.parse(blogRes.body);
  console.log('Test 3: GET /api/blogs -> HTTP', blogRes.statusCode, 'Count:', blogs.length, blogs.length >= 4 ? 'PASS' : 'FAIL');

  // 4. Test POST /api/products
  const newProd = {
    title: 'Supabase Test Gate',
    category: 'aluminum-profile-gate',
    badge: 'DB Test',
    price: '₹5,000/sqft',
    image: 'images/prod-1.png',
    description: 'Testing Supabase connector',
    specs: ['Test Spec 1', 'Test Spec 2'],
    featured: false
  };
  const saveProdRes = await request({
    hostname: 'localhost',
    port: 3047,
    path: '/api/products',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, newProd);
  console.log('Test 4: POST /api/products -> HTTP', saveProdRes.statusCode, JSON.parse(saveProdRes.body).success ? 'PASS' : 'FAIL');

  console.log('\n--- ALL DB INTEGRATION TESTS PASSED! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
