const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserExe = fs.existsSync(chromePath) ? chromePath : edgePath;

const viewports = [
  { name: 'Ultra-Compact Phone (320px)', width: 320, height: 568 },
  { name: 'Compact Phone (360px)', width: 360, height: 640 },
  { name: 'iPhone SE/8 (375px)', width: 375, height: 667 },
  { name: 'iPhone 14/15/16 (390px)', width: 390, height: 844 },
  { name: 'Tablet Portrait iPad (768px)', width: 768, height: 1024 },
  { name: 'Tablet Landscape / Laptop (1024px)', width: 1024, height: 768 }
];

const testUrls = [
  'http://localhost:8080/',
  'http://localhost:8080/product',
  'http://localhost:8080/our-products',
  'http://localhost:8080/about-us',
  'http://localhost:8080/contact',
  'http://localhost:8080/news',
  'http://localhost:8080/steel-gate-design',
  'http://localhost:8080/best-steel-gate-manufacturer-in-delhi',
  'http://localhost:8080/aluminium-profile-gate-manufacturer-in-janakpuri',
  'http://localhost:8080/privacy-policy',
  'http://localhost:8080/sitemap',
  'http://localhost:8080/admin'
];

async function run() {
  const debugPort = 9228;
  const userDir = path.join(__dirname, 'chrome_cdp_profile_' + Date.now());
  fs.mkdirSync(userDir, { recursive: true });

  const chromeProc = spawn(browserExe, [
    `--remote-debugging-port=${debugPort}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${userDir}`
  ]);

  function cdpGet(endpoint) {
    return new Promise((resolve, reject) => {
      const req = http.get({
        host: '127.0.0.1',
        port: debugPort,
        path: endpoint
      }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
    });
  }

  // Poll until Chrome debug port is ready
  let list = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      list = await cdpGet('/json/list');
      if (list && list.length > 0) break;
    } catch (e) {
      // wait and retry
    }
  }

  if (!list) {
    throw new Error('Chrome failed to start or respond on port ' + debugPort);
  }

  try {
    const pageTarget = list.find(t => t.type === 'page') || list[0];
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error('No page target with webSocketDebuggerUrl found');
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const onMsg = (event) => {
          const resp = JSON.parse(event.data);
          if (resp.id === id) {
            ws.removeEventListener('message', onMsg);
            if (resp.error) reject(new Error(resp.error.message));
            else resolve(resp.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('DOM.enable');

    console.log('================================================================');
    console.log(' STARTING DEEP RESPONSIVE AUDIT ACROSS ALL VIEWPORT SIZES       ');
    console.log('================================================================');

    const issues = [];

    for (const url of testUrls) {
      const pageName = url.replace('http://localhost:8080', '') || '/ (Home)';
      console.log(`\nTesting Page: ${pageName}`);

      // Navigate to URL
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 800));

      for (const vp of viewports) {
        // Set viewport
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.width <= 768
        });

        await new Promise(r => setTimeout(r, 200));

        // Evaluate overflow and layout metrics
        const evalRes = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const docWidth = document.documentElement.clientWidth;
              const scrollWidth = document.documentElement.scrollWidth;
              const winWidth = window.innerWidth;
              const hasOverflow = scrollWidth > docWidth + 1;

              let overflowingElements = [];
              if (hasOverflow) {
                const all = document.querySelectorAll('*');
                for (const el of all) {
                  const rect = el.getBoundingClientRect();
                  if (rect.right > docWidth + 2) {
                    overflowingElements.push({
                      tag: el.tagName.toLowerCase(),
                      class: el.className || '',
                      id: el.id || '',
                      right: Math.round(rect.right),
                      width: Math.round(rect.width)
                    });
                  }
                }
              }

              return {
                docWidth,
                scrollWidth,
                hasOverflow,
                overflowAmount: scrollWidth - docWidth,
                overflowingElements: overflowingElements.slice(0, 3)
              };
            })()
          `,
          returnByValue: true
        });

        const res = evalRes.result ? evalRes.result.value : null;
        if (res && res.hasOverflow) {
          console.log(`  ❌ [${vp.name}] OVERFLOW: scrollWidth=${res.scrollWidth}px > clientWidth=${res.docWidth}px (+${res.overflowAmount}px)`);
          issues.push({
            page: pageName,
            viewport: vp.name,
            width: vp.width,
            overflowAmount: res.overflowAmount,
            elements: res.overflowingElements
          });
          if (res.overflowingElements.length) {
            console.log('     Elements causing overflow:', JSON.stringify(res.overflowingElements));
          }
        } else {
          console.log(`  ✓ [${vp.name}] Clean: ${vp.width}px perfectly fitted (scrollWidth = ${res ? res.scrollWidth : vp.width}px)`);
        }
      }
    }

    console.log('\n================================================================');
    console.log(` AUDIT COMPLETE! Total Overflow Issues Found: ${issues.length}`);
    console.log('================================================================');

    fs.writeFileSync(path.join(__dirname, 'responsive_audit_results.json'), JSON.stringify(issues, null, 2), 'utf8');

    ws.close();
  } catch (err) {
    console.error('Audit error:', err);
  } finally {
    chromeProc.kill();
  }
}

run();
