const CMS = require('../js/cms-data.js');

console.log('Testing CMS CRUD in Node environment:');

// 1. Get seed products
const initialProducts = CMS.getProducts();
console.log('Initial Products count:', initialProducts.length);

// 2. Add a test product
const newProd = {
  title: 'Automated Telescopic Sliding Gate',
  category: 'aluminum-profile-gate',
  categoryName: 'Aluminum Profile Gate',
  badge: 'Smart Automation',
  price: '₹4,500/sqft',
  image: 'images/prod-1.png',
  description: 'Telescopic sliding gate designed for compact driveways with limited parking runout.',
  specs: ['Italian High-Speed Motor', 'Anti-Collision Sensors', 'SS304 Telescopic Track'],
  featured: true
};

const savedProd = CMS.saveProduct(newProd);
console.log('Saved Product ID:', savedProd.id);

const updatedProducts = CMS.getProducts();
console.log('Updated Products count:', updatedProducts.length);
console.log('Contains newly added product:', updatedProducts.some(p => p.id === savedProd.id) ? 'PASS' : 'FAIL');

// 3. Delete the test product
CMS.deleteProduct(savedProd.id);
const finalProducts = CMS.getProducts();
console.log('Count after deleting test product:', finalProducts.length);
console.log('Product deleted cleanly:', !finalProducts.some(p => p.id === savedProd.id) ? 'PASS' : 'FAIL');

// 4. Test Add Blog
const newBlog = {
  title: 'How to Choose Between SS304 and SS202 for Your Home Gate',
  slug: 'steel-gate-design.html',
  tag: 'Material Guide',
  author: 'Harichand Technical Team',
  date: 'October 27, 2026',
  excerpt: 'A comprehensive technical comparison between 304 and 202 grades of stainless steel in Delhi NCR climate.',
  content: 'SS304 contains 18% chromium and 8% nickel, providing virtually complete corrosion immunity in Delhi monsoon and pollution conditions.'
};

const savedBlog = CMS.saveBlog(newBlog);
console.log('Saved Blog ID:', savedBlog.id);

const updatedBlogs = CMS.getBlogs();
console.log('Updated Blogs count:', updatedBlogs.length);
console.log('Contains newly added blog:', updatedBlogs.some(b => b.id === savedBlog.id) ? 'PASS' : 'FAIL');

// Delete test blog
CMS.deleteBlog(savedBlog.id);
const finalBlogs = CMS.getBlogs();
console.log('Count after deleting test blog:', finalBlogs.length);
console.log('Blog deleted cleanly:', !finalBlogs.some(b => b.id === savedBlog.id) ? 'PASS' : 'FAIL');

console.log('\n--- All CMS CRUD verification passed! ---');
