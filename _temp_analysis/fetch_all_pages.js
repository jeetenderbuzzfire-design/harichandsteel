const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const urls = [
  'https://harichandsteel.com/',
  'https://harichandsteel.com/home/',
  'https://harichandsteel.com/news/',
  'https://harichandsteel.com/product/',
  'https://harichandsteel.com/contact/',
  'https://harichandsteel.com/steel-gate-design/',
  'https://harichandsteel.com/sitemap/',
  'https://harichandsteel.com/our-products/',
  'https://harichandsteel.com/about-us/',
  'https://harichandsteel.com/best-steel-gate-manufacturer-in-delhi/',
  'https://harichandsteel.com/aluminium-profile-gate-manufacturer-in-janakpuri/',
  'https://harichandsteel.com/privacy-policy/'
];

const rawDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages';
if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

function fetchUrl(url) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 20000
    };

    const req = https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).toString();
        }
        console.log(`Redirecting ${url} -> ${redirectUrl}`);
        fetchUrl(redirectUrl).then(resolve);
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, content: data });
      });
    });

    req.on('error', (err) => {
      console.error(`Error fetching ${url}:`, err.message);
      resolve({ url, status: 0, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      console.error(`Timeout fetching ${url}`);
      resolve({ url, status: 0, error: 'Timeout' });
    });
  });
}

(async () => {
  for (const url of urls) {
    const slug = url.replace('https://harichandsteel.com/', '').replace(/\/$/, '') || 'home_root';
    const filename = `${slug.replace(/\//g, '_')}.html`;
    const dest = path.join(rawDir, filename);

    console.log(`Fetching ${url} -> ${filename}...`);
    const res = await fetchUrl(url);
    if (res.content) {
      fs.writeFileSync(dest, res.content);
      console.log(`  Saved ${filename} (${res.content.length} bytes, status ${res.status})`);
    } else {
      console.log(`  FAILED ${filename}`);
    }
  }
  console.log('Finished fetching all pages.');
})();
