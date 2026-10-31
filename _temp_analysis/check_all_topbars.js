const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
  const hasTopbar = content.includes('class="topbar"');
  const hasTopDashBar = content.includes('class="top-bar"');
  console.log(`${f}: topbar=${hasTopbar}, top-bar=${hasTopDashBar}`);
});
