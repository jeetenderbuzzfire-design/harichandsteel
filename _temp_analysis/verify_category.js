const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('--- Testing /product-category/steel-door/ ---');
  const res1 = await get('http://localhost:8080/product-category/steel-door/');
  console.log('Status:', res1.status);
  
  const titleMatch = res1.body.match(/<title>(.*?)<\/title>/i);
  console.log('Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');
  
  const h1Match = res1.body.match(/<h1[^>]*class="[^"]*page-title[^"]*"[^>]*>(.*?)<\/h1>/i);
  console.log('H1:', h1Match ? h1Match[1] : 'NOT FOUND');

  const leadMatch = res1.body.match(/<p[^>]*class="[^"]*page-lead[^"]*"[^>]*>(.*?)<\/p>/i);
  console.log('Lead:', leadMatch ? leadMatch[1].substring(0, 60) + '...' : 'NOT FOUND');

  const activeBtn = res1.body.match(/<button[^>]*class="[^"]*filter-btn\s+active[^"]*"[^>]*data-filter="([^"]+)"/i);
  console.log('Active Filter Button:', activeBtn ? activeBtn[1] : 'NOT FOUND');

  console.log('\n--- Testing /product-category/aluminum-profile-gate/ ---');
  const res2 = await get('http://localhost:8080/product-category/aluminum-profile-gate/');
  const h1Match2 = res2.body.match(/<h1[^>]*class="[^"]*page-title[^"]*"[^>]*>(.*?)<\/h1>/i);
  console.log('H1 for aluminum-profile-gate:', h1Match2 ? h1Match2[1] : 'NOT FOUND');
  const titleMatch2 = res2.body.match(/<title>(.*?)<\/title>/i);
  console.log('Title for aluminum-profile-gate:', titleMatch2 ? titleMatch2[1] : 'NOT FOUND');
}

verify().catch(console.error);
