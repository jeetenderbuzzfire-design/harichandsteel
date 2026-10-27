/**
 * HARICHAND STEEL - CMS Admin Controller
 * Manages dashboard state, CRUD operations, live modals, search/filtering, and data backups
 */

document.addEventListener('DOMContentLoaded', function () {
  // Check CMS availability
  if (typeof CMS === 'undefined') {
    console.error('CMS module not found! Ensure js/cms-data.js is loaded before js/admin.js.');
    return;
  }

  // --- DOM Elements Cache ---
  const navItems = document.querySelectorAll('.admin-nav-item[data-tab]');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');
  const pageHeading = document.getElementById('pageHeading');
  const globalSearchInput = document.getElementById('globalSearchInput');

  // Stats & Badges
  const statTotalProducts = document.getElementById('statTotalProducts');
  const statTotalBlogs = document.getElementById('statTotalBlogs');
  const statTotalInquiries = document.getElementById('statTotalInquiries');
  const badgeProductCount = document.getElementById('badgeProductCount');
  const badgeBlogCount = document.getElementById('badgeBlogCount');
  const badgeInquiryCount = document.getElementById('badgeInquiryCount');

  // Tables
  const dashRecentProductsTable = document.getElementById('dashRecentProductsTable');
  const dashRecentBlogsTable = document.getElementById('dashRecentBlogsTable');
  const productsTableBody = document.getElementById('productsTableBody');
  const blogsTableBody = document.getElementById('blogsTableBody');
  const inquiriesTableBody = document.getElementById('inquiriesTableBody');

  // Filters
  const productSearchInput = document.getElementById('productSearchInput');
  const productCategoryFilter = document.getElementById('productCategoryFilter');
  const productShowingCount = document.getElementById('productShowingCount');

  const blogSearchInput = document.getElementById('blogSearchInput');
  const blogTagFilter = document.getElementById('blogTagFilter');
  const blogShowingCount = document.getElementById('blogShowingCount');

  // Product Modal & Form
  const productModalOverlay = document.getElementById('productModalOverlay');
  const productModalTitle = document.getElementById('productModalTitle');
  const productForm = document.getElementById('productForm');
  const prodInputId = document.getElementById('prodInputId');
  const prodInputTitle = document.getElementById('prodInputTitle');
  const prodInputCategory = document.getElementById('prodInputCategory');
  const prodInputCategoryName = document.getElementById('prodInputCategoryName');
  const prodInputBadge = document.getElementById('prodInputBadge');
  const prodInputPrice = document.getElementById('prodInputPrice');
  const prodInputImage = document.getElementById('prodInputImage');
  const prodFileInput = document.getElementById('prodFileInput');
  const prodImagePreview = document.getElementById('prodImagePreview');
  const prodInputDescription = document.getElementById('prodInputDescription');
  const prodInputSpecs = document.getElementById('prodInputSpecs');
  const prodInputFeatured = document.getElementById('prodInputFeatured');

  // Blog Modal & Form
  const blogModalOverlay = document.getElementById('blogModalOverlay');
  const blogModalTitle = document.getElementById('blogModalTitle');
  const blogForm = document.getElementById('blogForm');
  const blogInputId = document.getElementById('blogInputId');
  const blogInputTitle = document.getElementById('blogInputTitle');
  const blogInputSlug = document.getElementById('blogInputSlug');
  const blogInputTag = document.getElementById('blogInputTag');
  const blogInputAuthor = document.getElementById('blogInputAuthor');
  const blogInputDate = document.getElementById('blogInputDate');
  const blogInputImage = document.getElementById('blogInputImage');
  const blogFileInput = document.getElementById('blogFileInput');
  const blogImagePreview = document.getElementById('blogImagePreview');
  const blogInputExcerpt = document.getElementById('blogInputExcerpt');
  const blogInputContent = document.getElementById('blogInputContent');
  const blogInputPublished = document.getElementById('blogInputPublished');

  // Confirm Modal
  const confirmModalOverlay = document.getElementById('confirmModalOverlay');
  const confirmModalTitle = document.getElementById('confirmModalTitle');
  const confirmModalMessage = document.getElementById('confirmModalMessage');
  const confirmModalExecuteBtn = document.getElementById('confirmModalExecuteBtn');
  let confirmCallback = null;

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // State
  let currentActiveTab = 'dashboard';

  // ==========================================
  // 1. TAB NAVIGATION
  // ==========================================
  function switchTab(tabId) {
    currentActiveTab = tabId;
    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    tabPanes.forEach(pane => {
      if (pane.id === `pane-${tabId}`) {
        pane.style.display = 'block';
      } else {
        pane.style.display = 'none';
      }
    });

    // Update Topbar Title
    const titleMap = {
      dashboard: 'Dashboard Overview',
      products: 'Products Catalog Management',
      blogs: 'News & Blog Management',
      inquiries: 'Customer Inquiries & Leads',
      settings: 'Backup & Database Tools'
    };
    if (pageHeading) {
      pageHeading.textContent = titleMap[tabId] || 'Dashboard';
    }

    // Refresh contents
    if (tabId === 'dashboard') {
      renderDashboard();
    } else if (tabId === 'products') {
      renderProducts();
    } else if (tabId === 'blogs') {
      renderBlogs();
    } else if (tabId === 'inquiries') {
      renderInquiries();
    }
  }

  navItems.forEach(btn => {
    btn.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });

  // Jump from dashboard links
  document.querySelectorAll('[data-goto-tab]').forEach(btn => {
    btn.addEventListener('click', function () {
      const target = this.getAttribute('data-goto-tab');
      if (target) switchTab(target);
    });
  });

  // ==========================================
  // 2. TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  
  function resolveAdminImgPath(src) {
    if (!src) return '../images/prod-1.png';
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('../')) {
      return src;
    }
    return '../' + src.replace(/^\/+/, '');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // ==========================================
  // 3. CONFIRMATION DIALOG
  // ==========================================
  function openConfirmModal(title, message, onConfirm) {
    confirmModalTitle.textContent = title || 'Confirm Action';
    confirmModalMessage.textContent = message || 'Are you sure you want to proceed?';
    confirmCallback = onConfirm;
    confirmModalOverlay.classList.add('active');
  }

  confirmModalExecuteBtn.addEventListener('click', function () {
    if (confirmCallback) {
      confirmCallback();
      confirmCallback = null;
    }
    confirmModalOverlay.classList.remove('active');
  });

  // Close modals on [data-close-modal] or click on overlay backdrop
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', function () {
      const overlay = this.closest('.admin-modal-overlay');
      if (overlay) overlay.classList.remove('active');
    });
  });

  document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.remove('active');
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.admin-modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });

  // ==========================================
  // 4. DASHBOARD RENDERER
  // ==========================================
  function renderDashboard() {
    const products = CMS.getProducts();
    const blogs = CMS.getBlogs();
    const inquiries = CMS.getInquiries();

    // Stats
    statTotalProducts.textContent = products.length;
    statTotalBlogs.textContent = blogs.length;
    statTotalInquiries.textContent = inquiries.length;

    badgeProductCount.textContent = products.length;
    badgeBlogCount.textContent = blogs.length;
    badgeInquiryCount.textContent = inquiries.length;

    // Recent Products in Dashboard (first 4)
    if (dashRecentProductsTable) {
      if (products.length === 0) {
        dashRecentProductsTable.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--admin-text-muted); padding: 24px;">No products found. Click "Add Product" to create one.</td></tr>`;
      } else {
        dashRecentProductsTable.innerHTML = products.slice(0, 4).map(prod => `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${escapeHtml(resolveAdminImgPath(prod.image))}" alt="${escapeHtml(prod.title)}" class="table-thumb" onerror="this.src='../images/prod-1.png'">
                <div>
                  <strong style="color: #fff; font-size: 0.92rem;">${escapeHtml(prod.title)}</strong>
                  <div style="font-size: 0.76rem; color: var(--admin-text-muted);">${escapeHtml(prod.price || 'On Request')}</div>
                </div>
              </div>
            </td>
            <td><span class="pill-badge pill-cat">${escapeHtml(prod.categoryName || prod.category)}</span></td>
            <td><span class="pill-badge">${escapeHtml(prod.badge || 'Standard')}</span></td>
            <td>
              <div class="table-actions">
                <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="window.adminCMS.editProduct('${prod.id}')" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" style="color: var(--admin-danger);" onclick="window.adminCMS.deleteProduct('${prod.id}')" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }

    // Recent Blogs in Dashboard (first 4)
    if (dashRecentBlogsTable) {
      if (blogs.length === 0) {
        dashRecentBlogsTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--admin-text-muted); padding: 24px;">No blog articles found. Click "Add Article" to publish one.</td></tr>`;
      } else {
        dashRecentBlogsTable.innerHTML = blogs.slice(0, 4).map(blog => `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${escapeHtml(resolveAdminImgPath(blog.image))}" alt="${escapeHtml(blog.title)}" class="table-thumb" onerror="this.src='../images/about-3.jpg'">
                <strong style="color: #fff; font-size: 0.92rem;">${escapeHtml(blog.title)}</strong>
              </div>
            </td>
            <td><span class="pill-badge pill-cat">${escapeHtml(blog.tag || 'News')}</span></td>
            <td style="color: var(--admin-text-muted); font-size: 0.85rem;">${escapeHtml(blog.date || '-')}</td>
            <td style="color: var(--admin-text-muted); font-size: 0.85rem;">${escapeHtml(blog.author || 'Harichand Steel')}</td>
            <td>
              <div class="table-actions">
                <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="window.adminCMS.editBlog('${blog.id}')" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" style="color: var(--admin-danger);" onclick="window.adminCMS.deleteBlog('${blog.id}')" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  // ==========================================
  // 5. PRODUCTS MANAGER
  // ==========================================
  function renderProducts() {
    const products = CMS.getProducts();
    const searchTerm = (productSearchInput ? productSearchInput.value : '').toLowerCase().trim();
    const selectedCategory = productCategoryFilter ? productCategoryFilter.value : 'all';

    let filtered = products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = !searchTerm || 
        p.title.toLowerCase().includes(searchTerm) || 
        (p.description && p.description.toLowerCase().includes(searchTerm)) ||
        (Array.isArray(p.specs) && p.specs.some(s => s.toLowerCase().includes(searchTerm)));
      return matchCat && matchSearch;
    });

    if (productShowingCount) productShowingCount.textContent = filtered.length;
    if (badgeProductCount) badgeProductCount.textContent = products.length;
    if (statTotalProducts) statTotalProducts.textContent = products.length;

    if (!productsTableBody) return;

    if (filtered.length === 0) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 36px 16px;">
            <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 8px; display: block; opacity: 0.4;"></i>
            No products match your criteria.
          </td>
        </tr>`;
      return;
    }

    productsTableBody.innerHTML = filtered.map(prod => {
      const specsHtml = Array.isArray(prod.specs) && prod.specs.length > 0
        ? prod.specs.slice(0, 3).map(s => `<span class="pill-badge" style="font-size: 0.7rem; background: rgba(255,255,255,0.06); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.1); margin-right: 4px; margin-bottom: 2px;">${escapeHtml(s)}</span>`).join('')
        : '<span style="color: var(--admin-text-muted); font-size: 0.75rem;">-</span>';

      return `
        <tr>
          <td>
            <img src="${escapeHtml(resolveAdminImgPath(prod.image))}" alt="${escapeHtml(prod.title)}" class="table-thumb" onerror="this.src='../images/prod-1.png'">
          </td>
          <td>
            <strong style="color: #fff; font-size: 0.94rem; display: block;">${escapeHtml(prod.title)}</strong>
            <span style="font-size: 0.78rem; color: var(--admin-text-muted); line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
              ${escapeHtml(prod.description || '')}
            </span>
          </td>
          <td><span class="pill-badge pill-cat">${escapeHtml(prod.categoryName || prod.category)}</span></td>
          <td><span class="pill-badge">${escapeHtml(prod.badge || 'Standard')}</span></td>
          <td style="max-width: 220px;">${specsHtml}</td>
          <td><strong style="color: var(--admin-accent); font-size: 0.88rem;">${escapeHtml(prod.price || 'On Request')}</strong></td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="window.adminCMS.editProduct('${prod.id}')" title="Edit Product">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" style="color: var(--admin-danger);" onclick="window.adminCMS.deleteProduct('${prod.id}')" title="Delete Product">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Filter Event Listeners
  if (productSearchInput) productSearchInput.addEventListener('input', renderProducts);
  if (productCategoryFilter) productCategoryFilter.addEventListener('change', renderProducts);

  // Open Product Modal
  function openProductModal(prod = null) {
    productForm.reset();
    if (prod) {
      productModalTitle.textContent = 'Edit Product';
      prodInputId.value = prod.id || '';
      prodInputTitle.value = prod.title || '';
      prodInputCategory.value = prod.category || 'aluminum-profile-gate';
      prodInputCategoryName.value = prod.categoryName || '';
      prodInputBadge.value = prod.badge || '';
      prodInputPrice.value = prod.price || 'On Request';
      prodInputImage.value = prod.image || '';
      prodInputDescription.value = prod.description || '';
      prodInputSpecs.value = Array.isArray(prod.specs) ? prod.specs.join(', ') : (prod.specs || '');
      prodInputFeatured.checked = !!prod.featured;
      updateImagePreview(prodImagePreview, prod.image);
    } else {
      productModalTitle.textContent = 'Add New Product';
      prodInputId.value = '';
      prodInputPrice.value = 'On Request';
      prodInputCategoryName.value = 'Aluminum Profile Gate';
      prodInputBadge.value = 'New Arrival';
      prodInputImage.value = 'images/prod-1.png';
      updateImagePreview(prodImagePreview, '../images/prod-1.png');
    }
    productModalOverlay.classList.add('active');
  }

  // Category change syncs display name
  if (prodInputCategory) {
    prodInputCategory.addEventListener('change', function () {
      const map = {
        'aluminum-profile-gate': 'Aluminum Profile Gate',
        'steel-main-gate': 'Steel Main Gate',
        'steel-door': 'Steel Door',
        'modern-railings': 'Modern Railings',
        'custom-fabrication': 'Custom Fabrication'
      };
      if (map[this.value] && !prodInputCategoryName.value) {
        prodInputCategoryName.value = map[this.value];
      }
    });
  }

  // Live image preview helper
  function updateImagePreview(container, src) {
    if (!container) return;
    if (src) {
      container.innerHTML = `<img src="${escapeHtml(src)}" alt="Preview" onerror="this.onerror=null; this.src='../images/prod-1.png'">`;
    } else {
      container.innerHTML = `<span style="color: var(--admin-text-muted); font-size: 0.85rem;"><i class="fas fa-image"></i> Image Preview</span>`;
    }
  }

  if (prodInputImage) {
    prodInputImage.addEventListener('input', function () {
      updateImagePreview(prodImagePreview, this.value.trim());
    });
  }

  // File Upload via FileReader for immediate Base64 persistence
  if (prodFileInput) {
    prodFileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        prodInputImage.value = e.target.result;
        updateImagePreview(prodImagePreview, e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  // Submit Product Form
  if (productForm) {
    productForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const title = prodInputTitle.value.trim();
      if (!title) {
        showToast('Please enter a product title', 'error');
        return;
      }

      const specsStr = prodInputSpecs.value.trim();
      const specsArray = specsStr
        ? specsStr.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const categoryVal = prodInputCategory.value;
      const categoryNameVal = prodInputCategoryName.value.trim() || 
        prodInputCategory.options[prodInputCategory.selectedIndex].text;

      const productPayload = {
        id: prodInputId.value || undefined,
        title: title,
        category: categoryVal,
        categoryName: categoryNameVal,
        badge: prodInputBadge.value.trim() || 'Custom Built',
        price: prodInputPrice.value.trim() || 'On Request',
        image: prodInputImage.value.trim() || 'images/prod-1.png',
        description: prodInputDescription.value.trim(),
        specs: specsArray,
        featured: prodInputFeatured.checked
      };

      CMS.saveProduct(productPayload);
      productModalOverlay.classList.remove('active');
      showToast(prodInputId.value ? 'Product updated successfully!' : 'New product created successfully!');
      renderProducts();
      renderDashboard();
    });
  }

  // Top and pane triggers for Add Product
  const btnOpenProductModal = document.getElementById('btnOpenProductModal');
  const btnOpenProductModalTop = document.getElementById('btnOpenProductModalTop');
  const dashBtnAddProduct = document.getElementById('dashBtnAddProduct');

  if (btnOpenProductModal) btnOpenProductModal.addEventListener('click', () => openProductModal());
  if (btnOpenProductModalTop) btnOpenProductModalTop.addEventListener('click', () => openProductModal());
  if (dashBtnAddProduct) dashBtnAddProduct.addEventListener('click', () => openProductModal());

  // ==========================================
  // 6. BLOGS MANAGER
  // ==========================================
  function renderBlogs() {
    const blogs = CMS.getBlogs();
    const searchTerm = (blogSearchInput ? blogSearchInput.value : '').toLowerCase().trim();
    const selectedTag = blogTagFilter ? blogTagFilter.value : 'all';

    let filtered = blogs.filter(b => {
      const matchTag = selectedTag === 'all' || b.tag === selectedTag;
      const matchSearch = !searchTerm || 
        b.title.toLowerCase().includes(searchTerm) || 
        (b.excerpt && b.excerpt.toLowerCase().includes(searchTerm)) ||
        (b.content && b.content.toLowerCase().includes(searchTerm));
      return matchTag && matchSearch;
    });

    if (blogShowingCount) blogShowingCount.textContent = filtered.length;
    if (badgeBlogCount) badgeBlogCount.textContent = blogs.length;
    if (statTotalBlogs) statTotalBlogs.textContent = blogs.length;

    if (!blogsTableBody) return;

    if (filtered.length === 0) {
      blogsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--admin-text-muted); padding: 36px 16px;">
            <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 8px; display: block; opacity: 0.4;"></i>
            No blog articles match your criteria.
          </td>
        </tr>`;
      return;
    }

    blogsTableBody.innerHTML = filtered.map(blog => `
      <tr>
        <td>
          <img src="${escapeHtml(resolveAdminImgPath(blog.image))}" alt="${escapeHtml(blog.title)}" class="table-thumb" onerror="this.src='../images/about-3.jpg'">
        </td>
        <td>
          <strong style="color: #fff; font-size: 0.94rem; display: block;">${escapeHtml(blog.title)}</strong>
          <span style="font-size: 0.78rem; color: var(--admin-text-muted); line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
            ${escapeHtml(blog.excerpt || '')}
          </span>
        </td>
        <td><span class="pill-badge pill-cat">${escapeHtml(blog.tag || 'Guide')}</span></td>
        <td style="color: var(--admin-text-muted); font-size: 0.85rem;">${escapeHtml(blog.author || 'Harichand Steel Team')}</td>
        <td style="color: var(--admin-text-muted); font-size: 0.85rem;">${escapeHtml(blog.date || '-')}</td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            <a href="${escapeHtml(blog.slug || 'news.html')}" target="_blank" class="admin-btn admin-btn-outline admin-btn-sm" title="View Article Page">
              <i class="fas fa-external-link-alt"></i>
            </a>
            <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" onclick="window.adminCMS.editBlog('${blog.id}')" title="Edit Article">
              <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="admin-btn admin-btn-outline admin-btn-sm" style="color: var(--admin-danger);" onclick="window.adminCMS.deleteBlog('${blog.id}')" title="Delete Article">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  if (blogSearchInput) blogSearchInput.addEventListener('input', renderBlogs);
  if (blogTagFilter) blogTagFilter.addEventListener('change', renderBlogs);

  // Open Blog Modal
  function openBlogModal(blog = null) {
    blogForm.reset();
    if (blog) {
      blogModalTitle.textContent = 'Edit Blog Article';
      blogInputId.value = blog.id || '';
      blogInputTitle.value = blog.title || '';
      blogInputSlug.value = blog.slug || 'news.html';
      blogInputTag.value = blog.tag || 'Design Guide';
      blogInputAuthor.value = blog.author || 'Harichand Steel Team';
      blogInputDate.value = blog.date || '';
      blogInputImage.value = blog.image || '';
      blogInputExcerpt.value = blog.excerpt || '';
      blogInputContent.value = blog.content || '';
      blogInputPublished.checked = blog.published !== false;
      updateImagePreview(blogImagePreview, blog.image);
    } else {
      blogModalTitle.textContent = 'Add New Blog Article';
      blogInputId.value = '';
      blogInputSlug.value = 'news.html';
      blogInputTag.value = 'Design Guide';
      blogInputAuthor.value = 'Harichand Steel Team';
      blogInputDate.value = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      blogInputImage.value = 'images/about-3.jpg';
      blogInputPublished.checked = true;
      updateImagePreview(blogImagePreview, '../images/about-3.jpg');
    }
    blogModalOverlay.classList.add('active');
  }

  if (blogInputImage) {
    blogInputImage.addEventListener('input', function () {
      updateImagePreview(blogImagePreview, this.value.trim());
    });
  }

  if (blogFileInput) {
    blogFileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        blogInputImage.value = e.target.result;
        updateImagePreview(blogImagePreview, e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  if (blogForm) {
    blogForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const title = blogInputTitle.value.trim();
      const excerpt = blogInputExcerpt.value.trim();
      if (!title || !excerpt) {
        showToast('Please enter both article title and excerpt', 'error');
        return;
      }

      const blogPayload = {
        id: blogInputId.value || undefined,
        title: title,
        slug: blogInputSlug.value.trim() || 'news.html',
        tag: blogInputTag.value.trim() || 'Guide',
        author: blogInputAuthor.value.trim() || 'Harichand Steel Team',
        date: blogInputDate.value.trim() || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        image: blogInputImage.value.trim() || 'images/about-3.jpg',
        excerpt: excerpt,
        content: blogInputContent.value.trim(),
        published: blogInputPublished.checked
      };

      CMS.saveBlog(blogPayload);
      blogModalOverlay.classList.remove('active');
      showToast(blogInputId.value ? 'Article updated successfully!' : 'New article published successfully!');
      renderBlogs();
      renderDashboard();
    });
  }

  const btnOpenBlogModal = document.getElementById('btnOpenBlogModal');
  const btnOpenBlogModalTop = document.getElementById('btnOpenBlogModalTop');
  const dashBtnAddBlog = document.getElementById('dashBtnAddBlog');

  if (btnOpenBlogModal) btnOpenBlogModal.addEventListener('click', () => openBlogModal());
  if (btnOpenBlogModalTop) btnOpenBlogModalTop.addEventListener('click', () => openBlogModal());
  if (dashBtnAddBlog) dashBtnAddBlog.addEventListener('click', () => openBlogModal());

  // ==========================================
  // 7. INQUIRIES LEADS MANAGER
  // ==========================================
  function renderInquiries() {
    const inquiries = CMS.getInquiries();
    if (badgeInquiryCount) badgeInquiryCount.textContent = inquiries.length;
    if (statTotalInquiries) statTotalInquiries.textContent = inquiries.length;

    if (!inquiriesTableBody) return;

    if (inquiries.length === 0) {
      inquiriesTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 36px 16px;">
            <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 8px; display: block; opacity: 0.4;"></i>
            No inquiries logged yet. Submissions from Contact Us and Quote Estimator will appear here.
          </td>
        </tr>`;
      return;
    }

    inquiriesTableBody.innerHTML = inquiries.map(inq => {
      const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
      const waLink = cleanPhone ? `https://wa.me/91${cleanPhone.slice(-10)}` : '#';

      return `
        <tr>
          <td style="color: var(--admin-text-muted); font-size: 0.82rem;">${escapeHtml(inq.timestamp || '-')}</td>
          <td><strong style="color: #fff;">${escapeHtml(inq.name || 'Anonymous')}</strong></td>
          <td><a href="tel:${escapeHtml(inq.phone || '')}" style="color: #93c5fd; text-decoration: none;">${escapeHtml(inq.phone || '-')}</a></td>
          <td style="color: var(--admin-text-muted);">${escapeHtml(inq.email || '-')}</td>
          <td><span class="pill-badge pill-cat">${escapeHtml(inq.requirement || inq.service || 'General Inquiry')}</span></td>
          <td style="max-width: 260px; font-size: 0.85rem; color: #cbd5e1;">${escapeHtml(inq.message || '-')}</td>
          <td>
            ${cleanPhone ? `
              <a href="${waLink}" target="_blank" class="admin-btn admin-btn-outline admin-btn-sm" style="color: #22c55e; border-color: rgba(34, 197, 94, 0.4);">
                <i class="fab fa-whatsapp"></i> Chat
              </a>
            ` : '-'}
          </td>
        </tr>
      `;
    }).join('');
  }

  // Export Leads to CSV
  const btnExportInquiries = document.getElementById('btnExportInquiries');
  if (btnExportInquiries) {
    btnExportInquiries.addEventListener('click', function () {
      const inquiries = CMS.getInquiries();
      if (inquiries.length === 0) {
        showToast('No inquiries to export.', 'error');
        return;
      }

      let csv = 'Date,Name,Phone,Email,Requirement,Message\n';
      inquiries.forEach(inq => {
        const row = [
          `"${(inq.timestamp || '').replace(/"/g, '""')}"`,
          `"${(inq.name || '').replace(/"/g, '""')}"`,
          `"${(inq.phone || '').replace(/"/g, '""')}"`,
          `"${(inq.email || '').replace(/"/g, '""')}"`,
          `"${(inq.requirement || inq.service || '').replace(/"/g, '""')}"`,
          `"${(inq.message || '').replace(/"/g, '""')}"`
        ];
        csv += row.join(',') + '\n';
      });

      downloadFile(csv, `harichand-steel-leads-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
      showToast('Leads CSV exported successfully!');
    });
  }

  // Clear Inquiries
  const btnClearInquiries = document.getElementById('btnClearInquiries');
  if (btnClearInquiries) {
    btnClearInquiries.addEventListener('click', function () {
      openConfirmModal(
        'Clear All Inquiries?',
        'Are you sure you want to delete all recorded inquiries? This action cannot be undone.',
        function () {
          localStorage.setItem('hs_cms_inquiries', JSON.stringify([]));
          renderInquiries();
          renderDashboard();
          showToast('Inquiries cleared.');
        }
      );
    });
  }

  // ==========================================
  // 8. BACKUP, RESTORE & RESET
  // ==========================================
  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  function triggerBackupDownload() {
    const backupJson = CMS.exportData();
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(backupJson, `harichand-steel-cms-backup-${dateStr}.json`, 'application/json');
    showToast('CMS backup downloaded successfully!');
  }

  const btnDownloadBackupFile = document.getElementById('btnDownloadBackupFile');
  const dashBtnBackup = document.getElementById('dashBtnBackup');
  if (btnDownloadBackupFile) btnDownloadBackupFile.addEventListener('click', triggerBackupDownload);
  if (dashBtnBackup) dashBtnBackup.addEventListener('click', triggerBackupDownload);

  // Restore Backup
  const btnTriggerImportFile = document.getElementById('btnTriggerImportFile');
  const importFileInput = document.getElementById('importFileInput');

  if (btnTriggerImportFile && importFileInput) {
    btnTriggerImportFile.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const ok = CMS.importData(e.target.result);
        if (ok) {
          showToast('Data restored successfully!');
          renderDashboard();
          renderProducts();
          renderBlogs();
          renderInquiries();
        } else {
          showToast('Failed to parse backup JSON. Invalid format.', 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  // Reset to default seeds
  const btnResetToDefaults = document.getElementById('btnResetToDefaults');
  if (btnResetToDefaults) {
    btnResetToDefaults.addEventListener('click', function () {
      openConfirmModal(
        'Reset to Default Catalog?',
        'This will replace your current products and blog posts with the official default Harichand Steel live site data. Are you sure?',
        function () {
          CMS.resetToDefault();
          showToast('CMS restored to default live catalog.');
          renderDashboard();
          renderProducts();
          renderBlogs();
        }
      );
    });
  }

  // Global search input in topbar
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', function () {
      const query = this.value.trim();
      if (!query) return;

      // Automatically route to products or blogs tab depending on context
      if (currentActiveTab === 'dashboard' || currentActiveTab === 'settings') {
        switchTab('products');
      }
      if (currentActiveTab === 'products' && productSearchInput) {
        productSearchInput.value = query;
        renderProducts();
      } else if (currentActiveTab === 'blogs' && blogSearchInput) {
        blogSearchInput.value = query;
        renderBlogs();
      }
    });
  }

  // Global public API for inline table button actions
  window.adminCMS = {
    editProduct: function (id) {
      const prod = CMS.getProducts().find(p => p.id === id);
      if (prod) openProductModal(prod);
    },
    deleteProduct: function (id) {
      const prod = CMS.getProducts().find(p => p.id === id);
      const name = prod ? prod.title : 'this item';
      openConfirmModal(
        'Delete Product?',
        `Are you sure you want to permanently delete "${name}"?`,
        function () {
          CMS.deleteProduct(id);
          showToast(`Product "${name}" deleted.`);
          renderProducts();
          renderDashboard();
        }
      );
    },
    editBlog: function (id) {
      const blog = CMS.getBlogs().find(b => b.id === id);
      if (blog) openBlogModal(blog);
    },
    deleteBlog: function (id) {
      const blog = CMS.getBlogs().find(b => b.id === id);
      const name = blog ? blog.title : 'this article';
      openConfirmModal(
        'Delete Blog Article?',
        `Are you sure you want to permanently delete "${name}"?`,
        function () {
          CMS.deleteBlog(id);
          showToast(`Article "${name}" deleted.`);
          renderBlogs();
          renderDashboard();
        }
      );
    }
  };

  async function checkDbStatus() {
    try {
      const res = await fetch('/api/db-status');
      if (res.ok) {
        const data = await res.json();
        const statElem = document.getElementById('statDbSync');
        const iconElem = document.getElementById('statDbIcon');
        const badgeElem = document.getElementById('badgeSupabaseStatus');

        if (data.connected) {
          if (statElem) statElem.innerHTML = '<i class="fas fa-database" style="color:#22c55e;"></i> PostgreSQL';
          if (iconElem) { iconElem.style.background = 'rgba(34, 197, 94, 0.15)'; iconElem.style.color = '#22c55e'; }
          if (badgeElem) {
            badgeElem.textContent = 'PostgreSQL Connected';
            badgeElem.style.background = 'rgba(34, 197, 94, 0.15)';
            badgeElem.style.color = '#22c55e';
            badgeElem.style.borderColor = 'rgba(34, 197, 94, 0.3)';
          }
        } else if (data.hasPlaceholder) {
          if (statElem) statElem.innerHTML = '<span style="font-size:0.92rem; color:#f59e0b;"><i class="fas fa-key"></i> Set Password</span>';
          if (iconElem) { iconElem.style.background = 'rgba(245, 158, 11, 0.15)'; iconElem.style.color = '#f59e0b'; }
          if (badgeElem) {
            badgeElem.textContent = 'Awaiting Password in .env';
            badgeElem.style.background = 'rgba(245, 158, 11, 0.15)';
            badgeElem.style.color = '#f59e0b';
            badgeElem.style.borderColor = 'rgba(245, 158, 11, 0.3)';
          }
        }
      }
    } catch (_) {
      // offline / file:// mode
    }
  }

  // Initial render
  renderDashboard();
  renderProducts();
  renderBlogs();
  renderInquiries();
  checkDbStatus();
});
