const fs = require('fs');
const body = fs.readFileSync('C:/Users/Lenovo/.gemini/antigravity/scratch/harichand-steel-redesign/elementor_body.html', 'utf8');

// Section 1: Slider
const s1 = body.substring(0, body.indexOf('elementor-element-ced137c'));
console.log('=== SECTION 1 DETAILS (Slider) ===');
const s1Imgs = s1.match(/url\([^)]+\)/g);
console.log('Slider Background Images:', s1Imgs);

// Section 3: About Us Gallery
const s3 = body.substring(body.indexOf('About Us'), body.indexOf('Client Testimonials'));
console.log('\n=== SECTION 3 DETAILS (About Us & Gallery) ===');
const s3Imgs = s3.match(/data-src=["']([^"']*)["']/g) || s3.match(/src=["']([^"']*)["']/g);
console.log('Images in About Us:', s3Imgs);

// Section 4: Testimonials
const s4 = body.substring(body.indexOf('Client Testimonials'), body.indexOf('Best Aluminium Profile Gate'));
console.log('\n=== SECTION 4 DETAILS (Testimonials) ===');
const testimonials = s4.match(/<div class="elementor-testimonial-content">([\s\S]*?)<\/div>/g) || [];
console.log('Testimonials found:', testimonials.map(t => t.replace(/<[^>]+>/g, '').trim()));
const testNames = s4.match(/<div class="elementor-testimonial-name">([\s\S]*?)<\/div>/g) || [];
console.log('Testimonial names:', testNames.map(t => t.replace(/<[^>]+>/g, '').trim()));

// Section 6: Videos
const s6 = body.substring(body.indexOf('https:\/\/youtu.be'), body.indexOf('Are You Ready To Start'));
console.log('\n=== SECTION 6 DETAILS (Videos) ===');
console.log(s6.match(/https:\\\/\\\/youtu\.be[^\s"&]+/g));
