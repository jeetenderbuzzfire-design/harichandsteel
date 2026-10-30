const fs = require('fs');
const path = require('path');

const schemas = JSON.parse(fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/schemas_extracted.json', 'utf8'));

// Common Head Components
function getHead(title, description, canonical, schemaArray) {
  let schemaTags = '';
  if (schemaArray && schemaArray.length) {
    schemaArray.forEach(s => {
      schemaTags += `\n  <script type="application/ld+json">\n  ${s}\n  </script>`;
    });
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
${schemaTags}
  <!-- Favicons -->
  <link rel="icon" href="images/favicon-32.jpeg" sizes="32x32">
  <link rel="icon" href="https://harichandsteel.com/wp-content/uploads/2024/07/cropped-HS-SIGN-32x32.jpeg" sizes="32x32">
  <link rel="apple-touch-icon" href="https://harichandsteel.com/wp-content/uploads/2024/07/cropped-HS-SIGN-180x180.jpeg">

  <!-- Google Fonts: Oswald & Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Font Awesome CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <!-- Custom Stylesheet -->
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>`;
}

// Common Topbar & Header
function getHeader(activeNav) {
  return `  <!-- ========================================================================
       TOP BAR
       ======================================================================== -->
  <div class="topbar">
    <div class="container">
      <div class="topbar-left">
        <span class="badge-est"><i class="fas fa-shield-alt"></i> ESTABLISHED 2004</span>
        <div class="topbar-item">
          <i class="fas fa-map-marker-alt"></i>
          <a href="https://share.google/zrv3GklB8WzuMdZG3" target="_blank" rel="noopener">Uttam Nagar, New Delhi, 110059</a>
        </div>
        <div class="topbar-item">
          <i class="fas fa-envelope"></i>
          <a href="mailto:Admin@HARICHANDSTEEL.COM">Admin@HARICHANDSTEEL.COM</a>
        </div>
      </div>
      <div class="topbar-right">
        <div class="topbar-item">
          <i class="fas fa-phone-alt"></i>
          <a href="tel:+919870433868">+91 98704 33868</a>
        </div>
        <div class="topbar-socials">
          <a href="https://www.facebook.com/HARICHAND.STEEL/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/harichand_steel_official/?hl=en" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://www.youtube.com/channel/UC7qdT0UJ9YB1GrXkZ9wwUlA" target="_blank" rel="noopener" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================
       MAIN HEADER & NAVIGATION (1-LINE OPTIMIZED)
       ======================================================================== -->
  <header class="site-header" id="masthead">
    <div class="container">
      <div class="nav-wrapper">
        <!-- Logo -->
        <a href="https://harichandsteel.com/" class="brand-logo" aria-label="Harichand Steel Home">
          <img src="images/logo.jpeg" alt="HARICHAND STEEL" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2024/07/cropped-HS-SIGN-1-69x49.jpeg'">
          <div class="brand-text">
            <span class="brand-title">HARICHAND STEEL</span>
            <span class="brand-subtitle">Aluminium & Steel Gates</span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="main-nav" id="mainNav">
          <ul class="nav-menu">
            <li class="nav-item">
              <a href="https://harichandsteel.com/home/" class="nav-link ${activeNav === 'home' ? 'active' : ''}">Home</a>
            </li>
            <li class="nav-item has-dropdown">
              <a href="https://harichandsteel.com/our-products/" class="nav-link ${activeNav === 'our-products' ? 'active' : ''}">
                Our Products <i class="fas fa-chevron-down arrow"></i>
              </a>
              <ul class="dropdown-menu">
                <li><a href="https://harichandsteel.com/product-category/aluminum-profile-gate/" class="dropdown-link"><i class="fas fa-angle-right"></i> Aluminum Profile Gate</a></li>
                <li><a href="https://harichandsteel.com/product-category/iron-main-gate/" class="dropdown-link"><i class="fas fa-angle-right"></i> Iron Main Gate</a></li>
                <li><a href="https://harichandsteel.com/product-category/steel-main-gate/" class="dropdown-link"><i class="fas fa-angle-right"></i> Steel Main Gate</a></li>
                <li><a href="https://harichandsteel.com/product-category/steel-door/" class="dropdown-link"><i class="fas fa-angle-right"></i> Steel Door</a></li>
                <li><a href="https://harichandsteel.com/product-category/powder-coated-gates/" class="dropdown-link"><i class="fas fa-angle-right"></i> Powder Coated Gates</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a href="https://harichandsteel.com/product/" class="nav-link ${activeNav === 'product' ? 'active' : ''}">Product</a>
            </li>
            <li class="nav-item">
              <a href="https://harichandsteel.com/about-us/" class="nav-link ${activeNav === 'about-us' ? 'active' : ''}">About us</a>
            </li>
            <li class="nav-item">
              <a href="https://harichandsteel.com/news/" class="nav-link ${activeNav === 'news' ? 'active' : ''}">News</a>
            </li>
            <li class="nav-item">
              <a href="https://harichandsteel.com/contact/" class="nav-link ${activeNav === 'contact' ? 'active' : ''}">Contact</a>
            </li>
          </ul>

          <!-- Action Buttons -->
          <div class="nav-actions">
            <a href="https://wa.me/919870433868" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener">
              <i class="fab fa-whatsapp"></i> WhatsApp Us
            </a>
            <a href="#quickEstimator" class="btn btn-primary btn-sm trigger-inquiry-modal" data-product="Custom Gate Solution">
              <i class="fas fa-file-invoice"></i> Get Free Quote
            </a>
          </div>
        </nav>

        <!-- Mobile Toggle Button -->
        <button class="mobile-menu-btn" aria-label="Toggle Navigation">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>
  </header>`;
}

// Common Footer & Floating Actions
function getFooter() {
  return `  <!-- ========================================================================
       FOOTER
       ======================================================================== -->
  <footer class="site-footer" id="colophon">
    <div class="footer-top">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Contact -->
          <div class="footer-col">
            <a href="https://harichandsteel.com/" class="brand-logo" style="margin-bottom: 18px;">
              <img src="images/logo.jpeg" alt="HARICHAND STEEL" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2024/07/cropped-HS-SIGN-1-69x49.jpeg'">
              <div class="brand-text">
                <span class="brand-title">HARICHAND STEEL</span>
                <span class="brand-subtitle">Aluminium Profile Gate Manufacturer</span>
              </div>
            </a>
            <p>
              Harichand Steel is widely recognized for its quality craftsmanship and reliable service. Established in 2004, we manufacture top-tier aluminium profile gates and steel gate solutions across Delhi NCR.
            </p>
            <div class="footer-contact-items">
              <div class="footer-contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <a href="https://share.google/zrv3GklB8WzuMdZG3" target="_blank" rel="noopener">
                  27B, Street, New Jankipuri, Anup Nagar, Uttam Nagar, Bindapur, New Delhi, Delhi, 110059
                </a>
              </div>
              <div class="footer-contact-item">
                <i class="fas fa-phone-alt"></i>
                <a href="tel:+919870433868">+91 98704 33868</a>
              </div>
              <div class="footer-contact-item">
                <i class="fas fa-envelope"></i>
                <a href="mailto:Admin@HARICHANDSTEEL.COM">Admin@HARICHANDSTEEL.COM</a>
              </div>
            </div>
          </div>

          <!-- Col 2: Products Categories -->
          <div class="footer-col">
            <h4>OUR PRODUCTS</h4>
            <div class="footer-links-list">
              <a href="https://harichandsteel.com/product-category/aluminum-profile-gate/"><i class="fas fa-chevron-right"></i> Aluminum Profile Gate</a>
              <a href="https://harichandsteel.com/product-category/iron-main-gate/"><i class="fas fa-chevron-right"></i> Iron Main Gate</a>
              <a href="https://harichandsteel.com/product-category/steel-main-gate/"><i class="fas fa-chevron-right"></i> Steel Main Gate</a>
              <a href="https://harichandsteel.com/product-category/steel-door/"><i class="fas fa-chevron-right"></i> Steel Door</a>
              <a href="https://harichandsteel.com/product-category/powder-coated-gates/"><i class="fas fa-chevron-right"></i> Powder Coated Gates</a>
              <a href="https://harichandsteel.com/product/"><i class="fas fa-chevron-right"></i> All Products</a>
            </div>
          </div>

          <!-- Col 3: Company & Values -->
          <div class="footer-col">
            <h4>About Us</h4>
            <div class="footer-links-list">
              <a href="https://harichandsteel.com/about-us/"><i class="fas fa-chevron-right"></i> About Us</a>
              <a href="https://harichandsteel.com/about-us/"><i class="fas fa-chevron-right"></i> OUR MOTO</a>
              <a href="https://harichandsteel.com/about-us/"><i class="fas fa-chevron-right"></i> WHY US</a>
              <a href="https://harichandsteel.com/about-us/"><i class="fas fa-chevron-right"></i> OUR TEAM</a>
              <a href="https://harichandsteel.com/news/"><i class="fas fa-chevron-right"></i> News & Insights</a>
              <a href="https://harichandsteel.com/contact/"><i class="fas fa-chevron-right"></i> Contact Us</a>
            </div>
          </div>

          <!-- Col 4: Follow Us & Connect -->
          <div class="footer-col">
            <h4>Follow Us</h4>
            <p>Connect with our social media channels to see our weekly gate fabrication projects, live installations, and client reviews.</p>
            <div class="footer-social-links">
              <a href="https://www.facebook.com/HARICHAND.STEEL/" target="_blank" rel="noopener" class="footer-social-btn" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/harichand_steel_official/?hl=en" target="_blank" rel="noopener" class="footer-social-btn" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              <a href="https://www.youtube.com/channel/UC7qdT0UJ9YB1GrXkZ9wwUlA" target="_blank" rel="noopener" class="footer-social-btn" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            </div>

            <div style="margin-top: 24px;">
              <a href="https://wa.me/919870433868" class="btn btn-whatsapp btn-sm" style="width: 100%;" target="_blank" rel="noopener">
                <i class="fab fa-whatsapp"></i> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Copyright Bar -->
    <div class="footer-bottom">
      <div class="container">
        <p>Copyright &copy; 2026 HARICHAND STEEL. All rights reserved.</p>
        <p>Redesigned in pure HTML5, CSS3, & JavaScript | Zero Dependencies</p>
      </div>
    </div>
  </footer>

  <!-- Floating Actions -->
  <div class="floating-actions">
    <a href="https://wa.me/919870433868" class="floating-btn whatsapp" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
      <i class="fab fa-whatsapp"></i>
    </a>
    <a href="tel:+919870433868" class="floating-btn phone" aria-label="Call Harichand Steel">
      <i class="fas fa-phone-alt"></i>
    </a>
    <button class="floating-btn scroll-top" aria-label="Scroll to top">
      <i class="fas fa-chevron-up"></i>
    </button>
  </div>

  <!-- Mobile Sticky Bottom CTA Bar -->
  <div class="mobile-sticky-bar">
    <div class="mobile-sticky-grid">
      <a href="tel:+919870433868" class="btn btn-primary btn-sm">
        <i class="fas fa-phone-alt"></i> Call Now
      </a>
      <a href="https://wa.me/919870433868" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener">
        <i class="fab fa-whatsapp"></i> WhatsApp
      </a>
    </div>
  </div>

  <!-- Modal Dialog -->
  <div class="modal-overlay" id="inquiryModal">
    <div class="modal-dialog">
      <button class="modal-close-btn" aria-label="Close Dialog"><i class="fas fa-times"></i></button>
      <div class="modal-header">
        <h3>Request Gate Quotation</h3>
        <p>Send your specifications directly to Harichand Steel via WhatsApp.</p>
      </div>
      <form id="modalInquiryForm">
        <div class="form-group" style="margin-bottom: 14px;">
          <label for="modalProductField">Selected Product</label>
          <input type="text" id="modalProductField" name="m_product" class="form-control" readonly>
        </div>
        <div class="form-group" style="margin-bottom: 14px;">
          <label for="modalClientName">Your Name</label>
          <input type="text" id="modalClientName" name="m_name" class="form-control" placeholder="Enter your full name" required>
        </div>
        <div class="form-group" style="margin-bottom: 14px;">
          <label for="modalClientPhone">Phone Number</label>
          <input type="tel" id="modalClientPhone" name="m_phone" class="form-control" placeholder="Enter phone number" required>
        </div>
        <div class="form-group" style="margin-bottom: 20px;">
          <label for="modalClientNote">Dimensions / Specific Requirements</label>
          <textarea id="modalClientNote" name="m_note" class="form-control" rows="3" placeholder="e.g. Need 12x7 ft gate with motor setup"></textarea>
        </div>
        <button type="submit" class="btn btn-whatsapp btn-lg" style="width: 100%;">
          <i class="fab fa-whatsapp"></i> Send Inquiry via WhatsApp
        </button>
      </form>
    </div>
  </div>

  <script src="js/main.js"></script>
</body>
</html>`;
}

// Banner Component for Inner Pages
function getBanner(title, breadcrumbCurrent, subtitle) {
  return `  <div class="page-header-banner">
    <div class="container">
      <nav class="breadcrumb-nav">
        <a href="https://harichandsteel.com/home/">Home</a>
        <span class="sep"><i class="fas fa-chevron-right"></i></span>
        <span>${breadcrumbCurrent}</span>
      </nav>
      <h1 class="page-title">${title}</h1>
      ${subtitle ? `<p class="page-lead">${subtitle}</p>` : ''}
    </div>
  </div>`;
}

module.exports = { getHead, getHeader, getFooter, getBanner, schemas };
