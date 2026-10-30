const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserExe = fs.existsSync(chromePath) ? chromePath : edgePath;

console.log('Using browser:', browserExe);

const viewports = [
  { name: 'Ultra Compact Mobile', width: 320, height: 568 },
  { name: 'Compact Mobile', width: 360, height: 640 },
  { name: 'Standard iPhone', width: 375, height: 667 },
  { name: 'Modern iPhone 14/15/16', width: 390, height: 844 },
  { name: 'Tablet Portrait (iPad)', width: 768, height: 1024 },
  { name: 'Tablet Landscape / Laptop', width: 1024, height: 768 },
  { name: 'Desktop Full HD', width: 1440, height: 900 }
];

const testUrls = [
  'http://localhost:8080/',
  'http://localhost:8080/product',
  'http://localhost:8080/our-products',
  'http://localhost:8080/about-us',
  'http://localhost:8080/contact',
  'http://localhost:8080/news',
  'http://localhost:8080/steel-gate-design',
  'http://localhost:8080/best-steel-gate-manufacturer-in-delhi',
  'http://localhost:8080/aluminium-profile-gate-manufacturer-in-janakpuri',
  'http://localhost:8080/privacy-policy',
  'http://localhost:8080/sitemap',
  'http://localhost:8080/admin'
];

// Helper to launch browser with debugging port
async function runAudit() {
  const debugPort = 9225;
  const chromeProc = spawn(browserExe, [
    `--remote-debugging-port=${debugPort}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + path.join(__dirname, 'chrome_test_profile')
  ]);

  // Wait 1.5s for CDP to be available
  await new Promise(r => setTimeout(r, 1500));

  function cdpGet(endpoint) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${debugPort}${endpoint}`, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  try {
    const list = await cdpGet('/json/list');
    console.log('CDP available! Target count:', list.length);
  } catch (e) {
    console.error('CDP connection failed:', e.message);
  } finally {
    chromeProc.kill();
  }
}

runAudit();
