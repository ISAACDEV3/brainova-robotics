const { app, BrowserWindow, Menu, Tray, ipcMain, nativeTheme, screen, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path  = require('path');
const http  = require('http');
const fs    = require('fs');
const os    = require('os');
const Store = require('electron-store');
const QRCode = require('qrcode');

// ── PERSISTENT STORE ─────────────────────────────────────────────────────────
const store = new Store({ name: 'brainova-data' });

// ── DEFAULT USERS ─────────────────────────────────────────────────────────────
if (!store.has('brainova_users')) {
  store.set('brainova_users', [
    { id: 'admin-001', username: 'admin', password: 'brainova2026', role: 'admin', name: 'إدارة الأكاديمية' }
  ]);
}

let mainWindow, tray, parentServer;
let currentUser = { id: 'admin-001', username: 'admin', role: 'admin', name: 'إدارة الأكاديمية' };
const PARENT_PORT = 3055;

// ── AUTOMATIC BACKUP ENGINE ──────────────────────────────────────────────────
function getBackupDirectory() {
  const docsPath = app.getPath('documents');
  const backupDir = path.join(docsPath, 'Brainova Robotics Backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}

function performAutoBackup() {
  try {
    const backupDir = getBackupDirectory();
    const today = new Date().toISOString().slice(0, 10);
    const backupFile = path.join(backupDir, `auto-backup-${today}.brainova`);
    const data = JSON.stringify(store.store, null, 2);
    fs.writeFileSync(backupFile, data, 'utf8');
    console.log('[Brainova AutoBackup] تم حفظ نسخة احتياطية يومية في:', backupFile);

    // Keep only last 15 backups
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('auto-backup-') && f.endsWith('.brainova'))
      .sort();
    if (files.length > 15) {
      files.slice(0, files.length - 15).forEach(oldFile => {
        try { fs.unlinkSync(path.join(backupDir, oldFile)); } catch(e){}
      });
    }
  } catch (err) {
    console.error('[Brainova AutoBackup Error]:', err.message);
  }
}

// ── AUTO-UPDATER CONFIGURATION (GITHUB RELEASES) ─────────────────────────────
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    console.log('[Brainova AutoUpdate] فحص وجود تحديثات جديدة...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[Brainova AutoUpdate] تحديث جديد متاح:', info.version);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-available', info.version);
    }
  });

  autoUpdater.on('update-not-available', () => {
    console.log('[Brainova AutoUpdate] التطبيق محدث لآخر إصدار.');
  });

  autoUpdater.on('error', (err) => {
    console.log('[Brainova AutoUpdate Error]:', err ? err.message : err);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[Brainova AutoUpdate] تم اكتمال تحميل التحديث:', info.version);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-downloaded', info.version);
    }
    
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'تحديث جديد متوفر 🚀',
      message: `تم تحميل الإصدار الجديد v${info.version} بنجاح!`,
      detail: 'هل ترغب في إعادة تشغيل التطبيق الآن لتثبيت التحديث؟ لن تفقد أي بيانات.',
      buttons: ['نعم، إعادة التشغيل والتثبيت', 'لاحقاً (عند إغلاق البرنامج)'],
      defaultId: 0,
      cancelId: 1
    }).then((res) => {
      if (res.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  // Check for updates 5 seconds after startup (in production / packaged mode)
  setTimeout(() => {
    if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify().catch((e) => {
        console.log('[Brainova AutoUpdate Check Error]:', e.message);
      });
    }
  }, 5000);
}

// ── LOCAL IP ──────────────────────────────────────────────────────────────────
function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const list of Object.values(ifaces)) {
    for (const alias of list) {
      if (alias.family === 'IPv4' && !alias.internal) return alias.address;
    }
  }
  return 'localhost';
}

// ── PARENT HTTP SERVER ────────────────────────────────────────────────────────
function startParentServer() {
  const appPath = app.getAppPath();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.ico':  'image/x-icon',
    '.json': 'application/json'
  };

  parentServer = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PARENT_PORT}`);
    const pathname = url.pathname;

    // ── REST API ─────────────────────────────────────────────────────────────
    if (pathname === '/api/student') {
      const u = url.searchParams.get('u');
      const p = url.searchParams.get('p');
      const students = store.get('brainova_students', []);
      const stu = students.find(s =>
        (s.username || '').toLowerCase() === (u || '').toLowerCase() &&
        (s.password || '') === (p || '')
      );
      res.writeHead(stu ? 200 : 401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(stu ? { ok: true, student: stu } : { ok: false }));
      return;
    }

    if (pathname === '/api/payments') {
      const id = url.searchParams.get('studentId');
      const payments = store.get('brainova_payments', []);
      const filtered = id ? payments.filter(p => p.studentId === id) : payments;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(filtered));
      return;
    }

    if (pathname === '/api/attendance') {
      const id = url.searchParams.get('studentId');
      const att = store.get('brainova_attendance', []);
      const filtered = id ? att.filter(a => a.studentId === id) : att;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(filtered));
      return;
    }

    if (pathname === '/api/receipt') {
      const pid = url.searchParams.get('id') || url.searchParams.get('op');
      const payments = store.get('brainova_payments', []);
      const pay = pid ? payments.find(p => p.id === pid || p.opNumber === pid || p.id === 'REC-' + pid) : payments[payments.length - 1];
      const students = store.get('brainova_students', []);
      const stu = pay ? students.find(s => s.id === pay.studentId) : null;
      res.writeHead(pay ? 200 : 404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(pay ? { ok: true, payment: pay, student: stu } : { ok: false }));
      return;
    }

    // ── FILE SERVING ─────────────────────────────────────────────────────────
    let filePath;
    if (pathname === '/' || pathname === '/parent.html') {
      filePath = path.join(appPath, 'parent.html');
    } else {
      filePath = path.join(appPath, pathname);
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeTypes[ext] || 'application/octet-stream';

    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  parentServer.listen(PARENT_PORT, '0.0.0.0', () => {
    console.log(`[Brainova] Parent portal: http://${getLocalIP()}:${PARENT_PORT}`);
  });
}

// ── SPLASH ───────────────────────────────────────────────────────────────────
function createSplash() {
  const splash = new BrowserWindow({
    width: 520, height: 340,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    center: true,
    resizable: false,
    hasShadow: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  splash.loadFile(path.join(__dirname, 'splash.html'));
  return splash;
}

// ── MAIN WINDOW ───────────────────────────────────────────────────────────────
function createMain(splash) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width:    Math.min(1440, width),
    height:   Math.min(900, height),
    minWidth: 1024,
    minHeight: 640,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    transparent: false,
    backgroundColor: '#070D19',
    icon: path.join(__dirname, '..', 'assets', 'images', 'robot.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'dashboard.html'));

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (splash && !splash.isDestroyed()) splash.close();
      mainWindow.show();
      mainWindow.center();
      performAutoBackup();
      setupAutoUpdater();
    }, 2200);
  });

  mainWindow.on('close', () => {
    performAutoBackup();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (tray) { tray.destroy(); tray = null; }
    if (parentServer) parentServer.close();
    app.quit();
  });

  buildMenu();
  buildTray();
}

// ── SUB WINDOW ────────────────────────────────────────────────────────────────
function openWindow(file, w = 1200, h = 800) {
  const win = new BrowserWindow({
    width: w, height: h,
    minWidth: 900, minHeight: 600,
    frame: false,
    backgroundColor: '#070D19',
    icon: path.join(__dirname, '..', 'assets', 'images', 'robot.png'),
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile(path.join(__dirname, '..', file));
  return win;
}

// ── MENU ──────────────────────────────────────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: 'Brainova',
      submenu: [
        { label: '📊 لوحة التحكم', click: () => mainWindow && mainWindow.focus() },
        { type: 'separator' },
        { label: '📁 مجلد النسخ الاحتياطية', click: () => shell.openPath(getBackupDirectory()) },
        { type: 'separator' },
        { label: '🌐 بوابة الأولياء (شاشة)', click: () => openWindow('parent.html', 1100, 750) },
        { label: '🏠 الموقع الرسمي',  click: () => openWindow('index.html', 1300, 800) },
        { type: 'separator' },
        { label: '🚪 خروج', role: 'quit' }
      ]
    },
    {
      label: 'عرض',
      submenu: [
        { role: 'reload',           label: 'إعادة تحميل' },
        { role: 'toggleDevTools',   label: 'أدوات المطور' },
        { type: 'separator' },
        { role: 'resetZoom',        label: 'الحجم الافتراضي' },
        { role: 'zoomIn',           label: 'تكبير (+)' },
        { role: 'zoomOut',          label: 'تصغير (-)' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'ملء الشاشة (F11)' }
      ]
    },
    {
      label: 'نافذة',
      submenu: [
        { label: 'تصغير', click: () => mainWindow && mainWindow.minimize() },
        { label: 'تكبير', click: () => mainWindow && (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()) },
        { label: 'إغلاق', click: () => mainWindow && mainWindow.close() }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── TRAY ──────────────────────────────────────────────────────────────────────
function buildTray() {
  const iconPath = path.join(__dirname, '..', 'assets', 'images', 'robot.png');
  tray = new Tray(iconPath);
  tray.setToolTip('Brainova Robotics Academy');
  const ctxMenu = Menu.buildFromTemplate([
    { label: '📊 لوحة التحكم',   click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } } },
    { label: '📁 فتح مجلد النسخ الاحتياطية', click: () => shell.openPath(getBackupDirectory()) },
    { label: '🌐 بوابة الأولياء', click: () => openWindow('parent.html', 1100, 750) },
    { type: 'separator' },
    { label: '🚪 إغلاق البرنامج', click: () => app.quit() }
  ]);
  tray.setContextMenu(ctxMenu);
  tray.on('double-click', () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } });
}

// ── APP EVENTS ────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  nativeTheme.themeSource = 'dark';
  startParentServer();
  const splash = createSplash();
  createMain(splash);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMain(null);
});

// ── IPC: WINDOW CONTROLS ──────────────────────────────────────────────────────
ipcMain.on('win-minimize',  () => mainWindow && mainWindow.minimize());
ipcMain.on('win-maximize',  () => mainWindow && (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()));
ipcMain.on('win-close',     () => mainWindow && mainWindow.close());
ipcMain.on('win-hide',      () => mainWindow && mainWindow.hide());
ipcMain.on('open-parent-portal', () => openWindow('parent.html', 1100, 750));
ipcMain.on('open-main-site',     () => openWindow('index.html', 1300, 800));
ipcMain.handle('win-is-maximized', () => mainWindow ? mainWindow.isMaximized() : false);

// ── IPC: PRINT DIALOG & RECEIPT PRINTING ──────────────────────────────────────
ipcMain.on('print-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
  if (win) {
    win.webContents.print({
      silent: false,
      printBackground: true
    }, (success, failureReason) => {
      if (!success && failureReason !== 'cancelled') {
        console.log('[Brainova Print Status]:', failureReason);
      }
    });
  }
});

ipcMain.on('print-receipt', (event, payload) => {
  const paymentId = (typeof payload === 'object' && payload && payload.id) ? payload.id : (typeof payload === 'string' ? payload : '');
  const url = `http://localhost:${PARENT_PORT}/print-receipt.html?id=${encodeURIComponent(paymentId)}`;
  console.log('[Brainova] Opening Google Chrome for Receipt Printing:', url);
  shell.openExternal(url);
});

// ── IPC: AUTO UPDATER MANUAL TRIGGER ──────────────────────────────────────────
ipcMain.on('check-for-updates', () => {
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify().catch((e) => {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'فحص التحديثات',
        message: 'التطبيق محدث لأحدث إصدار أو لا يمكن الاتصال بمستودع التحديثات حالياً.',
        buttons: ['حسناً']
      });
    });
  } else {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'وضع التطوير',
      message: 'فحص التحديثات التلقائية يعمل في النسخ المثبتة (Production Build).',
      buttons: ['حسناً']
    });
  }
});

// ── IPC: LOGIN ────────────────────────────────────────────────────────────────
ipcMain.handle('login-attempt', (_, { username, password }) => {
  const users = store.get('brainova_users', []);
  const user = users.find(u =>
    u.username.toLowerCase() === username.toLowerCase() &&
    u.password === password
  );
  if (user) {
    currentUser = user;
    return { ok: true, user: { id: user.id, name: user.name, role: user.role, username: user.username } };
  }
  return { ok: false };
});

ipcMain.on('login-success', () => {
  createMain();
});

ipcMain.handle('get-current-user', () => currentUser);

// ── IPC: DATA STORE ───────────────────────────────────────────────────────────
ipcMain.handle('store-get', (_, key) => {
  return store.get(key, null);
});

ipcMain.on('store-set', (_, key, value) => {
  store.set(key, value);
});

ipcMain.handle('store-get-all', () => {
  return store.store; // returns entire store object
});

ipcMain.on('store-delete', (_, key) => {
  store.delete(key);
});

ipcMain.on('store-clear', () => {
  store.clear();
});

// ── IPC: BACKUP / RESTORE ─────────────────────────────────────────────────────
ipcMain.on('open-backup-folder', () => {
  shell.openPath(getBackupDirectory());
});

ipcMain.handle('backup-export', async () => {
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title: 'حفظ النسخة الاحتياطية',
    defaultPath: `brainova-backup-${new Date().toISOString().slice(0, 10)}.brainova`,
    filters: [{ name: 'Brainova Backup', extensions: ['brainova'] }]
  });
  if (canceled || !filePath) return { ok: false };
  const data = JSON.stringify(store.store, null, 2);
  fs.writeFileSync(filePath, data, 'utf8');
  return { ok: true, path: filePath };
});

ipcMain.handle('backup-import', async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: 'استيراد نسخة احتياطية',
    filters: [{ name: 'Brainova Backup', extensions: ['brainova'] }],
    properties: ['openFile']
  });
  if (canceled || !filePaths.length) return { ok: false };
  try {
    const raw = fs.readFileSync(filePaths[0], 'utf8');
    const data = JSON.parse(raw);
    Object.entries(data).forEach(([k, v]) => store.set(k, v));
    return { ok: true };
  } catch {
    return { ok: false, error: 'ملف غير صالح' };
  }
});

// ── IPC: PARENT PORTAL INFO + QR CODE ────────────────────────────────────────
ipcMain.handle('get-portal-info', async () => {
  const ip = getLocalIP();
  const url = `http://${ip}:${PARENT_PORT}`;
  try {
    const qr = await QRCode.toDataURL(url, { width: 200, margin: 1, color: { dark: '#0284C7', light: '#FFFFFF' } });
    return { ip, port: PARENT_PORT, url, qr };
  } catch {
    return { ip, port: PARENT_PORT, url, qr: null };
  }
});

// ── IPC: USER MANAGEMENT ──────────────────────────────────────────────────────
ipcMain.handle('get-users', () => {
  return store.get('brainova_users', []);
});

ipcMain.on('save-users', (_, users) => {
  store.set('brainova_users', users);
});

ipcMain.on('logout', () => {
  currentUser = null;
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
  createLoginWindow(null);
});