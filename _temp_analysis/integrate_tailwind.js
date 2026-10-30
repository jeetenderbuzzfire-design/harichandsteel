const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

// 1. Root HTML files to update
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

// 2. Admin HTML files to update
const adminHtmlFiles = [
  'admin/index.html',
  'admin/admin.html',
  'admin/products.html',
  'admin/inquiries.html'
];

// Tailwind injection snippet for root HTML
const rootTailwindSnippet = `  <!-- Tailwind CSS Framework & Configuration -->
  <link rel="stylesheet" href="css/tailwind.css">
  <script src="js/tailwind-config.js"></script>
  <script src="js/tailwind.js"></script>`;

// Tailwind injection snippet for admin HTML
const adminTailwindSnippet = `  <!-- Tailwind CSS Framework & Configuration -->
  <link rel="stylesheet" href="css/tailwind.css">
  <script src="js/tailwind-config.js"></script>
  <script src="js/tailwind.js"></script>`;

// Inject into root files
for (const rel of rootHtmlFiles) {
  const filePath = path.join(rootDir, rel);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Avoid duplicate injection
  if (!content.includes('tailwind-config.js')) {
    // Inject right before </head>
    content = content.replace('</head>', `${rootTailwindSnippet}\n</head>`);
    console.log(`✓ Injected Tailwind into ${rel}`);
  }

  // Enhance sticky mobile bar buttons with Tailwind classes
  content = content.replace(
    /class="btn btn-primary btn-sm"/g,
    'class="btn btn-primary btn-sm flex items-center justify-center gap-2 font-medium shadow-md transition-all duration-200 active:scale-95"'
  );
  content = content.replace(
    /class="btn btn-whatsapp btn-sm"/g,
    'class="btn btn-whatsapp btn-sm flex items-center justify-center gap-2 font-medium shadow-md transition-all duration-200 active:scale-95"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

// Inject into admin files
for (const rel of adminHtmlFiles) {
  const filePath = path.join(rootDir, rel);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Avoid duplicate injection
  if (!content.includes('tailwind-config.js')) {
    content = content.replace('</head>', `${adminTailwindSnippet}\n</head>`);
    console.log(`✓ Injected Tailwind into ${rel}`);
  }

  // Enhance admin elements with Tailwind utilities
  content = content.replace(
    /class="admin-body"/g,
    'class="admin-body bg-[#0f141a] text-slate-200 antialiased font-sans min-h-screen"'
  );
  content = content.replace(
    /class="admin-sidebar"([^>]*)>/g,
    'class="admin-sidebar border-r border-slate-800/80 transition-all duration-300"$1>'
  );
  content = content.replace(
    /class="admin-topbar"/g,
    'class="admin-topbar border-b border-slate-800/80 backdrop-blur-md bg-[#161d26]/95 sticky top-0 z-40"'
  );
  content = content.replace(
    /class="stat-box"([^>]*)>/g,
    'class="stat-box rounded-xl p-5 border border-slate-800/80 hover:border-slate-700 bg-[#161d26] shadow-lg transition-all duration-300 hover:-translate-y-1"$1>'
  );
  content = content.replace(
    /class="admin-card-panel"([^>]*)>/g,
    'class="admin-card-panel rounded-xl p-6 border border-slate-800/80 bg-[#161d26] shadow-xl"$1>'
  );
  content = content.replace(
    /class="admin-btn admin-btn-primary"/g,
    'class="admin-btn admin-btn-primary inline-flex items-center gap-2 font-medium rounded-lg shadow-md hover:shadow-red-600/25 transition-all duration-200 active:scale-95"'
  );
  content = content.replace(
    /class="admin-btn admin-btn-outline"/g,
    'class="admin-btn admin-btn-outline inline-flex items-center gap-2 font-medium rounded-lg hover:bg-slate-800 transition-all duration-200 active:scale-95"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('✓ All HTML pages updated with Tailwind scripts and modern utility classes!');
