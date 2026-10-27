/**
 * HARICHAND STEEL - Redesign Interactive Logic
 * Pure ES6 JavaScript - Zero dependencies
 * Integrated with Harichand Steel CMS Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initStickyHeader();
  initMobileNav();
  initQuoteEstimator();
  initModal();
  initScrollTop();

  // CMS dynamic hydration
  if (typeof CMS !== 'undefined') {
    hydrateProductsFromCMS();
    hydrateNewsFromCMS();
  } else {
    initProductFilter();
  }
});

/* ==========================================================================
   HERO SLIDER
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');

  if (!slides.length) return;

  let currentIndex = 0;
  let slideInterval = null;
  const slideDuration = 5500;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    let next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoPlay();
    });
  });

  const heroSection = document.querySelector('.hero-slider-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoPlay);
    heroSection.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

/* ==========================================================================
   STICKY HEADER SCROLL EFFECT
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER & DROPDOWNS
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.main-nav');
  const dropdownToggles = document.querySelectorAll('.nav-item.has-dropdown > .nav-link');

  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (nav.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });
  }

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        const parent = toggle.closest('.nav-item');
        const dropdown = parent.querySelector('.dropdown-menu');
        if (dropdown) {
          dropdown.classList.toggle('show');
        }
      }
    });
  });

  // Close nav on click outside
  document.addEventListener('click', (e) => {
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !toggleBtn.contains(e.target)) {
      nav.classList.remove('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  });
}

/* ==========================================================================
   PRODUCT FILTER TABS
   ========================================================================== */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ==========================================================================
   QUICK QUOTE ESTIMATOR FORM
   ========================================================================== */
function initQuoteEstimator() {
  const form = document.getElementById('quoteEstimatorForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const gateType = form.querySelector('[name="gate_type"]').value;
    const size = form.querySelector('[name="gate_size"]').value.trim() || 'Standard';
    const city = form.querySelector('[name="city"]').value.trim() || 'Delhi NCR';

    // Log lead to CMS
    if (typeof CMS !== 'undefined') {
      CMS.saveInquiry({
        name: name,
        phone: phone,
        requirement: `Quote: ${gateType} (${size})`,
        message: `Location: ${city}. Size: ${size}. Requested formal quotation and catalogue.`
      });
    }

    let msg = `*New Website Gate Enquiry - Harichand Steel*%0A%0A`;
    msg += `*Name:* ${encodeURIComponent(name)}%0A`;
    msg += `*Phone:* ${encodeURIComponent(phone)}%0A`;
    msg += `*Product Required:* ${encodeURIComponent(gateType)}%0A`;
    msg += `*Approx Dimension/Size:* ${encodeURIComponent(size)}%0A`;
    msg += `*Location:* ${encodeURIComponent(city)}%0A%0A`;
    msg += `Please provide quotation and catalogue.`;

    const whatsappUrl = `https://wa.me/919870433868?text=${msg}`;
    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   INTERACTIVE MODAL FOR PRODUCT INQUIRY
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('inquiryModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const triggerBtns = document.querySelectorAll('.trigger-inquiry-modal');
  const modalForm = document.getElementById('modalInquiryForm');
  const productInput = document.getElementById('modalProductField');

  if (!modal) return;

  triggerBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const productTitle = btn.getAttribute('data-product') || 'Aluminium Profile Gate Solution';
      if (productInput) productInput.value = productTitle;
      modal.classList.add('active');
    };
  });

  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('active');
    };
  }

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  };

  if (modalForm) {
    modalForm.onsubmit = (e) => {
      e.preventDefault();
      const name = modalForm.querySelector('[name="m_name"]').value.trim();
      const phone = modalForm.querySelector('[name="m_phone"]').value.trim();
      const product = modalForm.querySelector('[name="m_product"]').value.trim();
      const note = modalForm.querySelector('[name="m_note"]').value.trim() || 'Interested in price & design options';

      // Log lead to CMS
      if (typeof CMS !== 'undefined') {
        CMS.saveInquiry({
          name: name,
          phone: phone,
          requirement: product,
          message: note
        });
      }

      let msg = `*Instant Product Enquiry - Harichand Steel*%0A%0A`;
      msg += `*Client Name:* ${encodeURIComponent(name)}%0A`;
      msg += `*Phone:* ${encodeURIComponent(phone)}%0A`;
      msg += `*Selected Product:* ${encodeURIComponent(product)}%0A`;
      msg += `*Requirements:* ${encodeURIComponent(note)}%0A`;

      const whatsappUrl = `https://wa.me/919870433868?text=${msg}`;
      window.open(whatsappUrl, '_blank');
      modal.classList.remove('active');
    };
  }
}

/* ==========================================================================
   SCROLL TO TOP BUTTON
   ========================================================================== */
function initScrollTop() {
  const scrollBtn = document.querySelector('.floating-btn.scroll-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   CMS HYDRATION - PRODUCTS & BLOGS
   ========================================================================== */
function escapeHtmlSafe(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}

function hydrateProductsFromCMS() {
  const grid = document.querySelector('.product-cards-grid');
  if (!grid || typeof CMS === 'undefined') return;

  const products = CMS.getProducts();
  if (!products || !products.length) return;

  grid.innerHTML = products.map(prod => {
    const specsHtml = Array.isArray(prod.specs) && prod.specs.length > 0
      ? prod.specs.map(s => `<span class="spec-pill"><i class="fas fa-shield-alt"></i> ${escapeHtmlSafe(s)}</span>`).join('')
      : '<span class="spec-pill"><i class="fas fa-check"></i> Standard Spec</span>';

    const badge = prod.badge || 'Premium Build';
    const safeTitle = escapeHtmlSafe(prod.title);
    const safeCat = escapeHtmlSafe(prod.category || 'aluminum-profile-gate');
    const safeCatName = escapeHtmlSafe(prod.categoryName || 'Aluminum Profile Gate');
    const safeImg = escapeHtmlSafe(prod.image || 'images/prod-1.png');
    const waText = encodeURIComponent(`Enquiry for ${prod.title}`);

    return `
      <article class="product-card" data-category="${safeCat}">
        <div class="product-thumb">
          <span class="product-badge">${escapeHtmlSafe(badge)}</span>
          <a href="#${escapeHtmlSafe(prod.id)}">
            <img src="${safeImg}" alt="${safeTitle}" onerror="this.src='images/prod-1.png'">
          </a>
        </div>
        <div class="product-body">
          <span class="product-category-link">${safeCatName}</span>
          <h3 class="product-title"><a href="#${escapeHtmlSafe(prod.id)}">${safeTitle}</a></h3>
          <div class="product-specs">
            ${specsHtml}
          </div>
          <div class="product-card-ctas">
            <button type="button" class="btn btn-outline-dark btn-sm trigger-inquiry-modal" data-product="${safeTitle}">View Details</button>
            <a href="https://wa.me/919870433868?text=${waText}" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Enquire</a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Re-bind product filter tabs and modal handlers
  initProductFilter();
  initModal();
}

function hydrateNewsFromCMS() {
  const grid = document.querySelector('.news-cards-grid');
  if (!grid || typeof CMS === 'undefined') return;

  const blogs = CMS.getBlogs();
  if (!blogs || !blogs.length) return;

  grid.innerHTML = blogs.map(blog => {
    const safeTitle = escapeHtmlSafe(blog.title);
    const safeTag = escapeHtmlSafe(blog.tag || 'News');
    const safeDate = escapeHtmlSafe(blog.date || '');
    const safeExcerpt = escapeHtmlSafe(blog.excerpt || '');
    const safeSlug = escapeHtmlSafe(blog.slug || 'news.html');
    const waText = encodeURIComponent(`Enquiry regarding ${blog.title}`);

    return `
      <article class="news-card">
        <div class="news-card-body">
          <div class="news-meta">
            <span><i class="fas fa-calendar-alt"></i> ${safeDate}</span>
            <span><i class="fas fa-tag"></i> ${safeTag}</span>
          </div>
          <h3 class="news-title"><a href="${safeSlug}">${safeTitle}</a></h3>
          <p class="news-excerpt">${safeExcerpt}</p>
          <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
            <a href="${safeSlug}" class="btn btn-outline-dark btn-sm">Read Article &rarr;</a>
            <a href="https://wa.me/919870433868?text=${waText}" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Ask Expert</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}
