const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDir = path.join(__dirname, 'chrome_header_test_' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const debugPort = 9247;
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
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:3000/product/fgdfg...');
  await send('Page.navigate', { url: 'http://localhost:3000/product/fgdfg' });
  await new Promise(r => setTimeout(r, 1500));

  const topbarDetails = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const topbar = document.querySelector('.topbar') || document.querySelector('.top-bar');
        const header = document.querySelector('.site-header');
        if (!topbar) return { error: 'topbar not found' };

        const tbStyle = window.getComputedStyle(topbar);
        const tbRect = topbar.getBoundingClientRect();
        const hStyle = window.getComputedStyle(header);
        const hRect = header.getBoundingClientRect();

        return {
          topbarClass: topbar.className,
          topbarBg: tbStyle.backgroundColor,
          topbarColor: tbStyle.color,
          topbarHeight: tbRect.height,
          topbarTop: tbRect.top,
          headerTop: hRect.top,
          headerBg: hStyle.backgroundColor
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Topbar details on port 3000:', topbarDetails.result.value);

  // Capture screenshot of the top header area
  const screenshot = await send('Page.captureScreenshot', {
    clip: {
      x: 0,
      y: 0,
      width: 1280,
      height: 450,
      scale: 1
    }
  });

  const artifactDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\2f506127-b00f-49ac-859e-9586b38672a6';
  const outPath = path.join(artifactDir, 'header_fixed_after.png');
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  ws.close();
  chromeProc.kill();
}

run();
