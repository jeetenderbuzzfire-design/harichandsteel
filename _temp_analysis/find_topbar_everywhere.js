const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '_temp_analysis') {
        scan(fullPath);
      }
    } else if (entry.name.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('top-bar') || content.includes('topNotificationBar')) {
        console.log('Found top-bar in:', path.relative(rootDir, fullPath));
      }
    }
  }
}

scan(rootDir);
