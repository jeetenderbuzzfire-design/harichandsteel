const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const images = [
  { url: 'https://harichandsteel.com/wp-content/uploads/2024/07/cropped-HS-SIGN-1-69x49.jpeg', name: 'logo.jpeg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2024/07/cropped-HS-SIGN-32x32.jpeg', name: 'favicon-32.jpeg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2024/05/20230919_182426-scaled.jpg', name: 'hero-slide-1.jpg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2024/05/ALUMINUM-PROFILE-GATE-1.jpg', name: 'hero-slide-2.jpg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2024/05/ALUMINUM-PROFILE-GATE-2.jpg', name: 'hero-slide-3.jpg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2024/05/aluminuim-profile-box--1024x576.jpg', name: 'profile-box.jpg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2024/05/Main-Entrance-Gate_2850083224362_stainless-steel-window-grills-576x1024.jpg', name: 'about-1.jpg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2024/05/golden-brown-profile-gate-1024x461.jpg', name: 'about-2.jpg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2024/05/20231029_141009-1024x768.jpg', name: 'about-3.jpg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2024/05/20231018_133021-768x1024.jpg', name: 'about-4.jpg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2026/02/ChatGPT-Image-Feb-24-2026-02_47_54-PM.png', name: 'prod-1.png' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-1.26.00-PM.jpeg', name: 'prod-2.jpeg' },
  { url: 'https://harichandsteel.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-1.22.39-PM.jpeg', name: 'prod-3.jpeg' }
];

const destDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/images';

function download(item) {
  return new Promise((resolve) => {
    const dest = path.join(destDir, item.name);
    const file = fs.createWriteStream(dest);
    const req = https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (redirectRes) => {
          redirectRes.pipe(file);
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
    req.setTimeout(10000, () => { req.destroy(); resolve(false); });
  });
}

(async () => {
  for (const item of images) {
    const ok = await download(item);
    console.log(`Downloaded ${item.name}: ${ok ? 'OK' : 'FAILED'}`);
  }
})();
