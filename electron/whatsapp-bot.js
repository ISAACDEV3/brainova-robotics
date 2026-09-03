/**
 * BRAINOVA ROBOTICS — WhatsApp Automation & AI Receptionist Engine
 * Powered by @whiskeysockets/baileys & Multi-Device WebSocket Protocol
 * Zero-Click Autonomous Notifications + Interactive Arabic/Darja AI Receptionist
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
    this.dataProvider = () => ({});
    this.reconnectTimeout = null;
    this.isManualLogout = false;
    
    // AI Receptionist Settings
    this.aiAgentEnabled = true;
    this.aiApiKey = '';
    this.customInstructions = '';
    this.chatLogs = []; // Keeps last 60 live messages
  }

  init(authDir, sendToRenderer, dataProvider) {
    this.authDir = authDir;
    this.sendToRenderer = sendToRenderer || (() => {});
    this.dataProvider = dataProvider || (() => ({}));
    if (!fs.existsSync(this.authDir)) {
      fs.mkdirSync(this.authDir, { recursive: true });
    }
  }

  setAiSettings(settings) {
    if (!settings) return;
    if (typeof settings.enabled === 'boolean') this.aiAgentEnabled = settings.enabled;
    if (typeof settings.apiKey === 'string') this.aiApiKey = settings.apiKey.trim();
    if (typeof settings.customInstructions === 'string') this.customInstructions = settings.customInstructions.trim();
  }

  getAiSettings() {
    return {
      enabled: this.aiAgentEnabled,
      apiKey: this.aiApiKey ? '••••••••' + this.aiApiKey.slice(-4) : '',
      hasApiKey: !!this.aiApiKey,
      customInstructions: this.customInstructions
    };
  }

  getChatLogs() {
    return this.chatLogs;
  }

  formatPhoneToJid(phone) {
    if (!phone) return null;
    let cleaned = String(phone).replace(/[^\d]/g, '');
    if (cleaned.startsWith('00213')) cleaned = cleaned.substring(5);
    else if (cleaned.startsWith('00')) cleaned = cleaned.substring(2);
    else if (cleaned.startsWith('213')) cleaned = cleaned.substring(3);

    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);

    if (cleaned.length === 9) {
      cleaned = '213' + cleaned;
    } else if (cleaned.length < 8) {
      return null;
    }
    return `${cleaned}@s.whatsapp.net`;
  }

  cleanPhone(phone) {
    if (!phone) return '';
    let cleaned = String(phone).replace(/[^\d]/g, '');
    if (cleaned.startsWith('00213')) cleaned = cleaned.substring(5);
    else if (cleaned.startsWith('00')) cleaned = cleaned.substring(2);
    else if (cleaned.startsWith('213')) cleaned = cleaned.substring(3);
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    if (cleaned.length === 9) {
      cleaned = '0' + cleaned;
    }
    return cleaned;
  }

  matchStudent(students, senderJid) {
    if (!students || !Array.isArray(students)) return null;
    const rawDigits = String(senderJid).split('@')[0].replace(/[^\d]/g, '');
    const cleanSender = this.cleanPhone(rawDigits);
    const senderLast8 = rawDigits.slice(-8);

    return students.find(s => {
      const p = this.cleanPhone(s.parentPhone);
      if (!p || p === '—') return false;
      const pRaw = String(s.parentPhone).replace(/[^\d]/g, '');
      return p === cleanSender || pRaw.slice(-8) === senderLast8;
    }) || null;
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

      // ── LISTEN FOR INCOMING MESSAGES FROM PARENTS (AI RECEPTIONIST) ──
      this.sock.ev.on('messages.upsert', async (m) => {
        try {
          await this.handleIncomingMessages(m);
        } catch (msgErr) {
          console.error('[WhatsApp Bot Incoming Message Error]:', msgErr);
        }
      });

      return { success: true, status: this.status };
    } catch (err) {
      console.error('[WhatsApp Bot Start Error]:', err);
      this.status = 'disconnected';
      this.emitStatus();
      return { success: false, error: err.message };
    }
  }

  async handleIncomingMessages(m) {
    if (!this.aiAgentEnabled || !m.messages || m.type !== 'notify') return;

    for (const msg of m.messages) {
      if (msg.key.fromMe) continue; // Ignore bot's own outbound messages
      const remoteJid = msg.key.remoteJid;
      if (!remoteJid || remoteJid.endsWith('@g.us') || remoteJid === 'status@broadcast') continue; // Ignore groups

      // Extract incoming text
      const incomingText = (
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        ''
      ).trim();

      if (!incomingText) continue;

      console.log(`[WhatsApp Bot AI] Incoming from ${remoteJid}: "${incomingText}"`);

      // Generate intelligent context-aware response
      const reply = await this.generateAiResponse(remoteJid, incomingText);
      if (!reply) continue;

      // Small natural delay so response feels human (1.5s)
      await new Promise(r => setTimeout(r, 1500));

      // Send response
      await this.sock.sendMessage(remoteJid, { text: reply.text });

      // Log transaction
      const logEntry = {
        id: 'MSG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        remoteJid,
        phone: this.cleanPhone(remoteJid.split('@')[0]),
        incomingText,
        replyText: reply.text,
        studentName: reply.student ? reply.student.name : 'زائر جديد',
        timestamp: new Date().toISOString(),
        aiEngine: reply.engine
      };

      this.chatLogs.unshift(logEntry);
      if (this.chatLogs.length > 60) this.chatLogs.pop();

      this.sendToRenderer('whatsapp-message-logged', logEntry);
    }
  }

  async generateAiResponse(remoteJid, incomingText) {
    const db = this.dataProvider() || {};
    const students = db.students || [];
    const groups = db.groups || [];
    const attendance = db.attendance || [];
    const schedule = db.schedule || [];
    const educators = db.educators || [];

    const matchedStudent = this.matchStudent(students, remoteJid);
    let studentGroup = null;
    let studentSchedule = [];
    let latestAttendance = null;
    let studentEducator = null;

    if (matchedStudent) {
      studentGroup = groups.find(g => g.name === matchedStudent.group || g.id === matchedStudent.groupId);
      studentSchedule = schedule.filter(s => s.groupName === matchedStudent.group || (studentGroup && s.groupId === studentGroup.id));
      
      const studentAttHistory = attendance.filter(a => a.studentId === matchedStudent.id || a.studentName === matchedStudent.name);
      if (studentAttHistory.length > 0) {
        latestAttendance = studentAttHistory.sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
      }

      if (studentGroup && studentGroup.educatorName) {
        studentEducator = educators.find(e => e.name === studentGroup.educatorName);
      }
    }

    // ── ATTEMPT 1: GOOGLE GEMINI CLOUD LLM (If API Key is provided) ──
    if (this.aiApiKey) {
      try {
        const geminiReply = await this.callGeminiCloudApi(incomingText, {
          matchedStudent,
          studentGroup,
          studentSchedule,
          latestAttendance,
          studentEducator,
          allGroups: groups,
          allEducators: educators
        });

        if (geminiReply) {
          return { text: geminiReply, student: matchedStudent, engine: 'Gemini AI' };
        }
      } catch (geminiErr) {
        console.warn('[WhatsApp Bot] Gemini API call failed, falling back to built-in NLU engine:', geminiErr.message);
      }
    }

    // ── ATTEMPT 2: HIGH-PRECISION BUILT-IN NLU ENGINE (Arabic & Algerian Darja) ──
    const nluReply = this.generateNluResponse(incomingText, {
      matchedStudent,
      studentGroup,
      studentSchedule,
      latestAttendance,
      studentEducator,
      allGroups: groups
    });

    return { text: nluReply, student: matchedStudent, engine: 'Brainova NLU' };
  }

  async callGeminiCloudApi(userQuery, ctx) {
    const studentContextStr = ctx.matchedStudent ? `
بيانات التلميذ التابع لهذا الرقم:
- الاسم الكامل: ${ctx.matchedStudent.name} (المعرف: ${ctx.matchedStudent.id})
- الفوج والمستوى: ${ctx.matchedStudent.group || 'غير محدد'} (${ctx.matchedStudent.level || ''})
- رصيد الحصص المتبقي: ${ctx.matchedStudent.sessionsRemaining !== undefined ? ctx.matchedStudent.sessionsRemaining : '4'} حصص
- آخر حصة مسجلة: ${ctx.latestAttendance ? `${ctx.latestAttendance.date} (${ctx.latestAttendance.status === 'present' ? 'حاضر' : (ctx.latestAttendance.status === 'late' ? 'متأخر' : 'غائب')}) - ملاحظة: ${ctx.latestAttendance.note || 'عادية'}` : 'لا توجد غيابات مسجلة مؤخراً'}
- مواعيد حصص فوجه: ${ctx.studentSchedule.map(s => `${s.day} من ${s.startTime} إلى ${s.endTime} بالقاعة ${s.room || ''}`).join('، ') || 'السبت صباحاً'}
- الأستاذ المشرف: ${ctx.studentEducator ? ctx.studentEducator.name : 'طاقم تدريس Brainova'}
` : `هذا الرقم لا يعود لتلميذ مسجل بعد، بل هو ولي أمر جديد أو زائر يستفسر عن الأكاديمية والتسجيلات.`;

    const systemPrompt = `
أنت المساعد وموظف الاستقبال الآلي الذكي لأكاديمية Brainova Robotics للروبوتيك والبرمجة والذكاء الاصطناعي للأطفال والناشئين في أم البواقي، الجزائر.
مهمتك: الرد على أولياء الأمور بلباقة، ذكاء، ودفء، وبالدارجة الجزائرية المهذبة أو العربية الفصحى السلسة حسب لغة الولي.

معلومات الأكاديمية الثابتة:
- المقر: أم البواقي، الجزائر.
- البرامج: روبوتيك (LEGO, Arduino, Sensors)، برمجة وتفكير منطقي (Scratch, Python)، وذكاء اصطناعي للأعمار من 6 إلى 18 سنة.
- الاشتراك الشهري: 5000 دج شهرياً (4 حصص تطبيقية بمعدل ساعتين لكل حصة أسبوعياً).
- الدوام: أيام السبت، الجمعة، وأمسيات الثلاثاء.

${studentContextStr}

قواعد مهمة جداً:
1. أجب بإيجاز واحترافية (من سطرين إلى 4 أسطر).
2. لا تخترع أي معلومة غير موجودة في البيانات أعلاه.
3. إذا سأل الولي بالدارجة (مثل: وقتاش، شحال، ولدي غاب واش دارو)، أجب بلهجة جزائرية محترمة تريح الولي وتجيب عن طلبه بدقة.
4. إذا لم يكن هناك تلميذ مسجل وسأل عن التسجيل، رحب به وأعطه الأسعار والمقر ودعوه لزيارة الأكاديمية.
${this.customInstructions ? `تعليمات إضافية من الإدارة: ${this.customInstructions}` : ''}
`.trim();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.aiApiKey}`;
    const payload = {
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nرسالة الولي:\n"${userQuery}"` }] }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 300
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText ? candidateText.trim() : null;
  }

  generateNluResponse(text, ctx) {
    const q = text.toLowerCase()
      .replace(/[إأآا]/g, 'ا')
      .replace(/[ة]/g, 'ه')
      .replace(/[ى]/g, 'ي');

    const stu = ctx.matchedStudent;

    // 1. INQUIRY: ABSENCE & WHAT WAS STUDIED (الغياب وما تم شرحه في الحصة)
    const absenceKeywords = ['غاب', 'غياب', 'غيابات', 'حضر', 'حضور', 'واش دارو', 'واش قراو', 'الدرس', 'الحصه', 'فاتو', 'فاتت', 'السمانه اللي فاتت', 'الاسبوع الماضي', 'غيابو'];
    if (absenceKeywords.some(k => q.includes(k))) {
      if (stu) {
        const lastAtt = ctx.latestAttendance;
        const groupName = stu.group || 'فوجه';
        const eduName = (ctx.studentEducator && ctx.studentEducator.name) ? ctx.studentEducator.name : 'الأستاذ المشرف';
        
        let attStatusText = 'كان حاضراً في آخر حصة وتفاعل مع زملائه.';
        if (lastAtt && lastAtt.status === 'absent') {
          attStatusText = `تم تسجيل غيابه في آخر حصة بتاريخ ${lastAtt.date || 'مؤخراً'}.`;
        } else if (lastAtt && lastAtt.status === 'late') {
          attStatusText = `التحق متأخراً بالحصة الأخيرة بتاريخ ${lastAtt.date || 'مؤخراً'}.`;
        }

        const noteText = (lastAtt && lastAtt.note) ? `\n• ملاحظة المؤطر: "${lastAtt.note}"` : '';

        return (
          `أهلاً بحضرتك ولي أمر التلميذ ${stu.name} 🌸\n` +
          `بخصوص استفساركم: التلميذ مسجل في (${groupName}) بإشراف ${eduName}.\n` +
          `• حالة الحضور: ${attStatusText}${noteText}\n` +
          `• رصيد الحصص المتبقي: ${stu.sessionsRemaining !== undefined ? stu.sessionsRemaining : 4} حصص.\n` +
          `يمكن للتلميذ استدراك ما فاته ومتابعة التطبيق في الحصة القادمة إن شاء الله، ويسعدنا دوماً تواصلكم!`
        );
      } else {
        return (
          `أهلاً بحضرتك 🌸 لمتابعة تفاصيل غياب أو حضور التلميذ وما تم إنجازه في الحصة، يرجى تزويدنا باسم التلميذ الكريم لفتح ملفه وموافاتكم بالتقرير فوراً.`
        );
      }
    }

    // 2. INQUIRY: TIMINGS & SCHEDULE (مواعيد الحصص والتوقيت)
    const scheduleKeywords = ['وقتاش', 'وقتاه', 'توقيت', 'جدول', 'ساعه', 'الساعه', 'اي وقت', 'نهار', 'السبت', 'الجمعه', 'الثلاثاء', 'الحصه الجايه', 'الحصص'];
    if (scheduleKeywords.some(k => q.includes(k))) {
      if (stu) {
        const sched = ctx.studentSchedule;
        const timingLines = sched.length > 0
          ? sched.map(s => `• يوم ${s.day}: من ${s.startTime} إلى ${s.endTime} (${s.room || 'القاعة المخصصة'})`).join('\n')
          : '• يوم السبت صباحاً (يرجى مراجعة الإدارة لتأكيد التوقيت الدقيق)';

        return (
          `أهلاً بحضرتك 🌸\n` +
          `مواعيد حصص التلميذ ${stu.name} في (${stu.group || 'فوجه'}) هي كالتالي:\n` +
          `${timingLines}\n` +
          `يرجى الحضور 5 دقائق قبل انطلاق الورشة لضمان الاستفادة الكاملة من الوقت التطبيقي. دمتم بخير!`
        );
      } else {
        return (
          `مرحباً بكم 🌸\n` +
          `تقام ورشات الروبوتيك والبرمجة بأكاديمية Brainova أساساً أيام: الجمعة والسبت، بالإضافة لأمسيات الثلاثاء، مقسمة حسب الفئات العمرية.\n` +
          `إذا كان لديكم طفل تودون تسجيله، تفضلوا بتزويدنا بسنه لنوافيكم بالفوج والتوقيت الدقيق الشاغر.`
        );
      }
    }

    // 3. INQUIRY: PRICES, REGISTRATION & COURSES (الأسعار، الدورات، والتسجيل)
    const priceKeywords = ['شحال السعر', 'شحال تسقام', 'الاسعار', 'الاشتراك الشهري', 'التسجيل', 'الدورات', 'مستويات', 'سعر', 'سومه', 'prix', 'tarif', 'inscription'];
    if (priceKeywords.some(k => q.includes(k))) {
      return (
        `مرحباً بكم في أكاديمية Brainova Robotics للروبوتيك والذكاء الاصطناعي (أم البواقي) 🤖🇩🇿\n\n` +
        `• الاشتراك الشهري: 5000 دج شهرياً (يشمل 4 حصص تطبيقية بمعدل ساعتين لكل حصة أسبوعياً).\n` +
        `• الفئات العمرية: من 6 إلى 18 سنة (براعم، ناشئين، مراهقين).\n` +
        `• التجهيزات: نوفر لكل تلميذ حاسوباً، حقائب روبوت LEGO وArduino، مستشعرات، وطابعات 3D.\n\n` +
        `للتسجيل أو حجز مقعد لطفلكم، تفضلوا بزيارة مقرنا أو التواصل معنا لحجز موعد حصة تجريبية!`
      );
    }

    // 4. INQUIRY: REMAINING SESSIONS & SUBSCRIPTIONS (رصيد الحصص والاشتراك)
    const sessionKeywords = ['شحال باقي', 'شحال قعد', 'رصيد', 'الحصص المتبقيه', 'تجديد الاشتراك', 'رصيد الاشتراك', 'خلاصت', 'خلصت', 'كملت', 'الدفع', 'الوصل', 'الاشتراك'];
    if (sessionKeywords.some(k => q.includes(k))) {
      if (stu) {
        const rem = stu.sessionsRemaining !== undefined ? stu.sessionsRemaining : 4;
        const alertText = rem <= 1
          ? `\n⚠️ تنبيه: يرجى تجديد الاشتراك مع الإدارة (5000 دج) لضمان استمرارية مقعد التلميذ بالفوج للشهر القادم.`
          : `\nالاشتراك سارٍ ومنتظم، ونرافق التلميذ بكل سرور.`;

        return (
          `أهلاً بحضرتك ولي أمر التلميذ ${stu.name} 🌸\n` +
          `رصيد الحصص المتبقي في الاشتراك الحالي هو: ${rem} حصص.${alertText}`
        );
      } else {
        return (
          `أهلاً بكم 🌸 يرجى تزويدنا باسم التلميذ لنعلمكم برصيد الحصص المتبقي وموعد تجديد الاشتراك فوراً.`
        );
      }
    }

    // 5. GREETING / GENERAL (التحية والاستقبال)
    const greetingKeywords = ['سلام', 'مرحبا', 'bonjour', 'salut', 'صباح', 'مساء', 'السلام عليكم', 'اهلا'];
    if (greetingKeywords.some(k => q.includes(k)) || q.length <= 15) {
      if (stu) {
        return (
          `وعليكم السلام ورحمة الله وبركاته 🌸\n` +
          `أهلاً بحضرتك ولي أمر التلميذ ${stu.name} في أكاديمية Brainova Robotics 🤖\n` +
          `أنا موظف الاستقبال الآلي للأكاديمية. كيف يمكنني مساعدتك اليوم بخصوص فوج ${stu.group || 'طفلك'}، مواعيد الحصص، أو أي استفسار آخر؟`
        );
      } else {
        return (
          `وعليكم السلام ورحمة الله وبركاته، مرحباً بكم في أكاديمية Brainova Robotics للروبوتيك والذكاء الاصطناعي 🤖🇩🇿\n` +
          `يسعدنا استقبال استفساراتكم حول دوراتنا، أوقات الأفواج، أو التسجيل الجديد. كيف يمكننا خدمتكم اليوم؟`
        );
      }
    }

    // 6. DEFAULT POLITE CATCH-ALL
    if (stu) {
      return (
        `أهلاً بحضرتك ولي أمر التلميذ ${stu.name} بأكاديمية Brainova Robotics 🌸\n` +
        `تم استلام رسالتك باهتمام. بخصوص فوج "${stu.group || 'التلميذ'}"، يمكننا إفادتك بمواعيد الحصص، رصيد الحصص (${stu.sessionsRemaining !== undefined ? stu.sessionsRemaining : 4} حصص متبقية)، أو سجل الحضور.\n` +
        `كما تم إخطار إدارة الأكاديمية لخدمتكم بشكل مباشر عند الحاجة!`
      );
    } else {
      return (
        `مرحباً بكم في أكاديمية Brainova Robotics 🤖\n` +
        `تم استلام رسالتكم. يسعدنا الرد على استفساركم بخصوص التسجيل، الدورات (روبوتيك، برمجة، ذكاء اصطناعي)، أو أسعار الاشتراكات (5000 دج شهرياً).\n` +
        `تفضل بطرح سؤالك وسنوافيك بالتفاصيل فوراً!`
      );
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
      qr: this.lastQr,
      aiAgentEnabled: this.aiAgentEnabled,
      hasApiKey: !!this.aiApiKey
    };
  }

  emitStatus() {
    this.sendToRenderer('whatsapp-status', this.getStatus());
  }
}

module.exports = new WhatsAppBot();
