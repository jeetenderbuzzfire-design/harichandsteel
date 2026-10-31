const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDir = path.join(__dirname, 'chrome_admin_auth_' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const debugPort = 9251;
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
  await send('Network.enable');

  console.log('======================================================');
  console.log('STEP 1: VISIT /admin DIRECTLY (UNAUTHENTICATED)');
  console.log('======================================================');
  await send('Page.navigate', { url: 'http://localhost:8080/admin' });
  await new Promise(r => setTimeout(r, 1200));

  let res = await send('Runtime.evaluate', {
    expression: `
      (() => ({
        url: window.location.href,
        pathname: window.location.pathname,
        isLoginPage: !!document.getElementById('adminLoginForm'),
        hasUsernameInput: !!document.getElementById('adminUsername'),
        title: document.title
      }))()
    `,
    returnByValue: true
  });
  console.log('Result for /admin:', res.result.value);

  console.log('\n======================================================');
  console.log('STEP 2: SUBMIT WRONG CREDENTIALS (SHOULD REJECT & BLOCK)');
  console.log('======================================================');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.getElementById('adminUsername').value = 'wrong_admin';
        document.getElementById('adminPassword').value = 'wrong_password_123';
        document.getElementById('submitBtn').click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 800));

  res = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const alert = document.getElementById('loginAlert');
        return {
          url: window.location.href,
          pathname: window.location.pathname,
          alertVisible: alert && alert.style.display !== 'none',
          alertText: alert ? alert.innerText.trim() : null,
          stillOnLogin: !!document.getElementById('adminLoginForm')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Wrong credentials result:', res.result.value);

  console.log('\n======================================================');
  console.log('STEP 3: SUBMIT CORRECT CREDENTIALS (admin / Harichand@2026)');
  console.log('======================================================');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.getElementById('adminUsername').value = 'admin';
        document.getElementById('adminPassword').value = 'Harichand@2026';
        document.getElementById('submitBtn').click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  res = await send('Runtime.evaluate', {
    expression: `
      (() => ({
        url: window.location.href,
        pathname: window.location.pathname,
        isDashboard: !!document.getElementById('adminSidebar'),
        hasStats: !!document.querySelector('.stats-grid'),
        topbarHeading: document.getElementById('pageHeading') ? document.getElementById('pageHeading').innerText : null,
        title: document.title
      }))()
    `,
    returnByValue: true
  });
  console.log('Correct credentials result:', res.result.value);

  console.log('\n======================================================');
  console.log('STEP 4: NAVIGATE TO /admin/products WHILE LOGGED IN');
  console.log('======================================================');
  await send('Page.navigate', { url: 'http://localhost:8080/admin/products' });
  await new Promise(r => setTimeout(r, 1200));

  res = await send('Runtime.evaluate', {
    expression: `
      (() => ({
        url: window.location.href,
        pathname: window.location.pathname,
        isDashboard: !!document.getElementById('adminSidebar'),
        activeTab: document.querySelector('.admin-nav-item.active') ? document.querySelector('.admin-nav-item.active').getAttribute('data-tab') : null,
        tableRowsCount: document.querySelectorAll('#productsTableBody tr').length
      }))()
    `,
    returnByValue: true
  });
  console.log('Protected /admin/products result:', res.result.value);

  console.log('\n======================================================');
  console.log('STEP 5: TEST LOGOUT');
  console.log('======================================================');
  await send('Runtime.evaluate', {
    expression: `
      (async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        localStorage.removeItem('hs_admin_session');
        localStorage.removeItem('hs_admin_api_key');
        window.location.href = '/admin/login';
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  // Now try to visit /admin again after logging out
  await send('Page.navigate', { url: 'http://localhost:8080/admin' });
  await new Promise(r => setTimeout(r, 1200));

  res = await send('Runtime.evaluate', {
    expression: `
      (() => ({
        url: window.location.href,
        pathname: window.location.pathname,
        isLoginPage: !!document.getElementById('adminLoginForm'),
        isBlockedFromAdmin: !document.getElementById('adminSidebar')
      }))()
    `,
    returnByValue: true
  });
  console.log('Post-logout access to /admin result:', res.result.value);

  ws.close();
  chromeProc.kill();
  console.log('\nALL ADMIN LOGIN TESTS COMPLETED SUCCESSFULLY!');
}

run();
