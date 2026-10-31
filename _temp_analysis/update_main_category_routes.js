const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '..', 'js', 'main.js');
let code = fs.readFileSync(mainJsPath, 'utf8');

// Find the initProductFilter function
const funcStart = code.indexOf('function initProductFilter() {');
const funcEnd = code.indexOf('function initQuoteEstimator() {');

if (funcStart === -1 || funcEnd === -1) {
  console.error('Could not locate initProductFilter bounds');
  process.exit(1);
}

const newFunctionCode = `function initProductFilter() {
  const filterContainers = document.querySelectorAll('.product-filters');
  const cards = Array.from(document.querySelectorAll('.product-cards-grid .product-card'));

  if (!filterContainers.length || !cards.length) return;

  const PAGE_SIZE = 9;

  // Helper: extract page number from clean URL pathname or query parameters
  function getPageFromUrl() {
    const path = window.location.pathname || '';
    const match = path.match(/\\/(?:product|product-category\\/[^\\/]+)\\/page\\/(\\d+)\\/?/i);
    if (match && match[1]) {
      const p = parseInt(match[1], 10);
      if (!isNaN(p) && p >= 1) return p;
    }
    const params = new URLSearchParams(window.location.search || '');
    if (params.has('page')) {
      const p = parseInt(params.get('page'), 10);
      if (!isNaN(p) && p >= 1) return p;
    }
    return 1;
  }

  // Helper: extract category slug from clean URL pathname (/product-category/:slug/) or hash
  function getCategoryFromUrl() {
    const path = window.location.pathname || '';
    const catMatch = path.match(/\\/product-category\\/([a-zA-Z0-9_-]+)/i);
    if (catMatch && catMatch[1]) {
      return catMatch[1].toLowerCase();
    }
    const hash = window.location.hash ? window.location.hash.substring(1).toLowerCase() : '';
    return hash;
  }

  filterContainers.forEach(container => {
    const filterBtns = container.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    // Detect if this page has pagination elements (product catalogue)
    const paginationContainer = document.getElementById('cataloguePagination') ||
                                document.querySelector('.catalogue-pagination');
    const paginationList = paginationContainer ? paginationContainer.querySelector('.pagination-list') : null;
    const breadcrumbNav = document.getElementById('catalogueBreadcrumbs') ||
                          document.querySelector('.breadcrumb-nav');
    const countSummary = container.parentElement.querySelector('.product-results-count') ||
                         document.querySelector('.product-results-count');

    // 1. Calculate live counts for each category
    const categoryCounts = { all: cards.length };
    cards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (cat) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    });

    // 2. Update filter button text with exact count badges
    filterBtns.forEach(btn => {
      const filter = btn.getAttribute('data-filter') || 'all';
      const count = categoryCounts[filter] || 0;

      let baseLabel = btn.getAttribute('data-label');
      if (!baseLabel) {
        baseLabel = btn.textContent.replace(/\\s*\\(\\d+\\)\\s*$/, '').trim();
        btn.setAttribute('data-label', baseLabel);
      }

      btn.innerHTML = \`\${baseLabel} <span class="filter-count">(\${count})</span>\`;
    });

    // Current State
    let currentFilter = 'all';
    let currentPage = paginationContainer ? getPageFromUrl() : 1;

    // Helper: get display label for category
    function getCategoryLabel(filterKey) {
      if (!filterKey || filterKey === 'all') return 'All Products';
      const btn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === filterKey);
      if (btn) {
        return btn.getAttribute('data-label') || btn.textContent.replace(/\\s*\\(\\d+\\)\\s*$/, '').trim();
      }
      return filterKey.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
    }

    // 3. Render Breadcrumbs
    function renderBreadcrumbs(page) {
      if (!breadcrumbNav) return;
      const isFiltered = currentFilter && currentFilter !== 'all';
      const categoryLabel = getCategoryLabel(currentFilter);

      if (isFiltered) {
        if (page > 1) {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="product.html">Product</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="/product-category/\${currentFilter}/">\${categoryLabel}</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>Page \${page}</span>
          \`;
          document.title = \`\${categoryLabel} - Page \${page} - HARICHAND STEEL\`;
        } else {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="product.html">Product</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>\${categoryLabel}</span>
          \`;
          document.title = \`\${categoryLabel} - HARICHAND STEEL\`;
        }
      } else {
        if (page > 1) {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <a href="product.html">Product</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>Page \${page}</span>
          \`;
          document.title = \`Product - Page \${page} - HARICHAND STEEL\`;
        } else {
          breadcrumbNav.innerHTML = \`
            <a href="index.html">Home</a>
            <span class="sep"><i class="fas fa-chevron-right"></i></span>
            <span>Product</span>
          \`;
          document.title = 'Product - HARICHAND STEEL';
        }
      }
    }

    // 4. Render Pagination UI
    function renderPaginationUI(totalPages, page) {
      if (!paginationContainer || !paginationList) return;

      if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        paginationList.innerHTML = '';
        return;
      }

      paginationContainer.style.display = 'flex';
      let html = '';

      // [←] Previous button
      const isFirst = page <= 1;
      let prevUrl;
      if (currentFilter && currentFilter !== 'all') {
        prevUrl = page > 2 ? \`/product-category/\${currentFilter}/page/\${page - 1}/\` : \`/product-category/\${currentFilter}/\`;
      } else {
        prevUrl = page > 2 ? \`/product/page/\${page - 1}\` : '/product';
      }

      html += \`
        <li class="page-item \${isFirst ? 'disabled' : ''}">
          <a href="\${isFirst ? '#' : prevUrl}" class="page-link" data-page="\${page - 1}" aria-label="Previous Page" \${isFirst ? 'tabindex="-1" aria-disabled="true"' : ''}>
            <i class="fas fa-chevron-left"></i>
          </a>
        </li>
      \`;

      // [1] [2] [3] ... [totalPages] Numbered buttons
      for (let p = 1; p <= totalPages; p++) {
        const isActive = p === page;
        let pageUrl;
        if (currentFilter && currentFilter !== 'all') {
          pageUrl = p === 1 ? \`/product-category/\${currentFilter}/\` : \`/product-category/\${currentFilter}/page/\${p}/\`;
        } else {
          pageUrl = p === 1 ? '/product' : \`/product/page/\${p}\`;
        }
        html += \`
          <li class="page-item \${isActive ? 'active' : ''}" \${isActive ? 'aria-current="page"' : ''}>
            <a href="\${pageUrl}" class="page-link" data-page="\${p}">\${p}</a>
          </li>
        \`;
      }

      // [→] Next button
      const isLast = page >= totalPages;
      let nextUrl;
      if (currentFilter && currentFilter !== 'all') {
        nextUrl = \`/product-category/\${currentFilter}/page/\${page + 1}/\`;
      } else {
        nextUrl = \`/product/page/\${page + 1}\`;
      }

      html += \`
        <li class="page-item \${isLast ? 'disabled' : ''}">
          <a href="\${isLast ? '#' : nextUrl}" class="page-link" data-page="\${page + 1}" aria-label="Next Page" \${isLast ? 'tabindex="-1" aria-disabled="true"' : ''}>
            <i class="fas fa-chevron-right"></i>
          </a>
        </li>
      \`;

      paginationList.innerHTML = html;

      // Attach click listeners to pagination links
      paginationList.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const pageItem = link.closest('.page-item');
          if (pageItem && (pageItem.classList.contains('disabled') || pageItem.classList.contains('active'))) {
            return;
          }
          const targetPage = parseInt(link.getAttribute('data-page'), 10);
          if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages && targetPage !== currentPage) {
            currentPage = targetPage;
            applyDisplay(true, true); // pushHistory = true, scrollUp = true
          }
        });
      });
    }

    // 5. Apply Display (Filtering + Pagination Chunking)
    function applyDisplay(pushHistory = false, scrollUp = false) {
      // Find matching cards for the selected category
      const matchingCards = cards.filter(card => {
        const cat = card.getAttribute('data-category');
        return currentFilter === 'all' || cat === currentFilter;
      });

      const totalItems = matchingCards.length;

      if (paginationContainer) {
        const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);

        // Hide all non-matching cards
        cards.forEach(card => {
          if (!matchingCards.includes(card)) {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });

        // Show only matching cards within current page slice
        matchingCards.forEach((card, index) => {
          if (index >= startIndex && index < endIndex) {
            card.style.display = 'flex';
            setTimeout(() => { card.style.opacity = '1'; }, 20);
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });

        // Update Results Counter: "Showing X–Y of Z results"
        if (countSummary) {
          if (totalItems === 0) {
            countSummary.innerHTML = 'Showing 0 results';
          } else {
            countSummary.innerHTML = \`Showing <strong>\${startIndex + 1}–\${endIndex}</strong> of <strong>\${totalItems}</strong> results\`;
          }
        }

        // Update Breadcrumbs
        renderBreadcrumbs(currentPage);

        // Update Pagination Controls
        renderPaginationUI(totalPages, currentPage);

        // Update Clean URL via history.pushState
        if (pushHistory && window.history && window.history.pushState) {
          let cleanUrl;
          if (currentFilter && currentFilter !== 'all') {
            cleanUrl = currentPage > 1 ? \`/product-category/\${currentFilter}/page/\${currentPage}/\` : \`/product-category/\${currentFilter}/\`;
          } else {
            cleanUrl = currentPage > 1 ? \`/product/page/\${currentPage}\` : '/product';
          }
          try {
            const currentFullPath = window.location.pathname + window.location.search;
            if (currentFullPath !== cleanUrl) {
              window.history.pushState({ page: currentPage, filter: currentFilter }, '', cleanUrl);
            }
          } catch (err) {
            console.warn('pushState error:', err);
          }
        }

        // Smooth scroll to top of catalogue grid
        if (scrollUp) {
          const scrollTarget = container.closest('.section') || container;
          if (scrollTarget) {
            const topOffset = scrollTarget.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
          }
        }
      } else {
        // Fallback for non-paginated views (e.g. homepage)
        let visibleCount = 0;
        cards.forEach(card => {
          const cat = card.getAttribute('data-category');
          const matches = (currentFilter === 'all' || cat === currentFilter);
          if (matches) {
            visibleCount++;
            card.style.display = 'flex';
            setTimeout(() => { card.style.opacity = '1'; }, 20);
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });

        if (countSummary) {
          if (currentFilter === 'all') {
            countSummary.innerHTML = \`Showing all <strong>\${visibleCount}</strong> designs in catalogue\`;
          } else {
            const activeLabel = getCategoryLabel(currentFilter);
            countSummary.innerHTML = \`Showing <strong>\${visibleCount}</strong> of <strong>\${cards.length}</strong> results in <em>\${activeLabel}</em>\`;
          }
        }
      }
    }

    // 6. Category Button Event Listeners
    filterBtns.forEach(btn => {
      if (btn._filterListener) {
        btn.removeEventListener('click', btn._filterListener);
      }
      btn._filterListener = (e) => {
        e.preventDefault();
        const filter = btn.getAttribute('data-filter') || 'all';
        currentFilter = filter;
        currentPage = 1; // Reset to page 1 on filter switch

        filterBtns.forEach(b => b.classList.toggle('active', b === btn));
        applyDisplay(true, false);
      };
      btn.addEventListener('click', btn._filterListener);
    });

    // 7. Initial Active State Selection
    const initialCategory = getCategoryFromUrl();
    let initialBtn = null;
    if (initialCategory) {
      initialBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === initialCategory);
      if (initialBtn) {
        currentFilter = initialCategory;
        // If arrived via old hash URL like /product.html#steel-door or /product#steel-door, cleanly upgrade URL
        if (window.location.hash && window.history && window.history.replaceState) {
          const cleanUrl = \`/product-category/\${currentFilter}/\`;
          window.history.replaceState({ page: currentPage, filter: currentFilter }, '', cleanUrl);
        }
      }
    }
    if (!initialBtn) {
      initialBtn = container.querySelector('.filter-btn.active') || filterBtns[0];
      if (initialBtn) currentFilter = initialBtn.getAttribute('data-filter') || 'all';
    }

    filterBtns.forEach(b => b.classList.toggle('active', b === initialBtn));
    applyDisplay(false, false);

    // 8. Popstate listener for back/forward navigation
    if (!window._cataloguePopstateBound && paginationContainer) {
      window._cataloguePopstateBound = true;
      window.addEventListener('popstate', (e) => {
        const catFromUrl = getCategoryFromUrl();
        const stateFilter = (e.state && e.state.filter) || catFromUrl || 'all';
        const statePage = (e.state && typeof e.state.page === 'number') ? e.state.page : getPageFromUrl();

        currentFilter = stateFilter;
        currentPage = statePage;

        filterBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === currentFilter));
        applyDisplay(false, false);
      });
    }
  });

  // Global hashchange listener so old anchor links filter and upgrade URL dynamically
  if (!window._catalogueHashListenerBound) {
    window._catalogueHashListenerBound = true;
    window.addEventListener('hashchange', () => {
      const currentHash = window.location.hash ? window.location.hash.substring(1) : '';
      if (!currentHash) return;
      const targetBtn = document.querySelector(\`.filter-btn[data-filter="\${currentHash}"]\`);
      if (targetBtn) {
        targetBtn.click();
      }
    });
  }
}

`;

code = code.substring(0, funcStart) + newFunctionCode + code.substring(funcEnd);
fs.writeFileSync(mainJsPath, code, 'utf8');
console.log('Successfully updated initProductFilter in js/main.js!');
