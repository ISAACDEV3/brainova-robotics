const { app, BrowserWindow, Menu, Tray, ipcMain, nativeTheme, screen, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path  = require('path');
const http  = require('http');
const fs    = require('fs');
const os    = require('os');
const Store = require('electron-store');
const QRCode = require('qrcode');
const whatsappBot = require('./whatsapp-bot');

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
    const pay = paymentId ? payments.find(p => p.id === paymentId || p.opNumber === paymentId || p.id === 'REC-' + paymentId) : payments[payments.length - 1];
    const students = store.get('brainova_students', []);
    const stu = pay ? students.find(s => s.id === pay.studentId) : null;

    const opNum = (pay && pay.opNumber) || (pay && pay.id ? pay.id.replace('REC-', '') : '63336');
    const stuName = (stu && stu.name) || (pay && pay.studentName) || 'تلميذ';
    const parentName = (stu && stu.parentName) || (pay && pay.parentName) || 'ولي الأمر';
    const levelGroup = `${(pay && pay.level) || 'المستوى الأول'} • ${(pay && pay.group) || 'الفوج أ'}`;
    const dateStr = format24hDateTime((pay && pay.date) || new Date());
    const payMethod = (pay && pay.method) || 'نقداً (Cash)';
    const amountNum = Number((pay && pay.amountPaid) || 5000);
    const amountStr = `${amountNum.toLocaleString()} دج`;

    let wordsTafqeet = `${amountNum.toLocaleString()} دينار جزائري فقط`;
    if (amountNum === 2000) wordsTafqeet = 'ألفان دينار جزائري فقط';
    else if (amountNum === 5000) wordsTafqeet = 'خمسة آلاف دينار جزائري فقط (5,000 دج)';
    else if (amountNum === 8000) wordsTafqeet = 'ثمانية آلاف دينار جزائري فقط (باقة طفلين - 8,000 دج)';
    else if (amountNum === 11000) wordsTafqeet = 'أحد عشر ألف دينار جزائري فقط (باقة 3 أطفال - 11,000 دج)';

    const remainingSessions = (stu && stu.sessionsRemaining !== undefined) ? stu.sessionsRemaining : ((pay && pay.sessionsPurchased) || 4);
    const balanceNum = (stu && stu.balance !== undefined) ? stu.balance : amountNum;
    const balanceStr = `${remainingSessions} حصص متاحة / ${Number(balanceNum).toLocaleString()} دج`;

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

    const renewalDateObj = new Date(payBaseDate.getTime() + (30 * 24 * 60 * 60 * 1000));
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
      width: 80mm;
      max-width: 100%;
      background: #ffffff;
      border: 1.5px dashed #64748b;
      border-radius: 6px;
      padding: 12px 14px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
      position: relative;
    }
    .scissor-guide {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 9px;
      color: #94a3b8;
      font-weight: 700;
    }
    .scissor-guide::before, .scissor-guide::after {
      content: ''; flex: 1; height: 1px; border-bottom: 1px dashed #cbd5e1;
    }
    .receipt-header {
      text-align: center;
      border-bottom: 2px dashed #94a3b8;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .receipt-brand-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .receipt-logo-icon { width: 36px; height: 36px; object-fit: contain; }
    .receipt-brand-title { font-size: 14.5px; font-weight: 900; color: #0f172a; letter-spacing: 0.5px; line-height: 1.1; }
    .receipt-brand-title span { color: #0284c7; }
    .receipt-sub { font-size: 9px; color: #475569; font-weight: 700; margin-top: 2px; }
    .receipt-code-badge {
      display: inline-block;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 2px 10px;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 2px;
      font-family: 'JetBrains Mono', monospace;
      color: #0f172a;
      margin: 5px 0 2px;
    }
    .receipt-table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 11px; }
    .receipt-table tr { border-bottom: 1px solid #e2e8f0; }
    .receipt-table th { background: #f8fafc; color: #475569; padding: 5px 6px; font-weight: 800; width: 36%; text-align: right; border: 1px solid #e2e8f0; }
    .receipt-table td { padding: 5px 6px; color: #0f172a; font-weight: 700; border: 1px solid #e2e8f0; }
    .highlight-amount { font-size: 14px; font-weight: 900; color: #059669; font-family: 'JetBrains Mono', 'Cairo', monospace; }
    .highlight-words { font-size: 9px; color: #065f46; font-weight: 800; background: #f0fdf4; }
    .receipt-footer { text-align: center; border-top: 2px dashed #94a3b8; padding-top: 8px; margin-top: 8px; font-size: 8.5px; color: #475569; line-height: 1.4; }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; margin: 0 !important; display: block !important; }
      .screen-actions-bar { display: none !important; }
      .receipt-wrapper {
        box-shadow: none !important;
        border: 1.5px dashed #64748b !important;
        width: 80mm !important;
        padding: 8px 10px !important;
        margin: 0 auto !important;
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
        ${robotDataUri ? `<img src="${robotDataUri}" alt="Brainova" class="receipt-logo-icon">` : ''}
        <div style="text-align:right;">
          <div class="receipt-brand-title">BRAINOVA <span>ROBOTICS</span></div>
          <div class="receipt-sub">مدرسة الروبوتيك والذكاء الاصطناعي — أم البواقي</div>
        </div>
      </div>
      <div class="receipt-code-badge">${opNum}</div>
    </div>

    <table class="receipt-table">
      <tr><th>رقم العملية</th><td style="font-family:'JetBrains Mono', monospace; font-weight:900;">${opNum}</td></tr>
      <tr><th>اسم التلميذ</th><td style="font-size:12px; font-weight:900; color:#0f172a;">${stuName}</td></tr>
      <tr><th>ولي الأمر</th><td>${parentName}</td></tr>
      <tr><th>المستوى والفوج</th><td>${levelGroup}</td></tr>
      <tr><th>صلاحية الاشتراك</th><td style="color:#0284c7; font-weight:800;">${validityStr}</td></tr>
      <tr><th>موعد أول حصة قادمة</th><td style="color:#059669; font-weight:800;">${firstSessionStr}</td></tr>
      <tr><th>تاريخ استحقاق التجديد</th><td style="color:#d97706; font-weight:800; font-family:'JetBrains Mono', monospace;">${renewalDateStr}</td></tr>
      <tr><th>تاريخ الدفع</th><td style="font-family:'JetBrains Mono', monospace;">${dateStr}</td></tr>
      <tr><th>طريقة الدفع</th><td style="color:#0284c7; font-weight:800;">${payMethod}</td></tr>
      <tr><th>المبلغ المدفوع</th><td class="highlight-amount">${amountStr}</td></tr>
      <tr><th>المبلغ بالحروف</th><td class="highlight-words">${wordsTafqeet}</td></tr>
      <tr><th>الرصيد والحصص</th><td>${balanceStr}</td></tr>
    </table>

    <div class="receipt-footer">
      <div>الهاتف: <strong style="font-family:'JetBrains Mono', monospace;" dir="ltr">0791 19 46 33</strong> • البريد: <strong>brainovarobotics@gmail.com</strong></div>
      <div style="font-weight:800; color:#0f172a; margin-top:2px;">يرجى الاحتفاظ بهذا الوصل كإثبات رسمي لعملية التسديد</div>
      <div style="font-family:'JetBrains Mono', monospace; font-size:7.5px; color:#94a3b8; margin-top:2px;">BRAINOVA POS ENGINE · VALIDATED</div>
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
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    Object.entries(data).forEach(([k, v]) => store.set(k, v));
    performAutoBackup();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
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