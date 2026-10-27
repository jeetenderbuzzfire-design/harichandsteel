const fs = require('fs');
const path = require('path');
const https = require('https');

const rawDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages';
const imgDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/images';

const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.html'));

const allImages = new Set();

for (const file of files) {
  const content = fs.readFileSync(path.join(rawDir, file), 'utf8');
  const imgRegex = /(?:src|data-src)=["'](https:\/\/harichandsteel\.com\/wp-content\/uploads\/[^"']+)["']/gi;
  let m;
  while ((m = imgRegex.exec(content)) !== null) {
    let url = m[1];
    allImages.add(url);
  }
}

console.log('Total unique images found across all pages:', allImages.size);

function download(url, filename) {
  return new Promise((resolve) => {
    const dest = path.join(imgDir, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
      resolve(true); // already downloaded
      return;
    }
    const file = fs.createWriteStream(dest);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (redirRes) => {
          redirRes.pipe(file);
          file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => resolve(false));
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.setTimeout(15000, () => { req.destroy(); resolve(false); });
  });
}

(async () => {
  let count = 0;
  for (const url of Array.from(allImages)) {
    const basename = path.basename(new URL(url).pathname);
    const ok = await download(url, basename);
    if (ok) count++;
  }
  console.log(`Downloaded/verified ${count} images.`);
})();
