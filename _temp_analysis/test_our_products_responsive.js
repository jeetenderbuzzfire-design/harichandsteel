const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDir = path.join(__dirname, 'chrome_our_products_' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

const testViewports = [
  { name: 'Ultra-Compact (320px)', width: 320, height: 568 },
  { name: 'Compact Phone (360px)', width: 360, height: 640 },
  { name: 'iPhone SE (375px)', width: 375, height: 667 },
  { name: 'Tablet (768px)', width: 768, height: 1024 }
];

async function run() {
  const debugPort = 9241;
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
  await send('Page.navigate', { url: 'http://localhost:8080/our-products' });
  await new Promise(r => setTimeout(r, 1200));

  console.log('=== OUR PRODUCTS CATEGORY GRID AUDIT ===\n');

  for (const vp of testViewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width <= 768
    });
    await new Promise(r => setTimeout(r, 300));

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const grid = document.querySelector('.category-cards-grid');
          const tiles = Array.from(document.querySelectorAll('.category-cards-grid .cat-tile'));
          const docWidth = document.documentElement.clientWidth;

          return {
            docWidth,
            gridRect: { width: Math.round(grid.getBoundingClientRect().width), right: Math.round(grid.getBoundingClientRect().right) },
            gridColumns: window.getComputedStyle(grid).gridTemplateColumns,
            tiles: tiles.map((t, idx) => {
              const r = t.getBoundingClientRect();
              const cs = window.getComputedStyle(t);
              const actionDiv = t.querySelector('div[style*="display: flex"]') || t.querySelector('div:last-child');
              const btns = Array.from(t.querySelectorAll('.btn')).map(b => {
                const br = b.getBoundingClientRect();
                return {
                  text: b.innerText.trim(),
                  href: b.getAttribute('href'),
                  width: Math.round(br.width),
                  right: Math.round(br.right)
                };
              });

              return {
                idx,
                title: t.querySelector('h3') ? t.querySelector('h3').innerText : '',
                width: Math.round(r.width),
                right: Math.round(r.right),
                padding: cs.padding,
                overflows: r.right > docWidth + 1,
                actionFlexWrap: actionDiv ? window.getComputedStyle(actionDiv).flexWrap : null,
                btns
              };
            })
          };
        })()
      `,
      returnByValue: true
    });

    const val = res.result.value;
    console.log(`--- Viewport: ${vp.name} (width: ${vp.width}px) ---`);
    console.log(`Grid Columns: ${val.gridColumns}`);
    val.tiles.forEach(t => {
      console.log(`  Tile [${t.title}]: width=${t.width}px, right=${t.right}px, padding=${t.padding}, overflows=${t.overflows}`);
      t.btns.forEach(b => {
        console.log(`    Btn "${b.text}": href="${b.href}", width=${b.width}px, right=${b.right}px`);
      });
    });
    console.log('');
  }

  ws.close();
  chromeProc.kill();
}
run();
