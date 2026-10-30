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

const urlsToTest = [
  'http://localhost:8080/our-products',
  'http://localhost:8080/our-products.html'
];

async function run() {
  const debugPort = 9243;
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

  for (const testUrl of urlsToTest) {
    console.log(`\n======================================================`);
    console.log(`TESTING URL: ${testUrl}`);
    console.log(`======================================================`);
    await send('Page.navigate', { url: testUrl });
    await new Promise(r => setTimeout(r, 1200));

    for (const vp of testViewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.width <= 768
      });
      await new Promise(r => setTimeout(r, 250));

      const res = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const grid = document.querySelector('.category-cards-grid');
            const tiles = Array.from(document.querySelectorAll('.category-cards-grid .cat-tile'));
            const docWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;

            return {
              docWidth,
              scrollWidth,
              hasPageOverflow: scrollWidth > docWidth,
              gridRect: { width: Math.round(grid.getBoundingClientRect().width), right: Math.round(grid.getBoundingClientRect().right) },
              gridColumns: window.getComputedStyle(grid).gridTemplateColumns,
              tiles: tiles.map((t, idx) => {
                const r = t.getBoundingClientRect();
                const cs = window.getComputedStyle(t);
                const btns = Array.from(t.querySelectorAll('.btn')).map(b => {
                  const br = b.getBoundingClientRect();
                  return {
                    text: b.innerText.trim(),
                    href: b.getAttribute('href'),
                    width: Math.round(br.width),
                    right: Math.round(br.right),
                    overflows: br.right > r.right + 1
                  };
                });

                return {
                  id: t.id,
                  title: t.querySelector('h3') ? t.querySelector('h3').innerText : '',
                  width: Math.round(r.width),
                  right: Math.round(r.right),
                  padding: cs.padding,
                  overflows: r.right > docWidth + 1,
                  btns
                };
              })
            };
          })()
        `,
        returnByValue: true
      });

      const val = res.result.value;
      console.log(`\n--- Viewport: ${vp.name} (width: ${vp.width}px) ---`);
      console.log(`Document scrollWidth=${val.scrollWidth}px vs clientWidth=${val.docWidth}px (Overflow: ${val.hasPageOverflow})`);
      val.tiles.forEach(t => {
        console.log(`  Card [${t.title}] id="#${t.id}": width=${t.width}px, padding=${t.padding}, overflows=${t.overflows}`);
        t.btns.forEach(b => {
          console.log(`    Btn "${b.text}": href="${b.href}", width=${b.width}px, overflowsCard=${b.overflows}`);
        });
      });
    }
  }

  ws.close();
  chromeProc.kill();
  console.log('\nAudit completed successfully.');
}
run();
