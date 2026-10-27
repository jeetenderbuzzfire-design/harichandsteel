const fs = require('fs');
const path = require('path');
const { getHead, getHeader, getFooter, getBanner, schemas } = require('./template_components');

const baseDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign';

// =========================================================================
// 1. ABOUT-US.HTML
// =========================================================================
function buildAboutUs() {
  const title = "About Us - HARICHAND STEEL";
  const desc = "Harichand Steel has built a strong reputation as a trusted manufacturer of aluminium profile gates and premium steel gate solutions in Delhi NCR since 2004.";
  const canonical = "https://harichandsteel.com/about-us/";
  const schemaList = schemas['about-us.html'] || [];

  const html = `${getHead(title, desc, canonical, schemaList)}
${getHeader('about-us')}
${getBanner('About Us', 'About Us', 'Welcome to Harichand Steel, where innovation blends with durability to define true excellence since 2004.')}

  <main id="content">
    <!-- Story & Core Values -->
    <section class="section" style="padding-top: 60px;">
      <div class="container">
        <div class="showcase-grid">
          <div class="showcase-content">
            <div class="section-subtitle">Since 2004</div>
            <h2>Experts Dedicated to Your Success</h2>
            <p class="lead-text">
              We are trusted steel gate fabricators based in Delhi, specializing in premium steel gates, aluminum profile gates, and rolling shutters. Established in 2004, Harichand Steel has spent more than two decades perfecting metal fabrication, delivering architectural excellence for luxury homes, residential estates, and commercial buildings.
            </p>
            <p>
              Our commitment to quality, modern design, and precision craftsmanship has made us a preferred choice for durable and stylish gate manufacturing across Delhi and Delhi NCR.
            </p>

            <div class="highlight-points" style="margin-top: 30px;">
              <div class="point-item">
                <i class="fas fa-shield-alt"></i>
                <div>
                  <h5>Durability</h5>
                  <p>Engineered to resist harsh weather, corrosion, and heavy daily usage without sagging or fading.</p>
                </div>
              </div>
              <div class="point-item">
                <i class="fas fa-dumbbell"></i>
                <div>
                  <h5>Strength</h5>
                  <p>Fabricated using heavy-gauge SS304 stainless steel, reinforced aluminium sections, and solid MS frameworks.</p>
                </div>
              </div>
              <div class="point-item">
                <i class="fas fa-handshake"></i>
                <div>
                  <h5>Trust</h5>
                  <p>Thousands of satisfied homeowners and builders who rely on our prompt delivery and honest factory pricing.</p>
                </div>
              </div>
              <div class="point-item">
                <i class="fas fa-tools"></i>
                <div>
                  <h5>STRONG FOUNDATION</h5>
                  <p>State-of-the-art welding, CNC profiling, and automated gate motor integrations.</p>
                </div>
              </div>
            </div>

            <div class="showcase-ctas" style="margin-top: 30px;">
              <a href="https://wa.me/919870433868" class="btn btn-whatsapp btn-lg" target="_blank" rel="noopener">
                <i class="fab fa-whatsapp"></i> Chat with Our Team
              </a>
              <a href="tel:+919870433868" class="btn btn-primary btn-lg">
                <i class="fas fa-phone-alt"></i> Call +91 98704 33868
              </a>
              <a href="https://harichandsteel.com/contact/" class="btn btn-outline-dark btn-lg">
                <i class="fas fa-map-marker-alt"></i> Visit Workshop
              </a>
            </div>
          </div>

          <div class="showcase-media">
            <div class="showcase-img-box">
              <img src="images/about-1.jpg" alt="Harichand Steel Gates Workshop" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2024/05/Main-Entrance-Gate_2850083224362_stainless-steel-window-grills-576x1024.jpg'">
            </div>
            <div class="experience-badge">
              <span class="years">20+</span>
              <span class="text">Years of Trust<br>Delhi NCR</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHAT WE DO / Best Manufacturing Services -->
    <section class="section" style="background: #ffffff; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
      <div class="container">
        <div class="section-head">
          <div class="section-subtitle">WHAT WE DO</div>
          <h2 class="section-title">Best Manufacturing Services</h2>
          <p class="section-desc">
            Harichand Steel offers comprehensive metal fabrication services designed to meet modern security standards and architectural aesthetics.
          </p>
        </div>

        <div class="category-cards-grid" style="grid-template-columns: repeat(5, 1fr);">
          <div class="cat-tile">
            <div class="cat-icon"><i class="fas fa-archway"></i></div>
            <h4>Steel Gates</h4>
            <p style="font-size: 0.84rem; color: #64748b; margin: 4px 0 10px;">SS304 main gates with modern laser-cut CNC designs and sturdy hinges.</p>
            <a href="https://harichandsteel.com/product-category/steel-main-gate/" style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary);">Explore Steel Gates &rarr;</a>
          </div>

          <div class="cat-tile">
            <div class="cat-icon"><i class="fas fa-border-all"></i></div>
            <h4>Steel Grills</h4>
            <p style="font-size: 0.84rem; color: #64748b; margin: 4px 0 10px;">Window security grills, boundary wall railings, and decorative patterns.</p>
            <a href="https://harichandsteel.com/steel-gate-design/" style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary);">View Grill Designs &rarr;</a>
          </div>

          <div class="cat-tile">
            <div class="cat-icon"><i class="fas fa-layer-group"></i></div>
            <h4>Steel Staircase</h4>
            <p style="font-size: 0.84rem; color: #64748b; margin: 4px 0 10px;">Indoor & outdoor spiral or straight steel stairs with safety railings.</p>
            <a href="https://harichandsteel.com/our-products/" style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary);">View Staircases &rarr;</a>
          </div>

          <div class="cat-tile">
            <div class="cat-icon"><i class="fas fa-door-open"></i></div>
            <h4>Aluminium Profile Gates</h4>
            <p style="font-size: 0.84rem; color: #64748b; margin: 4px 0 10px;">Lightweight, rust-free profile gates with wood-finish or rose-gold accents.</p>
            <a href="https://harichandsteel.com/product-category/aluminum-profile-gate/" style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary);">View Profile Gates &rarr;</a>
          </div>

          <div class="cat-tile">
            <div class="cat-icon"><i class="fas fa-bars"></i></div>
            <h4>Rolling Shutter</h4>
            <p style="font-size: 0.84rem; color: #64748b; margin: 4px 0 10px;">Motorized and manual heavy-duty security shutters for shops and warehouses.</p>
            <a href="https://harichandsteel.com/contact/" style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary);">Get Shutter Quote &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Workshop Photo Gallery Grid -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div class="section-subtitle">Real Installations</div>
          <h2 class="section-title">Our Workmanship & Gallery</h2>
          <p class="section-desc">A glimpse of gates fabricated and successfully handed over to clients in Janakpuri, Sonipat, and across Delhi NCR.</p>
        </div>

        <div class="collage-grid" style="grid-template-columns: repeat(4, 1fr); gap: 20px;">
          <div class="collage-item">
            <img src="images/about-1.jpg" alt="Aluminium profile gates" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2024/05/Main-Entrance-Gate_2850083224362_stainless-steel-window-grills-576x1024.jpg'">
            <div class="collage-overlay"><span class="collage-caption">Aluminium Profile Gates</span></div>
          </div>
          <div class="collage-item">
            <img src="images/about-2.jpg" alt="Aluminum Profile Gate Manufacturer In Janakpuri" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2024/05/golden-brown-profile-gate-1024x461.jpg'">
            <div class="collage-overlay"><span class="collage-caption">Golden Brown Finish</span></div>
          </div>
          <div class="collage-item">
            <img src="images/about-3.jpg" alt="best steel gate manufacturer in Delhi" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2024/05/20231029_141009-1024x768.jpg'">
            <div class="collage-overlay"><span class="collage-caption">SS304 Main Gate</span></div>
          </div>
          <div class="collage-item">
            <img src="images/about-4.jpg" alt="Harichand Steel Gates" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2024/05/20231018_133021-768x1024.jpg'">
            <div class="collage-overlay"><span class="collage-caption">Custom Steel Entrance</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Project Banner -->
    <section class="cta-project-banner">
      <div class="container">
        <div class="cta-banner-content">
          <div class="cta-banner-text">
            <h2 class="cta-heading-1">Are You Ready To Start</h2>
            <h2 class="cta-heading-2">New Project With Us?</h2>
            <p>Connect with our engineering specialists for custom fabrication, on-site measurements, and competitive pricing.</p>
          </div>
          <div class="cta-banner-buttons">
            <a href="https://wa.me/919911690126" class="btn btn-whatsapp btn-lg btn-pulse" target="_blank" rel="noopener">
              <i class="fab fa-whatsapp"></i> CONTACT US
            </a>
            <a href="tel:+919870433868" class="btn btn-secondary btn-lg">
              <i class="fas fa-phone-alt"></i> Call +91 98704 33868
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
${getFooter()}`;

  fs.writeFileSync(path.join(baseDir, 'about-us.html'), html, 'utf8');
  console.log('Built about-us.html');
}

// =========================================================================
// 2. OUR-PRODUCTS.HTML
// =========================================================================
function buildOurProducts() {
  const title = "Our Products - HARICHAND STEEL";
  const desc = "Explore our premium gate collection: Aluminum Profile Gates, Steel Gates, Steel Doors, Staircase Railings, Balcony Railings, and custom architectural solutions.";
  const canonical = "https://harichandsteel.com/our-products/";
  const schemaList = schemas['our-products.html'] || [];

  const html = `${getHead(title, desc, canonical, schemaList)}
${getHeader('our-products')}
${getBanner('Our Products', 'Our Products', 'What Product We Provide - Engineered for supreme durability, luxury finishes, and maximum property security.')}

  <main id="content">
    <!-- Categories Breakdown -->
    <section class="section" style="padding-top: 60px;">
      <div class="container">
        <div class="section-head">
          <div class="section-subtitle">Comprehensive Gate Portfolio</div>
          <h2 class="section-title">What Product We Provide</h2>
          <p class="section-desc">
            We are committed to delivering high-quality services and superior steel fabrication solutions to our clients. As a trusted steel door manufacturer in Delhi, Harichand Steel focuses on precision craftsmanship, premium materials, and strict quality standards.
          </p>
        </div>

        <div class="category-cards-grid" style="grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 50px;">
          <!-- Cat 1 -->
          <div class="cat-tile" style="padding: 32px 24px; text-align: left; align-items: flex-start;">
            <div class="cat-icon" style="margin-bottom: 12px;"><i class="fas fa-door-open"></i></div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 8px;">Aluminum Profile Gate</h3>
            <p style="font-size: 0.95rem; color: #475569; line-height: 1.7; margin-bottom: 16px;">
              Engineered with lightweight yet rigid aluminium extrusions, offering modern luxury styling, rust-proof longevity, and effortless automation capability.
            </p>
            <div style="display: flex; gap: 10px; margin-top: auto;">
              <a href="https://harichandsteel.com/product-category/aluminum-profile-gate/" class="btn btn-outline-dark btn-sm">View Models</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Aluminum%20Profile%20Gate" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>

          <!-- Cat 2 -->
          <div class="cat-tile" style="padding: 32px 24px; text-align: left; align-items: flex-start;">
            <div class="cat-icon" style="margin-bottom: 12px;"><i class="fas fa-shield-alt"></i></div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 8px;">Steel Gate</h3>
            <p style="font-size: 0.95rem; color: #475569; line-height: 1.7; margin-bottom: 16px;">
              Fabricated from genuine SS304 grade stainless steel and heavy-gauge mild steel. Features intricate CNC laser-cut designs with polished mirror or matte finishes.
            </p>
            <div style="display: flex; gap: 10px; margin-top: auto;">
              <a href="https://harichandsteel.com/product-category/steel-main-gate/" class="btn btn-outline-dark btn-sm">View Models</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Steel%20Main%20Gate" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>

          <!-- Cat 3 -->
          <div class="cat-tile" style="padding: 32px 24px; text-align: left; align-items: flex-start;">
            <div class="cat-icon" style="margin-bottom: 12px;"><i class="fas fa-columns"></i></div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 8px;">Steel Doors</h3>
            <p style="font-size: 0.95rem; color: #475569; line-height: 1.7; margin-bottom: 16px;">
              Heavy-duty security doors designed for main entrances, back doors, and security partitions with multi-point locking systems and weatherproofing.
            </p>
            <div style="display: flex; gap: 10px; margin-top: auto;">
              <a href="https://harichandsteel.com/product-category/steel-door/" class="btn btn-outline-dark btn-sm">View Models</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Steel%20Doors" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>

          <!-- Cat 4 -->
          <div class="cat-tile" style="padding: 32px 24px; text-align: left; align-items: flex-start;">
            <div class="cat-icon" style="margin-bottom: 12px;"><i class="fas fa-layer-group"></i></div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 8px;">Stair Case Railing</h3>
            <p style="font-size: 0.95rem; color: #475569; line-height: 1.7; margin-bottom: 16px;">
              Architectural stainless steel, glass, and iron railings for indoor and outdoor staircases ensuring both safety and aesthetic elegance.
            </p>
            <div style="display: flex; gap: 10px; margin-top: auto;">
              <a href="https://harichandsteel.com/contact/" class="btn btn-outline-dark btn-sm">Enquire Design</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Staircase%20Railing" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>

          <!-- Cat 5 -->
          <div class="cat-tile" style="padding: 32px 24px; text-align: left; align-items: flex-start;">
            <div class="cat-icon" style="margin-bottom: 12px;"><i class="fas fa-border-all"></i></div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 8px;">Balcony Railing</h3>
            <p style="font-size: 0.95rem; color: #475569; line-height: 1.7; margin-bottom: 16px;">
              High-strength rust-proof railings designed to withstand continuous exposure to rain and sun, enhancing the external facade of your property.
            </p>
            <div style="display: flex; gap: 10px; margin-top: auto;">
              <a href="https://harichandsteel.com/contact/" class="btn btn-outline-dark btn-sm">Enquire Design</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Balcony%20Railing" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>

          <!-- Cat 6 -->
          <div class="cat-tile" style="padding: 32px 24px; text-align: left; align-items: flex-start;">
            <div class="cat-icon" style="margin-bottom: 12px;"><i class="fas fa-paint-roller"></i></div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 8px;">Powder Coated Gates</h3>
            <p style="font-size: 0.95rem; color: #475569; line-height: 1.7; margin-bottom: 16px;">
              Electrostatically applied powder coat available in matte black, antique bronze, and custom colors, providing exceptional scratch and corrosion resistance.
            </p>
            <div style="display: flex; gap: 10px; margin-top: auto;">
              <a href="https://harichandsteel.com/product-category/powder-coated-gates/" class="btn btn-outline-dark btn-sm">View Models</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Powder%20Coated%20Gates" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>
        </div>

        <!-- Featured Products Showcase -->
        <div class="section-head" style="margin-top: 60px;">
          <div class="section-subtitle">Signature Installations</div>
          <h2 class="section-title">Our Amenities & How It Looks</h2>
          <p class="section-desc">
            At Harichand Steel, we go beyond basic functionality to create amenities that enhance every space. Our designs combine elegance with strength, delivering visually appealing, durable, and well-crafted solutions.
          </p>
        </div>

        <div class="product-cards-grid">
          <!-- Item 1 -->
          <article class="product-card">
            <div class="product-thumb">
              <span class="product-badge">Top Rated</span>
              <a href="https://harichandsteel.com/product/aluminium-door-profile-gate/">
                <img src="images/prod-1.png" alt="Aluminium Door Profile Gate" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2026/02/ChatGPT-Image-Feb-24-2026-02_47_54-PM.png'">
              </a>
            </div>
            <div class="product-body">
              <span class="product-category-link">Aluminum Profile Gate</span>
              <h4 class="product-title"><a href="https://harichandsteel.com/product/aluminium-door-profile-gate/">Aluminium Door Profile Gate</a></h4>
              <div class="product-card-ctas">
                <a href="https://harichandsteel.com/product/aluminium-door-profile-gate/" class="btn btn-outline-dark btn-sm">View Details</a>
                <a href="https://wa.me/919870433868?text=Interested%20in%20Aluminium%20Door%20Profile%20Gate" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Enquire</a>
              </div>
            </div>
          </article>

          <!-- Item 2 -->
          <article class="product-card">
            <div class="product-thumb">
              <span class="product-badge">Rose Gold Pull</span>
              <a href="https://harichandsteel.com/product/aluminum-profile-gate-with-rose-gold-handle/">
                <img src="images/prod-2.jpeg" alt="Aluminum Profile Gate With Rose Gold Handle" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-1.26.00-PM.jpeg'">
              </a>
            </div>
            <div class="product-body">
              <span class="product-category-link">Aluminum Profile Gate</span>
              <h4 class="product-title"><a href="https://harichandsteel.com/product/aluminum-profile-gate-with-rose-gold-handle/">Aluminum Profile Gate With Rose Gold Handle</a></h4>
              <div class="product-card-ctas">
                <a href="https://harichandsteel.com/product/aluminum-profile-gate-with-rose-gold-handle/" class="btn btn-outline-dark btn-sm">View Details</a>
                <a href="https://wa.me/919870433868?text=Interested%20in%20Aluminum%20Profile%20Gate%20With%20Rose%20Gold%20Handle" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Enquire</a>
              </div>
            </div>
          </article>

          <!-- Item 3 -->
          <article class="product-card">
            <div class="product-thumb">
              <span class="product-badge">Reinforced Frame</span>
              <a href="https://harichandsteel.com/product/aluminum-profile-gate-with-steel-frame/">
                <img src="images/prod-3.jpeg" alt="Aluminum Profile Gate With Steel Frame" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-1.22.39-PM.jpeg'">
              </a>
            </div>
            <div class="product-body">
              <span class="product-category-link">Aluminum Profile Gate</span>
              <h4 class="product-title"><a href="https://harichandsteel.com/product/aluminum-profile-gate-with-steel-frame/">Aluminum Profile Gate With Steel Frame</a></h4>
              <div class="product-card-ctas">
                <a href="https://harichandsteel.com/product/aluminum-profile-gate-with-steel-frame/" class="btn btn-outline-dark btn-sm">View Details</a>
                <a href="https://wa.me/919870433868?text=Interested%20in%20Aluminum%20Profile%20Gate%20With%20Steel%20Frame" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Enquire</a>
              </div>
            </div>
          </article>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="https://harichandsteel.com/product/" class="btn btn-primary btn-lg">
            <i class="fas fa-th-large"></i> Browse Full Product Catalog (32 Designs)
          </a>
        </div>
      </div>
    </section>

    <!-- Project CTA Banner -->
    <section class="cta-project-banner">
      <div class="container">
        <div class="cta-banner-content">
          <div class="cta-banner-text">
            <h2 class="cta-heading-1">Are You Ready To Start</h2>
            <h2 class="cta-heading-2">New Project With Us?</h2>
            <p>Get instant assistance with gate sizing, material specifications, and doorstep measurements across Delhi NCR.</p>
          </div>
          <div class="cta-banner-buttons">
            <a href="https://wa.me/919911690126" class="btn btn-whatsapp btn-lg btn-pulse" target="_blank" rel="noopener">
              <i class="fab fa-whatsapp"></i> CONTACT US
            </a>
            <a href="tel:+919870433868" class="btn btn-secondary btn-lg">
              <i class="fas fa-phone-alt"></i> Call +91 98704 33868
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
${getFooter()}`;

  fs.writeFileSync(path.join(baseDir, 'our-products.html'), html, 'utf8');
  console.log('Built our-products.html');
}

// =========================================================================
// 3. PRODUCT.HTML
// =========================================================================
function buildProductCatalog() {
  const title = "Product - HARICHAND STEEL";
  const desc = "Browse our full product catalogue: Aluminium profile gates, stainless steel main gates, steel doors, double door gates, and luxury entrance solutions.";
  const canonical = "https://harichandsteel.com/product/";
  const schemaList = schemas['product.html'] || [];

  const products = [
    { title: "Aluminium Door Profile Gate", link: "https://harichandsteel.com/product/aluminium-door-profile-gate/", img: "images/prod-1.png", cdn: "https://harichandsteel.com/wp-content/uploads/2026/02/ChatGPT-Image-Feb-24-2026-02_47_54-PM-300x300.png", cat: "Aluminum Profile Gate" },
    { title: "Aluminium Profile Gate For Home", link: "https://harichandsteel.com/product/aluminium-profile-gate-for-home/", img: "images/Aluminium-Profile-Main-Gate_2851615169991_product-jpeg-300x300.jpg", cdn: "https://harichandsteel.com/wp-content/uploads/2024/05/Aluminium-Profile-Main-Gate_2851615169991_product-jpeg-300x300.jpg", cat: "Aluminum Profile Gate" },
    { title: "Aluminium Profile Main Gate", link: "https://harichandsteel.com/product/aluminium-profile-main-gate/", img: "images/ChatGPT-Image-Feb-23-2026-12_37_41-PM-300x300.png", cdn: "https://harichandsteel.com/wp-content/uploads/2026/02/ChatGPT-Image-Feb-23-2026-12_37_41-PM-300x300.png", cat: "Aluminum Profile Gate" },
    { title: "Aluminium Sliding Main Entrance Gate", link: "https://harichandsteel.com/product/aluminium-sliding-main-entrance-gate/", img: "images/WhatsApp-Image-2026-02-23-at-12.55.26-PM-300x300.jpeg", cdn: "https://harichandsteel.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-12.55.26-PM-300x300.jpeg", cat: "Aluminum Profile Gate" },
    { title: "Aluminum Profile Gate With Rose Gold Handle", link: "https://harichandsteel.com/product/aluminum-profile-gate-with-rose-gold-handle/", img: "images/prod-2.jpeg", cdn: "https://harichandsteel.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-1.26.00-PM-300x300.jpeg", cat: "Aluminum Profile Gate" },
    { title: "Aluminum Profile Gate With Steel Frame", link: "https://harichandsteel.com/product/aluminum-profile-gate-with-steel-frame/", img: "images/prod-3.jpeg", cdn: "https://harichandsteel.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-1.22.39-PM-300x300.jpeg", cat: "Aluminum Profile Gate" },
    { title: "Aluminum Profile Swing Gate for Home", link: "https://harichandsteel.com/product/aluminum-profile-swing-gate-for-home/", img: "images/WhatsApp-Image-2026-02-23-at-1.07.57-PM-300x300.jpeg", cdn: "https://harichandsteel.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-1.07.57-PM-300x300.jpeg", cat: "Aluminum Profile Gate" },
    { title: "Double Door Steel Gate", link: "https://harichandsteel.com/product/double-door-steel-gate/", img: "images/ChatGPT-Image-Feb-23-2026-04_42_39-PM-300x300.png", cdn: "https://harichandsteel.com/wp-content/uploads/2026/02/ChatGPT-Image-Feb-23-2026-04_42_39-PM-300x300.png", cat: "Steel Main Gate" },
    { title: "Entrance Steel Door For Home", link: "https://harichandsteel.com/product/entrance-steel-door-for-home/", img: "images/ChatGPT-Image-Feb-23-2026-04_22_55-PM-300x300.png", cdn: "https://harichandsteel.com/wp-content/uploads/2026/02/ChatGPT-Image-Feb-23-2026-04_22_55-PM-300x300.png", cat: "Steel Door" }
  ];

  let cardsHtml = '';
  products.forEach(p => {
    cardsHtml += `
          <article class="product-card" data-category="${p.cat.toLowerCase().replace(/\s+/g, '-')}">
            <div class="product-thumb">
              <span class="product-badge">Original Build</span>
              <a href="${p.link}">
                <img src="${p.img}" alt="${p.title}" onerror="this.src='${p.cdn}'">
              </a>
            </div>
            <div class="product-body">
              <span class="product-category-link">${p.cat}</span>
              <h3 class="product-title"><a href="${p.link}">${p.title}</a></h3>
              <div class="product-specs">
                <span class="spec-pill"><i class="fas fa-shield-alt"></i> SS Grade</span>
                <span class="spec-pill"><i class="fas fa-ruler-combined"></i> Custom Sizing</span>
                <span class="spec-pill"><i class="fas fa-lock"></i> Smart Lock Ready</span>
              </div>
              <div class="product-card-ctas">
                <a href="${p.link}" class="btn btn-outline-dark btn-sm">View Details</a>
                <a href="https://wa.me/919870433868?text=Enquiry%20for%20${encodeURIComponent(p.title)}" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Enquire</a>
              </div>
            </div>
          </article>`;
  });

  const html = `${getHead(title, desc, canonical, schemaList)}
${getHeader('product')}
${getBanner('Gate Products Catalogue', 'Product', 'Explore premium handcrafted gate models built for luxury, safety, and longevity.')}

  <main id="content">
    <section class="section" style="padding-top: 60px;">
      <div class="container">
        <!-- Filter Controls -->
        <div class="product-filters">
          <button class="filter-btn active" data-filter="all">All Gates (32)</button>
          <button class="filter-btn" data-filter="aluminum-profile-gate">Aluminum Profile Gate</button>
          <button class="filter-btn" data-filter="steel-main-gate">Steel Main Gate</button>
          <button class="filter-btn" data-filter="steel-door">Steel Door</button>
        </div>

        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Showing 1&ndash;9 of 32 results</p>

        <!-- Product Cards Grid -->
        <div class="product-cards-grid">
${cardsHtml}
        </div>

        <!-- Pagination Box -->
        <div class="load-more-box" style="margin-top: 30px;">
          <a href="https://harichandsteel.com/home/page/2/" class="btn btn-primary btn-lg">
            <i class="fas fa-sync-alt"></i> Load More Products
          </a>
        </div>
      </div>
    </section>

    <!-- Fast Estimator -->
    <section class="section quote-estimator-section" id="quickEstimator">
      <div class="container">
        <div class="estimator-box">
          <div class="estimator-grid">
            <div class="estimator-info">
              <div class="section-subtitle" style="color: #f59e0b;">Custom Fabrication</div>
              <h3>Need Custom Sizing for Any Product?</h3>
              <p>Every gate is fabricated strictly according to your entrance opening dimensions. Provide your approximate dimensions for instant pricing.</p>
              <div class="estimator-perks">
                <div class="perk-item"><i class="fas fa-check-circle"></i> Doorstep site visit in Delhi NCR</div>
                <div class="perk-item"><i class="fas fa-check-circle"></i> Computerized 3D architectural mockup</div>
              </div>
            </div>
            <form class="estimator-form" id="quoteEstimatorForm">
              <div class="form-group"><label>Your Name</label><input type="text" name="name" class="form-control" placeholder="Your Name" required></div>
              <div class="form-group"><label>Phone Number</label><input type="tel" name="phone" class="form-control" placeholder="+91 98704 33868" required></div>
              <div class="form-group"><label>Gate Type</label><select name="gate_type" class="form-control"><option>Aluminium Profile Gate</option><option>Steel Main Gate</option><option>Steel Door</option></select></div>
              <div class="form-group"><label>Size</label><input type="text" name="gate_size" class="form-control" placeholder="10 ft x 6 ft"></div>
              <div class="form-group full-width"><button type="submit" class="btn btn-whatsapp btn-lg" style="width: 100%;"><i class="fab fa-whatsapp"></i> Get Quote on WhatsApp</button></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
${getFooter()}`;

  fs.writeFileSync(path.join(baseDir, 'product.html'), html, 'utf8');
  console.log('Built product.html');
}

// =========================================================================
// 4. CONTACT.HTML
// =========================================================================
function buildContact() {
  const title = "Contact - HARICHAND STEEL";
  const desc = "Get in touch with Harichand Steel in Uttam Nagar, New Delhi. Call +91 98704 33868 or send an instant inquiry for gate fabrication, site measurement, and pricing.";
  const canonical = "https://harichandsteel.com/contact/";
  const schemaList = schemas['contact.html'] || [];

  const html = `${getHead(title, desc, canonical, schemaList)}
${getHeader('contact')}
${getBanner('Contact Harichand Steel', 'Contact', 'Have questions or need an estimate? Our team is available 6 days a week to assist you.')}

  <main id="content">
    <section class="section" style="padding-top: 60px;">
      <div class="container">
        <div class="contact-page-grid">
          <!-- Contact Form Card -->
          <div class="contact-form-card">
            <div class="section-subtitle">Send A Direct Message</div>
            <h2 style="font-family: var(--font-heading); font-size: 2rem; margin-bottom: 20px;">Contact Harichand Steel</h2>
            <p style="color: #64748b; margin-bottom: 30px;">
              Fill in your details below. We will calculate material requirements and respond with technical specifications and pricing via WhatsApp or phone call.
            </p>

            <form id="contactPageForm" onsubmit="event.preventDefault(); const n = this.name.value; const p = this.phone.value; const e = this.email.value; const m = this.message.value; window.open('https://wa.me/919870433868?text=' + encodeURIComponent('New Contact Form Submission:\\nName: ' + n + '\\nPhone: ' + p + '\\nEmail: ' + e + '\\nMessage: ' + m), '_blank');">
              <div class="form-group" style="margin-bottom: 18px;">
                <label for="cName">Your Full Name</label>
                <input type="text" id="cName" name="name" class="form-control" style="background: #f8fafc; color: #1e293b; border-color: #cbd5e1;" placeholder="Enter your full name" required>
              </div>

              <div class="form-group" style="margin-bottom: 18px;">
                <label for="cPhone">Contact No (Phone / WhatsApp)</label>
                <input type="tel" id="cPhone" name="phone" class="form-control" style="background: #f8fafc; color: #1e293b; border-color: #cbd5e1;" value="91" required>
              </div>

              <div class="form-group" style="margin-bottom: 18px;">
                <label for="cEmail">Email Address</label>
                <input type="email" id="cEmail" name="email" class="form-control" style="background: #f8fafc; color: #1e293b; border-color: #cbd5e1;" placeholder="name@example.com" required>
              </div>

              <div class="form-group" style="margin-bottom: 24px;">
                <label for="cMessage">Message / Gate Requirement</label>
                <textarea id="cMessage" name="message" class="form-control" rows="4" style="background: #f8fafc; color: #1e293b; border-color: #cbd5e1;" placeholder="Describe gate type, dimensions, or site location..."></textarea>
              </div>

              <button type="submit" class="btn btn-whatsapp btn-lg" style="width: 100%;">
                <i class="fab fa-whatsapp"></i> Send via WhatsApp
              </button>
            </form>
          </div>

          <!-- Contact Info Panel -->
          <div class="contact-info-panel">
            <div>
              <div class="section-subtitle" style="color: #f59e0b;">Get In Touch</div>
              <h3>Contact Information</h3>
              <p style="color: #cbd5e1; margin-bottom: 30px;">
                Reach us directly for immediate consultations, site appointments, and gate quotes.
              </p>

              <div class="contact-list">
                <div class="contact-row">
                  <div class="contact-row-icon"><i class="fas fa-map-marked-alt"></i></div>
                  <div class="contact-row-text">
                    <h5 style="color: #94a3b8;">Factory / Office Address</h5>
                    <p style="color: #ffffff;">
                      <a href="https://share.google/zrv3GklB8WzuMdZG3" target="_blank" rel="noopener" style="color: #ffffff;">
                        27B, Street, New Jankipuri, Anup Nagar, Uttam Nagar, Bindapur, New Delhi, Delhi, 110059
                      </a>
                    </p>
                  </div>
                </div>

                <div class="contact-row">
                  <div class="contact-row-icon"><i class="fas fa-phone-alt"></i></div>
                  <div class="contact-row-text">
                    <h5 style="color: #94a3b8;">Direct Calling</h5>
                    <p><a href="tel:+919870433868" style="color: #ffffff;">+91 98704 33868</a></p>
                  </div>
                </div>

                <div class="contact-row">
                  <div class="contact-row-icon"><i class="fab fa-whatsapp"></i></div>
                  <div class="contact-row-text">
                    <h5 style="color: #94a3b8;">WhatsApp Support</h5>
                    <p><a href="https://wa.me/919870433868" target="_blank" rel="noopener" style="color: #22c55e;">+91 98704 33868</a></p>
                  </div>
                </div>

                <div class="contact-row">
                  <div class="contact-row-icon"><i class="fas fa-envelope"></i></div>
                  <div class="contact-row-text">
                    <h5 style="color: #94a3b8;">Official Email</h5>
                    <p><a href="mailto:Admin@HARICHANDSTEEL.COM" style="color: #ffffff;">Admin@HARICHANDSTEEL.COM</a></p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 style="color: #cbd5e1; text-transform: uppercase; font-size: 0.84rem; letter-spacing: 0.05em; margin-bottom: 12px;">Follow & Connect</h5>
              <div class="contact-social-pills">
                <a href="https://www.facebook.com/HARICHAND.STEEL/" target="_blank" rel="noopener" class="social-pill"><i class="fab fa-facebook-f"></i> Facebook</a>
                <a href="https://www.instagram.com/harichand_steel_official/?hl=en" target="_blank" rel="noopener" class="social-pill"><i class="fab fa-instagram"></i> Instagram</a>
                <a href="https://www.youtube.com/channel/UC7qdT0UJ9YB1GrXkZ9wwUlA" target="_blank" rel="noopener" class="social-pill"><i class="fab fa-youtube"></i> YouTube</a>
                <a href="https://wa.me/919870433868" target="_blank" rel="noopener" class="social-pill"><i class="fab fa-whatsapp"></i> WhatsApp</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Google Map Section -->
        <div class="map-container-box" style="height: 480px;">
          <iframe 
            src="https://maps.google.com/maps?q=Harichand%20steel&amp;t=m&amp;z=15&amp;output=embed&amp;iwloc=near" 
            loading="lazy" 
            title="Harichand Steel Location Map" 
            aria-label="Harichand steel">
          </iframe>
        </div>
      </div>
    </section>
  </main>
${getFooter()}`;

  fs.writeFileSync(path.join(baseDir, 'contact.html'), html, 'utf8');
  console.log('Built contact.html');
}

// =========================================================================
// 5. NEWS.HTML
// =========================================================================
function buildNews() {
  const title = "News & Articles - HARICHAND STEEL";
  const desc = "Stay informed with the latest gate manufacturing insights, design trends, architectural guides, and updates from Harichand Steel in Delhi NCR.";
  const canonical = "https://harichandsteel.com/news/";
  const schemaList = schemas['news.html'] || [];

  const articles = [
    {
      title: "Latest Steel Gate Design (2025) – Ultimate Modern Guide",
      link: "https://harichandsteel.com/steel-gate-design/",
      desc: "Explore the most popular steel gate designs for modern homes, villas, and commercial properties, including laser-cut CNC patterns, SS304 durability, and motorized options.",
      date: "January 19, 2026",
      tag: "Design Guide"
    },
    {
      title: "Best Steel Gate Manufacturer In Delhi – Complete Buyer's Guide",
      link: "https://harichandsteel.com/best-steel-gate-manufacturer-in-delhi/",
      desc: "Why Harichand Steel is recognized as Delhi's #1 steel gate manufacturer. Insights on material grades, SS304 vs SS202, order processes, and custom fabrication.",
      date: "February 10, 2026",
      tag: "Manufacturing"
    },
    {
      title: "Aluminium Profile Gate Manufacturer in Janakpuri – Innovation & Strength",
      link: "https://harichandsteel.com/aluminium-profile-gate-manufacturer-in-janakpuri/",
      desc: "How aluminium profile gates have revolutionized residential entrances in Janakpuri and Delhi NCR with lightweight operation, weather immunity, and wood-finish styling.",
      date: "November 6, 2024",
      tag: "Case Study"
    },
    {
      title: "Aluminum Profile Gate Manufacturer in Prithviraj Road",
      link: "https://harichandsteel.com/aluminum-profile-gate-manufacturer-in-prithviraj-road/",
      desc: "High-end bespoke architectural gate installations tailored for premium residences and diplomatic areas across Central Delhi and Prithviraj Road.",
      date: "November 6, 2024",
      tag: "Luxury Projects"
    }
  ];

  let cardsHtml = '';
  articles.forEach(a => {
    cardsHtml += `
          <article class="news-card">
            <div class="news-card-body">
              <div class="news-meta">
                <span><i class="fas fa-calendar-alt"></i> ${a.date}</span>
                <span><i class="fas fa-tag"></i> ${a.tag}</span>
              </div>
              <h3 class="news-title"><a href="${a.link}">${a.title}</a></h3>
              <p class="news-excerpt">${a.desc}</p>
              <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                <a href="${a.link}" class="btn btn-outline-dark btn-sm">Read Article &rarr;</a>
                <a href="https://wa.me/919870433868?text=Enquiry%20regarding%20${encodeURIComponent(a.title)}" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Ask Expert</a>
              </div>
            </div>
          </article>`;
  });

  const html = `${getHead(title, desc, canonical, schemaList)}
${getHeader('news')}
${getBanner('News & Insights', 'News', 'Latest architectural trends, gate fabrication guides, and project spotlights from Harichand Steel.')}

  <main id="content">
    <section class="section" style="padding-top: 60px;">
      <div class="container">
        <div class="news-cards-grid">
${cardsHtml}
        </div>

        <!-- Consultation Banner -->
        <div class="best-intro-box" style="margin-top: 40px;">
          <div class="best-intro-text">
            <h2>Need Technical Advice on Gate Architecture?</h2>
            <p>Our senior gate engineers are available for free consultations regarding structural loading, motorized gate motors, and alloy grades.</p>
          </div>
          <div class="best-intro-cta">
            <a href="https://wa.me/919870433868" class="btn btn-whatsapp btn-lg" target="_blank" rel="noopener">
              <i class="fab fa-whatsapp"></i> Chat on WhatsApp
            </a>
            <a href="tel:+919870433868" class="btn btn-primary btn-lg">
              <i class="fas fa-phone-alt"></i> Call +91 98704 33868
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
${getFooter()}`;

  fs.writeFileSync(path.join(baseDir, 'news.html'), html, 'utf8');
  console.log('Built news.html');
}

buildAboutUs();
buildOurProducts();
buildProductCatalog();
buildContact();
buildNews();
