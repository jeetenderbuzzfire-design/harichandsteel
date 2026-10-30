const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Files to delete
const filesToDelete = [
  path.join(rootDir, 'css', 'tailwind.css'),
  path.join(rootDir, 'css', 'tailwind-input.css'),
  path.join(rootDir, 'admin', 'css', 'tailwind.css'),
  path.join(rootDir, 'js', 'tailwind.js'),
  path.join(rootDir, 'js', 'tailwind-config.js'),
  path.join(rootDir, 'admin', 'js', 'tailwind.js'),
  path.join(rootDir, 'admin', 'js', 'tailwind-config.js'),
  path.join(rootDir, 'tailwind.config.js')
];

for (const file of filesToDelete) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted: ${path.relative(rootDir, file)}`);
  }
}

// 2. Remove Tailwind snippet and extra classes from root HTML files
const rootHtmlFiles = [
  'index.html',
  'about-us.html',
  'our-products.html',
  'product.html',
  'contact.html',
  'news.html',
  'steel-gate-design.html',
  'best-steel-gate-manufacturer-in-delhi.html',
  'aluminium-profile-gate-manufacturer-in-janakpuri.html',
  'privacy-policy.html',
  'sitemap.html',
  'admin.html'
];

for (const rel of rootHtmlFiles) {
  const filePath = path.join(rootDir, rel);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove Tailwind links/scripts
  content = content.replace(/\s*<!-- Tailwind CSS Framework & Configuration -->\s*<link rel="stylesheet" href="css\/tailwind\.css">\s*<script src="js\/tailwind-config\.js"><\/script>\s*<script src="js\/tailwind\.js"><\/script>/g, '');
  content = content.replace(/\s*<link rel="stylesheet" href="css\/tailwind\.css">/g, '');
  content = content.replace(/\s*<script src="js\/tailwind-config\.js"><\/script>/g, '');
  content = content.replace(/\s*<script src="js\/tailwind\.js"><\/script>/g, '');

  // Restore clean button classes
  content = content.replace(
    /class="btn btn-primary btn-sm flex items-center justify-center gap-2 font-medium shadow-md transition-all duration-200 active:scale-95"/g,
    'class="btn btn-primary btn-sm"'
  );
  content = content.replace(
    /class="btn btn-whatsapp btn-sm flex items-center justify-center gap-2 font-medium shadow-md transition-all duration-200 active:scale-95"/g,
    'class="btn btn-whatsapp btn-sm"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned Tailwind from ${rel}`);
}

// 3. Clean admin HTML files
const adminHtmlFiles = [
  'admin/index.html',
  'admin/admin.html',
  'admin/products.html',
  'admin/inquiries.html'
];

for (const rel of adminHtmlFiles) {
  const filePath = path.join(rootDir, rel);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove Tailwind links/scripts
  content = content.replace(/\s*<!-- Tailwind CSS Framework & Configuration -->\s*<link rel="stylesheet" href="css\/tailwind\.css">\s*<script src="js\/tailwind-config\.js"><\/script>\s*<script src="js\/tailwind\.js"><\/script>/g, '');
  content = content.replace(/\s*<link rel="stylesheet" href="css\/tailwind\.css">/g, '');
  content = content.replace(/\s*<script src="js\/tailwind-config\.js"><\/script>/g, '');
  content = content.replace(/\s*<script src="js\/tailwind\.js"><\/script>/g, '');

  // Restore clean admin classes
  content = content.replace(
    /class="admin-body bg-\[#0f141a\] text-slate-200 antialiased font-sans min-h-screen"/g,
    'class="admin-body"'
  );
  content = content.replace(
    /class="admin-sidebar border-r border-slate-800\/80 transition-all duration-300"/g,
    'class="admin-sidebar"'
  );
  content = content.replace(
    /class="admin-topbar border-b border-slate-800\/80 backdrop-blur-md bg-\[#161d26\]\/95 sticky top-0 z-40"/g,
    'class="admin-topbar"'
  );
  content = content.replace(
    /class="stat-box rounded-xl p-5 border border-slate-800\/80 hover:border-slate-700 bg-\[#161d26\] shadow-lg transition-all duration-300 hover:-translate-y-1"/g,
    'class="stat-box"'
  );
  content = content.replace(
    /class="admin-card-panel rounded-xl p-6 border border-slate-800\/80 bg-\[#161d26\] shadow-xl"/g,
    'class="admin-card-panel"'
  );
  content = content.replace(
    /class="admin-btn admin-btn-primary inline-flex items-center gap-2 font-medium rounded-lg shadow-md hover:shadow-red-600\/25 transition-all duration-200 active:scale-95"/g,
    'class="admin-btn admin-btn-primary"'
  );
  content = content.replace(
    /class="admin-btn admin-btn-outline inline-flex items-center gap-2 font-medium rounded-lg hover:bg-slate-800 transition-all duration-200 active:scale-95"/g,
    'class="admin-btn admin-btn-outline"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned Tailwind from ${rel}`);
}

// 4. Update package.json
const pkgPath = path.join(rootDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.scripts) {
    delete pkg.scripts['build:css'];
    delete pkg.scripts['watch:css'];
  }
  if (pkg.devDependencies) {
    delete pkg.devDependencies['tailwindcss'];
    if (Object.keys(pkg.devDependencies).length === 0) {
      delete pkg.devDependencies;
    }
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
  console.log('Cleaned package.json (removed tailwind scripts and dependency)');
}

console.log('✓ Tailwind removal completed!');
