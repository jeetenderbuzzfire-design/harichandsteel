const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\harichand-steel-redesign';
const mapping = {
  'index.html': 'home/index.html',
  'about-us.html': 'about-us/index.html',
  'our-products.html': 'our-products/index.html',
  'product.html': 'product/index.html',
  'contact.html': 'contact/index.html',
  'news.html': 'news/index.html',
  'steel-gate-design.html': 'steel-gate-design/index.html',
  'best-steel-gate-manufacturer-in-delhi.html': 'best-steel-gate-manufacturer-in-delhi/index.html',
  'aluminium-profile-gate-manufacturer-in-janakpuri.html': 'aluminium-profile-gate-manufacturer-in-janakpuri/index.html',
  'sitemap.html': 'sitemap/index.html',
  'privacy-policy.html': 'privacy-policy/index.html'
};

for (const [src, dest] of Object.entries(mapping)) {
  const srcPath = path.join(dir, src);
  const destPath = path.join(dir, dest);
  if (fs.existsSync(srcPath)) {
    // In subfolders, relative assets like images/ or css/ or js/ need ../ if opened directly in subfolder
    let content = fs.readFileSync(srcPath, 'utf8');
    // adjust paths for 1 folder depth: href="css/ -> href="../css/, src="images/ -> src="../images/, src="js/ -> src="../js/
    content = content
      .replace(/href="css\//g, 'href="../css/')
      .replace(/src="images\//g, 'src="../images/')
      .replace(/href="images\//g, 'href="../images/')
      .replace(/src="js\//g, 'src="../js/')
      .replace(/href="admin\.html"/g, 'href="../admin.html"')
      .replace(/href="index\.html"/g, 'href="../index.html"');
    
    // adjust html page links
    const pages = [
      'about-us.html', 'our-products.html', 'product.html', 'contact.html',
      'news.html', 'steel-gate-design.html', 'best-steel-gate-manufacturer-in-delhi.html',
      'aluminium-profile-gate-manufacturer-in-janakpuri.html', 'sitemap.html', 'privacy-policy.html'
    ];
    pages.forEach(p => {
      content = content.replace(new RegExp(`href="${p}"`, 'g'), `href="../${p}"`);
    });

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, content, 'utf8');
    console.log(`Synced ${dest}`);
  }
}
