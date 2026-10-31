const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.join(__dirname, '..', 'admin', 'index.html');
let adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');

const regex = /(<a href="\/product\.html" target="_blank" class="admin-btn admin-btn-outline" title="Preview Public Products Page">\s*<i class="fas fa-eye"><\/i>\s*<\/a>)/;

const logoutButton = `$1\n        <button type="button" class="admin-btn admin-btn-outline" id="topbarLogoutBtn" title="Logout of Admin Panel" style="display: inline-flex; align-items: center; gap: 6px; color: #f87171; border-color: rgba(239, 68, 68, 0.35); font-weight: 600;">\n          <i class="fas fa-power-off"></i>\n          <span>Logout</span>\n        </button>`;

if (regex.test(adminHtml) && !adminHtml.includes('id="topbarLogoutBtn"')) {
  adminHtml = adminHtml.replace(regex, logoutButton);
  fs.writeFileSync(adminHtmlPath, adminHtml, 'utf8');
  console.log('Successfully added topbarLogoutBtn to admin/index.html');
} else {
  console.log('Regex did not match or already present');
}
