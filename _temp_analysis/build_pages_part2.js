const fs = require('fs');
const path = require('path');
const { getHead, getHeader, getFooter, getBanner, schemas } = require('./template_components');

const baseDir = 'C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign';

// =========================================================================
// 6. STEEL-GATE-DESIGN.HTML
// =========================================================================
function buildSteelGateDesign() {
  const title = "Latest Steel Gate Design | Get Best Price";
  const desc = "Discover the latest modern steel gate designs in 2025. Explore stainless steel SS304 gates, laser cut CNC designs, window grills, and custom fabrication from Harichand Steel.";
  const canonical = "https://harichandsteel.com/steel-gate-design/";
  const schemaList = schemas['steel-gate-design.html'] || [];

  const html = `${getHead(title, desc, canonical, schemaList)}
${getHeader('news')}
${getBanner('Steel Gate Design (2025)', 'Steel Gate Design', 'Strength, Security & Style — Complete guide to modern stainless steel and CNC gate designs.')}

  <main id="content">
    <section class="section" style="padding-top: 60px;">
      <div class="container">
        <div class="article-container">
          <div class="article-content">
            <div class="section-subtitle">Design Blueprint</div>
            <h1 style="font-family: var(--font-heading); font-size: clamp(2rem, 3.5vw, 2.8rem); line-height: 1.2; margin-bottom: 24px;">
              Ultimate Modern Steel Gate Designs (2025)
            </h1>

            <p class="lead-text" style="font-size: 1.15rem; font-weight: 500; color: #1e293b;">
              Premium steel gate designs crafted for security, style, and durability. When selecting an entrance gate for your residence or commercial property, stainless steel (especially grade SS304) represents the pinnacle of modern architectural design, corrosion resistance, and effortless maintenance.
            </p>

            <div style="margin: 32px 0;">
              <img src="images/about-3.jpg" alt="Steel Gate Design Showcase" style="width: 100%; max-height: 480px; object-fit: cover; border-radius: var(--radius-md);" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2024/05/20231029_141009-1024x768.jpg'">
            </div>

            <h2>Types of Steel Gate Designs</h2>
            <p>
              Steel gates have evolved far beyond basic metal bars. At Harichand Steel, our fabrication workshop produces multiple distinctive gate design styles tailored to varying architectural languages:
            </p>

            <ul>
              <li><strong>Modern Steel Gate:</strong> Minimalist horizontal slat gates, integrated flush sheets, and contrasting metallic handles that match contemporary villa architecture.</li>
              <li><strong>Laser Cut CNC Steel Gates:</strong> Intricate geometric, floral, or abstract patterns cut into heavy gauge steel plates with computerized precision.</li>
              <li><strong>Aluminium Profile Steel Framework:</strong> Combining the structural rigidity of steel with the lightweight elegance and rust immunity of aluminium profiles.</li>
              <li><strong>Double Door Swing Gates:</strong> Classic majestic entrances ideal for wide driveways and bungalow entrances.</li>
              <li><strong>Sliding Motorized Steel Gates:</strong> Space-saving sliding track designs compatible with automatic remote sensors and mobile app controls.</li>
            </ul>

            <div class="highlight-points" style="margin: 36px 0;">
              <div class="point-item">
                <i class="fas fa-gem"></i>
                <div>
                  <h5>SS304 Marine Grade</h5>
                  <p>Guaranteed rust-proof performance even under continuous monsoon rain and high humidity.</p>
                </div>
              </div>
              <div class="point-item">
                <i class="fas fa-bolt"></i>
                <div>
                  <h5>Motorization Ready</h5>
                  <p>Engineered balanced weight distribution for smooth operation with Italian and Indian gate motors.</p>
                </div>
              </div>
            </div>

            <h2>Best Steel Gate Designs</h2>
            <p>
              Choosing the right design depends on property privacy requirements, air circulation, and structural proportions. Gates with full solid back-panels provide maximum visual security, while louvre and perforated slat patterns maintain air flow without compromising protection.
            </p>

            <blockquote>
              "A custom stainless steel entrance gate is not just a security barrier; it is the first visual impression of your property that retains its pristine shine for decades."
            </blockquote>

            <h2>Window Grill Design &amp; Architectural Railings</h2>
            <p>
              To maintain design coherence across your entire building facade, Harichand Steel fabricates matching window security grills, boundary wall panels, and balcony safety railings that harmonize with your main entrance gate design.
            </p>

            <h2>Looking for the Best Steel Gate Manufacturer?</h2>
            <p>
              With over 20 years of proven manufacturing excellence, Harichand Steel provides turnkey metal fabrication services across Delhi, Noida, Gurgaon, Faridabad, and Sonipat. From initial CAD drawing approvals to final doorstep installation and motorized lock calibration, our experienced engineers manage every stage.
            </p>

            <div style="background: #f1f5f9; padding: 28px; border-radius: var(--radius-md); margin-top: 36px;">
              <h3 style="margin-top: 0;">Get Custom Sizing &amp; Price Estimate</h3>
              <p style="margin-bottom: 20px;">Contact our senior fabrication specialist for site measurement and customized gate quotes.</p>
              <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                <a href="https://wa.me/919870433868?text=Hello%20Harichand%20Steel,%20I%20am%20interested%20in%20Steel%20Gate%20Designs" class="btn btn-whatsapp btn-lg" target="_blank" rel="noopener">
                  <i class="fab fa-whatsapp"></i> Chat on WhatsApp
                </a>
                <a href="tel:+919870433868" class="btn btn-primary btn-lg">
                  <i class="fas fa-phone-alt"></i> Call +91 98704 33868
                </a>
                <a href="https://harichandsteel.com/our-products/" class="btn btn-outline-dark btn-lg">
                  <i class="fas fa-th-large"></i> View All Gates
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
${getFooter()}`;

  fs.writeFileSync(path.join(baseDir, 'steel-gate-design.html'), html, 'utf8');
  console.log('Built steel-gate-design.html');
}

// =========================================================================
// 7. BEST-STEEL-GATE-MANUFACTURER-IN-DELHI.HTML
// =========================================================================
function buildBestSteelGateDelhi() {
  const title = "Best Steel Gate Manufacturer In Delhi | Premium Steel Gate by Harichand Steel | Delhi No.1 Manufacturer";
  const desc = "Harichand Steel is widely recognized as the #1 steel gate manufacturer in Delhi and Delhi NCR. Delivering SS304 main gates, modern aluminium profile gates, and durable iron gates.";
  const canonical = "https://harichandsteel.com/best-steel-gate-manufacturer-in-delhi/";
  const schemaList = schemas['best-steel-gate-manufacturer-in-delhi.html'] || [];

  const html = `${getHead(title, desc, canonical, schemaList)}
${getHeader('news')}
${getBanner('Best Steel Gate Manufacturer In Delhi', 'Best Steel Gate Manufacturer in Delhi', 'Delivering exceptional craftsmanship, SS304 certified gates, and dependable delivery since 2004.')}

  <main id="content">
    <section class="section" style="padding-top: 60px;">
      <div class="container">
        <div class="article-container">
          <div class="article-content">
            <div class="section-subtitle">Delhi's Trusted Fabricators</div>
            <h1 style="font-family: var(--font-heading); font-size: clamp(2rem, 3.5vw, 2.8rem); line-height: 1.2; margin-bottom: 24px;">
              Best Steel Gate Manufacturer In Delhi
            </h1>

            <p class="lead-text" style="font-size: 1.15rem; font-weight: 500; color: #1e293b;">
              Harichand Steel is highly appreciated for its exceptional craftsmanship, timely delivery, and dependable service. Established in 2004, our workshop in Uttam Nagar, New Delhi produces premier entrance gates that truly enhance the appearance and security of any residential or commercial property.
            </p>

            <div style="margin: 32px 0;">
              <img src="images/about-2.jpg" alt="Best Steel Gate Manufacturer In Delhi" style="width: 100%; max-height: 480px; object-fit: cover; border-radius: var(--radius-md);" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2024/05/golden-brown-profile-gate-1024x461.jpg'">
            </div>

            <h2>Stainless Steel Gates For Home</h2>
            <p>
              Stainless steel gates offer a perfect combination of durability, safety, and contemporary style for modern homes. They are resistant to rust, weather damage, and wear, ensuring long-lasting performance with minimal maintenance. Our designs incorporate premium SS304 grades, precision TIG welding, and scratch-resistant satin finishes.
            </p>

            <h2>Our Core Services</h2>
            <ul>
              <li><strong>Aluminium Profile Gates:</strong> Sleek, lightweight architectural profiles with wood-grain coatings, rose gold accents, and automatic motor tracks.</li>
              <li><strong>Steel Main Gates:</strong> High-security stainless steel and mild steel sliding or swing gates with anti-sag hinge reinforcements.</li>
              <li><strong>Powder-Coated Iron Gates:</strong> Cost-effective, robust iron gates coated with industrial-grade electrostatic powder finishes.</li>
              <li><strong>Custom Railings &amp; Grills:</strong> Balcony safety glass railings, window protective grills, and rooftop boundary barriers.</li>
            </ul>

            <h2>Our Step-by-Step Order Process</h2>
            <p>We ensure a smooth, transparent manufacturing journey from initial consultation to final handover:</p>

            <ol>
              <li><strong>Site Consultation:</strong> Free measurement and design discussion at your property in Delhi NCR.</li>
              <li><strong>CAD 3D Mockup:</strong> Review dimensions, slat spacing, and lock placements before fabrication begins.</li>
              <li><strong>Precision Manufacturing:</strong> High-precision cutting, argon welding, and polishing at our Delhi facility.</li>
              <li><strong>Doorstep Installation:</strong> Professional mounting with anchor bolts, smooth bearings, and motor testing.</li>
            </ol>

            <h2>Top Steel Gate Manufacturers In Delhi</h2>
            <p>
              With thousands of completed installations across Janakpuri, Uttam Nagar, Dwarka, South Delhi, and Sonipat, Harichand Steel combines master artisan experience with honest factory-direct pricing.
            </p>

            <div style="background: #161e27; color: #ffffff; padding: 34px; border-radius: var(--radius-md); margin-top: 36px;">
              <h3 style="color: #ffffff; margin-top: 0;">Speak Directly With Our Manufacturing Team</h3>
              <p style="color: #cbd5e1; margin-bottom: 24px;">Need site measurements or looking for a customized gate design? We are here to help.</p>
              <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                <a href="https://wa.me/919870433868" class="btn btn-whatsapp btn-lg" target="_blank" rel="noopener">
                  <i class="fab fa-whatsapp"></i> WhatsApp Us Now
                </a>
                <a href="tel:+919870433868" class="btn btn-primary btn-lg">
                  <i class="fas fa-phone-alt"></i> Call +91 98704 33868
                </a>
                <a href="https://harichandsteel.com/contact/" class="btn btn-outline btn-lg">
                  <i class="fas fa-map-marker-alt"></i> Visit Workshop
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
${getFooter()}`;

  fs.writeFileSync(path.join(baseDir, 'best-steel-gate-manufacturer-in-delhi.html'), html, 'utf8');
  console.log('Built best-steel-gate-manufacturer-in-delhi.html');
}

// =========================================================================
// 8. ALUMINIUM-PROFILE-GATE-MANUFACTURER-IN-JANAKPURI.HTML
// =========================================================================
function buildAluminiumJanakpuri() {
  const title = "Aluminium Profile Gate Manufacturer In Janakpuri​​​";
  const desc = "Harichand Steel is the leading aluminium profile gate manufacturer in Janakpuri, New Delhi. Discover rust-proof, lightweight, and modern gate solutions crafted with precision.";
  const canonical = "https://harichandsteel.com/aluminium-profile-gate-manufacturer-in-janakpuri/";
  const schemaList = schemas['aluminium-profile-gate-manufacturer-in-janakpuri.html'] || [];

  const html = `${getHead(title, desc, canonical, schemaList)}
${getHeader('news')}
${getBanner('Aluminium Profile Gate In Janakpuri', 'Janakpuri Gate Manufacturer', 'Innovative, rust-proof, and modern aluminium profile gate solutions in Janakpuri, Delhi.')}

  <main id="content">
    <section class="section" style="padding-top: 60px;">
      <div class="container">
        <div class="article-container">
          <div class="article-content">
            <div class="section-subtitle">Local Craftsmanship</div>
            <h1 style="font-family: var(--font-heading); font-size: clamp(2rem, 3.5vw, 2.8rem); line-height: 1.2; margin-bottom: 24px;">
              Aluminium Profile Gate Manufacturer In Janakpuri
            </h1>

            <p class="lead-text" style="font-size: 1.15rem; font-weight: 500; color: #1e293b;">
              Harichand Steel is widely recognized as a trusted manufacturer of premium aluminium profile gates, along with steel gates, iron gates, MS doors, and rolling shutters in Janakpuri and West Delhi. We specialize in modern aluminium gates designed for strength, elegance, and zero-corrosion durability.
            </p>

            <div style="margin: 32px 0;">
              <img src="images/profile-box.jpg" alt="Aluminium Profile Gate Manufacturer In Janakpuri" style="width: 100%; max-height: 480px; object-fit: cover; border-radius: var(--radius-md);" onerror="this.src='https://harichandsteel.com/wp-content/uploads/2024/05/aluminuim-profile-box--1024x576.jpg'">
            </div>

            <h2>Why Choose Aluminium Profile Gates?</h2>
            <p>
              Traditional iron gates are prone to rust and require frequent repainting, while heavy solid gates place immense stress on automated motors and hinges. Aluminium profile gates have become the preferred choice for Janakpuri homeowners because:
            </p>

            <ul>
              <li><strong>Zero Rust &amp; Corrosion:</strong> Aluminium naturally forms a protective oxide layer, making it completely impervious to rainwater, moisture, and sunlight.</li>
              <li><strong>Lightweight Operation:</strong> Puts 60% less strain on gate hinges and automation motors, ensuring decades of silent, smooth movement.</li>
              <li><strong>Contemporary Aesthetics:</strong> Available with sleek architectural slats, wood-sublimation finishes, and luxury rose gold pull handles.</li>
              <li><strong>Eco-Friendly &amp; Low Maintenance:</strong> Easy to clean with plain water and 100% recyclable.</li>
            </ul>

            <div class="strip-grid" style="grid-template-columns: repeat(4, 1fr); margin: 36px 0;">
              <div class="strip-card" style="background: #f8fafc; border-color: #e2e8f0;">
                <div class="strip-icon"><i class="fas fa-lightbulb"></i></div>
                <div class="strip-info"><h4 style="color: #1e293b;">Innovative Design</h4><p>Modern European aesthetics</p></div>
              </div>
              <div class="strip-card" style="background: #f8fafc; border-color: #e2e8f0;">
                <div class="strip-icon"><i class="fas fa-tag"></i></div>
                <div class="strip-info"><h4 style="color: #1e293b;">Best Price</h4><p>Factory-direct quotes</p></div>
              </div>
              <div class="strip-card" style="background: #f8fafc; border-color: #e2e8f0;">
                <div class="strip-icon"><i class="fas fa-award"></i></div>
                <div class="strip-info"><h4 style="color: #1e293b;">Best Quality</h4><p>Heavy grade extrusions</p></div>
              </div>
              <div class="strip-card" style="background: #f8fafc; border-color: #e2e8f0;">
                <div class="strip-icon"><i class="fas fa-headset"></i></div>
                <div class="strip-info"><h4 style="color: #1e293b;">Best Services</h4><p>Doorstep site support</p></div>
              </div>
            </div>

            <h2>Client Testimonials From Janakpuri</h2>
            <blockquote>
              "Harichand Steel in Janakpuri excels in aluminum profile gates of quality and innovation. I recently upgraded my entrance, and the result is remarkable. The precision, attention to detail, and seamless operation showcase their commitment to excellence."
              <br><small style="font-size: 0.9rem; color: #64748b; font-style: normal;">— Happy Client, Janakpuri</small>
            </blockquote>

            <h2>Why Harichand Steel Stands Out in Janakpuri</h2>
            <p>
              Located conveniently near Janakpuri (Uttam Nagar / Bindapur), our manufacturing facility allows clients to inspect sample profiles, handle accessories, and verify aluminum wall thicknesses before commissioning fabrication.
            </p>

            <div style="background: #f1f5f9; padding: 32px; border-radius: var(--radius-md); margin-top: 36px;">
              <h3 style="margin-top: 0;">Book a Site Measurement in Janakpuri</h3>
              <p style="margin-bottom: 20px;">Our gate expert will visit your property with physical profile samples and provide a customized price quote.</p>
              <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                <a href="https://wa.me/919870433868?text=I%20need%20Aluminium%20Profile%20Gate%20in%20Janakpuri" class="btn btn-whatsapp btn-lg" target="_blank" rel="noopener">
                  <i class="fab fa-whatsapp"></i> WhatsApp Booking
                </a>
                <a href="tel:+919870433868" class="btn btn-primary btn-lg">
                  <i class="fas fa-phone-alt"></i> Call +91 98704 33868
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
${getFooter()}`;

  fs.writeFileSync(path.join(baseDir, 'aluminium-profile-gate-manufacturer-in-janakpuri.html'), html, 'utf8');
  console.log('Built aluminium-profile-gate-manufacturer-in-janakpuri.html');
}

// =========================================================================
// 9. SITEMAP.HTML
// =========================================================================
function buildSitemap() {
  const title = "Sitemap - HARICHAND STEEL";
  const desc = "HTML Sitemap for Harichand Steel. Easily browse all pages, gate models, product categories, and articles.";
  const canonical = "https://harichandsteel.com/sitemap/";
  const schemaList = schemas['sitemap.html'] || [];

  const html = `${getHead(title, desc, canonical, schemaList)}
${getHeader('home')}
${getBanner('Website Sitemap', 'Sitemap', 'Directory of all pages, articles, and product categories across Harichand Steel.')}

  <main id="content">
    <section class="section" style="padding-top: 60px;">
      <div class="container">
        <!-- Pages Section -->
        <div class="sitemap-section-card">
          <h2 class="sitemap-title"><i class="fas fa-file-alt" style="color: var(--color-primary); margin-right: 10px;"></i> Main Pages</h2>
          <div class="sitemap-list">
            <div class="sitemap-item"><a href="https://harichandsteel.com/home/">Home Page</a> <span class="sitemap-date">Updated 2026</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/about-us/">About Us</a> <span class="sitemap-date">Company Profile</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/our-products/">Our Products</a> <span class="sitemap-date">Gate Portfolio</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/product/">Product Catalog</a> <span class="sitemap-date">32+ Models</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/news/">News &amp; Insights</a> <span class="sitemap-date">Latest Articles</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/contact/">Contact Us</a> <span class="sitemap-date">Map &amp; Workshop</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/privacy-policy/">Privacy Policy</a> <span class="sitemap-date">Legal</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/sitemap/">HTML Sitemap</a> <span class="sitemap-date">Current Page</span></div>
          </div>
        </div>

        <!-- Product Categories -->
        <div class="sitemap-section-card">
          <h2 class="sitemap-title"><i class="fas fa-th-large" style="color: var(--color-primary); margin-right: 10px;"></i> Product Categories</h2>
          <div class="sitemap-list">
            <div class="sitemap-item"><a href="https://harichandsteel.com/product-category/aluminum-profile-gate/">Aluminum Profile Gate</a> <span class="sitemap-date">Category</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/product-category/steel-main-gate/">Steel Main Gate</a> <span class="sitemap-date">Category</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/product-category/iron-main-gate/">Iron Main Gate</a> <span class="sitemap-date">Category</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/product-category/steel-door/">Steel Door</a> <span class="sitemap-date">Category</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/product-category/powder-coated-gates/">Powder Coated Gates</a> <span class="sitemap-date">Category</span></div>
          </div>
        </div>

        <!-- Articles / Posts -->
        <div class="sitemap-section-card">
          <h2 class="sitemap-title"><i class="fas fa-newspaper" style="color: var(--color-primary); margin-right: 10px;"></i> Published Guides &amp; Posts</h2>
          <div class="sitemap-list">
            <div class="sitemap-item"><a href="https://harichandsteel.com/steel-gate-design/">Steel Gate Design – Modern Architecture &amp; Prices</a> <span class="sitemap-date">(Jan 19, 2026)</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/best-steel-gate-manufacturer-in-delhi/">Best Steel Gate Manufacturer in Delhi | Premium Gates</a> <span class="sitemap-date">(Feb 10, 2026)</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/aluminium-profile-gate-manufacturer-in-janakpuri/">Aluminium Profile Gate Manufacturer in Janakpuri</a> <span class="sitemap-date">(Nov 6, 2024)</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/aluminum-profile-gate-manufacturer-in-prithviraj-road/">Aluminum Profile Gate Manufacturer in Prithviraj Road</a> <span class="sitemap-date">(Nov 6, 2024)</span></div>
            <div class="sitemap-item"><a href="https://harichandsteel.com/best-aluminum-profile-gate-gates-manufacturer/">Best Aluminum Profile Gate Manufacturer</a> <span class="sitemap-date">(Oct 3, 2024)</span></div>
          </div>
        </div>
      </div>
    </section>
  </main>
${getFooter()}`;

  fs.writeFileSync(path.join(baseDir, 'sitemap.html'), html, 'utf8');
  console.log('Built sitemap.html');
}

// =========================================================================
// 10. PRIVACY-POLICY.HTML
// =========================================================================
function buildPrivacyPolicy() {
  const title = "Privacy Policy - HARICHAND STEEL";
  const desc = "Privacy policy of Harichand Steel. Learn how we handle customer contact inquiries, cookies, and protect client privacy.";
  const canonical = "https://harichandsteel.com/privacy-policy/";
  const schemaList = schemas['privacy-policy.html'] || [];

  const html = `${getHead(title, desc, canonical, schemaList)}
${getHeader('home')}
${getBanner('Privacy Policy', 'Privacy Policy', 'Our commitment to protecting your personal data, inquiries, and customer privacy.')}

  <main id="content">
    <section class="section" style="padding-top: 60px;">
      <div class="container">
        <div class="article-container">
          <div class="article-content">
            <div class="section-subtitle">Legal &amp; Data Protection</div>
            <h1 style="font-family: var(--font-heading); font-size: 2.2rem; margin-bottom: 24px;">Privacy Policy</h1>

            <h2>Who we are</h2>
            <p>Our website address is: <a href="https://harichandsteel.com" style="color: var(--color-primary); font-weight: 600;">https://harichandsteel.com</a>. We are Harichand Steel, established in 2004, located at 27B, Street, New Jankipuri, Anup Nagar, Uttam Nagar, Bindapur, New Delhi, Delhi, 110059.</p>

            <h2>Comments &amp; Inquiries</h2>
            <p>When visitors leave comments or submit quotation requests through forms on the site, we collect the data shown in the comments/inquiry form, and also the visitor's IP address and browser user agent string to help spam detection.</p>

            <h2>Media</h2>
            <p>If you upload images to the website or send gate pictures via WhatsApp, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.</p>

            <h2>Cookies</h2>
            <p>If you leave a comment or request on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another message. These cookies will last for one year.</p>

            <h2>Embedded content from other websites</h2>
            <p>Articles on this site may include embedded content (e.g. videos from YouTube, maps from Google Maps, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website. These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content.</p>

            <h2>Who we share your data with</h2>
            <p>We do not sell, trade, or share your contact numbers or inquiry information with third-party advertisers. Your information is strictly utilized by our internal engineering team to calculate quotes and schedule site measurements.</p>

            <h2>How long we retain your data</h2>
            <p>If you leave a comment or inquiry, the comment and its metadata are retained indefinitely. This is so we can recognize and follow up on customer project requirements automatically instead of holding them in a moderation queue.</p>

            <h2>What rights you have over your data</h2>
            <p>If you have submitted inquiries or contacted Harichand Steel through this site, you can request to receive an exported file of the personal data we hold about you. You can also request that we erase any personal data we hold about you by contacting <a href="mailto:Admin@HARICHANDSTEEL.COM" style="color: var(--color-primary); font-weight: 600;">Admin@HARICHANDSTEEL.COM</a>.</p>

            <h2>Where your data is sent</h2>
            <p>Visitor comments and messages may be checked through an automated spam detection service.</p>

            <div style="background: #f8fafc; border: 1px solid var(--color-border); padding: 24px; border-radius: var(--radius-sm); margin-top: 36px;">
              <h3 style="margin-top: 0;">Have Questions Regarding Our Policy?</h3>
              <p style="margin-bottom: 0;">Contact our support office at <a href="mailto:Admin@HARICHANDSTEEL.COM" style="color: var(--color-primary); font-weight: 600;">Admin@HARICHANDSTEEL.COM</a> or call <a href="tel:+919870433868" style="color: var(--color-primary); font-weight: 600;">+91 98704 33868</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
${getFooter()}`;

  fs.writeFileSync(path.join(baseDir, 'privacy-policy.html'), html, 'utf8');
  console.log('Built privacy-policy.html');
}

buildSteelGateDesign();
buildBestSteelGateDelhi();
buildAluminiumJanakpuri();
buildSitemap();
buildPrivacyPolicy();
