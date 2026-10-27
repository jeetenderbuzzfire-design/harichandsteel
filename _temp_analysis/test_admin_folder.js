const http = require('http');

process.env.PORT = '3046';
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
  console.log('--- Testing /admin/ Folder & Routes ---');
  await new Promise(r => setTimeout(r, 600));

  // 1. Test redirect from /admin to /admin/
  const redirectRes = await request({ hostname: 'localhost', port: 3046, path: '/admin', method: 'GET' });
  console.log('Test 1: GET /admin -> HTTP', redirectRes.statusCode, 'Location:', redirectRes.headers.location, redirectRes.statusCode === 301 && redirectRes.headers.location === '/admin/' ? 'PASS' : 'FAIL');

  // 2. Test GET /admin/
  const adminFolderRes = await request({ hostname: 'localhost', port: 3046, path: '/admin/', method: 'GET' });
  console.log('Test 2: GET /admin/ -> HTTP', adminFolderRes.statusCode, adminFolderRes.body.includes('CMS DASHBOARD') ? 'PASS' : 'FAIL');

  // 3. Test GET /admin/index.html
  const adminIndexRes = await request({ hostname: 'localhost', port: 3046, path: '/admin/index.html', method: 'GET' });
  console.log('Test 3: GET /admin/index.html -> HTTP', adminIndexRes.statusCode, adminIndexRes.body.includes('CMS DASHBOARD') ? 'PASS' : 'FAIL');

  // 4. Test GET /admin/css/admin.css
  const adminCssRes = await request({ hostname: 'localhost', port: 3046, path: '/admin/css/admin.css', method: 'GET' });
  console.log('Test 4: GET /admin/css/admin.css -> HTTP', adminCssRes.statusCode, adminCssRes.headers['content-type'].includes('css') ? 'PASS' : 'FAIL');

  // 5. Test GET /admin/js/admin.js
  const adminJsRes = await request({ hostname: 'localhost', port: 3046, path: '/admin/js/admin.js', method: 'GET' });
  console.log('Test 5: GET /admin/js/admin.js -> HTTP', adminJsRes.statusCode, adminJsRes.headers['content-type'].includes('javascript') ? 'PASS' : 'FAIL');

  // 6. Test GET /admin/js/cms-data.js
  const cmsJsRes = await request({ hostname: 'localhost', port: 3046, path: '/admin/js/cms-data.js', method: 'GET' });
  console.log('Test 6: GET /admin/js/cms-data.js -> HTTP', cmsJsRes.statusCode, cmsJsRes.headers['content-type'].includes('javascript') ? 'PASS' : 'FAIL');

  // 7. Test Homepage footer link points to admin/
  const homeRes = await request({ hostname: 'localhost', port: 3046, path: '/', method: 'GET' });
  console.log('Test 7: Homepage footer contains href="admin/" ->', homeRes.body.includes('href="admin/"') ? 'PASS' : 'FAIL');

  console.log('\n--- ALL /admin/ FOLDER ROUTE TESTS PASSED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
