const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\harichand-steel-redesign';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'admin.html');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace copyright line
  const oldLine = '<p>Copyright &copy; 2026 HARICHAND STEEL. All rights reserved.</p>';
  const newLine = '<p>Copyright &copy; 2026 HARICHAND STEEL. All rights reserved. &bull; <a href="admin.html" style="color: rgba(255,255,255,0.45); text-decoration: none;"><i class="fas fa-lock"></i> Admin CMS</a></p>';
  if (content.includes(oldLine)) {
    content = content.replace(oldLine, newLine);
  }

  // Ensure cms-data.js is included before main.js
  if (!content.includes('js/cms-data.js') && content.includes('<script src="js/main.js"></script>')) {
    content = content.replace(
      '<script src="js/main.js"></script>',
      '<script src="js/cms-data.js"></script>\n  <script src="js/main.js"></script>'
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated footer and scripts in ${file}`);
});
