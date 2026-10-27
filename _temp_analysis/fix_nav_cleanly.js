const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign';

function generateNav(prefix, activePage) {
  return `<nav class="main-nav" id="mainNav">
          <ul class="nav-menu">
            <li class="nav-item">
              <a href="${prefix}index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
            </li>
            <li class="nav-item">
              <a href="${prefix}our-products.html" class="nav-link ${activePage === 'our-products' ? 'active' : ''}">Our Products</a>
            </li>
            <li class="nav-item">
              <a href="${prefix}about-us.html" class="nav-link ${activePage === 'about-us' ? 'active' : ''}">About us</a>
            </li>
            <li class="nav-item">
              <a href="${prefix}contact.html" class="nav-link ${activePage === 'contact' ? 'active' : ''}">Contact</a>
            </li>
            <li class="nav-item">
              <a href="${prefix}news.html" class="nav-link ${activePage === 'news' ? 'active' : ''}">News</a>
            </li>
            <li class="nav-item has-dropdown">
              <a href="${prefix}product.html" class="nav-link ${activePage === 'product' ? 'active' : ''}">
                Product <i class="fas fa-chevron-down arrow"></i>
              </a>
              <ul class="dropdown-menu">
                <li><a href="${prefix}our-products.html#aluminum-profile-gate" class="dropdown-link"><i class="fas fa-angle-right"></i> Aluminum Profile Gate</a></li>
                <li><a href="${prefix}our-products.html#iron-main-gate" class="dropdown-link"><i class="fas fa-angle-right"></i> Iron Main Gate</a></li>
                <li><a href="${prefix}our-products.html#steel-main-gate" class="dropdown-link"><i class="fas fa-angle-right"></i> Steel Main Gate</a></li>
                <li><a href="${prefix}our-products.html#steel-door" class="dropdown-link"><i class="fas fa-angle-right"></i> Steel Door</a></li>
                <li><a href="${prefix}our-products.html#powder-coated-gates" class="dropdown-link"><i class="fas fa-angle-right"></i> Powder Coated Gates</a></li>
              </ul>
            </li>
          </ul>

          <!-- Action Buttons -->
          <div class="nav-actions">
            <a href="https://wa.me/919870433868" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener">
              <i class="fab fa-whatsapp"></i> WhatsApp Us
            </a>
            <a href="#quickEstimator" class="btn btn-primary btn-sm trigger-inquiry-modal" data-product="Custom Gate Solution">
              <i class="fas fa-file-invoice"></i> Get Free Quote
            </a>
          </div>
        </nav>`;
}

const fullNavRegex = /<nav class=["']main-nav["'] id=["']mainNav["']>[\s\S]*?<\/nav>/i;

// 1. Root files
const rootFiles = [
  { file: 'index.html', active: 'home' },
  { file: 'about-us.html', active: 'about-us' },
  { file: 'our-products.html', active: 'our-products' },
  { file: 'product.html', active: 'product' },
  { file: 'contact.html', active: 'contact' },
  { file: 'news.html', active: 'news' },
  { file: 'steel-gate-design.html', active: 'news' },
  { file: 'best-steel-gate-manufacturer-in-delhi.html', active: 'news' },
  { file: 'aluminium-profile-gate-manufacturer-in-janakpuri.html', active: 'news' },
  { file: 'sitemap.html', active: 'home' },
  { file: 'privacy-policy.html', active: 'home' }
];

rootFiles.forEach(p => {
  const filePath = path.join(baseDir, p.file);
  let content = fs.readFileSync(filePath, 'utf8');
  const cleanNav = generateNav('', p.active);
  content = content.replace(fullNavRegex, cleanNav);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned nav in ${p.file}`);
});

// 2. Subfolder directory mirrors
const subfolderFiles = [
  { folder: 'home', active: 'home' },
  { folder: 'about-us', active: 'about-us' },
  { folder: 'our-products', active: 'our-products' },
  { folder: 'product', active: 'product' },
  { folder: 'contact', active: 'contact' },
  { folder: 'news', active: 'news' },
  { folder: 'steel-gate-design', active: 'news' },
  { folder: 'best-steel-gate-manufacturer-in-delhi', active: 'news' },
  { folder: 'aluminium-profile-gate-manufacturer-in-janakpuri', active: 'news' },
  { folder: 'sitemap', active: 'home' },
  { folder: 'privacy-policy', active: 'home' }
];

subfolderFiles.forEach(s => {
  const filePath = path.join(baseDir, s.folder, 'index.html');
  let content = fs.readFileSync(filePath, 'utf8');
  const cleanNav = generateNav('../', s.active);
  content = content.replace(fullNavRegex, cleanNav);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned nav in ${s.folder}/index.html`);
});

console.log('Finished cleaning nav in all files.');
