const { app, BrowserWindow, Menu, Tray, ipcMain, nativeTheme, screen, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path   = require('path');
const http   = require('http');
const fs     = require('fs');
const os     = require('os');
const crypto = require('crypto');
const Store  = require('electron-store');
const QRCode = require('qrcode');
const whatsappBot = require('./whatsapp-bot');
const cloudSync = require('./cloudSync');

// Global crash guards
process.on('uncaughtException', (err) => {
  console.error('[Brainova Uncaught Exception]:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Brainova Unhandled Rejection]:', reason);
});

// Single instance lock to prevent duplicate instances and port collisions
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// ── PERSISTENT STORE (MILITARY-GRADE AES-256 ENCRYPTION AT REST) ─────────────
const STORE_ENCRYPTION_KEY = 'Brainova_Robotics_2026_Vault_Key_AES256_x86_x64';
const store = new Store({ name: 'brainova-data', encryptionKey: STORE_ENCRYPTION_KEY });

// ── DEFAULT USERS ─────────────────────────────────────────────────────────────
if (!store.has('brainova_users')) {
  store.set('brainova_users', [
    { id: 'admin-001', username: 'admin', password: '', role: 'admin', name: 'إدارة الأكاديمية' }
  ]);
}

let mainWindow, tray, parentServer;
let currentUser = { id: 'admin-001', username: 'admin', role: 'admin', name: 'إدارة الأكاديمية' };
const PARENT_PORT = 3055;

// ── MILITARY-GRADE AES-256-GCM BACKUP ENCRYPTION VAULT ────────────────────────
const BACKUP_VAULT_KEY = crypto.createHash('sha256').update('Brainova_Robotics_2026_Enterprise_Secure_Vault').digest();

function encryptBackupPayload(jsonString) {
  const iv = crypto.randomBytes(12); // 96-bit random initialization vector
  const cipher = crypto.createCipheriv('aes-256-gcm', BACKUP_VAULT_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(jsonString, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag(); // 128-bit authentication & integrity tag
  return Buffer.concat([Buffer.from('BNV1', 'ascii'), iv, tag, encrypted]);
}

function decryptBackupPayload(buffer) {
  if (Buffer.isBuffer(buffer) && buffer.length >= 32 && buffer.subarray(0, 4).toString('ascii') === 'BNV1') {
    const iv = buffer.subarray(4, 16);
    const tag = buffer.subarray(16, 32);
    const ciphertext = buffer.subarray(32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', BACKUP_VAULT_KEY, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
  }
  // Backward compatibility with legacy unencrypted JSON backup files
  return JSON.parse(buffer.toString('utf8'));
}

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
    const rawJson = JSON.stringify(store.store, null, 2);
    const encryptedPayload = encryptBackupPayload(rawJson);

    // Atomic write: write to unique temporary file first, then replace destination
    const tmpFile = path.join(backupDir, `auto-backup-${today}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}.tmp`);
    fs.writeFileSync(tmpFile, encryptedPayload);
    try {
      fs.renameSync(tmpFile, backupFile);
    } catch (renameErr) {
      if (fs.existsSync(backupFile)) {
        try { fs.unlinkSync(backupFile); } catch(e){}
      }
      fs.renameSync(tmpFile, backupFile);
    }
    console.log('[Brainova AutoBackup] تم حفظ نسخة احتياطية ذرية مشفرة بـ AES-256-GCM في:', backupFile);

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

  // Periodic silent check every 30 minutes while app is running
  setInterval(() => {
    if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify().catch((e) => {
        console.log('[Brainova AutoUpdate Background Check Error]:', e.message);
      });
    }
  }, 30 * 60 * 1000);
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
  const safeAppPath = path.resolve(appPath);
  const mimeTypes = {
    '.html':  'text/html; charset=utf-8',
    '.css':   'text/css',
    '.js':    'application/javascript',
    '.png':   'image/png',
    '.jpg':   'image/jpeg',
    '.jpeg':  'image/jpeg',
    '.svg':   'image/svg+xml',
    '.ico':   'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff':  'font/woff',
    '.ttf':   'font/ttf'
  };

  // IP Rate Limiter to mitigate brute-force password guessing and flooding
  const ipRateLimits = new Map();
  function checkRateLimit(ip, maxRequests = 20, windowMs = 5000) {
    const now = Date.now();
    let record = ipRateLimits.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      ipRateLimits.set(ip, record);
      return true;
    }
    record.count++;
    if (record.count > maxRequests) {
      return false;
    }
    return true;
  }

  parentServer = http.createServer((req, res) => {
    // Security headers for local portal
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    // Rate limiting check
    const clientIp = req.socket.remoteAddress || '127.0.0.1';
    if (!checkRateLimit(clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'Too Many Requests. Please slow down.' }));
      return;
    }

    let url;
    try {
      url = new URL(req.url, `http://localhost:${PARENT_PORT}`);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Bad Request');
      return;
    }
    const pathname = url.pathname;

    // ── REST API ─────────────────────────────────────────────────────────────
    if (pathname === '/api/student') {
      const u = (url.searchParams.get('u') || '').trim();
      const p = (url.searchParams.get('p') || '').trim();
      if (!u || !p) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Missing username or password' }));
        return;
      }
      const students = store.get('brainova_students', []);
      const stu = students.find(s =>
        (s.username || '').toLowerCase() === u.toLowerCase() &&
        (s.password || '') === p
      );
      res.writeHead(stu ? 200 : 401, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(stu ? { ok: true, student: stu } : { ok: false, error: 'Invalid credentials' }));
      return;
    }

    if (pathname === '/api/payments') {
      const id = url.searchParams.get('studentId');
      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Missing required studentId parameter' }));
        return;
      }
      const cleanId = id.trim();
      const payments = store.get('brainova_payments', []);
      const filtered = payments.filter(p => p.studentId === cleanId);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(filtered));
      return;
    }

    if (pathname === '/api/attendance') {
      const id = url.searchParams.get('studentId');
      if (!id || typeof id !== 'string' || id.trim() === '') {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Missing required studentId parameter' }));
        return;
      }
      const cleanId = id.trim();
      const att = store.get('brainova_attendance', []);
      const filtered = att.filter(a => a.studentId === cleanId);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(filtered));
      return;
    }

    if (pathname === '/api/receipt') {
      const pid = url.searchParams.get('id') || url.searchParams.get('op');
      if (!pid || typeof pid !== 'string' || pid.trim() === '') {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Missing required payment ID parameter' }));
        return;
      }
      const cleanPid = pid.trim();
      const payments = store.get('brainova_payments', []);
      const pay = payments.find(p => p.id === cleanPid || String(p.opNumber) === cleanPid || p.id === 'REC-' + cleanPid);
      const students = store.get('brainova_students', []);
      const stu = pay ? students.find(s => s.id === pay.studentId) : null;
      res.writeHead(pay ? 200 : 404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(pay ? { ok: true, payment: pay, student: stu } : { ok: false, error: 'Receipt not found' }));
      return;
    }

    // ── FILE SERVING (PATH TRAVERSAL DEFENSE & MIME WHITELIST) ───────────────
    let reqPath;
    try {
      reqPath = decodeURIComponent(pathname);
    } catch {
      reqPath = pathname;
    }

    if (reqPath === '/' || reqPath === '/parent.html') {
      reqPath = 'parent.html';
    } else {
      reqPath = reqPath.replace(/^[/\\]+/, '');
    }

    const resolvedPath = path.resolve(safeAppPath, reqPath);

    // Path traversal defense: ensure resolvedPath strictly belongs to safeAppPath
    if (!resolvedPath.startsWith(safeAppPath + path.sep) && resolvedPath !== safeAppPath) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Access Denied: Path Traversal Detected');
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    // Only serve allowed static asset types (strictly blocks .json, .env, .brainova, .exe, etc.)
    if (!mimeTypes[ext]) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden File Type');
      return;
    }

    try {
      if (!fs.existsSync(resolvedPath) || fs.statSync(resolvedPath).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }
      const data = fs.readFileSync(resolvedPath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] });
      res.end(data);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
    }
  });

  parentServer.on('error', (err) => {
    console.error('[Brainova] Parent portal server error:', err.message);
  });

  try {
    parentServer.listen(PARENT_PORT, '0.0.0.0', () => {
      console.log(`[Brainova] Parent portal: http://${getLocalIP()}:${PARENT_PORT}`);
    });
  } catch (err) {
    console.error('[Brainova] Parent portal listen error:', err.message);
  }
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
    show: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  splash.loadFile(path.join(__dirname, 'splash.html'));
  return splash;
}

// ── MAIN WINDOW ───────────────────────────────────────────────────────────────
function createMain(splash) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width:    width,
    height:   height,
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

  // Ensure external links and print receipts open in user's default browser (Google Chrome, etc.)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('print-receipt.html') || url.startsWith('http:') || url.startsWith('https:') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('show', () => {
    try {
      if (!mainWindow.isMaximized()) {
        mainWindow.maximize();
      }
    } catch(e) {}
  });

  let isReadyToShow = false;
  let isSplashFinished = false;
  let isAppLaunched = false;

  function launchMainWindow() {
    if (isAppLaunched) return;
    if (!isReadyToShow || !isSplashFinished) return;
    isAppLaunched = true;

    // 1. Immediately unpin, hide and destroy splash window so it vanishes 100% cleanly from desktop
    if (splash && !splash.isDestroyed()) {
      try { splash.setAlwaysOnTop(false); } catch(e) {}
      try { splash.hide(); } catch(e) {}
      try { splash.destroy(); } catch(e) {}
    }

    // 2. Wait 350ms to ensure Windows DWM has fully cleared the splash window before revealing mainWindow
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show();
        mainWindow.focus();

        performAutoBackup();
        setupAutoUpdater();
      }
    }, 350);

      // Initialize WhatsApp Automation Bot
      try {
        const waAuthDir = path.join(app.getPath('userData'), 'whatsapp_auth');
        const savedAiSettings = store.get('brainova_ai_settings') || { enabled: true, apiKey: '' };
        whatsappBot.setAiSettings(savedAiSettings);

        whatsappBot.init(
          waAuthDir,
          (channel, data) => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send(channel, data);
            }
          },
          () => ({
            students: store.get('brainova_students') || [],
            groups: store.get('brainova_groups') || [],
            attendance: store.get('brainova_attendance') || [],
            courses: store.get('brainova_courses') || [],
            schedule: store.get('brainova_schedule') || [],
            rooms: store.get('brainova_rooms') || [],
            educators: store.get('brainova_educators') || []
          })
        );
        if (fs.existsSync(waAuthDir) && fs.readdirSync(waAuthDir).length > 0) {
          whatsappBot.start().catch(err => console.error('[WhatsApp Bot Auto-Start Error]:', err));
        }
      } catch (waErr) {
        console.error('[WhatsApp Bot Init Error]:', waErr);
      }

      // Initialize Silent Cloud Fleet Sync Engine
      try {
        cloudSync.init(store, app);
        cloudSync.onRemoteCommands((commands) => {
          if (mainWindow && !mainWindow.isDestroyed() && commands) {
            mainWindow.webContents.send('remote-license-status', commands);
          }
        });
        let lastLocalSnapshotNonce = Date.now();
        function takeAndUploadSnapshot(targetUrl) {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.capturePage().then(img => {
              const jpegBuf = img.toJPEG(75);
              const base64 = 'data:image/jpeg;base64,' + jpegBuf.toString('base64');
              const destination = targetUrl || cloudSync.config.databaseUrl;
              cloudSync.uploadLiveSnapshot(destination, base64);
            }).catch(err => {
              console.error('[Brainova] Capture page error:', err);
            });
          }
        }

        cloudSync.onTakeSnapshot((targetUrl) => {
          takeAndUploadSnapshot(targetUrl);
        });
        cloudSync.onEmergencyWipe(() => {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('remote-emergency-wipe');
          }
        });
        cloudSync.onRestartApp(() => {
          app.relaunch();
          app.exit(0);
        });
        cloudSync.onClearCache(async () => {
          try {
            if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents && mainWindow.webContents.session) {
              await mainWindow.webContents.session.clearCache();
              mainWindow.webContents.reloadIgnoringCache();
            }
          } catch(e) {}
        });
        if (typeof store.onDidChange === 'function') {
          store.onDidChange('brainova_remote_commands', (newVal) => {
            if (mainWindow && !mainWindow.isDestroyed() && newVal) {
              mainWindow.webContents.send('remote-license-status', newVal);
            }
            if (newVal && newVal.requestSnapshot && newVal.requestSnapshot !== lastLocalSnapshotNonce) {
              lastLocalSnapshotNonce = newVal.requestSnapshot;
              takeAndUploadSnapshot();
            }
          });
          store.onDidChange('brainova_feature_flags', (flags) => {
            if (mainWindow && !mainWindow.isDestroyed() && flags) {
              mainWindow.webContents.send('remote-feature-flags', flags);
            }
          });
          store.onDidChange('brainova_broadcast_banner', (banner) => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('remote-broadcast-banner', banner);
            }
          });
        }
        try {
          if (store.path && fs.existsSync(store.path)) {
            fs.watchFile(store.path, { interval: 800 }, () => {
              try {
                const fresh = JSON.parse(fs.readFileSync(store.path, 'utf8'));
                if (fresh && fresh.brainova_remote_commands && mainWindow && !mainWindow.isDestroyed()) {
                  mainWindow.webContents.send('remote-license-status', fresh.brainova_remote_commands);
                  if (fresh.brainova_remote_commands.requestSnapshot && fresh.brainova_remote_commands.requestSnapshot !== lastLocalSnapshotNonce) {
                    lastLocalSnapshotNonce = fresh.brainova_remote_commands.requestSnapshot;
                    takeAndUploadSnapshot();
                  }
                }
                if (fresh && fresh.brainova_feature_flags && mainWindow && !mainWindow.isDestroyed()) {
                  mainWindow.webContents.send('remote-feature-flags', fresh.brainova_feature_flags);
                }
                if (fresh && fresh.brainova_broadcast_banner !== undefined && mainWindow && !mainWindow.isDestroyed()) {
                  mainWindow.webContents.send('remote-broadcast-banner', fresh.brainova_broadcast_banner);
                }
              } catch(e) {}
            });
          }
        } catch(e) {}
      } catch (csErr) {}
  }

  mainWindow.once('ready-to-show', () => {
    isReadyToShow = true;
    launchMainWindow();
  });

  // Ensure splash card is displayed first and finishes its complete loading sequence (~2450ms)
  setTimeout(() => {
    isSplashFinished = true;
    launchMainWindow();
  }, 2450);

  mainWindow.on('close', () => {
    performAutoBackup();
    try {
      cloudSync.performSync('app_close');
    } catch (e) {}
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
        { label: '🏠 الموقع الرسمي للأكاديمية',  click: () => openWindow('index.html', 1300, 800) },
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

  // Periodic auto-backup every 2 hours while application is running
  setInterval(() => {
    try {
      performAutoBackup();
    } catch (e) {
      console.error('[Brainova Periodic Backup Error]:', e);
    }
  }, 2 * 60 * 60 * 1000);
});

app.on('before-quit', () => {
  try {
    performAutoBackup();
  } catch (e) {}
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
ipcMain.on('open-main-site',     () => openWindow('index.html', 1300, 800));
ipcMain.handle('win-is-maximized', () => mainWindow ? mainWindow.isMaximized() : false);
ipcMain.handle('open-external', async (_, url) => {
  try {
    if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:'))) {
      await shell.openExternal(url);
      return { success: true };
    }
  } catch(e) {
    return { success: false, error: e.message };
  }
  return { success: false, error: 'Invalid URL' };
});

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

function convert12hTo24hString(str) {
  if (!str || typeof str !== 'string') return str;
  const isPM = str.includes('م') || str.toLowerCase().includes('pm');
  const isAM = str.includes('ص') || str.toLowerCase().includes('am');
  if (!isPM && !isAM) return str;

  return str.replace(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(م|ص|am|pm)?/gi, (match, hStr, mStr, sStr, ampm) => {
    let h = parseInt(hStr, 10);
    const indicator = (ampm || '').toLowerCase();
    if (indicator === 'م' || indicator === 'pm') {
      if (h < 12) h += 12;
    } else if (indicator === 'ص' || indicator === 'am') {
      if (h === 12) h = 0;
    }
    const h24 = String(h).padStart(2, '0');
    return sStr ? `${h24}:${mStr}:${sStr}` : `${h24}:${mStr}`;
  }).replace(/\s*(م|ص|am|pm)/gi, '').trim();
}

function format24hDateTime(inputDate = new Date()) {
  if (!inputDate) return '';
  let d = null;
  if (inputDate instanceof Date) {
    d = inputDate;
  } else if (typeof inputDate === 'string') {
    let cleaned = inputDate.trim();
    if (cleaned.includes('م') || cleaned.includes('ص') || cleaned.toLowerCase().includes('pm') || cleaned.toLowerCase().includes('am')) {
      return convert12hTo24hString(cleaned);
    }
    if (/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}/.test(cleaned)) {
      return cleaned;
    }
    d = new Date(cleaned);
  } else {
    d = new Date(inputDate);
  }

  if (!d || isNaN(d.getTime())) return String(inputDate);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

ipcMain.on('print-receipt', (event, payload) => {
  try {
    const paymentId = (typeof payload === 'object' && payload && payload.id) ? payload.id : (typeof payload === 'string' ? payload : '');
    const payments = store.get('brainova_payments', []);
    let pay = (typeof payload === 'object' && payload && payload.payment) ? payload.payment : null;
    if (!pay) {
      pay = paymentId ? payments.find(p => p.id === paymentId || p.opNumber === paymentId || p.id === 'REC-' + paymentId) : payments[payments.length - 1];
    }
    const students = store.get('brainova_students', []);
    const stu = pay ? students.find(s => s.id === pay.studentId) : null;

    const opNum = (pay && pay.opNumber) || (pay && pay.id ? pay.id.replace('REC-', '') : '63336');
    const stuName = (stu && stu.name) || (pay && pay.studentName) || 'تلميذ';
    const parentName = (stu && stu.parentName) || (pay && pay.parentName) || 'ولي الأمر';
    const levelGroup = `${(pay && pay.level) || 'المستوى الأول'} • ${(pay && pay.group) || 'الفوج أ'}`;
    const dateStr = format24hDateTime((pay && pay.date) || new Date());
    const payMethod = (pay && pay.method) || 'نقداً (Cash)';
    const isUnpaid = (pay && (pay.status === 'unpaid' || pay.isDebt)) || Number((pay && pay.amountPaid) || 0) === 0;
    const debtAmountNum = Number((pay && pay.debtAmount) || (stu && stu.debtAmount) || 5000);
    const unpaidSessionsNum = (pay && pay.unpaidSessions) || (stu && stu.unpaidSessions) || (stu && stu.unpaidAttendedSessions) || 4;
    const unpaidPeriodText = (pay && pay.unpaidPeriodText) || (stu && stu.debtNotes) || `${unpaidSessionsNum} حصص غير مدفوعة (درسها الطالب)`;

    const amountNum = isUnpaid ? 0 : Number((pay && pay.amountPaid) || 5000);
    const amountStr = isUnpaid ? '0 دج (غير مدفوع)' : `${amountNum.toLocaleString()} دج`;

    const remainingSessions = (pay && pay.sessionsRemaining !== undefined)
      ? pay.sessionsRemaining
      : ((stu && stu.sessionsRemaining !== undefined) ? stu.sessionsRemaining : ((pay && pay.sessionsPurchased) || 4));
    const balanceNum = (pay && pay.currentBalance !== undefined && pay.currentBalance >= 0)
      ? pay.currentBalance
      : ((stu && stu.balance !== undefined && stu.balance >= 0) ? stu.balance : amountNum);
    const balanceStr = isUnpaid ? `⚠️ دين معلق: ${debtAmountNum.toLocaleString()} دج` : `${remainingSessions} حصص متاحة / ${Number(balanceNum).toLocaleString()} دج`;

    // Subscription Validity, First Session Date, and Expected Renewal Date
    const daysMap = { 'الأحد': 0, 'الاحد': 0, 'الإثنين': 1, 'الاثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الاربعاء': 3, 'الخميس': 4, 'الجمعة': 5, 'السبت': 6 };
    let payBaseDate = new Date();
    if (pay && pay.paidAtIso) {
      payBaseDate = new Date(pay.paidAtIso);
    } else if (pay && pay.date) {
      const parts = pay.date.trim().split(' ')[0].split(/[\/\-]/);
      if (parts.length === 3) {
        payBaseDate = parts[0].length === 4 ? new Date(parts[0], parts[1]-1, parts[2]) : new Date(parts[2], parts[1]-1, parts[0]);
      }
    }
    const purchasedSessions = (pay && pay.sessionsPurchased) || 4;
    const validityStr = `${purchasedSessions} حصص (${purchasedSessions === 4 ? 'اشتراك شهري' : 'باقة تدريبية'})`;

    let firstSessionStr = '';
    const dayName = (stu && stu.day) ? stu.day : 'السبت';
    const timeStr = (stu && stu.sessionTime) ? stu.sessionTime : (stu && stu.startTime ? `${stu.startTime} - ${stu.endTime || ''}` : '14:00 - 16:00');
    if (daysMap[dayName] !== undefined) {
      const targetDay = daysMap[dayName];
      const d = new Date(payBaseDate);
      d.setHours(12, 0, 0, 0);
      const currentDay = d.getDay();
      const daysToAdd = (targetDay - currentDay + 7) % 7;
      const nextDate = new Date(d.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
      const y = nextDate.getFullYear();
      const m = String(nextDate.getMonth() + 1).padStart(2, '0');
      const day = String(nextDate.getDate()).padStart(2, '0');
      firstSessionStr = `${dayName} ${day}/${m}/${y} (${timeStr})`;
    } else {
      firstSessionStr = (stu && stu.startDate) ? `${stu.startDate} (${timeStr})` : `الحصة القادمة (${timeStr})`;
    }

    const targetPayment = pay || {};
    let renewalDateObj = null;
    if (targetPayment.renewalIso || targetPayment.renewalDate) {
      renewalDateObj = new Date(targetPayment.renewalIso || targetPayment.renewalDate);
    }
    if (!renewalDateObj || isNaN(renewalDateObj.getTime())) {
      const mCount = Number(targetPayment.monthsPurchased) || Math.max(1, Math.round((Number(targetPayment.sessionsPurchased) || 4) / 4));
      renewalDateObj = new Date(payBaseDate);
      renewalDateObj.setMonth(renewalDateObj.getMonth() + mCount);
    }
    const ry = renewalDateObj.getFullYear();
    const rm = String(renewalDateObj.getMonth() + 1).padStart(2, '0');
    const rday = String(renewalDateObj.getDate()).padStart(2, '0');
    const renewalDateStr = `${rday}/${rm}/${ry}`;

    // High resolution robot icon base64
    let robotDataUri = '';
    try {
      const robotPath = path.join(__dirname, '..', 'assets', 'images', 'robot.png');
      if (fs.existsSync(robotPath)) {
        robotDataUri = `data:image/png;base64,${fs.readFileSync(robotPath).toString('base64')}`;
      }
    } catch(e){}

    const receiptHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>وصل تسديد — ${opNum} — ${stuName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&family=JetBrains+Mono:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #1e293b;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 14px;
    }
    .screen-actions-bar {
      width: 100%;
      max-width: 440px;
      margin-bottom: 16px;
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: space-between;
      background: #1e293b;
      padding: 10px 16px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .btn-action {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
    }
    .btn-action:hover { background: #0369a1; }
    .btn-secondary { background: rgba(255, 255, 255, 0.1); color: #f1f5f9; }
    .receipt-wrapper {
      width: 76mm;
      max-width: 100%;
      background: #ffffff;
      border: 1.5px dashed #64748b;
      border-radius: 6px;
      padding: 10px 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
      position: relative;
    }
    .scissor-guide {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 8.5px;
      color: #94a3b8;
      font-weight: 700;
    }
    .scissor-guide::before, .scissor-guide::after {
      content: ''; flex: 1; height: 1px; border-bottom: 1px dashed #cbd5e1;
    }
    .receipt-header {
      border-bottom: 2px dashed #94a3b8;
      padding-bottom: 8px;
      margin-bottom: 8px;
      width: 100%;
    }
    .receipt-brand-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      width: 100%;
    }
    .receipt-logo-icon { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; }
    .receipt-brand-title { font-size: 13.5px; font-weight: 900; color: #0f172a; letter-spacing: 0.5px; line-height: 1.15; }
    .receipt-brand-title span { color: #0284c7; }
    .receipt-sub { font-size: 8px; color: #475569; font-weight: 700; margin-top: 1px; }
    .receipt-code-badge {
      display: inline-block;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 1px 7px;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1.5px;
      font-family: 'JetBrains Mono', monospace;
      color: #0f172a;
      margin-top: 3px;
    }
    .receipt-table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 10.5px; table-layout: fixed; }
    .receipt-table tr { border-bottom: 1px solid #e2e8f0; }
    .receipt-table th { background: #f8fafc; color: #475569; padding: 4px 6px; font-weight: 800; width: 38%; text-align: right; border: 1px solid #e2e8f0; font-size: 10px; }
    .receipt-table td { padding: 4px 6px; color: #0f172a; font-weight: 700; border: 1px solid #e2e8f0; width: 62%; font-size: 10.5px; }
    .highlight-amount { font-size: 14px; font-weight: 900; color: #059669; font-family: 'JetBrains Mono', 'Cairo', monospace; }
    .receipt-footer { text-align: center; border-top: 2px dashed #94a3b8; padding-top: 6px; margin-top: 8px; font-size: 8px; color: #475569; line-height: 1.35; width: 100%; }
    @page {
      size: auto;
      margin: 4mm;
    }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; margin: 0 !important; display: block !important; }
      .screen-actions-bar { display: none !important; }
      .receipt-wrapper {
        box-shadow: none !important;
        border: 1.5px dashed #64748b !important;
        width: 76mm !important;
        max-width: 76mm !important;
        padding: 6px 8px !important;
        margin: 0 auto !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="screen-actions-bar">
    <div style="display:flex; align-items:center; gap:8px;">
      <button type="button" class="btn-action" onclick="window.print()">
        🖨️ طباعة الوصل الآن (Google Chrome)
      </button>
      <button type="button" class="btn-action btn-secondary" onclick="window.close()">إغلاق</button>
    </div>
    <span style="font-size:11px; color:#94a3b8; font-weight:600;">✂️ A4 / 80mm</span>
  </div>

  <div class="receipt-wrapper">
    <div class="scissor-guide">✂️ خط قص الوصل (80 مم) ✂️</div>
    <div class="receipt-header">
      <div class="receipt-brand-row">
        <div style="display:flex; align-items:center; gap:6px; text-align:right;">
          ${robotDataUri ? `<img src="${robotDataUri}" alt="Brainova" class="receipt-logo-icon">` : ''}
          <div>
            <div class="receipt-brand-title">BRAINOVA <span>ROBOTICS</span></div>
            <div class="receipt-sub">أكاديمية الروبوتيك والذكاء الاصطناعي — أم البواقي</div>
            <div class="receipt-code-badge">وصل رقم: #${opNum}</div>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=1&data=https://wa.me/213791194633" style="width:50px; height:50px; border:1px solid #cbd5e1; border-radius:4px;" alt="WhatsApp QR">
          <span style="font-size:7.5px; font-weight:800; color:#0f172a; margin-top:2px; text-align:center; white-space:nowrap;">واتساب الأكاديمية</span>
        </div>
      </div>
    </div>

    <table class="receipt-table">
      <tr><th>رقم العملية</th><td style="font-family:'JetBrains Mono', monospace; font-weight:900;">#${opNum}</td></tr>
      <tr><th>اسم التلميذ</th><td style="font-size:11.5px; font-weight:900; color:#0f172a;">${stuName}</td></tr>
      <tr><th>ولي الأمر</th><td>${parentName}</td></tr>
      <tr><th>المستوى والفوج</th><td>${levelGroup}</td></tr>
      ${isUnpaid ? `
        <tr><th style="color:#dc2626;">الحصص / الفترة غير المدفوعة</th><td style="color:#dc2626; font-weight:800;">${unpaidPeriodText}</td></tr>
        <tr><th style="color:#dc2626;">المبلغ المستحق للدفع</th><td style="color:#dc2626; font-size:12px; font-weight:900; font-family:'JetBrains Mono', monospace;">${debtAmountNum.toLocaleString()} دج</td></tr>
      ` : ''}
      <tr><th>صلاحية الاشتراك</th><td style="color:${isUnpaid ? '#dc2626' : '#0284c7'}; font-weight:800;">${isUnpaid ? unpaidPeriodText : validityStr}</td></tr>
      <tr><th>تاريخ استحقاق التجديد</th><td style="color:#d97706; font-weight:800; font-family:'JetBrains Mono', monospace;">${renewalDateStr}</td></tr>
      <tr><th>تاريخ العملية</th><td style="font-family:'JetBrains Mono', monospace;">${dateStr}</td></tr>
      <tr><th>طريقة الدفع</th><td style="color:#0284c7; font-weight:800;">${isUnpaid ? 'غير مدفوع (دين معلق)' : payMethod}</td></tr>
      <tr><th>المبلغ المدفوع</th><td>${isUnpaid ? `<span style="color:#dc2626; font-weight:900; text-decoration:line-through;">0 دج (غير مدفوع)</span>` : `<span class="highlight-amount">${amountStr}</span>`}</td></tr>
      <tr><th>الرصيد والحصص</th><td>${balanceStr}</td></tr>
    </table>

    <div class="receipt-footer">
      <div>الهاتف: <strong style="font-family:'JetBrains Mono', monospace;" dir="ltr">07 91 19 46 33</strong> • البريد: <strong>brainovarobotics@gmail.com</strong></div>
      <div style="font-weight:800; color:#0f172a; margin-top:2px;">يرجى الاحتفاظ بهذا الوصل فهو يثبت عملية التسديد</div>
      <div style="font-family:'JetBrains Mono', monospace; font-size:7px; color:#94a3b8; margin-top:2px;">BRAINOVA POS ENGINE · VALIDATED</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

    const tempDir = app.getPath('temp') || os.tmpdir();
    const tempFile = path.join(tempDir, `Brainova-Receipt-${opNum}.html`);
    fs.writeFileSync(tempFile, receiptHtml, 'utf8');

    const fileUrl = 'file:///' + tempFile.replace(/\\/g, '/');
    console.log('[Brainova] Launching Google Chrome Print for:', fileUrl);
    shell.openExternal(fileUrl);
  } catch (err) {
    console.error('[Brainova Print Receipt Error]:', err);
  }
});

// ── IPC: PRINT DOCUMENT (ATTENDANCE SHEETS, CERTIFICATES, REPORTS) ────────────
ipcMain.on('print-document', (event, payload) => {
  try {
    const html = (typeof payload === 'object' && payload && payload.html) ? payload.html : (typeof payload === 'string' ? payload : '');
    if (!html) return;
    const tempDir = app.getPath('temp');
    const tempFile = path.join(tempDir, `brainova_sheet_${Date.now()}.html`);
    fs.writeFileSync(tempFile, html, 'utf8');
    const fileUrl = 'file:///' + tempFile.replace(/\\/g, '/');
    console.log('[Brainova] Opening Printable Document in Browser/Printer:', fileUrl);
    shell.openExternal(fileUrl);
  } catch (err) {
    console.error('[Brainova Print Document Error]:', err);
  }
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
  try {
    cloudSync.scheduleSync('store_set_' + key);
  } catch (e) {}
});

ipcMain.handle('store-get-all', () => {
  return store.store; // returns entire store object
});

ipcMain.on('store-delete', (_, key) => {
  store.delete(key);
  try {
    cloudSync.scheduleSync('store_delete_' + key);
  } catch (e) {}
});

ipcMain.on('store-clear', () => {
  store.clear();
  try {
    cloudSync.scheduleSync('store_clear');
  } catch (e) {}
});

ipcMain.handle('check-remote-license-now', async () => {
  try {
    if (cloudSync && cloudSync.config && cloudSync.config.databaseUrl) {
      await cloudSync.checkRemoteDirectives(cloudSync.config.databaseUrl);
    }
  } catch (e) {}

  if (cloudSync) {
    const curHwid = cloudSync.getHwid();
    const remoteCmds = store.get('brainova_remote_commands') || {};
    if (remoteCmds.licenseStatus !== 'locked') {
      store.set('brainova_hwid_lock', curHwid);
      store.delete('brainova_clock_tampered');
      cloudSync.hwidMismatch = false;
      cloudSync.clockTampered = false;
    }
  }
  return store.get('brainova_remote_commands') || { licenseStatus: 'active' };
});

ipcMain.on('get-remote-license-sync', (event) => {
  let cmds = store.get('brainova_remote_commands') || { licenseStatus: 'active' };
  if (cloudSync) {
    if (!cloudSync.verifyHwidLock()) {
      cmds = {
        licenseStatus: 'locked',
        hwidMismatch: true,
        broadcastMessage: `⚠️ تم تشغيل النسخة على حاسوب غير مصرح به (HWID Mismatch).\nمعرف العتاد الحالي: ${cloudSync.getHwid()}\nيرجى مراجعة إدارة ISAACDEV لربط الترخيص بهذا الحاسوب.`
      };
    } else if (cloudSync.checkClockTamper()) {
      cmds = {
        licenseStatus: 'locked',
        clockTampered: true,
        broadcastMessage: '⚠️ تم اكتشاف تلاعب بساعة وتاريخ النظام (System Clock Rollback Detected).\nتم تجميد الترخيص لحماية البيانات. يرجى ضبط توقيت الحاسوب بدقة والاتصال بـ ISAACDEV.'
      };
    }
  }
  event.returnValue = cmds;
});

ipcMain.handle('get-active-features', () => {
  return store.get('brainova_feature_flags') || {
    enableWhatsAppBot: true,
    enableAiAdvisor: true,
    enableFinanceExports: true,
    enableQrAttendance: true
  };
});

ipcMain.handle('get-broadcast-banner', () => {
  return store.get('brainova_broadcast_banner') || null;
});

ipcMain.handle('get-hwid-info', () => {
  return {
    hwid: cloudSync ? cloudSync.getHwid() : 'HWID-UNKNOWN',
    mismatch: cloudSync ? cloudSync.hwidMismatch : false,
    clockTampered: cloudSync ? cloudSync.clockTampered : false
  };
});

// ── IPC: BACKUP / RESTORE ─────────────────────────────────────────────────────
ipcMain.on('open-backup-folder', () => {
  shell.openPath(getBackupDirectory());
});

ipcMain.handle('backup-export', async () => {
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title: 'حفظ النسخة الاحتياطية المشفرة',
    defaultPath: `brainova-backup-${new Date().toISOString().slice(0, 10)}.brainova`,
    filters: [{ name: 'Brainova Encrypted Backup', extensions: ['brainova'] }]
  });
  if (canceled || !filePath) return { ok: false };
  try {
    const rawJson = JSON.stringify(store.store, null, 2);
    const encryptedPayload = encryptBackupPayload(rawJson);
    fs.writeFileSync(filePath, encryptedPayload);
    return { ok: true, path: filePath };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('backup-import', async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: 'استيراد نسخة احتياطية',
    filters: [{ name: 'Brainova Backup', extensions: ['brainova'] }],
    properties: ['openFile']
  });
  if (canceled || !filePaths.length) return { ok: false };
  try {
    const rawBuffer = fs.readFileSync(filePaths[0]);
    const data = decryptBackupPayload(rawBuffer);
    Object.entries(data).forEach(([k, v]) => store.set(k, v));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: 'فشل استيراد النسخة الاحتياطية أو فك تشفيرها: ' + err.message };
  }
});

ipcMain.handle('backup-list', async () => {
  try {
    const backupDir = getBackupDirectory();
    if (!fs.existsSync(backupDir)) return { ok: true, files: [] };
    const files = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.brainova') || f.endsWith('.json'))
      .map(f => {
        const fullPath = path.join(backupDir, f);
        const stat = fs.statSync(fullPath);
        return {
          name: f,
          path: fullPath,
          size: stat.size,
          sizeFormatted: (stat.size / 1024).toFixed(1) + ' KB',
          createdAt: stat.mtime.toISOString(),
          createdDateStr: stat.mtime.toLocaleDateString('ar-DZ') + ' ' + stat.mtime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { ok: true, files };
  } catch (err) {
    return { ok: false, error: err.message, files: [] };
  }
});

ipcMain.handle('backup-restore-file', async (event, filePath) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) return { ok: false, error: 'ملف النسخة الاحتياطية غير موجود' };
    const rawBuffer = fs.readFileSync(filePath);
    const data = decryptBackupPayload(rawBuffer);
    Object.entries(data).forEach(([k, v]) => store.set(k, v));
    performAutoBackup();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: 'فشل استرجاع النسخة الاحتياطية أو فك تشفيرها: ' + err.message };
  }
});

ipcMain.handle('backup-delete-file', async (event, filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { ok: true };
    }
    return { ok: false, error: 'الملف غير موجود' };
  } catch (err) {
    return { ok: false, error: err.message };
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

// ── IPC: GENERATE QR CODE FOR BADGES / TICKETS ──────────────────────────────
ipcMain.handle('generate-qr', async (_, text) => {
  try {
    const qr = await QRCode.toDataURL(String(text), { width: 250, margin: 1, color: { dark: '#0A1324', light: '#FFFFFF' } });
    return qr;
  } catch {
    return null;
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

// ── IPC: WHATSAPP BOT AUTOMATION ──────────────────────────────────────────
ipcMain.handle('whatsapp-get-status', async () => {
  return whatsappBot.getStatus();
});

ipcMain.handle('whatsapp-start', async () => {
  return await whatsappBot.start();
});

ipcMain.handle('whatsapp-logout', async () => {
  return await whatsappBot.logout();
});

ipcMain.handle('whatsapp-send-message', async (_, { phone, text }) => {
  return await whatsappBot.sendMessage(phone, text);
});

ipcMain.handle('whatsapp-set-ai-settings', async (_, settings) => {
  whatsappBot.setAiSettings(settings);
  store.set('brainova_ai_settings', settings);
  return { success: true };
});

ipcMain.handle('whatsapp-get-ai-settings', async () => {
  return whatsappBot.getAiSettings();
});

ipcMain.handle('whatsapp-get-chat-logs', async () => {
  return whatsappBot.getChatLogs();
});