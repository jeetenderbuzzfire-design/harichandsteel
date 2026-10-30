const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDir = path.join(__dirname, 'chrome_quick_card_' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const debugPort = 9235;
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
  await new Promise(r => setTimeout(r, 1000));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 320,
    height: 568,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 300));

  const res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.contact-quick-card');
        if (!card) return 'card not found';
        const rect = card.getBoundingClientRect();
        const cs = window.getComputedStyle(card);
        const btns = Array.from(card.querySelectorAll('.btn')).map(b => {
          const br = b.getBoundingClientRect();
          const bcs = window.getComputedStyle(b);
          return {
            text: b.innerText.trim(),
            rect: { left: Math.round(br.left), right: Math.round(br.right), width: Math.round(br.width) },
            scrollWidth: b.scrollWidth,
            whiteSpace: bcs.whiteSpace
          };
        });
        const rows = Array.from(card.querySelectorAll('.contact-row')).map(r => {
          const rr = r.getBoundingClientRect();
          return {
            title: r.querySelector('h5') ? r.querySelector('h5').innerText : '',
            rect: { left: Math.round(rr.left), right: Math.round(rr.right), width: Math.round(rr.width) },
            scrollWidth: r.scrollWidth
          };
        });
        return {
          cardRect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
          cardScrollWidth: card.scrollWidth,
          cardPadding: cs.padding,
          btns,
          rows
        };
      })()
    `,
    returnByValue: true
  });

  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
  chromeProc.kill();
}
run();
