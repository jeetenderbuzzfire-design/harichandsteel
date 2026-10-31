const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Update server.js
const serverJsPath = path.join(rootDir, 'server.js');
let serverJs = fs.readFileSync(serverJsPath, 'utf8');

// Replace top-level admin credentials with getAdminCredentials helper
const oldCredsHook = `const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Harichand@2026';`;

const newCredsHook = `const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'buzzspire.info@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Harichand@2004';

// Helper to dynamically read admin credentials from .env or memory on every request
function getAdminCredentials() {
  try {
    const envPath = path.join(ROOT_DIR, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split(/\\r?\\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
        const [k, ...v] = trimmed.split('=');
        const key = k.trim();
        const val = v.join('=').trim().replace(/^['"](.*)['"]$/, '$1');
        if (key === 'ADMIN_USERNAME') process.env.ADMIN_USERNAME = val;
        if (key === 'ADMIN_PASSWORD') process.env.ADMIN_PASSWORD = val;
      }
    }
  } catch (_) {}

  return {
    username: (process.env.ADMIN_USERNAME || 'buzzspire.info@gmail.com').trim(),
    password: (process.env.ADMIN_PASSWORD || 'Harichand@2004').trim()
  };
}`;

if (serverJs.includes(oldCredsHook)) {
  serverJs = serverJs.replace(oldCredsHook, newCredsHook);
  console.log('Added getAdminCredentials helper to server.js');
}

// Update login validation endpoint to use getAdminCredentials and case-insensitive username comparison
const oldLoginValidateRegex = /const user = \(data\.username \|\| ''\)\.trim\(\);\r?\n\s*const pass = \(data\.password \|\| ''\)\.trim\(\);\r?\n\s*const validUser = \(process\.env\.ADMIN_USERNAME \|\| 'admin'\)\.trim\(\);\r?\n\s*const validPass = \(process\.env\.ADMIN_PASSWORD \|\| 'Harichand@2026'\)\.trim\(\);\r?\n\s*if \(user === validUser && pass === validPass\)/;

const newLoginValidateBlock = `const user = (data.username || '').trim();
      const pass = (data.password || '').trim();
      const creds = getAdminCredentials();

      if (user.toLowerCase() === creds.username.toLowerCase() && pass === creds.password)`;

if (oldLoginValidateRegex.test(serverJs)) {
  serverJs = serverJs.replace(oldLoginValidateRegex, newLoginValidateBlock);
  console.log('Updated login validation logic in server.js');
} else {
  console.log('Could not match oldLoginValidateRegex, checking fallback');
}

fs.writeFileSync(serverJsPath, serverJs, 'utf8');
console.log('server.js saved!');

// 2. Update admin/login.html placeholder and autocapitalize
const loginHtmlPath = path.join(rootDir, 'admin', 'login.html');
let loginHtml = fs.readFileSync(loginHtmlPath, 'utf8');

loginHtml = loginHtml.replace(
  '<label for="adminUsername" class="form-label">Admin Username</label>',
  '<label for="adminUsername" class="form-label">Admin Email / Username</label>'
).replace(
  'placeholder="Enter your username"',
  'placeholder="buzzspire.info@gmail.com" autocapitalize="none" autocorrect="off" spellcheck="false"'
);

fs.writeFileSync(loginHtmlPath, loginHtml, 'utf8');
console.log('admin/login.html saved!');
