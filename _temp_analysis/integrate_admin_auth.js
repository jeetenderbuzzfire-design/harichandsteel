const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Update admin/index.html to add topbar logout button
const adminHtmlPath = path.join(rootDir, 'admin', 'index.html');
let adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');

const targetTopbarAction = `<a href="/product.html" target="_blank" class="admin-btn admin-btn-outline" title="Preview Public Products Page">
          <i class="fas fa-eye"></i>
        </a>`;

const topbarLogoutHtml = `<a href="/product.html" target="_blank" class="admin-btn admin-btn-outline" title="Preview Public Products Page">
          <i class="fas fa-eye"></i>
        </a>
        <button type="button" class="admin-btn admin-btn-outline" id="topbarLogoutBtn" title="Logout of Admin Panel" style="display: inline-flex; align-items: center; gap: 6px; color: #f87171; border-color: rgba(239, 68, 68, 0.35); font-weight: 600;">
          <i class="fas fa-power-off"></i>
          <span>Logout</span>
        </button>`;

if (adminHtml.includes(targetTopbarAction) && !adminHtml.includes('id="topbarLogoutBtn"')) {
  adminHtml = adminHtml.replace(targetTopbarAction, topbarLogoutHtml);
  fs.writeFileSync(adminHtmlPath, adminHtml, 'utf8');
  console.log('Added topbar logout button to admin/index.html');
} else {
  console.log('Topbar logout button already present or target not found');
}

// 2. Update admin/js/admin.js with Auth Guard & Logout Event Listeners
const adminJsPath = path.join(rootDir, 'admin', 'js', 'admin.js');
let adminJs = fs.readFileSync(adminJsPath, 'utf8');

const authGuardCode = `  // 0. Authentication Guard & Session Verification
  async function checkAdminAuth() {
    try {
      const sessionKey = localStorage.getItem('hs_admin_session') || localStorage.getItem('hs_admin_api_key');
      const res = await fetch('/api/admin/check-auth', {
        headers: sessionKey ? { 'Authorization': 'Bearer ' + sessionKey, 'x-admin-key': sessionKey } : {}
      });
      const data = await res.json();
      if (!data.authenticated) {
        localStorage.removeItem('hs_admin_session');
        localStorage.removeItem('hs_admin_api_key');
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = '/admin/login?redirect=' + encodeURIComponent(currentPath);
        return false;
      }
      if (data.username) {
        const nameElem = document.querySelector('.user-name');
        if (nameElem) nameElem.textContent = data.username;
      }
      return true;
    } catch (e) {
      return true;
    }
  }
  checkAdminAuth();

  // Logout Handlers
  async function handleAdminLogout(e) {
    if (e) e.preventDefault();
    if (confirm('Are you sure you want to log out of the admin panel?')) {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
      } catch (_) {}
      localStorage.removeItem('hs_admin_session');
      localStorage.removeItem('hs_admin_api_key');
      window.location.href = '/admin/login';
    }
  }

  const btnLogoutSidebar = document.getElementById('btnAdminLogout');
  if (btnLogoutSidebar) {
    btnLogoutSidebar.addEventListener('click', handleAdminLogout);
  }

  const btnLogoutTopbar = document.getElementById('topbarLogoutBtn');
  if (btnLogoutTopbar) {
    btnLogoutTopbar.addEventListener('click', handleAdminLogout);
  }

  // --- End Auth Integration ---
`;

const domReadyHook = `document.addEventListener('DOMContentLoaded', function () {`;

if (!adminJs.includes('checkAdminAuth()') && adminJs.includes(domReadyHook)) {
  adminJs = adminJs.replace(domReadyHook, domReadyHook + '\n' + authGuardCode);
  fs.writeFileSync(adminJsPath, adminJs, 'utf8');
  console.log('Added checkAdminAuth and logout handling to admin/js/admin.js');
} else {
  console.log('Auth guard already in admin.js or hook not found');
}

console.log('Admin integration completed!');
