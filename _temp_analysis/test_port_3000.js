const http = require('http');

http.get('http://localhost:3000/product/fgdfg', (res) => {
  console.log('Status on port 3000:', res.statusCode);
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Length:', d.length);
    console.log('Contains top-bar?', d.includes('top-bar'));
    console.log('Contains topbar?', d.includes('class="topbar"'));
  });
});
