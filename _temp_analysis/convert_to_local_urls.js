const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign';

const urlMapping = [
  // Specific pages first
  { live: 'https://harichandsteel.com/home/page/2/', local: 'product.html' },
  { live: 'https://harichandsteel.com/home/', local: 'index.html' },
  { live: 'https://harichandsteel.com/our-products/', local: 'our-products.html' },
  { live: 'https://harichandsteel.com/about-us/', local: 'about-us.html' },
  { live: 'https://harichandsteel.com/product/', local: 'product.html' },
  { live: 'https://harichandsteel.com/contact/', local: 'contact.html' },
  { live: 'https://harichandsteel.com/news/', local: 'news.html' },
  { live: 'https://harichandsteel.com/steel-gate-design/', local: 'steel-gate-design.html' },
  { live: 'https://harichandsteel.com/best-steel-gate-manufacturer-in-delhi/', local: 'best-steel-gate-manufacturer-in-delhi.html' },
  { live: 'https://harichandsteel.com/aluminium-profile-gate-manufacturer-in-janakpuri/', local: 'aluminium-profile-gate-manufacturer-in-janakpuri.html' },
  { live: 'https://harichandsteel.com/sitemap/', local: 'sitemap.html' },
  { live: 'https://harichandsteel.com/privacy-policy/', local: 'privacy-policy.html' },

  // Specific product items
  { live: 'https://harichandsteel.com/product/aluminium-door-profile-gate/', local: 'product.html#aluminium-door-profile-gate' },
  { live: 'https://harichandsteel.com/product/aluminum-profile-gate-with-rose-gold-handle/', local: 'product.html#aluminum-profile-gate-with-rose-gold-handle' },
  { live: 'https://harichandsteel.com/product/aluminum-profile-gate-with-steel-frame/', local: 'product.html#aluminum-profile-gate-with-steel-frame' },
  { live: 'https://harichandsteel.com/product/aluminium-profile-gate-for-home/', local: 'product.html#aluminium-profile-gate-for-home' },
  { live: 'https://harichandsteel.com/product/aluminium-profile-main-gate/', local: 'product.html#aluminium-profile-main-gate' },
  { live: 'https://harichandsteel.com/product/aluminium-sliding-main-entrance-gate/', local: 'product.html#aluminium-sliding-main-entrance-gate' },
  { live: 'https://harichandsteel.com/product/aluminum-profile-swing-gate-for-home/', local: 'product.html#aluminum-profile-swing-gate-for-home' },
  { live: 'https://harichandsteel.com/product/double-door-steel-gate/', local: 'product.html#double-door-steel-gate' },
  { live: 'https://harichandsteel.com/product/entrance-steel-door-for-home/', local: 'product.html#entrance-steel-door-for-home' },

  // Product categories
  { live: 'https://harichandsteel.com/product-category/aluminum-profile-gate/', local: 'our-products.html#aluminum-profile-gate' },
  { live: 'https://harichandsteel.com/product-category/iron-main-gate/', local: 'our-products.html#iron-main-gate' },
  { live: 'https://harichandsteel.com/product-category/steel-main-gate/', local: 'our-products.html#steel-main-gate' },
  { live: 'https://harichandsteel.com/product-category/steel-door/', local: 'our-products.html#steel-door' },
  { live: 'https://harichandsteel.com/product-category/powder-coated-gates/', local: 'our-products.html#powder-coated-gates' },

  // Blog extras
  { live: 'https://harichandsteel.com/aluminum-profile-gate-manufacturer-in-prithviraj-road/', local: 'news.html#prithviraj-road' },
  { live: 'https://harichandsteel.com/best-aluminum-profile-gate-gates-manufacturer/', local: 'news.html#best-profile-gate' },
  { live: 'https://harichandsteel.com/steel-gate-design-2/', local: 'steel-gate-design.html' },
  { live: 'https://harichandsteel.com/steel-gate-design-3/', local: 'steel-gate-design.html' },

  // Favicons in head
  { live: 'https://harichandsteel.com/wp-content/uploads/2024/07/cropped-HS-SIGN-32x32.jpeg', local: 'images/favicon-32.jpeg' },
  { live: 'https://harichandsteel.com/wp-content/uploads/2024/07/cropped-HS-SIGN-180x180.jpeg', local: 'images/favicon-32.jpeg' },
  { live: 'https://harichandsteel.com/wp-content/uploads/2024/07/cropped-HS-SIGN-192x192.jpeg', local: 'images/favicon-32.jpeg' },

  // Root domain (must be last)
  { live: 'https://harichandsteel.com/', local: 'index.html' },
  { live: 'https://harichandsteel.com', local: 'index.html' }
];

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // We only want to replace href="..." and link href="..." (excluding the JSON-LD script and canonical if schema needs to stay canonical, or does user want canonical local as well?)
  // Let's replace href in <a> tags, <link rel="icon">, but keep canonical or make canonical local?
  // Let's check: in href="https://harichandsteel.com/..."
  urlMapping.forEach(m => {
    // Replace in href="..."
    const regexHref = new RegExp(`href=["']${m.live.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    content = content.replace(regexHref, `href="${m.local}"`);
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

const targetFiles = [
  'index.html',
  'about-us.html',
  'our-products.html',
  'product.html',
  'contact.html',
  'news.html',
  'steel-gate-design.html',
  'best-steel-gate-manufacturer-in-delhi.html',
  'aluminium-profile-gate-manufacturer-in-janakpuri.html',
  'sitemap.html',
  'privacy-policy.html'
];

targetFiles.forEach(f => {
  const p = path.join(baseDir, f);
  if (fs.existsSync(p)) {
    convertFile(p);
    console.log(`Converted hrefs in ${f}`);
  }
});
