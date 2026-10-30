const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browserExe = fs.existsSync(chromePath) ? chromePath : edgePath;

async function run() {
  const debugPort = 9229;
  const userDir = path.join(__dirname, 'chrome_cdp_profile_interactivity');
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

  let list = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    await new Promise(r => setTimeout(r, 500));
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

    console.log('--- Testing Mobile Interactivity on 375px Viewport ---');
    await send('Page.navigate', { url: 'http://localhost:8080/' });
    await new Promise(r => setTimeout(r, 1000));

    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 300));

    // 1. Test Sticky Bar presence & visibility
    const stickyCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const bar = document.querySelector('.mobile-sticky-bar');
          if (!bar) return { error: 'Sticky bar not found' };
          const style = window.getComputedStyle(bar);
          const rect = bar.getBoundingClientRect();
          const callBtn = bar.querySelector('a[href^="tel:"]');
          const waBtn = bar.querySelector('a[href*="wa.me"]');
          return {
            display: style.display,
            position: style.position,
            bottom: style.bottom,
            visible: rect.height > 0 && style.display !== 'none',
            hasCall: !!callBtn,
            callHref: callBtn ? callBtn.getAttribute('href') : null,
            hasWa: !!waBtn,
            waHref: waBtn ? waBtn.getAttribute('href') : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Mobile Sticky Bar Status:', stickyCheck.result.value);

    // 2. Test Mobile Menu Button Click
    const menuClickRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('.mobile-menu-btn');
          const nav = document.querySelector('.main-nav');
          if (!btn) return { error: 'Mobile menu button not found' };
          btn.click();
          return {
            clicked: true,
            navHasOpenClass: nav.classList.contains('open'),
            navComputedDisplay: window.getComputedStyle(nav).display
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Mobile Menu Toggle Open:', menuClickRes.result.value);

    // 3. Test Dropdown click inside mobile drawer
    const dropdownClickRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const dropdownToggle = document.querySelector('.has-dropdown > .dropdown-toggle') || document.querySelector('.has-dropdown > a');
          const dropdownMenu = document.querySelector('.has-dropdown .dropdown-menu');
          if (!dropdownToggle) return { error: 'Dropdown toggle not found' };
          dropdownToggle.click();
          return {
            clicked: true,
            menuHasShowClass: dropdownMenu.classList.contains('show'),
            menuComputedDisplay: window.getComputedStyle(dropdownMenu).display
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Mobile Dropdown Accordion Expand:', dropdownClickRes.result.value);

    // 4. Test "Our Products" link has NO dropdown
    const ourProductsCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const links = Array.from(document.querySelectorAll('.nav-link'));
          const ourProductsLink = links.find(l => l.textContent.trim().toLowerCase().includes('our products'));
          const hasDropdownChild = ourProductsLink ? ourProductsLink.parentElement.querySelector('.dropdown-menu') : null;
          return {
            found: !!ourProductsLink,
            hasDropdownMenu: !!hasDropdownChild,
            href: ourProductsLink ? ourProductsLink.getAttribute('href') : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Our Products (No Dropdown Check):', ourProductsCheck.result.value);

    ws.close();
  } catch (err) {
    console.error('Error during interactivity testing:', err);
  } finally {
    chromeProc.kill();
  }
}

run();
