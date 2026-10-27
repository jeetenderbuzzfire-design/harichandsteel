const fs = require('fs');
const path = require('path');

const rawDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages';
const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.html'));

const schemasMap = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(rawDir, file), 'utf8');
  const schemaRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  const list = [];
  while ((match = schemaRegex.exec(content)) !== null) {
    list.push(match[1].trim());
  }
  schemasMap[file] = list;
}

fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/schemas_extracted.json', JSON.stringify(schemasMap, null, 2));
console.log('Saved schemas_extracted.json');
for (let k in schemasMap) {
  console.log(`${k}: ${schemasMap[k].length} schema blocks, total chars: ${schemasMap[k].reduce((acc, cur) => acc + cur.length, 0)}`);
}
