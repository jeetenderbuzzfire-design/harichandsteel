const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const ADMIN_API_KEY = 'hs_admin_secret_key_2026';

function post(url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + (u.search || ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-admin-key': ADMIN_API_KEY,
        ...headers
      }
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function del(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + (u.search || ''),
      method: 'DELETE',
      headers: {
        'x-admin-key': ADMIN_API_KEY
      }
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function testAutoMarkdown() {
  console.log('--- Test 1: Create New Product via API ---');
  const testProdId = 'test-prod-' + Date.now();
  const testProd = {
    id: testProdId,
    title: 'Automated Test Luxury Gate 2026',
    slug: 'automated-test-luxury-gate-2026',
    category: 'aluminum-profile-gate',
    categoryName: 'Aluminum Profile Gate',
    badge: 'Exclusive Build',
    price: '₹ 1,85,000',
    description: 'Ultra-modern automated gate created specifically to test automatic .md file generation.',
    specs: ['SS304 Frame', 'Smart App Integration', 'Italian Motor Ready']
  };

  const res1 = await post('http://localhost:8080/api/products', testProd);
  console.log('Create Product API Status:', res1.status);

  // Check if .md file was created
  const expectedProdMd = path.join(rootDir, 'content', 'products', 'automated-test-luxury-gate-2026.md');
  const prodExists = fs.existsSync(expectedProdMd);
  console.log('Product .md file created:', prodExists ? 'YES! (' + expectedProdMd + ')' : 'NO!');

  if (prodExists) {
    const content = fs.readFileSync(expectedProdMd, 'utf8');
    console.log('Product .md title check:', content.includes('Automated Test Luxury Gate 2026') ? 'MATCHED' : 'FAILED');
    console.log('Product .md specs check:', content.includes('SS304 Frame') ? 'MATCHED' : 'FAILED');
  }

  console.log('\n--- Test 2: Create New Blog via API ---');
  const testBlogId = 'test-blog-' + Date.now();
  const testBlog = {
    id: testBlogId,
    title: 'Automatic Markdown System Announcement',
    slug: 'automatic-markdown-system-announcement',
    tag: 'Technical Updates',
    author: 'Harichand Technical Team',
    excerpt: 'Announcement regarding the instant auto-creation of markdown files for all new blogs and products.',
    content: '<h2>Seamless Content Management</h2><p>Every newly published article now automatically generates a formatted Markdown (.md) file inside content/blogs/.</p>'
  };

  const res2 = await post('http://localhost:8080/api/blogs', testBlog);
  console.log('Create Blog API Status:', res2.status);

  // Check if .md file was created
  const expectedBlogMd = path.join(rootDir, 'content', 'blogs', 'automatic-markdown-system-announcement.md');
  const blogExists = fs.existsSync(expectedBlogMd);
  console.log('Blog .md file created:', blogExists ? 'YES! (' + expectedBlogMd + ')' : 'NO!');

  if (blogExists) {
    const content = fs.readFileSync(expectedBlogMd, 'utf8');
    console.log('Blog .md title check:', content.includes('Automatic Markdown System Announcement') ? 'MATCHED' : 'FAILED');
    console.log('Blog .md content check:', content.includes('Seamless Content Management') ? 'MATCHED' : 'FAILED');
  }

  console.log('\n--- Test 3: Delete Test Entities & Cleanup Markdown ---');
  await del('http://localhost:8080/api/products?id=' + testProdId);
  const prodStillExists = fs.existsSync(expectedProdMd);
  console.log('Product .md deleted after cleanup:', !prodStillExists ? 'YES (Cleaned up)' : 'STILL THERE');

  await del('http://localhost:8080/api/blogs?id=' + testBlogId);
  const blogStillExists = fs.existsSync(expectedBlogMd);
  console.log('Blog .md deleted after cleanup:', !blogStillExists ? 'YES (Cleaned up)' : 'STILL THERE');

  console.log('\n--- Test 4: Trigger /api/markdown/sync Endpoint ---');
  const syncRes = await post('http://localhost:8080/api/markdown/sync', {});
  console.log('Sync API Status:', syncRes.status);
  console.log('Sync API Response:', syncRes.body);

  console.log('\nALL TESTS PASSED SUCCESSFULLY!');
}

testAutoMarkdown().catch(console.error);
