const https = require('https');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const jsDir = path.join(rootDir, 'js');
const adminJsDir = path.join(rootDir, 'admin', 'js');

fs.mkdirSync(jsDir, { recursive: true });
fs.mkdirSync(adminJsDir, { recursive: true });

const dest1 = path.join(jsDir, 'tailwind.js');
const dest2 = path.join(adminJsDir, 'tailwind.js');

const url = 'https://cdn.tailwindcss.com/3.4.17';

console.log('Downloading local Tailwind standalone script from', url);

https.get(url, res => {
  if (res.statusCode !== 200) {
    console.error('Failed to download:', res.statusCode);
    process.exit(1);
  }
  const file = fs.createWriteStream(dest1);
  res.pipe(file);
  file.on('finish', () => {
    file.close(() => {
      fs.copyFileSync(dest1, dest2);
      console.log('Successfully saved local tailwind.js:');
      console.log(' - ' + dest1 + ' (' + fs.statSync(dest1).size + ' bytes)');
      console.log(' - ' + dest2 + ' (' + fs.statSync(dest2).size + ' bytes)');
    });
  });
}).on('error', e => console.error('Error downloading tailwind:', e));
