const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDir = path.join(__dirname, 'chrome_cdp_profile_estimator_' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const debugPort = 9232;
  const chromeProc = spawn(chromePath, [
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

  let list = null;
  for (let attempt = 0; attempt < 25; attempt++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      list = await cdpGet('/json/list');
      if (list && list.length > 0) break;
    } catch (e) {}
  }

  if (!list) throw new Error('Chrome failed to start');

  try {
    const pageTarget = list.find(t => t.type === 'page') || list[0];
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

    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise(r => setTimeout(r, 1200));

    // Match exact user viewport: 320 x 557
    await send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 557,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 400));

    // Scroll to #quickEstimator
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#quickEstimator').scrollIntoView();
      `
    });
    await new Promise(r => setTimeout(r, 400));

    // Capture screenshot of viewport
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(__dirname, 'estimator_after.png');
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot to:', shotPath);

    // Evaluate detailed element widths
    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const root = document.querySelector('#quickEstimator');
          const elements = root.querySelectorAll('*');
          const wideElements = [];
          for (const el of elements) {
            const r = el.getBoundingClientRect();
            const cs = window.getComputedStyle(el);
            if (r.right > 310) {
              wideElements.push({
                tag: el.tagName,
                className: el.className,
                id: el.id,
                rect: { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) },
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
                minWidth: cs.minWidth,
                width: cs.width,
                whiteSpace: cs.whiteSpace,
                padding: cs.padding,
                text: el.innerText ? el.innerText.trim().substring(0, 40) : ''
              });
            }
          }
          return {
            boxRect: document.querySelector('.estimator-box').getBoundingClientRect(),
            boxPadding: window.getComputedStyle(document.querySelector('.estimator-box')).padding,
            gridTemplateColumns: window.getComputedStyle(document.querySelector('.estimator-grid')).gridTemplateColumns,
            wideElements
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Metrics at 320x557:');
    console.log(JSON.stringify(res.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProc.kill();
  }
}

run();
