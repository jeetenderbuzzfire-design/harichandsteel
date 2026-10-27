const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign';

// Define the new menu generator
function makeNavMenu(prefix, activePage) {
  return `<ul class="nav-menu">
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
          </ul>`;
}

// 1. Update Root Files
const rootPages = [
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

const navMenuRegex = /<ul class=["']nav-menu["']>[\s\S]*?<\/ul>/i;

rootPages.forEach(p => {
  const filePath = path.join(baseDir, p.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newMenu = makeNavMenu('', p.active);
    content = content.replace(navMenuRegex, newMenu);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated nav menu in root ${p.file}`);
  }
});

// 2. Update Subfolder Directory Mirrors
const subfolders = [
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

subfolders.forEach(s => {
  const filePath = path.join(baseDir, s.folder, 'index.html');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newMenu = makeNavMenu('../', s.active);
    content = content.replace(navMenuRegex, newMenu);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated nav menu in ${s.folder}/index.html`);
  }
});

console.log('All navigation menus updated successfully!');
