const fs = require('fs');
const path = require('path');

const rawDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages';
const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.html'));

const summary = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(rawDir, file), 'utf8');

  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Meta description
  const descMatch = content.match(/<meta name=["']description["'] content=["']([^"']*)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // Canonical
  const canonMatch = content.match(/<link rel=["']canonical["'] href=["']([^"']*)["']/i);
  const canonical = canonMatch ? canonMatch[1].trim() : '';

  // Schemas (application/ld+json)
  const schemaRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let sMatch;
  const schemas = [];
  while ((sMatch = schemaRegex.exec(content)) !== null) {
    try {
      // test parse
      const parsed = JSON.parse(sMatch[1]);
      schemas.push(parsed);
    } catch (e) {
      schemas.push({ raw: sMatch[1].trim() });
    }
  }

  // Headings
  const hRegex = /<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi;
  let hMatch;
  const headings = [];
  while ((hMatch = hRegex.exec(content)) !== null) {
    const text = hMatch[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (text && text.length > 1) {
      headings.push(`${hMatch[1]}: ${text}`);
    }
  }

  // Check elementor body or main content
  const mainMatch = content.match(/<div data-elementor-type=["']wp-page["'][\s\S]*?<\/footer>/i) ||
                    content.match(/<div class=["']entry-content["'][\s\S]*?<\/div>/i) ||
                    content.match(/<main[\s\S]*?<\/main>/i);
  
  summary[file] = {
    title,
    description,
    canonical,
    schemaCount: schemas.length,
    schemasPreview: schemas.map(s => s['@type'] || s['@graph'] ? 'Graph (' + (s['@graph'] || []).length + ')' : Object.keys(s)),
    headingsCount: headings.length,
    headingsSample: headings.slice(0, 15)
  };
}

fs.writeFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/pages_analysis.json', JSON.stringify(summary, null, 2));
console.log('Saved pages_analysis.json. Sample overview:');
for (let k in summary) {
  console.log(`\n=== ${k} ===`);
  console.log(`Title: ${summary[k].title}`);
  console.log(`Canonical: ${summary[k].canonical}`);
  console.log(`Schema Count: ${summary[k].schemaCount} (${JSON.stringify(summary[k].schemasPreview)})`);
  console.log(`Headings (${summary[k].headingsCount}):`, summary[k].headingsSample.slice(0, 6));
}
