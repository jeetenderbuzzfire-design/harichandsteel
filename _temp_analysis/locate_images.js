const fs = require('fs');
const body = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/elementor_body.html', 'utf8');

const imgList = [
  'aluminuim-profile-box',
  'Main-Entrance-Gate',
  'golden-brown-profile-gate',
  '20231029_141009',
  '20231018_133021',
  'ChatGPT-Image-Feb-24',
  'WhatsApp-Image-2026-02-23-at-1.26.00-PM',
  'WhatsApp-Image-2026-02-23-at-1.22.39-PM'
];

imgList.forEach(name => {
  let pos = body.indexOf(name);
  if (pos !== -1) {
    let snippet = body.substring(Math.max(0, pos - 200), Math.min(body.length, pos + 250));
    console.log(`\n=== Found ${name} at ${pos} ===`);
    console.log(snippet.replace(/<svg[\s\S]*?<\/svg>/g, '[SVG]'));
  } else {
    console.log(`NOT found: ${name}`);
  }
});
