const fs = require('fs');
const path = require('path');

const newsHtml = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages/news.html', 'utf8');
const sitemapHtml = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/_raw_pages/sitemap.html', 'utf8');

// Find links in news
const linkRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
let m;
const newsLinks = [];
while ((m = linkRegex.exec(newsHtml)) !== null) {
  let t = m[2].replace(/<[^>]+>/g, '').trim();
  if (t && !t.includes('Home') && !t.includes('Contact') && !t.includes('Products')) {
    newsLinks.push({ href: m[1], text: t });
  }
}
console.log('=== NEWS CONTENT CHUNK ===');
const mainNews = newsHtml.match(/<main[\s\S]*?<\/main>/i) || newsHtml.match(/<div id=["']primary["'][\s\S]*?<\/div>/i);
if (mainNews) {
  console.log(mainNews[0].replace(/<svg[\s\S]*?<\/svg>/g, '').slice(0, 3000));
}

console.log('\n=== SITEMAP CONTENT CHUNK ===');
const mainSitemap = sitemapHtml.match(/<main[\s\S]*?<\/main>/i) || sitemapHtml.match(/<div class=["']entry-content["'][\s\S]*?<\/div>/i);
if (mainSitemap) {
  console.log(mainSitemap[0].replace(/<svg[\s\S]*?<\/svg>/g, '').slice(0, 3000));
}
