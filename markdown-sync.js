/**
 * HARICHAND STEEL - Automatic Markdown (.md) Content Synchronizer
 * 
 * Automatically generates and maintains Markdown files for:
 * 1. Site Pages: content/pages/*.md and root *.md
 * 2. Products: content/products/*.md (auto-generated on new product creation / updates)
 * 3. Blogs / News: content/blogs/*.md (auto-generated on new blog creation / updates)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const PAGES_DIR = path.join(CONTENT_DIR, 'pages');
const PRODUCTS_DIR = path.join(CONTENT_DIR, 'products');
const BLOGS_DIR = path.join(CONTENT_DIR, 'blogs');

// Ensure content directories exist
function ensureDirs() {
  [CONTENT_DIR, PAGES_DIR, PRODUCTS_DIR, BLOGS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}
ensureDirs();

// Helper to convert arbitrary string into safe URL / filename slug
function slugify(text) {
  if (!text) return 'item-' + Date.now();
  return String(text)
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/\.html$/i, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item-' + Date.now();
}

// Helper to clean HTML into markdown text
function htmlToMarkdown(html) {
  if (!html) return '';
  let md = html;

  // Remove script and style tags
  md = md.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  md = md.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n');
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n');

  // Bold / Italic
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');

  // Lists
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<\/?(?:ul|ol)[^>]*>/gi, '\n');

  // Paragraphs and breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');

  // Links
  md = md.replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Images
  md = md.replace(/<img\b[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  md = md.replace(/<img\b[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/gi, '![$1]($2)');
  md = md.replace(/<img\b[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n');

  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode common HTML entities
  md = md.replace(/&amp;/g, '&')
         .replace(/&lt;/g, '<')
         .replace(/&gt;/g, '>')
         .replace(/&quot;/g, '"')
         .replace(/&#039;/g, "'")
         .replace(/&bull;/g, '•')
         .replace(/&nbsp;/g, ' ');

  // Normalize multi-newlines and spaces
  md = md.replace(/\r\n/g, '\n')
         .replace(/\n{3,}/g, '\n\n')
         .trim();

  return md;
}

// ============================================================================
// 1. PRODUCT MARKDOWN GENERATOR
// ============================================================================
function generateProductMarkdown(product) {
  if (!product) return null;
  ensureDirs();

  const title = product.title || product.name || 'Custom Gate Product';
  const slug = product.slug || slugify(title);
  const category = product.category || 'aluminum-profile-gate';
  const categoryName = product.categoryName || product.category_display || category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const badge = product.badge || 'Premium';
  const price = product.price || 'On Request';
  const image = product.image || 'images/prod-1.png';
  const desc = product.description || '';
  const specs = Array.isArray(product.specs) ? product.specs : [];
  const outerFrame = product.outerFrame || product.outer_frame || 'Heavy-duty extruded alloy profile';
  const innerFrame = product.innerFrame || product.inner_frame || 'Interlocking reinforced structural cross-members';
  const usage = product.usage || 'Residential entrances, luxury villas, bungalows, and commercial properties';
  const finish = product.finish || 'Architectural grade powder coated or high-gloss weather-resistant painted';
  const hardware = product.hardware || 'SS304 stainless steel ball bearing hinges & concealed locks';
  const automation = product.automation || 'Compatible with remote motorized automated swing & sliding operators';
  const featured = Boolean(product.featured);
  const createdAt = product.createdAt || product.created_at || new Date().toISOString().split('T')[0];

  const frontmatter = [
    '---',
    `id: "${product.id || slug}"`,
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `category: "${category}"`,
    `categoryName: "${categoryName.replace(/"/g, '\\"')}"`,
    `badge: "${badge.replace(/"/g, '\\"')}"`,
    `price: "${price}"`,
    `image: "${image}"`,
    `featured: ${featured}`,
    `createdAt: "${createdAt}"`,
    `updatedAt: "${new Date().toISOString().split('T')[0]}"`,
    'specs:',
    ...specs.map(s => `  - "${String(s).replace(/"/g, '\\"')}"`),
    '---'
  ].join('\n');

  const content = `

# ${title}

${desc}

## Product Highlights
- **Product Category:** [${categoryName}](/product-category/${category}/)
- **Quality Grade Badge:** ${badge}
- **Price Range:** ${price}
- **Primary Image:** ![](${image})
- **Catalogue URL:** [/product/${slug}](/product/${slug})

## Key Specifications & Engineering
- **Outer Frame Construction:** ${outerFrame}
- **Inner Frame & Cross Members:** ${innerFrame}
- **Recommended Usage:** ${usage}
- **Surface Finish & Weatherproofing:** ${finish}
- **Hardware & Bearing Setup:** ${hardware}
- **Motor Automation Compatibility:** ${automation}

${specs.length ? `## Core Features\n${specs.map(s => `- ${s}`).join('\n')}\n` : ''}
## Custom Sizing & Fabrication
Harichand Steel fabricates every gate strictly tailored to opening dimensions:
- Doorstep site visit & precise measurement across Delhi & Delhi NCR.
- Genuine certified SS304 grade steel & architectural aluminium extrusions.
- Smart biometric lock & Italian motorized opener integration options.

## Direct Inquiries
- **WhatsApp Direct:** [Chat on WhatsApp](https://wa.me/919870433868?text=${encodeURIComponent('Enquiry regarding ' + title)})
- **Phone Call:** [+91 98704 33868](tel:+919870433868)
- **Official Email:** [Admin@HARICHANDSTEEL.COM](mailto:Admin@HARICHANDSTEEL.COM)
- **Workshop Address:** 27B, Street, New Jankipuri, Anup Nagar, Uttam Nagar, Bindapur, New Delhi, Delhi, 110059
`;

  const fullMd = frontmatter + '\n' + content.trim() + '\n';
  const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, fullMd, 'utf8');

  return { filePath, slug, title };
}

// Delete product markdown
function deleteProductMarkdown(idOrSlug) {
  if (!idOrSlug) return false;
  ensureDirs();
  const slug = slugify(idOrSlug);
  const target1 = path.join(PRODUCTS_DIR, `${slug}.md`);
  if (fs.existsSync(target1)) {
    try { fs.unlinkSync(target1); return true; } catch (_) {}
  }
  // Try matching by id inside files
  const files = fs.readdirSync(PRODUCTS_DIR);
  for (const file of files) {
    if (file.endsWith('.md')) {
      const p = path.join(PRODUCTS_DIR, file);
      const text = fs.readFileSync(p, 'utf8');
      if (text.includes(`id: "${idOrSlug}"`)) {
        try { fs.unlinkSync(p); return true; } catch (_) {}
      }
    }
  }
  return false;
}

// ============================================================================
// 2. BLOG / NEWS MARKDOWN GENERATOR
// ============================================================================
function generateBlogMarkdown(blog) {
  if (!blog) return null;
  ensureDirs();

  const title = blog.title || 'Untitled Blog Post';
  let slug = blog.slug || slugify(title);
  slug = slugify(slug);
  const tag = blog.tag || 'News & Insights';
  const author = blog.author || 'Harichand Steel Team';
  const date = blog.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const image = blog.image || 'images/about-3.jpg';
  const excerpt = blog.excerpt || '';
  const rawContent = blog.content || '';
  const cleanBody = htmlToMarkdown(rawContent);
  const published = blog.published !== false;

  const frontmatter = [
    '---',
    `id: "${blog.id || slug}"`,
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `tag: "${tag.replace(/"/g, '\\"')}"`,
    `author: "${author.replace(/"/g, '\\"')}"`,
    `date: "${date}"`,
    `image: "${image}"`,
    `excerpt: "${excerpt.replace(/"/g, '\\"')}"`,
    `published: ${published}`,
    `updatedAt: "${new Date().toISOString().split('T')[0]}"`,
    '---'
  ].join('\n');

  const content = `

# ${title}

*Published on: **${date}** | Author: **${author}** | Category: **${tag}***

${image ? `![](${image})\n` : ''}
${excerpt ? `> **Summary:** ${excerpt}\n` : ''}
## Article Content

${cleanBody || excerpt || 'Detailed guide by Harichand Steel.'}

---

## About Harichand Steel
Harichand Steel (Established 2004) is recognized for quality craftsmanship and reliable service in manufacturing aluminium profile gates, stainless steel main gates, and custom architectural solutions across Delhi NCR.

- **Contact Phone:** [+91 98704 33868](tel:+919870433868)
- **WhatsApp Quote:** [Chat on WhatsApp](https://wa.me/919870433868?text=${encodeURIComponent('Enquiry regarding blog: ' + title)})
- **Factory Address:** 27B, Street, New Jankipuri, Anup Nagar, Uttam Nagar, Bindapur, New Delhi, Delhi, 110059
`;

  const fullMd = frontmatter + '\n' + content.trim() + '\n';
  const filePath = path.join(BLOGS_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, fullMd, 'utf8');

  return { filePath, slug, title };
}

// Delete blog markdown
function deleteBlogMarkdown(idOrSlug) {
  if (!idOrSlug) return false;
  ensureDirs();
  const slug = slugify(idOrSlug);
  const target = path.join(BLOGS_DIR, `${slug}.md`);
  if (fs.existsSync(target)) {
    try { fs.unlinkSync(target); return true; } catch (_) {}
  }
  const files = fs.readdirSync(BLOGS_DIR);
  for (const file of files) {
    if (file.endsWith('.md')) {
      const p = path.join(BLOGS_DIR, file);
      const text = fs.readFileSync(p, 'utf8');
      if (text.includes(`id: "${idOrSlug}"`)) {
        try { fs.unlinkSync(p); return true; } catch (_) {}
      }
    }
  }
  return false;
}

// ============================================================================
// 3. SITE PAGES MARKDOWN GENERATOR
// ============================================================================
function generatePageMarkdown(htmlFileName) {
  const baseName = path.basename(htmlFileName, '.html');
  const htmlPath = path.join(ROOT_DIR, `${baseName}.html`);

  if (!fs.existsSync(htmlPath)) return null;
  ensureDirs();

  const html = fs.readFileSync(htmlPath, 'utf8');

  // Extract meta tags
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : `${baseName.replace(/-/g, ' ').toUpperCase()} - HARICHAND STEEL`;

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([\s\S]*?)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : `/${baseName}.html`;

  // Extract main content area (strip header, footer, scripts)
  let mainBody = html;
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    mainBody = mainMatch[1];
  } else {
    // Strip header and footer
    mainBody = mainBody.replace(/<header\b[\s\S]*?<\/header>/gi, '');
    mainBody = mainBody.replace(/<footer\b[\s\S]*?<\/footer>/gi, '');
  }

  const cleanMd = htmlToMarkdown(mainBody);

  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `url: "/${baseName === 'index' ? '' : baseName + '/'}"`,
    `canonical: "https://harichandsteel.com/${baseName === 'index' ? '' : baseName + '/'}"`,
    `layout: "page"`,
    `updatedAt: "${new Date().toISOString().split('T')[0]}"`,
    '---'
  ].join('\n');

  const fullMd = `${frontmatter}\n\n# ${title.replace(/\s*-\s*HARICHAND STEEL\s*$/i, '')}\n\n${description ? `> ${description}\n\n` : ''}${cleanMd}\n`;

  // Save in content/pages/${baseName}.md
  const contentPagePath = path.join(PAGES_DIR, `${baseName}.md`);
  fs.writeFileSync(contentPagePath, fullMd, 'utf8');

  // Also save in root as ${baseName}.md (e.g. about-us.md, contact.md, etc.)
  // Except README.md so we don't overwrite repository README
  if (baseName.toLowerCase() !== 'readme') {
    const rootPagePath = path.join(ROOT_DIR, `${baseName}.md`);
    fs.writeFileSync(rootPagePath, fullMd, 'utf8');
  }

  return { contentPagePath, baseName, title };
}

// ============================================================================
// 4. BATCH SYNC ALL (Pages, Products, Blogs)
// ============================================================================
function syncAll() {
  ensureDirs();
  const summary = {
    pages: [],
    products: [],
    blogs: []
  };

  // 1. Sync All HTML Pages in ROOT_DIR
  const rootFiles = fs.readdirSync(ROOT_DIR);
  const htmlFiles = rootFiles.filter(f => f.endsWith('.html') && !f.startsWith('_') && f !== 'site_raw.html' && f !== 'wpcode_extracted.html');
  for (const file of htmlFiles) {
    const res = generatePageMarkdown(file);
    if (res) summary.pages.push(res.baseName);
  }

  // 2. Sync All Products from data/products.json
  const productsJsonPath = path.join(ROOT_DIR, 'data', 'products.json');
  if (fs.existsSync(productsJsonPath)) {
    try {
      const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
      if (Array.isArray(products)) {
        for (const prod of products) {
          const res = generateProductMarkdown(prod);
          if (res) summary.products.push(res.slug);
        }
      }
    } catch (e) {
      console.error('Error reading products.json during sync:', e.message);
    }
  }

  // 3. Sync All Blogs from data/blogs.json
  const blogsJsonPath = path.join(ROOT_DIR, 'data', 'blogs.json');
  if (fs.existsSync(blogsJsonPath)) {
    try {
      const blogs = JSON.parse(fs.readFileSync(blogsJsonPath, 'utf8'));
      if (Array.isArray(blogs)) {
        for (const blog of blogs) {
          const res = generateBlogMarkdown(blog);
          if (res) summary.blogs.push(res.slug);
        }
      }
    } catch (e) {
      console.error('Error reading blogs.json during sync:', e.message);
    }
  }

  return summary;
}

module.exports = {
  generateProductMarkdown,
  deleteProductMarkdown,
  generateBlogMarkdown,
  deleteBlogMarkdown,
  generatePageMarkdown,
  syncAll,
  CONTENT_DIR,
  PAGES_DIR,
  PRODUCTS_DIR,
  BLOGS_DIR
};

// If run directly via CLI (node markdown-sync.js)
if (require.main === module) {
  console.log('Synchronizing all markdown files for Harichand Steel...');
  const summary = syncAll();
  console.log(`✓ Synchronized ${summary.pages.length} Pages:`, summary.pages.join(', '));
  console.log(`✓ Synchronized ${summary.products.length} Products`);
  console.log(`✓ Synchronized ${summary.blogs.length} Blogs`);
}
