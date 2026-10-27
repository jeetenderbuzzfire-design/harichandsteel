const fs = require('fs');
const html = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/site_raw.html', 'utf8');

const occurrences = (str) => {
  let count = 0;
  let pos = 0;
  while ((pos = html.indexOf(str, pos)) !== -1) {
    count++;
    console.log(`Found "${str}" at index ${pos}`);
    pos += str.length;
  }
  return count;
};

console.log('Occurrences of class="hero" or similar:');
occurrences('class="hero');
occurrences('class="why');
occurrences('class="pricing');
occurrences('class="gallery-grid');
occurrences('class="faq-item');
occurrences('class="stat-num');
