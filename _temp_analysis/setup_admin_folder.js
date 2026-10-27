const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\harichand-steel-redesign';
const adminDir = path.join(rootDir, 'admin');
const adminCssDir = path.join(adminDir, 'css');
const adminJsDir = path.join(adminDir, 'js');

// 1. Create directories
fs.mkdirSync(adminCssDir, { recursive: true });
fs.mkdirSync(adminJsDir, { recursive: true });

// 2. Copy admin.css
const cssSrc = path.join(rootDir, 'css', 'admin.css');
const cssDest = path.join(adminCssDir, 'admin.css');
fs.copyFileSync(cssSrc, cssDest);
console.log('Copied admin.css to admin/css/admin.css');

// 3. Copy cms-data.js
const cmsSrc = path.join(rootDir, 'js', 'cms-data.js');
const cmsDest = path.join(adminJsDir, 'cms-data.js');
fs.copyFileSync(cmsSrc, cmsDest);
console.log('Copied cms-data.js to admin/js/cms-data.js');

// 4. Create admin/js/admin.js with resolveAdminImgPath
let adminJs = fs.readFileSync(path.join(rootDir, 'js', 'admin.js'), 'utf8');

// Insert image resolver helper right after escapeHtml
const helperCode = `
  function resolveAdminImgPath(src) {
    if (!src) return '../images/prod-1.png';
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('../')) {
      return src;
    }
    return '../' + src.replace(/^\\/+/, '');
  }
`;

adminJs = adminJs.replace('function escapeHtml(str) {', helperCode + '\n  function escapeHtml(str) {');

// Update image rendering references in tables to use resolveAdminImgPath
adminJs = adminJs.replace(/\${escapeHtml\(prod\.image \|\| 'images\/prod-1\.png'\)}/g, '${escapeHtml(resolveAdminImgPath(prod.image))}');
adminJs = adminJs.replace(/\${escapeHtml\(blog\.image \|\| 'images\/about-3\.jpg'\)}/g, '${escapeHtml(resolveAdminImgPath(blog.image))}');
adminJs = adminJs.replace(/this\.src='images\/prod-1\.png'/g, "this.src='../images/prod-1.png'");
adminJs = adminJs.replace(/this\.src='images\/about-3\.jpg'/g, "this.src='../images/about-3.jpg'");
adminJs = adminJs.replace(/updateImagePreview\(prodImagePreview, 'images\/prod-1\.png'\)/g, "updateImagePreview(prodImagePreview, '../images/prod-1.png')");
adminJs = adminJs.replace(/updateImagePreview\(blogImagePreview, 'images\/about-3\.jpg'\)/g, "updateImagePreview(blogImagePreview, '../images/about-3.jpg')");

fs.writeFileSync(path.join(adminJsDir, 'admin.js'), adminJs, 'utf8');
console.log('Created admin/js/admin.js with path resolution');

// 5. Create admin/index.html
let adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf8');

// Update asset paths for inside admin/
adminHtml = adminHtml
  .replace('href="images/favicon.ico"', 'href="../images/favicon.ico"')
  .replace('src="images/logo.png"', 'src="../images/logo.png"')
  .replace("onerror=\"this.src='images/logo.jpeg'\"", "onerror=\"this.src='../images/logo.jpeg'\"")
  .replace('href="index.html"', 'href="../index.html"')
  .replace('href="product.html"', 'href="../product.html"');

fs.writeFileSync(path.join(adminDir, 'index.html'), adminHtml, 'utf8');
// Also create admin/admin.html alias
fs.writeFileSync(path.join(adminDir, 'admin.html'), adminHtml, 'utf8');
console.log('Created admin/index.html and admin/admin.html');
