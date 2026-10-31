const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDir = path.join(__dirname, 'chrome_header_mob_' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const debugPort = 9249;
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });

  await send('Page.navigate', { url: 'http://localhost:3000/product/fgdfg' });
  await new Promise(r => setTimeout(r, 1500));

  const mobileDetails = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const topbar = document.querySelector('.topbar') || document.querySelector('.top-bar');
        const header = document.querySelector('.site-header');
        const brand = document.querySelector('.brand-logo');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;

        return {
          docWidth,
          scrollWidth,
          hasOverflow: scrollWidth > docWidth,
          topbarDisplay: topbar ? window.getComputedStyle(topbar).display : 'none',
          headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
          menuBtnDisplay: menuBtn ? window.getComputedStyle(menuBtn).display : 'none',
          brandVisible: brand ? window.getComputedStyle(brand).display : 'none'
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Mobile Top Header Result on Port 3000:', mobileDetails.result.value);

  ws.close();
  chromeProc.kill();
}

run();
