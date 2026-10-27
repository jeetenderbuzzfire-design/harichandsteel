const fs = require('fs');

const schemas = JSON.parse(fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/schemas_extracted.json', 'utf8'));

for (let key in schemas) {
  console.log(`\n================ SCHEMA FOR ${key} ================`);
  schemas[key].forEach((s, idx) => {
    console.log(`--- Block ${idx + 1} (${s.length} chars) ---`);
    console.log(s.slice(0, 300) + '...');
  });
}
