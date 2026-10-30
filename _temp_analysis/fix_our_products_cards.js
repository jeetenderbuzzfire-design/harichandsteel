const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'our-products.html');
let html = fs.readFileSync(filePath, 'utf8');

// Find the category-cards-grid block
const gridStartPattern = '<div class="category-cards-grid" style="margin-bottom: 50px;">';
const startIndex = html.indexOf(gridStartPattern);

if (startIndex === -1) {
  console.error('Could not find category-cards-grid start pattern');
  process.exit(1);
}

// Find where category-cards-grid ends (before "<!-- Featured Products Showcase -->")
const showcasePattern = '<!-- Featured Products Showcase -->';
const endIndex = html.indexOf(showcasePattern, startIndex);

if (endIndex === -1) {
  console.error('Could not find Featured Products Showcase pattern');
  process.exit(1);
}

const newGridHtml = `<div class="category-cards-grid" style="margin-bottom: 50px;">
          <!-- Cat 1 -->
          <div class="cat-tile cat-tile-detail" id="aluminum-profile-gate">
            <div class="cat-icon"><i class="fas fa-door-open"></i></div>
            <h3 class="cat-tile-title">Aluminum Profile Gate</h3>
            <p class="cat-tile-desc">
              Engineered with lightweight yet rigid aluminium extrusions, offering modern luxury styling, rust-proof
              longevity, and effortless automation capability.
            </p>
            <div class="cat-tile-actions">
              <a href="product.html#aluminum-profile-gate" class="btn btn-outline-dark btn-sm">View Models</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Aluminum%20Profile%20Gate"
                class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>

          <!-- Cat 2 -->
          <div class="cat-tile cat-tile-detail" id="steel-main-gate">
            <div class="cat-icon"><i class="fas fa-shield-alt"></i></div>
            <h3 class="cat-tile-title">Steel Gate</h3>
            <p class="cat-tile-desc">
              Fabricated from genuine SS304 grade stainless steel and heavy-gauge mild steel. Features intricate CNC
              laser-cut designs with polished mirror or matte finishes.
            </p>
            <div class="cat-tile-actions">
              <a href="product.html#steel-main-gate" class="btn btn-outline-dark btn-sm">View Models</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Steel%20Main%20Gate"
                class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>

          <!-- Cat 3 -->
          <div class="cat-tile cat-tile-detail" id="steel-door">
            <div class="cat-icon"><i class="fas fa-columns"></i></div>
            <h3 class="cat-tile-title">Steel Doors</h3>
            <p class="cat-tile-desc">
              Heavy-duty security doors designed for main entrances, back doors, and security partitions with
              multi-point locking systems and weatherproofing.
            </p>
            <div class="cat-tile-actions">
              <a href="product.html#steel-door" class="btn btn-outline-dark btn-sm">View Models</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Steel%20Doors" class="btn btn-whatsapp btn-sm"
                target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>

          <!-- Cat 4 -->
          <div class="cat-tile cat-tile-detail" id="staircase-railing">
            <div class="cat-icon"><i class="fas fa-layer-group"></i></div>
            <h3 class="cat-tile-title">Stair Case Railing</h3>
            <p class="cat-tile-desc">
              Architectural stainless steel, glass, and iron railings for indoor and outdoor staircases ensuring both
              safety and aesthetic elegance.
            </p>
            <div class="cat-tile-actions">
              <a href="contact.html?subject=Staircase+Railing" class="btn btn-outline-dark btn-sm">Enquire Design</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Staircase%20Railing"
                class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>

          <!-- Cat 5 -->
          <div class="cat-tile cat-tile-detail" id="balcony-railing">
            <div class="cat-icon"><i class="fas fa-border-all"></i></div>
            <h3 class="cat-tile-title">Balcony Railing</h3>
            <p class="cat-tile-desc">
              High-strength rust-proof railings designed to withstand continuous exposure to rain and sun, enhancing the
              external facade of your property.
            </p>
            <div class="cat-tile-actions">
              <a href="contact.html?subject=Balcony+Railing" class="btn btn-outline-dark btn-sm">Enquire Design</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Balcony%20Railing"
                class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>

          <!-- Cat 6 -->
          <div class="cat-tile cat-tile-detail" id="powder-coated-gates">
            <div class="cat-icon"><i class="fas fa-paint-roller"></i></div>
            <h3 class="cat-tile-title">Powder Coated Gates</h3>
            <p class="cat-tile-desc">
              Electrostatically applied powder coat available in matte black, antique bronze, and custom colors,
              providing exceptional scratch and corrosion resistance.
            </p>
            <div class="cat-tile-actions">
              <a href="product.html#powder-coated-gates" class="btn btn-outline-dark btn-sm">View Models</a>
              <a href="https://wa.me/919870433868?text=Enquiry%20for%20Powder%20Coated%20Gates"
                class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> Quote</a>
            </div>
          </div>
        </div>

        `;

// Replace from startIndex to endIndex
const updatedHtml = html.substring(0, startIndex) + newGridHtml + html.substring(endIndex);
fs.writeFileSync(filePath, updatedHtml, 'utf8');
console.log('Successfully updated our-products.html category cards grid!');
