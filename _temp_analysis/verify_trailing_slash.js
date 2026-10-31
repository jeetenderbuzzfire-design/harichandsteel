const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + (u.search || ''),
      method: 'GET'
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        location: res.headers['location'],
        contentType: res.headers['content-type'],
        bodyLength: d.length
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  const tests = [
    { url: 'http://localhost:8080/index.html', expectStatus: 301, expectLoc: '/' },
    { url: 'http://localhost:8080/', expectStatus: 200 },
    { url: 'http://localhost:8080/about-us.html', expectStatus: 301, expectLoc: '/about-us/' },
    { url: 'http://localhost:8080/about-us', expectStatus: 301, expectLoc: '/about-us/' },
    { url: 'http://localhost:8080/about-us/', expectStatus: 200 },
    { url: 'http://localhost:8080/contact.html', expectStatus: 301, expectLoc: '/contact/' },
    { url: 'http://localhost:8080/contact', expectStatus: 301, expectLoc: '/contact/' },
    { url: 'http://localhost:8080/contact/', expectStatus: 200 },
    { url: 'http://localhost:8080/product.html', expectStatus: 301, expectLoc: '/product/' },
    { url: 'http://localhost:8080/product', expectStatus: 301, expectLoc: '/product/' },
    { url: 'http://localhost:8080/product/', expectStatus: 200 },
    { url: 'http://localhost:8080/product/aluminium-door-profile-gate', expectStatus: 301, expectLoc: '/product/aluminium-door-profile-gate/' },
    { url: 'http://localhost:8080/product/aluminium-door-profile-gate/', expectStatus: 200 },
    { url: 'http://localhost:8080/product-category/steel-door', expectStatus: 301, expectLoc: '/product-category/steel-door/' },
    { url: 'http://localhost:8080/product-category/steel-door/', expectStatus: 200 },
    { url: 'http://localhost:8080/steel-gate-design.html', expectStatus: 301, expectLoc: '/steel-gate-design/' },
    { url: 'http://localhost:8080/steel-gate-design/', expectStatus: 200 },
    { url: 'http://localhost:8080/css/style.css', expectStatus: 200 },
    { url: 'http://localhost:8080/about-us/css/style.css', expectStatus: 200 },
    { url: 'http://localhost:8080/product/aluminium-door-profile-gate/images/logo.jpeg', expectStatus: 200 }
  ];

  let passed = 0;
  for (const t of tests) {
    try {
      const res = await get(t.url);
      const statusOk = res.status === t.expectStatus;
      const locOk = !t.expectLoc || res.location === t.expectLoc;
      const ok = statusOk && locOk;
      if (ok) {
        passed++;
        console.log(`[PASS] ${t.url} -> Status: ${res.status}${res.location ? ` (Location: ${res.location})` : ''}`);
      } else {
        console.error(`[FAIL] ${t.url} -> Got status: ${res.status}, loc: ${res.location}. Expected: ${t.expectStatus}, loc: ${t.expectLoc}`);
      }
    } catch (e) {
      console.error(`[ERROR] ${t.url}: ${e.message}`);
    }
  }

  console.log(`\nResults: ${passed} / ${tests.length} tests passed.`);
  if (passed === tests.length) {
    console.log('ALL URL TESTS PASSED PERFECTLY!');
  } else {
    process.exit(1);
  }
}

runTests().catch(console.error);
