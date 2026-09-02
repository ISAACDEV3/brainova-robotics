/**
 * BRAINOVA ROBOTICS — WhatsApp Automation Bot Engine
 * Powered by @whiskeysockets/baileys & Multi-Device WebSocket Protocol
 * Zero-Click Background Automation for Attendance & Payment Notifications
 */

const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');

let baileysModule = null;
let pinoModule = null;

async function loadBaileys() {
  if (!baileysModule) {
    baileysModule = await import('@whiskeysockets/baileys');
  }
  if (!pinoModule) {
    pinoModule = (await import('pino')).default;
  }
  return {
    makeWASocket: baileysModule.default || baileysModule.makeWASocket,
    useMultiFileAuthState: baileysModule.useMultiFileAuthState,
    DisconnectReason: baileysModule.DisconnectReason,
    pino: pinoModule
  };
}

class WhatsAppBot {
  constructor() {
    this.sock = null;
    this.status = 'disconnected'; // 'disconnected' | 'connecting' | 'waiting_qr' | 'connected'
    this.userPhone = null;
    this.userName = null;
    this.lastQr = null;
    this.authDir = null;
    this.sendToRenderer = () => {};
    this.reconnectTimeout = null;
    this.isManualLogout = false;
  }

  init(authDir, sendToRenderer) {
    this.authDir = authDir;
    this.sendToRenderer = sendToRenderer || (() => {});
    if (!fs.existsSync(this.authDir)) {
      fs.mkdirSync(this.authDir, { recursive: true });
    }
  }

  formatPhoneToJid(phone) {
    if (!phone) return null;
    let cleaned = String(phone).replace(/[^\d]/g, '');
    if (cleaned.startsWith('00')) cleaned = cleaned.substring(2);
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = '213' + cleaned.substring(1);
    }
    if (cleaned.length < 8) return null;
    return `${cleaned}@s.whatsapp.net`;
  }

  async start() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    try {
      this.isManualLogout = false;
      this.status = 'connecting';
      this.emitStatus();

      const { makeWASocket, useMultiFileAuthState, DisconnectReason, pino } = await loadBaileys();
      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['Brainova Robotics', 'Desktop', '1.0.0'],
        connectTimeoutMs: 30000,
        keepAliveIntervalMs: 25000
      });

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            this.lastQr = await QRCode.toDataURL(qr, { margin: 2, scale: 7 });
            this.status = 'waiting_qr';
            this.emitStatus();
            this.sendToRenderer('whatsapp-qr', this.lastQr);
          } catch (qrErr) {
            console.error('[WhatsApp Bot QR Error]:', qrErr);
          }
        }

        if (connection === 'open') {
          this.status = 'connected';
          this.lastQr = null;
          const rawId = this.sock.user?.id || '';
          this.userPhone = rawId.split(':')[0] || 'Unknown';
          this.userName = this.sock.user?.name || 'Brainova WhatsApp';
          console.log(`[WhatsApp Bot] Connected successfully as ${this.userPhone} (${this.userName})`);
          this.emitStatus();
        }

        if (connection === 'close') {
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut && !this.isManualLogout;

          console.log(`[WhatsApp Bot] Connection closed. Code: ${statusCode}. Reconnecting: ${shouldReconnect}`);

          if (shouldReconnect) {
            this.status = 'connecting';
            this.emitStatus();
            this.reconnectTimeout = setTimeout(() => this.start(), 4000);
          } else {
            this.status = 'disconnected';
            this.userPhone = null;
            this.userName = null;
            this.lastQr = null;
            this.clearAuthFiles();
            this.emitStatus();
          }
        }
      });

      this.sock.ev.on('creds.update', saveCreds);

      return { success: true, status: this.status };
    } catch (err) {
      console.error('[WhatsApp Bot Start Error]:', err);
      this.status = 'disconnected';
      this.emitStatus();
      return { success: false, error: err.message };
    }
  }

  async sendMessage(phone, text) {
    if (this.status !== 'connected' || !this.sock) {
      return { success: false, error: 'بوت الواتساب غير متصل حالياً. يرجى مسح رمز QR أولاً.' };
    }

    const jid = this.formatPhoneToJid(phone);
    if (!jid) {
      return { success: false, error: `رقم الهاتف غير صالح (${phone})` };
    }

    try {
      await this.sock.sendMessage(jid, { text });
      console.log(`[WhatsApp Bot] Message sent to ${jid} (${phone})`);
      return { success: true, jid };
    } catch (err) {
      console.error(`[WhatsApp Bot Send Error to ${jid}]:`, err);
      return { success: false, error: err.message };
    }
  }

  async logout() {
    this.isManualLogout = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.sock) {
      try {
        await this.sock.logout();
      } catch (e) {}
      try {
        this.sock.end();
      } catch (e) {}
      this.sock = null;
    }

    this.status = 'disconnected';
    this.userPhone = null;
    this.userName = null;
    this.lastQr = null;
    this.clearAuthFiles();
    this.emitStatus();
    return { success: true };
  }

  clearAuthFiles() {
    try {
      if (this.authDir && fs.existsSync(this.authDir)) {
        fs.rmSync(this.authDir, { recursive: true, force: true });
        fs.mkdirSync(this.authDir, { recursive: true });
      }
    } catch (err) {
      console.error('[WhatsApp Bot Clear Auth Error]:', err);
    }
  }

  getStatus() {
    return {
      status: this.status,
      connected: this.status === 'connected',
      phone: this.userPhone,
      name: this.userName,
      qr: this.lastQr
    };
  }

  emitStatus() {
    this.sendToRenderer('whatsapp-status', this.getStatus());
  }
}

module.exports = new WhatsAppBot();
