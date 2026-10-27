const fs = require('fs');

const schemas = JSON.parse(fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/schemas_extracted.json', 'utf8'));

console.log('Keys in schemas:', Object.keys(schemas));
