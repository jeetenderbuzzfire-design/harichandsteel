const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Helper to replace links in HTML
function cleanHtmlLinks(html) {
  let out = html;

  // Replace index.html with /
  out = out.replace(/href=["'](?:\.?\/)?index\.html["']/g, 'href="/"');

  // Specific queries and hashes
  out = out.replace(/href=["'](?:\.?\/)?contact\.html\?([^"']*)["']/g, 'href="/contact/?$1"');
  out = out.replace(/href=["'](?:\.?\/)?news\.html#([^"']*)["']/g, 'href="/news/#$1"');
  out = out.replace(/href=["'](?:\.?\/)?product\.html#aluminium-door-profile-gate["']/g, 'href="/product/aluminium-door-profile-gate/"');
  out = out.replace(/href=["'](?:\.?\/)?product\.html#([a-zA-Z0-9_-]+)["']/g, 'href="/product-category/$1/"');

  const pages = [
    'about-us',
    'contact',
    'our-products',
    'product',
    'news',
    'privacy-policy',
    'sitemap',
    'steel-gate-design',
    'best-steel-gate-manufacturer-in-delhi',
    'aluminium-profile-gate-manufacturer-in-janakpuri'
  ];

  for (const p of pages) {
    const reg = new RegExp(`href=["'](?:\\.?\\/)?${p}\\.html["']`, 'g');
    out = out.replace(reg, `href="/${p}/"`);
  }

  // Canonical tags
  out = out.replace(/(<link[^>]*rel=["']canonical["'][^>]*href=["'])(?:https?:\/\/[^\/]+)?\/?([^"']*?)(?:\.html)?\/?(["'])/gi, (m, pre, pth, suf) => {
    let clean = pth.replace(/^\/+/, '').replace(/\.html$/i, '');
    let full = clean ? `https://harichandsteel.com/${clean}/` : 'https://harichandsteel.com/';
    return `${pre}${full}${suf}`;
  });

  // Breadcrumbs: <a href="index.html">Home</a> or <a href="product.html">Product</a>
  out = out.replace(/<a\s+href="index\.html">Home<\/a>/g, '<a href="/">Home</a>');
  out = out.replace(/<a\s+href="product\.html">Product<\/a>/g, '<a href="/product/">Product</a>');
  out = out.replace(/<a\s+href="\/product">Product<\/a>/g, '<a href="/product/">Product</a>');

  // Fix product detail links missing trailing slash: /product/:slug -> /product/:slug/
  out = out.replace(/href="\/product\/([a-zA-Z0-9_-]+)(?<!\/)"/g, 'href="/product/$1/"');

  // Ensure <base href="/"> in <head> for reliable asset resolution
  if (!out.includes('<base href="/">')) {
    out = out.replace(/(<head\b[^>]*>)/i, '$1\n  <base href="/">');
  }

  return out;
}

// 1. Process all Root HTML files
const rootHtmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && !f.startsWith('_') && f !== 'site_raw.html' && f !== 'wpcode_extracted.html');
rootHtmlFiles.forEach(f => {
  const p = path.join(rootDir, f);
  const content = fs.readFileSync(p, 'utf8');
  const updated = cleanHtmlLinks(content);
  fs.writeFileSync(p, updated, 'utf8');
  console.log(`✓ Updated root: ${f}`);
});

// 2. Process all Mirror Directories
const mirrorDirs = [
  'about-us',
  'contact',
  'news',
  'our-products',
  'privacy-policy',
  'product',
  'sitemap',
  'steel-gate-design',
  'best-steel-gate-manufacturer-in-delhi',
  'aluminium-profile-gate-manufacturer-in-janakpuri',
  'admin'
];

mirrorDirs.forEach(dir => {
  const dirPath = path.join(rootDir, dir);
  if (fs.existsSync(dirPath)) {
    const idxPath = path.join(dirPath, 'index.html');
    if (fs.existsSync(idxPath)) {
      const content = fs.readFileSync(idxPath, 'utf8');
      const updated = cleanHtmlLinks(content);
      fs.writeFileSync(idxPath, updated, 'utf8');
      console.log(`✓ Updated mirror: ${dir}/index.html`);
    }
  }
});

// Also admin/login.html
const adminLoginPath = path.join(rootDir, 'admin', 'login.html');
if (fs.existsSync(adminLoginPath)) {
  const content = fs.readFileSync(adminLoginPath, 'utf8');
  fs.writeFileSync(adminLoginPath, cleanHtmlLinks(content), 'utf8');
  console.log(`✓ Updated admin/login.html`);
}

// 3. Update js/main.js
const mainJsPath = path.join(rootDir, 'js', 'main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

// Update breadcrumb links to / and /product/
mainJs = mainJs.replace(/<a href="index\.html">Home<\/a>/g, '<a href="/">Home</a>');
mainJs = mainJs.replace(/<a href="product\.html">Product<\/a>/g, '<a href="/product/">Product</a>');
mainJs = mainJs.replace(/<a href="\/product">Product<\/a>/g, '<a href="/product/">Product</a>');

// Update pagination cleanUrl logic: ensure trailing slash
mainJs = mainJs.replace(
  "cleanUrl = currentPage > 1 ? `/product/page/${currentPage}` : '/product';",
  "cleanUrl = currentPage > 1 ? `/product/page/${currentPage}/` : '/product/';"
);

// Update pagination prevUrl and nextUrl for /product/
mainJs = mainJs.replace(
  "prevUrl = page > 2 ? `/product/page/${page - 1}` : '/product';",
  "prevUrl = page > 2 ? `/product/page/${page - 1}/` : '/product/';"
);
mainJs = mainJs.replace(
  "pageUrl = p === 1 ? '/product' : `/product/page/${p}`;",
  "pageUrl = p === 1 ? '/product/' : `/product/page/${p}/`;"
);
mainJs = mainJs.replace(
  "nextUrl = `/product/page/${page + 1}`;",
  "nextUrl = `/product/page/${page + 1}/`;"
);

// Update detailUrl to end with slash
mainJs = mainJs.replace(
  "const detailUrl = `/product/${prodSlug}`;",
  "const detailUrl = `/product/${prodSlug}/`;"
);

// Update getPageFromUrl regex for trailing slash
mainJs = mainJs.replace(
  "path.match(/\\/(?:product|product-category\\/[^\\/]+)\\/page\\/(\\d+)\\/?/i)",
  "path.match(/\\/(?:product|product-category\\/[^\\/]+)\\/page\\/(\\d+)\\/?/i)"
);

fs.writeFileSync(mainJsPath, mainJs, 'utf8');
console.log('✓ Updated js/main.js');

// 4. Update data/blogs.json
const blogsJsonPath = path.join(rootDir, 'data', 'blogs.json');
if (fs.existsSync(blogsJsonPath)) {
  let blogs = JSON.parse(fs.readFileSync(blogsJsonPath, 'utf8'));
  blogs = blogs.map(b => {
    if (b.slug) {
      let s = b.slug.replace(/\.html$/i, '');
      if (s === '/index') s = '/';
      else if (!s.endsWith('/')) s = s + '/';
      b.slug = s;
    }
    return b;
  });
  fs.writeFileSync(blogsJsonPath, JSON.stringify(blogs, null, 2), 'utf8');
  console.log('✓ Updated data/blogs.json');
}

// 5. Update markdown-sync.js
const mdSyncPath = path.join(rootDir, 'markdown-sync.js');
let mdSync = fs.readFileSync(mdSyncPath, 'utf8');
mdSync = mdSync.replace(
  '`url: "/${baseName === \'index\' ? \'\' : baseName + \'.html\'}"`,',
  '`url: "/${baseName === \'index\' ? \'\' : baseName + \'/\'}"`,'
);
mdSync = mdSync.replace(
  '`canonical: "${canonical}"`,',
  '`canonical: "https://harichandsteel.com/${baseName === \'index\' ? \'\' : baseName + \'/\'}"`,'
);
mdSync = mdSync.replace(
  '`- **Catalogue URL:** [/product/${slug}](/product/${slug})`,',
  '`- **Catalogue URL:** [/product/${slug}/](/product/${slug}/)`,'
);
fs.writeFileSync(mdSyncPath, mdSync, 'utf8');
console.log('✓ Updated markdown-sync.js');

console.log('ALL HTML, JS, JSON & MD LINK REPLACEMENTS COMPLETED!');
