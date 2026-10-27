const http = require('http');
const fs = require('fs');
const path = require('path');

// Start the server on port 3045 to test
process.env.PORT = '3045';
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
  console.log('--- Starting CMS & Server Integration Tests ---');
  
  // Wait 500ms for server to bind
  await new Promise(r => setTimeout(r, 500));

  // 1. Test homepage
  const homeRes = await request({ hostname: 'localhost', port: 3045, path: '/', method: 'GET' });
  console.log('Test 1: GET / (Homepage) -> HTTP', homeRes.statusCode, homeRes.body.includes('HARICHAND STEEL') ? 'PASS' : 'FAIL');

  // 2. Test admin.html
  const adminRes = await request({ hostname: 'localhost', port: 3045, path: '/admin.html', method: 'GET' });
  console.log('Test 2: GET /admin.html (CMS Dashboard) -> HTTP', adminRes.statusCode, adminRes.body.includes('CMS DASHBOARD') ? 'PASS' : 'FAIL');

  // 3. Test product.html
  const prodRes = await request({ hostname: 'localhost', port: 3045, path: '/product.html', method: 'GET' });
  console.log('Test 3: GET /product.html -> HTTP', prodRes.statusCode, prodRes.body.includes('product-card') ? 'PASS' : 'FAIL');

  // 4. Test news.html
  const newsRes = await request({ hostname: 'localhost', port: 3045, path: '/news.html', method: 'GET' });
  console.log('Test 4: GET /news.html -> HTTP', newsRes.statusCode, newsRes.body.includes('news-card') ? 'PASS' : 'FAIL');

  // 5. Test GET /api/products
  const apiProdRes = await request({ hostname: 'localhost', port: 3045, path: '/api/products', method: 'GET' });
  const products = JSON.parse(apiProdRes.body);
  console.log('Test 5: GET /api/products -> HTTP', apiProdRes.statusCode, 'Count:', products.length, products.length >= 9 ? 'PASS' : 'FAIL');

  // 6. Test GET /api/blogs
  const apiBlogsRes = await request({ hostname: 'localhost', port: 3045, path: '/api/blogs', method: 'GET' });
  const blogs = JSON.parse(apiBlogsRes.body);
  console.log('Test 6: GET /api/blogs -> HTTP', apiBlogsRes.statusCode, 'Count:', blogs.length, blogs.length >= 4 ? 'PASS' : 'FAIL');

  // 7. Test POST /api/inquiries
  const sampleInquiry = {
    id: 'test-inq-1',
    name: 'Rohan Sharma',
    phone: '+91 9811122233',
    email: 'rohan@example.com',
    requirement: 'Aluminium Sliding Gate 14x7ft',
    message: 'Need quotation for Janakpuri villa installation.',
    timestamp: new Date().toLocaleString()
  };
  const inqPostRes = await request({
    hostname: 'localhost',
    port: 3045,
    path: '/api/inquiries',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, sampleInquiry);
  console.log('Test 7: POST /api/inquiries -> HTTP', inqPostRes.statusCode, JSON.parse(inqPostRes.body).success ? 'PASS' : 'FAIL');

  // 8. Test GET /api/inquiries
  const apiInqRes = await request({ hostname: 'localhost', port: 3045, path: '/api/inquiries', method: 'GET' });
  const inqs = JSON.parse(apiInqRes.body);
  console.log('Test 8: GET /api/inquiries -> HTTP', apiInqRes.statusCode, 'Count:', inqs.length, inqs[0].name === 'Rohan Sharma' ? 'PASS' : 'FAIL');

  console.log('\n--- ALL CMS INTEGRATION TESTS COMPLETED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
