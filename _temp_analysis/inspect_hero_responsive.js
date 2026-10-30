const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDir = path.join(__dirname, 'chrome_hero_inspect_' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

const testViewports = [
  { name: 'Ultra-Compact (320px)', width: 320, height: 568 },
  { name: 'Compact Phone (360px)', width: 360, height: 640 },
  { name: 'iPhone SE (375px)', width: 375, height: 667 },
  { name: 'iPhone 14/15/16 (390px)', width: 390, height: 844 },
  { name: 'Tablet (768px)', width: 768, height: 1024 }
];

async function run() {
  const debugPort = 9237;
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
  await send('Page.navigate', { url: 'http://localhost:8080/' });
  await new Promise(r => setTimeout(r, 1200));

  console.log('=== HERO SECTION RESPONSIVE AUDIT ===\n');

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
          const badge = document.querySelector('.hero-badge');
          const title = document.querySelector('.hero-title');
          const desc = document.querySelector('.hero-desc');
          const ctas = document.querySelector('.hero-ctas');
          const btns = Array.from(document.querySelectorAll('.hero-ctas .btn'));
          const stats = document.querySelector('.hero-stats-row');
          const statItems = Array.from(document.querySelectorAll('.hero-stat-item'));
          const docWidth = document.documentElement.clientWidth;

          const inspectEl = (el, name) => {
            if (!el) return { name, notFound: true };
            const r = el.getBoundingClientRect();
            const cs = window.getComputedStyle(el);
            return {
              name,
              rect: { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) },
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth,
              fontSize: cs.fontSize,
              lineHeight: cs.lineHeight,
              overflows: r.right > docWidth + 1,
              whiteSpace: cs.whiteSpace,
              padding: cs.padding
            };
          };

          return {
            docWidth,
            badge: inspectEl(badge, 'badge'),
            title: inspectEl(title, 'title'),
            desc: inspectEl(desc, 'desc'),
            ctas: inspectEl(ctas, 'ctas'),
            btns: btns.map(b => inspectEl(b, b.innerText.trim())),
            stats: inspectEl(stats, 'stats'),
            statItems: statItems.map((s, idx) => ({
              idx,
              num: s.querySelector('.hero-stat-num') ? s.querySelector('.hero-stat-num').innerText : '',
              label: s.querySelector('.hero-stat-label') ? s.querySelector('.hero-stat-label').innerText : '',
              rect: {
                width: Math.round(s.getBoundingClientRect().width),
                right: Math.round(s.getBoundingClientRect().right)
              },
              scrollWidth: s.scrollWidth
            }))
          };
        })()
      `,
      returnByValue: true
    });

    const val = res.result.value;
    console.log(`--- Viewport: ${vp.name} (width: ${vp.width}px) ---`);
    console.log(`Badge: width=${val.badge.rect.width}px, right=${val.badge.rect.right}px, overflows=${val.badge.overflows}`);
    console.log(`Title: fontSize=${val.title.fontSize}, width=${val.title.rect.width}px, overflows=${val.title.overflows}`);
    console.log(`Desc: width=${val.desc.rect.width}px, overflows=${val.desc.overflows}`);
    console.log(`CTAs: width=${val.ctas.rect.width}px, overflows=${val.ctas.overflows}`);
    val.btns.forEach(b => console.log(`  Btn [${b.name}]: width=${b.rect.width}px, overflows=${b.overflows}`));
    console.log(`Stats Row: width=${val.stats.rect.width}px, overflows=${val.stats.overflows}`);
    val.statItems.forEach(s => console.log(`  Stat [${s.num} - ${s.label}]: width=${s.rect.width}px`));
    console.log('');
  }

  ws.close();
  chromeProc.kill();
}

run();
