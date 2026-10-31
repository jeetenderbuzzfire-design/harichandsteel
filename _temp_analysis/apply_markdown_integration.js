const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update db.js
const dbJsPath = path.join(rootDir, 'db.js');
let dbJs = fs.readFileSync(dbJsPath, 'utf8').replace(/\r\n/g, '\n');

// Add markdownSync require at top if not present
if (!dbJs.includes("const markdownSync = require('./markdown-sync.js')") && !dbJs.includes("let markdownSync")) {
  dbJs = dbJs.replace(
    "const { Pool } = require('pg');",
    "const { Pool } = require('pg');\n\nlet markdownSync = null;\ntry {\n  markdownSync = require('./markdown-sync.js');\n} catch (_) {}"
  );
}

// In saveProduct before return product
if (!dbJs.includes('markdownSync.generateProductMarkdown(product)')) {
  dbJs = dbJs.replace(
    'return product;\n  },',
    'if (markdownSync && typeof markdownSync.generateProductMarkdown === "function") {\n      try { markdownSync.generateProductMarkdown(product); } catch (_) {}\n    }\n    return product;\n  },'
  );
}

// In deleteProduct before return true
if (!dbJs.includes('markdownSync.deleteProductMarkdown(idOrSlug)')) {
  dbJs = dbJs.replace(
    'return true;\n  },\n\n  // --- BLOGS ---',
    'if (markdownSync && typeof markdownSync.deleteProductMarkdown === "function") {\n      try { markdownSync.deleteProductMarkdown(idOrSlug); } catch (_) {}\n    }\n    return true;\n  },\n\n  // --- BLOGS ---'
  );
}

// In saveBlog before return blog
if (!dbJs.includes('markdownSync.generateBlogMarkdown(blog)')) {
  dbJs = dbJs.replace(
    'return blog;\n  },',
    'if (markdownSync && typeof markdownSync.generateBlogMarkdown === "function") {\n      try { markdownSync.generateBlogMarkdown(blog); } catch (_) {}\n    }\n    return blog;\n  },'
  );
}

// In deleteBlog before return true
if (!dbJs.includes('markdownSync.deleteBlogMarkdown(idOrSlug)')) {
  dbJs = dbJs.replace(
    'return true;\n  },\n\n  // --- INQUIRIES ---',
    'if (markdownSync && typeof markdownSync.deleteBlogMarkdown === "function") {\n      try { markdownSync.deleteBlogMarkdown(idOrSlug); } catch (_) {}\n    }\n    return true;\n  },\n\n  // --- INQUIRIES ---'
  );
}

fs.writeFileSync(dbJsPath, dbJs.replace(/\n/g, '\r\n'), 'utf8');
console.log('✓ db.js updated with automatic markdown hooks.');

// 2. Update server.js
const serverJsPath = path.join(rootDir, 'server.js');
let serverJs = fs.readFileSync(serverJsPath, 'utf8').replace(/\r\n/g, '\n');

// Add markdownSync require at top if not present
if (!serverJs.includes("const markdownSync = require('./markdown-sync.js')")) {
  serverJs = serverJs.replace(
    "const db = require('./db.js');",
    "const db = require('./db.js');\nconst markdownSync = require('./markdown-sync.js');"
  );
}

// Add /api/markdown/sync endpoint
if (!serverJs.includes('/api/markdown/sync')) {
  const syncEndpoint = `  // --- /api/markdown/sync ---
  if (pathname === '/api/markdown/sync') {
    if (!isAuthorized(req)) {
      return sendJson(res, 401, { error: 'Unauthorized: Valid x-admin-key or Bearer token required' });
    }
    try {
      const summary = markdownSync.syncAll();
      sendJson(res, 200, { success: true, message: 'All markdown files synchronized successfully', summary });
    } catch (e) {
      sendJson(res, 500, { error: 'Failed to sync markdown files: ' + e.message });
    }
    return;
  }

`;
  serverJs = serverJs.replace('  // --- /api/products ---', syncEndpoint + '  // --- /api/products ---');
}

// In /api/products POST / PUT, ensure markdown generation
if (!serverJs.includes('markdownSync.generateProductMarkdown(item)')) {
  serverJs = serverJs.replace(
    "if (db && typeof db.saveProduct === 'function') {\n              try { await db.saveProduct(item); } catch (_) { }\n            }",
    "if (db && typeof db.saveProduct === 'function') {\n              try { await db.saveProduct(item); } catch (_) { }\n            }\n            try { markdownSync.generateProductMarkdown(item); } catch (_) { }"
  );
  serverJs = serverJs.replace(
    "if (db && typeof db.saveProduct === 'function') {\n            try { await db.saveProduct(item); } catch (_) { }\n          }",
    "if (db && typeof db.saveProduct === 'function') {\n            try { await db.saveProduct(item); } catch (_) { }\n          }\n          try { markdownSync.generateProductMarkdown(item); } catch (_) { }"
  );
}

// In /api/products DELETE
if (!serverJs.includes('markdownSync.deleteProductMarkdown(id)')) {
  serverJs = serverJs.replace(
    "await db.deleteProduct(id);",
    "await db.deleteProduct(id);\n          try { markdownSync.deleteProductMarkdown(id); } catch (_) { }"
  );
}

// In /api/blogs POST / PUT
if (!serverJs.includes('markdownSync.generateBlogMarkdown(item)')) {
  serverJs = serverJs.replace(
    "await db.saveBlog(item);",
    "await db.saveBlog(item);\n            try { markdownSync.generateBlogMarkdown(item); } catch (_) { }"
  );
  serverJs = serverJs.replace(
    "const saved = await db.saveBlog(data);",
    "const saved = await db.saveBlog(data);\n          try { markdownSync.generateBlogMarkdown(saved || data); } catch (_) { }"
  );
}

// In /api/blogs DELETE
if (!serverJs.includes('markdownSync.deleteBlogMarkdown(id)')) {
  serverJs = serverJs.replace(
    "await db.deleteBlog(id);",
    "await db.deleteBlog(id);\n          try { markdownSync.deleteBlogMarkdown(id); } catch (_) { }"
  );
}

// In server.listen, add Markdown Sync startup notice
if (!serverJs.includes('Markdown Content:')) {
  serverJs = serverJs.replace(
    "console.log('----------------------------------------------------------------');\n  const dbHost",
    "try {\n    const mdSummary = markdownSync.syncAll();\n    console.log(` > Markdown Content: ${mdSummary.pages.length} Pages, ${mdSummary.products.length} Products, ${mdSummary.blogs.length} Blogs`);\n  } catch (_) {}\n  console.log('----------------------------------------------------------------');\n  const dbHost"
  );
}

fs.writeFileSync(serverJsPath, serverJs.replace(/\n/g, '\r\n'), 'utf8');
console.log('✓ server.js updated with automatic markdown routes and hooks.');
