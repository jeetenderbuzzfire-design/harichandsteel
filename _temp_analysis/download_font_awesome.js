const fs = require('fs');
const https = require('https');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function run() {
  const cssUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
  console.log('Fetching CSS from', cssUrl);
  const cssBuf = await fetchBuffer(cssUrl);
  let cssText = cssBuf.toString('utf8');

  // Font files typically used by FA 6.5.1:
  const fontFiles = [
    'fa-solid-900.woff2',
    'fa-solid-900.ttf',
    'fa-regular-400.woff2',
    'fa-regular-400.ttf',
    'fa-brands-400.woff2',
    'fa-brands-400.ttf',
    'fa-v4compatibility.woff2',
    'fa-v4compatibility.ttf'
  ];

  const webfontsDir = path.join(rootDir, 'webfonts');
  const adminWebfontsDir = path.join(rootDir, 'admin', 'webfonts');
  fs.mkdirSync(webfontsDir, { recursive: true });
  fs.mkdirSync(adminWebfontsDir, { recursive: true });

  for (const filename of fontFiles) {
    const fullFontUrl = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/${filename}`;
    try {
      console.log('Downloading', filename, '...');
      const fontBuf = await fetchBuffer(fullFontUrl);
      fs.writeFileSync(path.join(webfontsDir, filename), fontBuf);
      fs.writeFileSync(path.join(adminWebfontsDir, filename), fontBuf);
      console.log('✓ Saved', filename, `(${Math.round(fontBuf.length / 1024)} KB)`);
    } catch (e) {
      console.warn('Skipping', filename, ':', e.message);
    }
  }

  // Save CSS
  const cssPath = path.join(rootDir, 'css', 'all.min.css');
  const adminCssPath = path.join(rootDir, 'admin', 'css', 'all.min.css');
  fs.writeFileSync(cssPath, cssText, 'utf8');
  fs.writeFileSync(adminCssPath, cssText, 'utf8');
  console.log('✓ Saved local Font Awesome CSS to:');
  console.log('  -', cssPath);
  console.log('  -', adminCssPath);
}

run().catch(console.error);
