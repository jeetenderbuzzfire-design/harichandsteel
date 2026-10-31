const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDir = path.join(__dirname, 'chrome_cat_test_' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const debugPort = 9245;
  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${debugPort}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${userDir}`
  ]);

  function cdpGet(endpoint) {
    return new Promise((resolve, reject) => {
      const req = http.get({ host: '127.0.0.1', port: debugPort, path: endpoint }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      });
      req.on('error', reject);
    });
  }

  let list = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      list = await cdpGet('/json/list');
      if (list && list.length > 0) break;
    } catch(e){}
  }

  const pageTarget = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      const onMsg = (event) => {
        const resp = JSON.parse(event.data);
        if (resp.id === id) {
          ws.removeEventListener('message', onMsg);
          resolve(resp.result);
        }
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');

  console.log('======================================================');
  console.log('TEST 1: DIRECT ACCESS TO /product-category/steel-door/');
  console.log('======================================================');
  await send('Page.navigate', { url: 'http://localhost:8080/product-category/steel-door/' });
  await new Promise(r => setTimeout(r, 1500));

  let res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.title;
        const currentUrl = window.location.href;
        const pathname = window.location.pathname;
        const activeBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : null;
        const activeLabel = activeBtn ? activeBtn.innerText.trim() : null;
        const breadcrumbs = document.getElementById('catalogueBreadcrumbs') ? document.getElementById('catalogueBreadcrumbs').innerText.replace(/\\s+/g, ' ').trim() : null;
        const allCards = Array.from(document.querySelectorAll('.product-cards-grid .product-card'));
        const visibleCards = allCards.filter(c => window.getComputedStyle(c).display !== 'none');
        const visibleCategories = visibleCards.map(c => c.getAttribute('data-category'));

        return {
          currentUrl,
          pathname,
          title,
          activeFilter,
          activeLabel,
          breadcrumbs,
          totalCards: allCards.length,
          visibleCount: visibleCards.length,
          visibleCategories: [...new Set(visibleCategories)],
          allMatching: visibleCategories.every(cat => cat === 'steel-door')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Direct Category Load Result:', JSON.stringify(res.result.value, null, 2));

  console.log('\n======================================================');
  console.log('TEST 2: OLD HASH COMPATIBILITY (/product.html#steel-door)');
  console.log('======================================================');
  await send('Page.navigate', { url: 'http://localhost:8080/product.html#steel-door' });
  await new Promise(r => setTimeout(r, 1500));

  res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        return {
          currentUrl: window.location.href,
          pathname: window.location.pathname,
          activeFilter: document.querySelector('.filter-btn.active') ? document.querySelector('.filter-btn.active').getAttribute('data-filter') : null,
          title: document.title
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Old Hash Compatibility Result:', JSON.stringify(res.result.value, null, 2));

  console.log('\n======================================================');
  console.log('TEST 3: DYNAMIC FILTER SWITCHING (CLICK ALUMINUM PROFILE GATE)');
  console.log('======================================================');
  res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('.filter-btn[data-filter="aluminum-profile-gate"]');
        if (btn) btn.click();
        return {
          clicked: !!btn,
          urlAfterClick: window.location.href,
          pathname: window.location.pathname,
          title: document.title
        };
      })()
    `,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('After Clicking Aluminum Profile Gate:', JSON.stringify(res.result.value, null, 2));

  console.log('\n======================================================');
  console.log('TEST 4: DYNAMIC FILTER SWITCHING (CLICK "ALL")');
  console.log('======================================================');
  res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('.filter-btn[data-filter="all"]');
        if (btn) btn.click();
        return {
          clicked: !!btn,
          urlAfterClick: window.location.href,
          pathname: window.location.pathname,
          title: document.title
        };
      })()
    `,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('After Clicking All:', JSON.stringify(res.result.value, null, 2));

  console.log('\n======================================================');
  console.log('TEST 5: MULTI-VIEWPORT RESPONSIVENESS OF /product-category/steel-door/');
  console.log('======================================================');
  await send('Page.navigate', { url: 'http://localhost:8080/product-category/steel-door/' });
  await new Promise(r => setTimeout(r, 1200));

  const viewports = [
    { name: 'Ultra-Compact (320px)', width: 320, height: 568 },
    { name: 'Compact Phone (360px)', width: 360, height: 640 },
    { name: 'iPhone SE (375px)', width: 375, height: 667 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Desktop (1200px)', width: 1200, height: 800 }
  ];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width <= 768
    });
    await new Promise(r => setTimeout(r, 200));

    const vpRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const docWidth = document.documentElement.clientWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          return {
            docWidth,
            scrollWidth,
            hasOverflow: scrollWidth > docWidth
          };
        })()
      `,
      returnByValue: true
    });
    console.log(`Viewport ${vp.name}: width=${vpRes.result.value.docWidth}px, scrollWidth=${vpRes.result.value.scrollWidth}px, overflow=${vpRes.result.value.hasOverflow}`);
  }

  ws.close();
  chromeProc.kill();
  console.log('\nALL PRODUCT CATEGORY TESTS COMPLETED.');
}

run();
