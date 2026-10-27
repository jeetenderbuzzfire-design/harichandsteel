/**
 * HARICHAND STEEL - PostgreSQL Database Connector
 * Connects to Supabase PostgreSQL or falls back to local data/ JSON files
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let pool = null;
let isConnected = false;
let dbStatusMessage = 'Initializing...';

const dbUrl = process.env.DATABASE_URL || '';
const hasPlaceholderPassword = !dbUrl || dbUrl.includes('[YOUR-PASSWORD]') || dbUrl.includes('YOUR_ACTUAL_DB_PASSWORD');

// ==========================================
// FILE FALLBACK HELPERS
// ==========================================
function readJsonFile(filePath, defaultVal = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
  }
  return defaultVal;
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e.message);
  }
}

// ==========================================
// DATABASE INITIALIZATION & MIGRATIONS
// ==========================================
async function initDatabase() {
  if (hasPlaceholderPassword) {
    isConnected = false;
    dbStatusMessage = 'Awaiting Supabase DB Password in .env file';
    console.log('----------------------------------------------------------------');
    console.log(' [Database Notice] Supabase connection string detected.');
    console.log(' Please replace [YOUR-PASSWORD] with your actual Supabase');
    console.log(' database password in .env to connect live PostgreSQL.');
    console.log(' System currently running in offline local JSON data mode.');
    console.log('----------------------------------------------------------------');
    return;
  }

  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });

    // Test connection
    const client = await pool.connect();
    console.log('----------------------------------------------------------------');
    console.log(' [Database Connected] Successfully connected to Supabase PostgreSQL!');
    console.log(' Host: db.uxazybwdglgvmnmjetoy.supabase.co');
    console.log('----------------------------------------------------------------');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(64) PRIMARY KEY,
        title TEXT NOT NULL,
        category VARCHAR(64) NOT NULL,
        category_name VARCHAR(128),
        badge VARCHAR(64),
        price VARCHAR(64),
        image TEXT,
        description TEXT,
        specs JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(64) PRIMARY KEY,
        title TEXT NOT NULL,
        slug VARCHAR(255) NOT NULL,
        tag VARCHAR(128),
        author VARCHAR(128),
        date VARCHAR(64),
        image TEXT,
        excerpt TEXT,
        content TEXT,
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(64),
        email VARCHAR(255),
        requirement TEXT,
        message TEXT,
        timestamp VARCHAR(64),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Check if products table is empty, seed if needed
    const prodCountRes = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(prodCountRes.rows[0].count, 10) === 0) {
      console.log(' Seeding default products into Supabase PostgreSQL...');
      const seedProducts = readJsonFile(PRODUCTS_FILE, []);
      for (const p of seedProducts) {
        await client.query(`
          INSERT INTO products (id, title, category, category_name, badge, price, image, description, specs, featured, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING
        `, [
          p.id, p.title, p.category, p.categoryName || p.category,
          p.badge || 'Standard', p.price || 'On Request', p.image || 'images/prod-1.png',
          p.description || '', JSON.stringify(p.specs || []), !!p.featured,
          p.createdAt || new Date()
        ]);
      }
      console.log(` Successfully seeded ${seedProducts.length} products into Supabase!`);
    }

    // Check if blogs table is empty, seed if needed
    const blogCountRes = await client.query('SELECT COUNT(*) FROM blogs');
    if (parseInt(blogCountRes.rows[0].count, 10) === 0) {
      console.log(' Seeding default blog articles into Supabase PostgreSQL...');
      const seedBlogs = readJsonFile(BLOGS_FILE, []);
      for (const b of seedBlogs) {
        await client.query(`
          INSERT INTO blogs (id, title, slug, tag, author, date, image, excerpt, content, published)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING
        `, [
          b.id, b.title, b.slug || 'news.html', b.tag || 'Guide',
          b.author || 'Harichand Steel Team', b.date || '', b.image || 'images/about-3.jpg',
          b.excerpt || '', b.content || '', b.published !== false
        ]);
      }
      console.log(` Successfully seeded ${seedBlogs.length} articles into Supabase!`);
    }

    client.release();
    isConnected = true;
    dbStatusMessage = 'Connected to Supabase PostgreSQL';
  } catch (err) {
    isConnected = false;
    dbStatusMessage = `PostgreSQL Connection Failed: ${err.message}. Using local file fallback.`;
    console.error(' [Database Error] Could not connect to Supabase PostgreSQL:', err.message);
    console.log(' [Fallback] Continuing in local JSON storage mode.');
  }
}

// Kick off initialization
initDatabase();

// ==========================================
// CRUD REPOSITORY
// ==========================================
module.exports = {
  getStatus: function () {
    return {
      connected: isConnected,
      message: dbStatusMessage,
      hasPlaceholder: hasPlaceholderPassword,
      provider: isConnected ? 'Supabase PostgreSQL' : 'Local JSON'
    };
  },

  // --- PRODUCTS ---
  getProducts: async function () {
    if (isConnected && pool) {
      try {
        const res = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        return res.rows.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category,
          categoryName: r.category_name,
          badge: r.badge,
          price: r.price,
          image: r.image,
          description: r.description,
          specs: typeof r.specs === 'string' ? JSON.parse(r.specs) : (r.specs || []),
          featured: r.featured,
          createdAt: r.created_at ? r.created_at.toISOString().split('T')[0] : ''
        }));
      } catch (err) {
        console.error('getProducts SQL error:', err.message);
      }
    }
    return readJsonFile(PRODUCTS_FILE, []);
  },

  saveProduct: async function (product) {
    if (!product.id) {
      product.id = 'prod-' + Date.now();
      product.createdAt = new Date().toISOString().split('T')[0];
    }

    // Save to local file backup
    const localList = readJsonFile(PRODUCTS_FILE, []);
    const idx = localList.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      localList[idx] = { ...localList[idx], ...product };
    } else {
      localList.unshift(product);
    }
    writeJsonFile(PRODUCTS_FILE, localList);

    // Save to PostgreSQL if connected
    if (isConnected && pool) {
      try {
        await pool.query(`
          INSERT INTO products (id, title, category, category_name, badge, price, image, description, specs, featured, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            category_name = EXCLUDED.category_name,
            badge = EXCLUDED.badge,
            price = EXCLUDED.price,
            image = EXCLUDED.image,
            description = EXCLUDED.description,
            specs = EXCLUDED.specs,
            featured = EXCLUDED.featured,
            updated_at = NOW()
        `, [
          product.id,
          product.title,
          product.category,
          product.categoryName || product.category,
          product.badge || 'Standard',
          product.price || 'On Request',
          product.image || 'images/prod-1.png',
          product.description || '',
          JSON.stringify(product.specs || []),
          !!product.featured
        ]);
      } catch (err) {
        console.error('saveProduct SQL error:', err.message);
      }
    }

    return product;
  },

  deleteProduct: async function (id) {
    // Delete from local file
    let localList = readJsonFile(PRODUCTS_FILE, []);
    localList = localList.filter(p => p.id !== id);
    writeJsonFile(PRODUCTS_FILE, localList);

    // Delete from PostgreSQL
    if (isConnected && pool) {
      try {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
      } catch (err) {
        console.error('deleteProduct SQL error:', err.message);
      }
    }
    return true;
  },

  // --- BLOGS ---
  getBlogs: async function () {
    if (isConnected && pool) {
      try {
        const res = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
        return res.rows.map(r => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          tag: r.tag,
          author: r.author,
          date: r.date,
          image: r.image,
          excerpt: r.excerpt,
          content: r.content,
          published: r.published
        }));
      } catch (err) {
        console.error('getBlogs SQL error:', err.message);
      }
    }
    return readJsonFile(BLOGS_FILE, []);
  },

  saveBlog: async function (blog) {
    if (!blog.id) {
      blog.id = 'blog-' + Date.now();
      blog.date = blog.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    // Save to local file backup
    const localList = readJsonFile(BLOGS_FILE, []);
    const idx = localList.findIndex(b => b.id === blog.id);
    if (idx !== -1) {
      localList[idx] = { ...localList[idx], ...blog };
    } else {
      localList.unshift(blog);
    }
    writeJsonFile(BLOGS_FILE, localList);

    // Save to PostgreSQL if connected
    if (isConnected && pool) {
      try {
        await pool.query(`
          INSERT INTO blogs (id, title, slug, tag, author, date, image, excerpt, content, published)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            slug = EXCLUDED.slug,
            tag = EXCLUDED.tag,
            author = EXCLUDED.author,
            date = EXCLUDED.date,
            image = EXCLUDED.image,
            excerpt = EXCLUDED.excerpt,
            content = EXCLUDED.content,
            published = EXCLUDED.published
        `, [
          blog.id,
          blog.title,
          blog.slug || 'news.html',
          blog.tag || 'Guide',
          blog.author || 'Harichand Steel Team',
          blog.date || '',
          blog.image || 'images/about-3.jpg',
          blog.excerpt || '',
          blog.content || '',
          blog.published !== false
        ]);
      } catch (err) {
        console.error('saveBlog SQL error:', err.message);
      }
    }

    return blog;
  },

  deleteBlog: async function (id) {
    let localList = readJsonFile(BLOGS_FILE, []);
    localList = localList.filter(b => b.id !== id);
    writeJsonFile(BLOGS_FILE, localList);

    if (isConnected && pool) {
      try {
        await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
      } catch (err) {
        console.error('deleteBlog SQL error:', err.message);
      }
    }
    return true;
  },

  // --- INQUIRIES ---
  getInquiries: async function () {
    if (isConnected && pool) {
      try {
        const res = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
        return res.rows.map(r => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          requirement: r.requirement,
          message: r.message,
          timestamp: r.timestamp
        }));
      } catch (err) {
        console.error('getInquiries SQL error:', err.message);
      }
    }
    return readJsonFile(INQUIRIES_FILE, []);
  },

  saveInquiry: async function (inq) {
    if (!inq.id) {
      inq.id = 'inq-' + Date.now();
      inq.timestamp = inq.timestamp || new Date().toLocaleString();
    }

    const localList = readJsonFile(INQUIRIES_FILE, []);
    localList.unshift(inq);
    writeJsonFile(INQUIRIES_FILE, localList);

    if (isConnected && pool) {
      try {
        await pool.query(`
          INSERT INTO inquiries (id, name, phone, email, requirement, message, timestamp)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          inq.id,
          inq.name || '',
          inq.phone || '',
          inq.email || '',
          inq.requirement || '',
          inq.message || '',
          inq.timestamp || ''
        ]);
      } catch (err) {
        console.error('saveInquiry SQL error:', err.message);
      }
    }

    return inq;
  }
};
