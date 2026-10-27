const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign';

// Find all HTML files in root and subdirectories
function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === '_temp_analysis' || file === 'node_modules') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = getAllHtmlFiles(baseDir);
console.log('Found HTML files:', allFiles.length);

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Check how many times '<a href="contact.html"' or '<a href="../contact.html"' appears in nav
  const navMatch = content.match(/<nav class=["']main-nav["'][\s\S]*?<\/nav>/i);
  if (navMatch) {
    const navHtml = navMatch[0];
    const contactCount = (navHtml.match(/Contact<\/a>/g) || []).length;
    const productCount = (navHtml.match(/Product/g) || []).length;
    console.log(`${path.relative(baseDir, f)}: Contact appears ${contactCount} times, Product appears ${productCount} times`);
  }
});
