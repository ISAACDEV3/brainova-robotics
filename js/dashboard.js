/* ================================================
   BRAINOVA ROBOTICS — Complete Management Platform
   In-Memory Engine, Rooms, Age Groups, Attendance & Payments
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. IN-MEMORY HIGH PERFORMANCE CACHE
  // ==========================================
  
  function generateRandomCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    for (let i = 0; i < length; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  }

  const MemoryCache = {};

      function initializeData() {
    const singleEducator = [
      { id: "EDU-001", name: "عابد اسحاق تقي الدين", specialty: "هندسة الروبوتيك والذكاء الاصطناعي", phone: "0791194633" }
    ];

    const defaultRooms = [
      { id: "ROOM-1", name: "قاعة Brainova الرئيسية", capacity: 14, type: "قاعة تدريب تفاعلية", equipment: "حواسيب، حقائب أردوينو، شاشة ذكية", status: "available", currentGroup: "الفوج أ (مبتدئ)" },
      { id: "ROOM-2", name: "قاعة البرمجة والروبوتيك", capacity: 16, type: "مخبر حواسيب", equipment: "حواسيب محمولة، شاشة عرض، إنترنت", status: "available", currentGroup: "الفوج ب (متوسط)" },
      { id: "ROOM-3", name: "مخبر الذكاء الاصطناعي و3D", capacity: 12, type: "مخبر ابتكار وتصنيع", equipment: "طابعات 3D، كاميرات AI، أردوينو متقدم", status: "available", currentGroup: "الفوج ج (متقدم)" }
    ];

    const defaultGroups = [
      { id: "GRP-001", name: "الفوج أ (مبتدئ)", level: "المستوى الأول", ageCategory: "6 - 8 سنوات (براعم)", room: "قاعة Brainova الرئيسية", educatorId: "EDU-001", educatorName: "عابد اسحاق تقي الدين", maxStudents: 12 },
      { id: "GRP-002", name: "الفوج ب (متوسط)", level: "المستوى الثاني", ageCategory: "8 - 11 سنة (ناشئين)", room: "قاعة البرمجة والروبوتيك", educatorId: "EDU-001", educatorName: "عابد اسحاق تقي الدين", maxStudents: 12 },
      { id: "GRP-003", name: "الفوج ج (متقدم)", level: "المستوى الثالث", ageCategory: "11 - 15 سنة (فتيان)", room: "مخبر الذكاء الاصطناعي و3D", educatorId: "EDU-001", educatorName: "عابد اسحاق تقي الدين", maxStudents: 10 }
    ];

    const defaultCourses = [
      { id: "CRS-001", name: "المستوى الأول: التفكير المنطقي وأساسيات الروبوت", age: "6-8 سنوات", duration: "3 أشهر (12 حصة)" },
      { id: "CRS-002", name: "المستوى الثاني: البرمجة المرئية بسكراتش", age: "8-11 سنة", duration: "3 أشهر (12 حصة)" },
      { id: "CRS-003", name: "المستوى الثالث: برمجة الأردوينو والمستشعرات", age: "11-15 سنة", duration: "4 أشهر (16 حصة)" },
      { id: "CRS-004", name: "المستوى الرابع: الذكاء الاصطناعي والرؤية الحاسوبية", age: "12-18 سنة", duration: "4 أشهر (16 حصة)" }
    ];

    const defaultSchedule = [
      { id: "SCH-001", groupId: "GRP-001", groupName: "الفوج أ (مبتدئ)", educatorName: "عابد اسحاق تقي الدين", day: "Saturday", startTime: "08:00", endTime: "10:00", room: "قاعة Brainova الرئيسية" },
      { id: "SCH-002", groupId: "GRP-002", groupName: "الفوج ب (متوسط)", educatorName: "عابد اسحاق تقي الدين", day: "Saturday", startTime: "10:00", endTime: "12:00", room: "قاعة البرمجة والروبوتيك" },
      { id: "SCH-003", groupId: "GRP-003", groupName: "الفوج ج (متقدم)", educatorName: "عابد اسحاق تقي الدين", day: "Saturday", startTime: "14:00", endTime: "16:00", room: "مخبر الذكاء الاصطناعي و3D" }
    ];

    const defaultData = {
      brainova_registrations: [],
      brainova_students: [],
      brainova_educators: singleEducator,
      brainova_groups: defaultGroups,
      brainova_rooms: defaultRooms,
      brainova_courses: defaultCourses,
      brainova_schedule: defaultSchedule,
      brainova_attendance: [],
      brainova_payments: [],
      brainova_settings: {
        schoolName: "Brainova Robotics",
        adminName: "إدارة الأكاديمية",
        adminEmail: "brainovarobotics@gmail.com",
        adminPhone: "0791194633",
        academicYear: "2026/2027"
      }
    };

    for (const key in defaultData) {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultData[key]));
        MemoryCache[key] = defaultData[key];
      } else {
        try {
          const parsed = JSON.parse(stored);
          if (key === 'brainova_students' && parsed.some(s => s.name === 'نزار تسنيم' || s.name === 'سارة محمد' || s.name === 'ياسين كريم')) {
            localStorage.setItem(key, JSON.stringify([]));
            MemoryCache[key] = [];
          } else if (key === 'brainova_educators') {
            localStorage.setItem(key, JSON.stringify(singleEducator));
            MemoryCache[key] = singleEducator;
          } else if (key === 'brainova_groups' && (!parsed || parsed.length === 0)) {
            localStorage.setItem(key, JSON.stringify(defaultGroups));
            MemoryCache[key] = defaultGroups;
          } else if (key === 'brainova_rooms' && (!parsed || parsed.length === 0)) {
            localStorage.setItem(key, JSON.stringify(defaultRooms));
            MemoryCache[key] = defaultRooms;
          } else if (key === 'brainova_schedule' && (!parsed || parsed.length === 0)) {
            localStorage.setItem(key, JSON.stringify(defaultSchedule));
            MemoryCache[key] = defaultSchedule;
          } else {
            MemoryCache[key] = parsed;
          }
        } catch(e) {
          localStorage.setItem(key, JSON.stringify(defaultData[key]));
          MemoryCache[key] = defaultData[key];
        }
      }
    }
  }

  function getData(key) {
    if (MemoryCache[key] !== undefined) return MemoryCache[key];
    try {
      MemoryCache[key] = JSON.parse(localStorage.getItem(key) || 'null');
      if (MemoryCache[key] === null) MemoryCache[key] = [];
    } catch(e) {
      MemoryCache[key] = [];
    }
    return MemoryCache[key];
  }
  window.getData = getData;

  function saveData(key, data) {
    MemoryCache[key] = data;
    // Sync to localStorage (fast, synchronous UI layer)
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch(e){}
    // Sync to electron-store (persistent disk storage, fire-and-forget)
    if (window.electronAPI && window.electronAPI.store) {
      window.electronAPI.store.set(key, data);
    }
  }
  window.saveData = saveData;

  // Load persistent data from electron-store into localStorage on startup
  async function loadFromPersistentStore() {
    if (!window.electronAPI || !window.electronAPI.store) return;
    try {
      const allData = await window.electronAPI.store.getAll();
      if (!allData) return;
      // Keys to sync (skip non-data keys)
      const dataKeys = Object.keys(allData).filter(k => k.startsWith('brainova_'));
      dataKeys.forEach(key => {
        // electron-store is source of truth — always overwrites localStorage
        const val = allData[key];
        if (val !== undefined && val !== null) {
          localStorage.setItem(key, JSON.stringify(val));
          MemoryCache[key] = val; // update cache too
        }
      });
    } catch(e) {
      console.warn('[Brainova] Could not load from persistent store:', e);
    }
  }

  // Load current user info from electron-store
  async function loadCurrentUser() {
    if (!window.electronAPI || !window.electronAPI.getCurrentUser) return;
    try {
      const user = await window.electronAPI.getCurrentUser();
      if (user) {
        window.__currentUser = user;
        // Apply teacher restrictions if not admin
        if (user.role === 'teacher') {
          applyTeacherRestrictions(user);
        }
        // Show user name in topbar
        const topbarName = document.getElementById('adminName');
        if (topbarName) topbarName.textContent = user.name;
        const topbarRole = document.getElementById('adminRole');
        if (topbarRole) topbarRole.textContent = user.role === 'admin' ? 'مدير النظام' : 'مؤطر';
      }
    } catch(e) {}
  }

  function applyTeacherRestrictions(user) {
    // Hide financial sections for teachers
    const hiddenViews = ['payments', 'settings'];
    hiddenViews.forEach(view => {
      const navItem = document.querySelector(`[data-view="${view}"]`);
      if (navItem) navItem.closest('li').style.display = 'none';
    });
  }

  // ── Run startup loaders
  loadFromPersistentStore().then(() => {
    initializeData();
    renderCurrentView();
  });



  // ==========================================
  // 2. UI STATE & TOASTS
  // ==========================================
  
  let currentView = 'overview';
  let searchQuery = '';

  function showToast(messageKey, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : '⚠️');
    
    const currentLang = (document.documentElement && document.documentElement.lang) || 'ar';
    const text = (typeof dashTranslations !== 'undefined' && dashTranslations[currentLang]?.[messageKey]) || messageKey;
    
    toast.innerHTML = `<span>${icon}</span> <span>${text}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 200);
    }, 2500);
  }
  window.showToast = showToast;

  // --- TAB SWITCHING ---
  const navLinks = document.querySelectorAll('.sidebar__nav a[data-view]');
  const views = document.querySelectorAll('.dashboard-view');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetViewName = link.dataset.view;
      if (currentView === targetViewName) return;

      navLinks.forEach(l => l.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));
      
      link.classList.add('active');
      currentView = targetViewName;
      const targetView = document.getElementById(`view-${currentView}`);
      
      const viewTitleMap = {
        'overview': 'نظرة عامة',
        'students': 'إدارة الطلاب',
        'attendance': 'تسجيل الحضور والغياب',
        'groups': 'الأفواج والفئات',
        'rooms': 'القاعات والمخابر',
        'courses': 'المناهج والدورات',
        'schedule': 'الجدول الزمني الأسبوعي',
        'payments': 'المدفوعات والوصولات',
        'registrations': 'طلبات التسجيل الجديدة',
        'educators': 'طاقم التدريس',
        'settings': 'إعدادات النظام'
      };
      const titleEl = document.getElementById('topbarViewTitle');
      if (titleEl) titleEl.textContent = viewTitleMap[currentView] || 'لوحة التحكم';
      if (targetView) targetView.classList.add('active');
      
      const searchInput = document.getElementById('globalSearch');
      if (searchInput && searchInput.value) {
        searchInput.value = '';
        searchQuery = '';
      }
      
      if (window.innerWidth <= 992) {
        document.getElementById('sidebar').classList.remove('open');
      }
      
      renderActiveView();
    });
  });

  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }

  // ==========================================
  // 3. DEBOUNCED SEARCH & FAST FILTER
  // ==========================================
  
  let searchDebounceTimer = null;
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderActiveView();
      }, 120);
    });
  }

  function filterData(dataArray, query) {
    if (!query) return dataArray;
    return dataArray.filter(item => {
      for (const val of Object.values(item)) {
        if (val && String(val).toLowerCase().includes(query)) return true;
      }
      return false;
    });
  }

  // ==========================================
  // 4. SELECTIVE VIEW RENDERING
  // ==========================================
  
  function renderAll() {
    updateHeaderBadges();
    renderActiveView();
  }
  window.renderAll = renderAll;

  function updateHeaderBadges() {
    const regs = getData('brainova_registrations');
    const pendingCount = regs.filter(r => r.status === 'pending').length;
    const badge = document.getElementById('regBadge');
    if (badge) {
      badge.textContent = pendingCount;
      badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }
  }

  function renderActiveView() {
    if (currentView === 'overview') renderOverview();
    else if (currentView === 'students') renderStudents();
    else if (currentView === 'attendance') renderAttendance();
    else if (currentView === 'payments') renderPayments();
    else if (currentView === 'registrations') renderRegistrationsView();
    else if (currentView === 'educators') renderEducators();
    else if (currentView === 'groups') renderGroups();
    else if (currentView === 'rooms') renderRooms();
    else if (currentView === 'courses') renderCourses();
    else if (currentView === 'schedule') renderSchedule();
    else if (currentView === 'whatsapp') renderWhatsAppView();
    
    const currentLang = document.documentElement.lang;
    if (currentLang !== 'ar') updateDashboardLanguage(currentLang);
  }

  // ==========================================
  // 5. VIEW RENDERERS
  // ==========================================

      // --- OVERVIEW ---
  function renderOverview() {
    const students = getData('brainova_students');
    const groups = getData('brainova_groups');
    const regs = getData('brainova_registrations');
    const payments = getData('brainova_payments');
    const schedule = getData('brainova_schedule');
    const allAttendance = getData('brainova_attendance');
    const pendingCount = regs.filter(r => r.status === 'pending').length;
    const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);

    // ── Monthly revenue (current month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyRevenue = payments.filter(p => {
      const d = new Date(p.date || p.paymentDate || p.createdAt || 0);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);

    // ── Overall attendance rate
    const totalAttRecords = allAttendance.length;
    const presentRecords = allAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const attendanceRate = totalAttRecords > 0 ? Math.round((presentRecords / totalAttRecords) * 100) : 0;

    // ── Low balance students (sessions exhausted)
    const lowBalanceCount = students.filter(s => (Number(s.sessionsRemaining) || 0) === 0).length;

    const stats = [
      {
        label: "إجمالي الطلاب المسجلين",
        value: students.length,
        sub: `${lowBalanceCount > 0 ? lowBalanceCount + ' نفدت حصصهم' : 'جميعهم نشطون'}`,
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        color: '#38BDF8',
        trendClass: 'trend-badge--positive'
      },
      {
        label: "إيرادات هذا الشهر",
        value: `${monthlyRevenue.toLocaleString('ar-DZ')} دج`,
        sub: now.toLocaleString('ar-DZ', { month: 'long', year: 'numeric' }),
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
        color: '#10B981',
        trendClass: monthlyRevenue > 0 ? 'trend-badge--positive' : 'trend-badge--pending'
      },
      {
        label: "نسبة الحضور الكلية",
        value: `${attendanceRate}%`,
        sub: `${presentRecords} حضور من أصل ${totalAttRecords} سجل`,
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
        color: attendanceRate >= 80 ? '#10B981' : attendanceRate >= 60 ? '#F59E0B' : '#EF4444',
        trendClass: attendanceRate >= 80 ? 'trend-badge--positive' : 'trend-badge--pending'
      },
      {
        label: "إجمالي التحصيلات المالية",
        value: `${totalRevenue.toLocaleString('ar-DZ')} دج`,
        sub: `${payments.length} وصل موثق`,
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
        color: '#A78BFA',
        trendClass: 'trend-badge--positive'
      },
      {
        label: "طلبات التسجيل المعلقة",
        value: pendingCount,
        sub: pendingCount > 0 ? 'تتطلب المراجعة والقبول' : 'لا توجد طلبات معلقة',
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        color: pendingCount > 0 ? '#F59E0B' : '#10B981',
        trendClass: pendingCount > 0 ? 'trend-badge--pending' : 'trend-badge--positive'
      },
      {
        label: "الأفواج التدريبية النشطة",
        value: groups.length,
        sub: `${schedule.length} حصص مبرمجة أسبوعياً`,
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
        color: '#38BDF8',
        trendClass: 'trend-badge--positive'
      }
    ];

    const statsGrid = document.getElementById('overviewStats') || document.getElementById('statsGrid');
    if (statsGrid) {
      statsGrid.innerHTML = stats.map(s => `
        <div class="stat-card">
          <div class="stat-card__top">
            <span class="stat-card__title">${s.label}</span>
            <div class="stat-card__icon-badge" style="color:${s.color}; background:${s.color}1a;">${s.icon}</div>
          </div>
          <div class="stat-card__value" style="color:${s.color};">${s.value}</div>
          <div class="stat-card__footer">
            <span class="trend-badge ${s.trendClass}">${s.sub}</span>
          </div>
        </div>
      `).join('');
    }

    // ── Last 6 Months Revenue Chart
    const chartContainer = document.getElementById('overviewRevenueChart');
    if (chartContainer) {
      const monthNames = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
      const last6 = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        const m = d.getMonth();
        const y = d.getFullYear();
        const rev = payments.filter(p => {
          const pd = new Date(p.date || p.paymentDate || p.createdAt || 0);
          return pd.getMonth() === m && pd.getFullYear() === y;
        }).reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);
        last6.push({ label: monthNames[m], value: rev, isCurrent: i === 0 });
      }
      const maxVal = Math.max(...last6.map(x => x.value), 1);
      chartContainer.innerHTML = `
        <div style="display:flex; align-items:flex-end; gap:10px; height:100px; padding:0 4px;">
          ${last6.map(m => {
            const pct = Math.round((m.value / maxVal) * 100);
            const barH = Math.max(pct, 4);
            return `
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
                <span style="font-size:0.68rem; color:var(--color-text-dim); font-family:monospace; white-space:nowrap;">${m.value > 0 ? m.value.toLocaleString() : '—'}</span>
                <div style="width:100%; height:${barH}px; background:${m.isCurrent ? '#10B981' : 'rgba(56,189,248,0.35)'}; border-radius:4px 4px 0 0; transition:height 0.4s ease; min-height:4px;"></div>
                <span style="font-size:0.7rem; color:${m.isCurrent ? '#10B981' : 'var(--color-text-dim)'}; font-weight:${m.isCurrent ? '700' : '400'};">${m.label}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // ── Attendance per group breakdown
    const attBreakdown = document.getElementById('overviewAttBreakdown');
    if (attBreakdown) {
      if (groups.length === 0 || allAttendance.length === 0) {
        attBreakdown.innerHTML = `<div style="text-align:center; padding:18px; color:var(--color-text-dim); font-size:0.84rem;">لا توجد سجلات حضور بعد.</div>`;
      } else {
        attBreakdown.innerHTML = groups.map(grp => {
          const grpRecords = allAttendance.filter(a => a.groupName === grp.name);
          const grpPresent = grpRecords.filter(a => a.status === 'present' || a.status === 'late').length;
          const grpRate = grpRecords.length > 0 ? Math.round((grpPresent / grpRecords.length) * 100) : 0;
          const color = grpRate >= 80 ? '#10B981' : grpRate >= 60 ? '#F59E0B' : '#EF4444';
          return `
            <div style="display:flex; align-items:center; gap:14px; padding:10px 0; border-bottom:1px solid var(--color-border);">
              <div style="flex:1; min-width:0;">
                <div style="font-weight:700; font-size:0.85rem; color:#F1F5F9; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${grp.name}</div>
                <div style="font-size:0.72rem; color:var(--color-text-dim); margin-top:2px;">${grpRecords.length} سجل حضور</div>
              </div>
              <div style="width:100px; flex-shrink:0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                  <span style="font-size:0.7rem; color:var(--color-text-dim);">نسبة الحضور</span>
                  <span style="font-size:0.75rem; font-weight:700; color:${color};">${grpRate}%</span>
                </div>
                <div style="height:5px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden;">
                  <div style="height:100%; width:${grpRate}%; background:${color}; border-radius:999px;"></div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Render Recent Registrations Table
    renderRegistrationsTable(regs.slice(0, 5), 'overviewTableBody', false);

    // Render Today's Schedule Stream in Overview
    const streamContainer = document.getElementById('overviewScheduleStream');
    if (streamContainer) {
      if (schedule.length === 0) {
        streamContainer.innerHTML = `<div style="text-align:center; padding:18px; color:var(--color-text-dim); font-size:0.84rem;">لا توجد حصص مبرمجة حالياً.</div>`;
      } else {
        streamContainer.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${schedule.map(sch => {
              const grp = groups.find(g => g.id === sch.groupId || g.name === sch.groupName);
              const studentCount = students.filter(s => s.groupId === sch.groupId || s.group === sch.groupName).length;
              return `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:rgba(255,255,255,0.03); border:1px solid var(--color-border); border-radius:8px; gap:12px;">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:36px; height:36px; border-radius:8px; background:rgba(56,189,248,0.12); color:#38BDF8; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.8rem; font-family:monospace;">
                      ${sch.startTime || '08:00'}
                    </div>
                    <div>
                      <div style="font-weight:700; color:#F8FAFC; font-size:0.88rem;">${sch.groupName}</div>
                      <div style="font-size:0.74rem; color:var(--color-text-muted); margin-top:2px;">
                        المؤطر: <span style="color:#F1F5F9;">${sch.educatorName || 'غير محدد'}</span> • ${sch.room || 'قاعة Brainova'}
                      </div>
                    </div>
                  </div>
                  <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:0.75rem; color:var(--color-text-dim); font-weight:600;">${studentCount} تلاميذ</span>
                    <button class="btn btn--outline btn--small" onclick="document.getElementById('attGroupSelect').value='${sch.groupName}'; document.querySelector('[data-view=\\'attendance\\']').click();" style="font-size:0.76rem; padding:4px 10px;">
                      تفقد الحضور
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    }

    // Render Cohort Capacity Meters
    const capacityContainer = document.getElementById('overviewCapacityMeters');
    if (capacityContainer) {
      if (groups.length === 0) {
        capacityContainer.innerHTML = `<div style="text-align:center; padding:18px; color:var(--color-text-dim);">لا توجد أفواج مسجلة.</div>`;
      } else {
        capacityContainer.innerHTML = groups.map(grp => {
          const enrolled = students.filter(s => s.groupId === grp.id || s.group === grp.name).length;
          const max = Number(grp.maxStudents) || 12;
          const pct = Math.min(100, Math.round((enrolled / max) * 100));
          return `
            <div class="capacity-item">
              <div class="capacity-header">
                <span class="capacity-name">${grp.name} <small style="color:var(--color-text-dim); font-weight:normal;">(${grp.level || ''})</small></span>
                <span class="capacity-stat"><strong>${enrolled}</strong> / ${max} تلميذ (${pct}%)</span>
              </div>
              <div class="capacity-track">
                <div class="capacity-fill" style="width: ${pct}%; background: ${pct >= 90 ? '#EF4444' : (pct >= 60 ? '#38BDF8' : '#10B981')};"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }



  // --- UTILITY: PARSE DATE STRING ROBUSTLY ---
  function parseBrainovaDate(dateStr) {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;
    const str = String(dateStr).trim();
    if (str.includes('/')) {
      const parts = str.split(' ');
      const dmy = parts[0].split('/');
      if (dmy.length === 3) {
        const day = parseInt(dmy[0], 10);
        const month = parseInt(dmy[1], 10) - 1;
        const year = parseInt(dmy[2], 10);
        let hour = 12, min = 0;
        if (parts[1] && parts[1].includes(':')) {
          const hm = parts[1].split(':');
          hour = parseInt(hm[0], 10) || 12;
          min = parseInt(hm[1], 10) || 0;
        }
        return new Date(year, month, day, hour, min);
      }
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }
  window.parseBrainovaDate = parseBrainovaDate;

  function getArabicDayName(dateStr) {
    const d = parseBrainovaDate(dateStr);
    if (!d) return '';
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[d.getDay()] || '';
  }
  window.getArabicDayName = getArabicDayName;

  // --- TIMELINE & PAYMENT TRACKER CALCULATION ---
  function getStudentPaymentTimeline(studentId, stuObj, allPaymentsList) {
    const payments = (allPaymentsList || getData('brainova_payments')).filter(p => p.studentId === studentId);
    
    // Sort payments latest first
    payments.sort((a, b) => {
      const dateA = parseBrainovaDate(a.paidAtIso || a.date) || new Date(0);
      const dateB = parseBrainovaDate(b.paidAtIso || b.date) || new Date(0);
      return dateB - dateA;
    });

    const lastPayment = payments[0];
    if (!lastPayment) {
      return {
        hasPayment: false,
        status: 'unpaid',
        statusLabel: 'لم يسدد بعد',
        badgeClass: 'unpaid',
        lastDateStr: '—',
        daysElapsed: null,
        weeksElapsed: null,
        elapsedText: 'لا توجد دفعات مسجلة',
        renewalDateStr: '—',
        daysRemaining: null,
        renewalSummary: 'لم يسدد أي اشتراك بعد',
        lastAmount: 0,
        lastOpNumber: '—',
        paymentsCount: 0
      };
    }

    const payDate = parseBrainovaDate(lastPayment.paidAtIso || lastPayment.date) || new Date();
    const now = new Date();
    const diffMs = now.getTime() - payDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const diffWeeks = Math.floor(diffDays / 7);

    let elapsedText = '';
    if (diffDays === 0) {
      elapsedText = 'دفع اليوم';
    } else if (diffDays === 1) {
      elapsedText = 'دفع بالأمس';
    } else if (diffDays < 7) {
      elapsedText = `دفع منذ ${diffDays} أيام`;
    } else if (diffDays < 14) {
      const rem = diffDays - 7;
      elapsedText = `دفع منذ أسبوع ${rem > 0 ? 'و ' + rem + ' أيام' : ''}`;
    } else if (diffDays < 21) {
      elapsedText = `دفع منذ أسبوعين (${diffDays} يوماً)`;
    } else if (diffDays < 28) {
      elapsedText = `دفع منذ 3 أسابيع (${diffDays} يوماً)`;
    } else if (diffDays < 35) {
      elapsedText = `دفع منذ شهر (${diffDays} يوماً)`;
    } else {
      const months = Math.floor(diffDays / 30);
      elapsedText = `دفع منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'} (${diffDays} يوماً)`;
    }

    // Monthly Subscription Renewal (Cycle of 30 days)
    const renewalTimestamp = payDate.getTime() + (30 * 24 * 60 * 60 * 1000);
    const renewalDate = new Date(renewalTimestamp);
    const renewalDateStr = `${String(renewalDate.getDate()).padStart(2, '0')}/${String(renewalDate.getMonth() + 1).padStart(2, '0')}/${renewalDate.getFullYear()}`;
    const daysRemaining = Math.ceil((renewalTimestamp - now.getTime()) / (1000 * 60 * 60 * 24));

    let status = 'active';
    let statusLabel = 'اشتراك ساري';
    let badgeClass = 'paid';
    let renewalSummary = '';

    if (daysRemaining > 5) {
      status = 'active';
      statusLabel = 'اشتراك ساري';
      badgeClass = 'paid';
      renewalSummary = `متبقي ${daysRemaining} يوماً (استحقاق: ${renewalDateStr})`;
    } else if (daysRemaining >= 0) {
      status = 'due_soon';
      statusLabel = 'اقترب موعد التجديد';
      badgeClass = 'partial';
      renewalSummary = `مستحق للتجديد خلال ${daysRemaining === 0 ? 'اليوم' : daysRemaining + ' أيام'} (${renewalDateStr})`;
    } else {
      status = 'overdue';
      statusLabel = 'انتهى الاشتراك الشهري';
      badgeClass = 'overdue';
      renewalSummary = `متأخر عن دفع الشهر بـ ${Math.abs(daysRemaining)} يوم (انتهى في: ${renewalDateStr})`;
    }

    return {
      hasPayment: true,
      status,
      statusLabel,
      badgeClass,
      lastDateStr: lastPayment.date || payDate.toLocaleDateString('ar-DZ'),
      daysElapsed: diffDays,
      weeksElapsed: diffWeeks,
      elapsedText,
      renewalDate,
      renewalDateStr,
      daysRemaining,
      renewalSummary,
      lastAmount: Number(lastPayment.amountPaid) || 0,
      lastOpNumber: lastPayment.opNumber || lastPayment.id,
      paymentsCount: payments.length,
      allStudentPayments: payments
    };
  }
  window.getStudentPaymentTimeline = getStudentPaymentTimeline;

  // --- STUDENTS ---
  function renderStudents() {
    const rawStudents = getData('brainova_students');
    const allPayments = getData('brainova_payments');
    const subFilter = document.getElementById('studentSubFilter')?.value || 'all';
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;

    let students = filterData(rawStudents, searchQuery);

    if (subFilter !== 'all') {
      students = students.filter(stu => {
        const timeline = getStudentPaymentTimeline(stu.id, stu, allPayments);
        return timeline.status === subFilter;
      });
    }

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color:var(--color-text-muted);">لا توجد بيانات تطابق الفلتر المحدد</td></tr>`;
      return;
    }

    tbody.innerHTML = students.map(stu => {
      const balance = Number(stu.balance) || 0;
      const sessions = Number(stu.sessionsRemaining) || 0;
      const timeline = getStudentPaymentTimeline(stu.id, stu, allPayments);

      let sessionsBadge = '';
      if (sessions > 0) {
        sessionsBadge = `<span class="payment-badge paid">✅ ${sessions} حصص (${balance.toLocaleString()} دج)</span>`;
      } else if (balance < 0) {
        sessionsBadge = `<span class="payment-badge overdue">⚠️ دين: ${balance.toLocaleString()} دج</span>`;
      } else {
        sessionsBadge = `<span class="payment-badge partial">⏳ نفدت الحصص</span>`;
      }

      let paymentTimelineBadge = '';
      if (timeline.hasPayment) {
        if (timeline.status === 'active') {
          paymentTimelineBadge = `
            <div style="margin-top:5px; font-size:0.75rem; line-height:1.35;">
              <span style="color:#10B981; font-weight:700;">🕒 ${timeline.elapsedText}</span>
              <br>
              <span style="font-size:0.72rem; color:#64748B;">📅 التجديد: ${timeline.renewalDateStr} (متبقي ${timeline.daysRemaining} يوم)</span>
            </div>
          `;
        } else if (timeline.status === 'due_soon') {
          paymentTimelineBadge = `
            <div style="margin-top:5px; font-size:0.75rem; color:#F59E0B; line-height:1.35;">
              <span style="font-weight:700;">⏳ ${timeline.elapsedText}</span>
              <br>
              <span style="background:rgba(245,158,11,0.15); color:#FBBF24; padding:2px 6px; border-radius:4px; font-weight:700; font-size:0.7rem;">مستحق التجديد خلال ${timeline.daysRemaining === 0 ? 'اليوم' : timeline.daysRemaining + ' أيام'}</span>
            </div>
          `;
        } else {
          paymentTimelineBadge = `
            <div style="margin-top:5px; font-size:0.75rem; color:#EF4444; line-height:1.35;">
              <span style="font-weight:700;">⚠️ ${timeline.elapsedText}</span>
              <br>
              <span style="background:rgba(239,68,68,0.15); color:#F87171; padding:2px 6px; border-radius:4px; font-weight:700; font-size:0.7rem;">متأخر بـ ${Math.abs(timeline.daysRemaining)} يوم عن الشهر</span>
            </div>
          `;
        }
      } else {
        paymentTimelineBadge = `<div style="margin-top:5px; font-size:0.72rem; color:#64748B;">⚪ لم يسدد أي اشتراك بعد</div>`;
      }

      return `
        <tr>
          <td><span style="font-family:monospace; font-weight:700; color:var(--color-primary);">${stu.id}</span></td>
          <td>
            <a href="#" onclick="openStudentProfile('${stu.id}'); return false;" style="color:#fff; font-weight:700; text-decoration:underline;">
              ${stu.name}
            </a>
          </td>
          <td>
            <span style="font-weight:700; color:#F8FAFC;">${stu.group || 'غير محدد'}</span>
            ${(stu.sessionTime || (stu.startTime ? (stu.startTime + ' - ' + (stu.endTime || '')) : '')) ? `<div style="font-size:0.75rem; color:#00E5FF; font-weight:700; margin-top:2px;">🕒 ${stu.sessionTime || (stu.startTime + ' - ' + (stu.endTime || ''))}</div>` : ''}
            <small style="color:var(--color-accent);">${stu.level || ''}</small>
          </td>
          <td>
            <div>${stu.parentName || '—'}</div>
            <a href="tel:${stu.parentPhone}" dir="ltr" style="color:var(--color-primary); font-size:0.85rem;">${stu.parentPhone || '—'}</a>
          </td>
          <td>
            ${sessionsBadge}
            ${paymentTimelineBadge}
          </td>
          <td style="text-align: center;">
            <div style="display:inline-flex; gap:4px; flex-wrap:nowrap;">
              <button class="btn btn--outline" style="padding: 4px 6px; font-size: 0.75rem;" title="الملف الشامل" onclick="openStudentProfile('${stu.id}')"> الملف</button>
              <button class="btn btn--outline" style="padding: 4px 6px; font-size: 0.75rem; color:#38BDF8; border-color:rgba(56,189,248,0.4);" title="كتابة ملاحظة للولي" onclick="openStudentNoteModal('${stu.id}')"> ملاحظة</button>
              <button class="btn btn--small" style="padding: 4px 6px; font-size: 0.75rem; background:#0284C7; color:#fff;" title="بطاقة الطالب الذكية" onclick="openStudentIdCard('${stu.id}')">🪪 بطاقة</button>
              <button class="btn btn--small" style="padding: 4px 6px; font-size: 0.75rem; background:#25D366; color:#fff;" title="إشعار واتساب للولي" onclick="openWhatsAppDispatchModal('${stu.id}')"> واتساب</button>
              <button class="btn btn--primary" style="padding: 4px 6px; font-size: 0.75rem;" title="تسجيل دفعة" onclick="openRecordPaymentModal('${stu.id}')">🧾 وصل</button>
              <button class="btn-icon" style="width:26px; height:26px; border:none; color:#ef4444;" title="حذف" onclick="deleteStudent('${stu.id}')">حذف</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- ATTENDANCE SYSTEM ---
  let activeAttendanceDraft = {};

  function renderAttendance() {
    const groups = getData('brainova_groups');
    const groupSelect = document.getElementById('attGroupSelect');
    const dateInput = document.getElementById('attDateSelect');
    const timeSelect = document.getElementById('attSessionTimeSelect');
    const tbody = document.getElementById('attendanceTableBody');
    if (!tbody || !groupSelect || !dateInput) return;

    if (groupSelect.children.length === 0 && groups.length > 0) {
      groupSelect.innerHTML = groups.map(g => `<option value="${g.name}">${g.name}</option>`).join('');
    }

    if (!dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    const selectedGroup = groupSelect.value || (groups[0] ? groups[0].name : '');
    const selectedDate = dateInput.value;
    const selectedTime = timeSelect ? timeSelect.value : '09:00 - 11:00';

    const allStudents = getData('brainova_students');
    const groupStudents = allStudents.filter(s => s.group === selectedGroup || (s.group && s.group.includes(selectedGroup)));
    const existingRecords = getData('brainova_attendance').filter(a => a.date === selectedDate && (a.groupName === selectedGroup || a.groupId === selectedGroup) && (!a.sessionTime || a.sessionTime === selectedTime));

    activeAttendanceDraft = {};
    groupStudents.forEach(stu => {
      const existing = existingRecords.find(r => r.studentId === stu.id);
      activeAttendanceDraft[stu.id] = {
        status: existing ? existing.status : 'present',
        note: existing ? existing.note || '' : ''
      };
    });

    updateAttendanceStats();

    if (groupStudents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 28px; color:var(--color-text-dim);">لا يوجد طلاب مسجلين في هذا الفوج حالياً.</td></tr>`;
      return;
    }

    tbody.innerHTML = groupStudents.map(stu => {
      const draft = activeAttendanceDraft[stu.id] || { status: 'present', note: '' };
      const sessions = Number(stu.sessionsRemaining) || 0;
      const isAbsent = draft.status === 'absent';

      return `
        <tr id="att-row-${stu.id}">
          <!-- Student Info Column -->
          <td>
            <div class="student-att-meta">
              <div class="student-att-avatar">${stu.name.trim().charAt(0)}</div>
              <div class="student-att-info">
                <div class="student-att-name">${stu.name}</div>
                <div class="student-att-balance">
                  ${sessions > 0 ? `<span style="color:#34D399; font-weight:700;">${sessions} حصص متبقية</span>` : `<span style="color:#EF4444; font-weight:700;">نفدت الحصص</span>`}
                  • ID: <span style="font-family:monospace;">${stu.id}</span>
                </div>
              </div>
            </div>
          </td>

          <!-- Status Segmented Control -->
          <td style="text-align: center;">
            <div class="att-segmented-control" id="att-toggles-${stu.id}">
              <button type="button" class="att-seg-btn ${draft.status === 'present' ? 'is-active-present' : ''}" onclick="setAttendanceStatus('${stu.id}', 'present')">حاضر</button>
              <button type="button" class="att-seg-btn ${draft.status === 'absent' ? 'is-active-absent' : ''}" onclick="setAttendanceStatus('${stu.id}', 'absent')">غائب</button>
              <button type="button" class="att-seg-btn ${draft.status === 'late' ? 'is-active-late' : ''}" onclick="setAttendanceStatus('${stu.id}', 'late')">متأخر</button>
            </div>
          </td>

          <!-- Notes / Observation Input -->
          <td>
            <input type="text" value="${draft.note}" placeholder="ملاحظة تطبيق الحصة أو سبب الغياب..." class="form-input" style="padding: 6px 10px; font-size: 0.82rem; height: 32px;" onchange="setAttendanceNote('${stu.id}', this.value)">
          </td>

          <!-- Quick Action -->
          <td style="text-align: center;">
            <div style="display:flex; justify-content:center; gap:6px;">
              ${isAbsent && stu.parentPhone ? `
                <a href="https://wa.me/${stu.parentPhone.replace(/\D/g, '').replace(/^0/, '213')}?text=${encodeURIComponent('السلام عليكم ولي أمر التلميذ(ة) ' + stu.name + '، نعلمكم بغياب الطالب عن ورشة الروبوتيك المقررة اليوم بتاريخ ' + selectedDate + ' (توقيت ' + selectedTime + '). يرجى التواصل معنا في حال وجود أي استفسار.')}" target="_blank" class="btn btn--outline btn--small" style="color:#25D366; border-color:rgba(37,211,102,0.3);" title="إشعار الولي عبر واتساب">
                   إشعار
                </a>
              ` : ''}
              <button type="button" class="btn btn--outline btn--small" onclick="openStudentProfile('${stu.id}')" title="الملف الشامل">
                 الملف
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.setAttendanceStatus = function(studentId, status) {
    if (!activeAttendanceDraft[studentId]) activeAttendanceDraft[studentId] = { status: 'present', note: '' };
    activeAttendanceDraft[studentId].status = status;

    const toggleBox = document.getElementById(`att-toggles-${studentId}`);
    if (toggleBox) {
      const btns = toggleBox.querySelectorAll('.att-seg-btn');
      btns.forEach(b => {
        b.className = 'att-seg-btn';
        if (b.textContent.trim() === 'حاضر' && status === 'present') b.classList.add('is-active-present');
        if (b.textContent.trim() === 'غائب' && status === 'absent') b.classList.add('is-active-absent');
        if (b.textContent.trim() === 'متأخر' && status === 'late') b.classList.add('is-active-late');
      });
    }

    updateAttendanceStats();
  };

  window.setAttendanceNote = function(studentId, note) {
    if (!activeAttendanceDraft[studentId]) activeAttendanceDraft[studentId] = { status: 'present', note: '' };
    activeAttendanceDraft[studentId].note = note;
  };

  window.markAllAttendance = function(status) {
    for (const stuId in activeAttendanceDraft) {
      setAttendanceStatus(stuId, status);
    }
    showToast(`تم تحديد الجميع كـ ${status === 'present' ? 'حاضر' : 'غائب'}`, 'success');
  };

  function updateAttendanceStats() {
    const values = Object.values(activeAttendanceDraft);
    const total = values.length || 1;
    const present = values.filter(v => v.status === 'present').length;
    const absent = values.filter(v => v.status === 'absent').length;
    const late = values.filter(v => v.status === 'late').length;
    
    const rate = Math.round(((present + late) / total) * 100);

    const elP = document.getElementById('attPresentCount');
    const elA = document.getElementById('attAbsentCount');
    const elL = document.getElementById('attLateCount');
    const elE = document.getElementById('attExcusedCount');
    const elR = document.getElementById('attRate');

    if (elP) elP.textContent = present;
    if (elA) elA.textContent = absent;
    if (elL) elL.textContent = late;
    
    if (elR) elR.textContent = `${rate}%`;
  }

  window.saveAttendanceRecord = function() {
    const groupSelect = document.getElementById('attGroupSelect');
    const dateInput = document.getElementById('attDateSelect');
    const timeSelect = document.getElementById('attSessionTimeSelect');
    const selectedGroup = groupSelect.value;
    const selectedDate = dateInput.value;
    const selectedTime = timeSelect ? timeSelect.value : '09:00 - 11:00';

    let allAttendance = getData('brainova_attendance');
    allAttendance = allAttendance.filter(a => !(a.date === selectedDate && a.groupName === selectedGroup && (!a.sessionTime || a.sessionTime === selectedTime)));

    const students = getData('brainova_students');
    const nowStr = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    for (const [studentId, data] of Object.entries(activeAttendanceDraft)) {
      const stu = students.find(s => s.id === studentId);
      allAttendance.push({
        id: 'ATT-' + Date.now() + '-' + studentId,
        date: selectedDate,
        groupName: selectedGroup,
        sessionTime: selectedTime,
        studentId,
        studentName: stu ? stu.name : 'Unknown',
        status: data.status,
        note: data.note
      });

      if (stu && (data.status === 'present' || data.status === 'late')) {
        stu.lastAttendance = `${selectedDate} (${selectedTime})`;
        if (stu.sessionsRemaining > 0) {
          stu.sessionsRemaining = Math.max(0, stu.sessionsRemaining - 1);
        }
      }

      // Zero-click WhatsApp Bot Trigger for late / absent
      if (stu && (data.status === 'late' || data.status === 'absent')) {
        triggerAutoAttendanceWhatsApp(stu, data.status, selectedTime, selectedDate);
      }
    }

    saveData('brainova_attendance', allAttendance);
    saveData('brainova_students', students);
    showToast(`تم حفظ سجل الحضور لفوج (${selectedGroup}) بتوقيت (${selectedTime}) بنجاح!`, 'success');
  };

  // --- PAYMENTS & RECEIPTS SYSTEM ---
  function renderPayments() {
    const payments = filterData(getData('brainova_payments'), searchQuery);
    const filter = document.getElementById('paymentStatusFilter')?.value || 'all';
    const tbody = document.getElementById('paymentsTableBody');
    const statsGrid = document.getElementById('paymentStatsGrid');
    if (!tbody) return;

    const filteredPayments = filter === 'all' ? payments : payments.filter(p => p.status === filter);

    const allPayments = getData('brainova_payments');
    const students = getData('brainova_students');
    const totalCollected = allPayments.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);
    const totalDue = students.filter(s => (s.balance || 0) < 0).reduce((sum, s) => sum + Math.abs(s.balance), 0);
    const activeReceipts = allPayments.length;
    const paidStudents = students.filter(s => (s.sessionsRemaining || 0) > 0).length;
    const paidRate = students.length > 0 ? Math.round((paidStudents / students.length) * 100) : 100;

    if (statsGrid) {
      statsGrid.innerHTML = `
        <div class="stat-card">
          <div class="stat-card__icon">💰</div>
          <div class="stat-card__info">
            <span class="stat-card__title">إجمالي المداخيل المحصلة</span>
            <span class="stat-card__value" style="color:#10b981;">${totalCollected.toLocaleString()} دج</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon">⏳</div>
          <div class="stat-card__info">
            <span class="stat-card__title">المبالغ المتبقية / الديون</span>
            <span class="stat-card__value" style="color:#ef4444;">${totalDue.toLocaleString()} دج</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon">🧾</div>
          <div class="stat-card__info">
            <span class="stat-card__title">إجمالي الوصولات الصادرة</span>
            <span class="stat-card__value">${activeReceipts} وصل</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon">📈</div>
          <div class="stat-card__info">
            <span class="stat-card__title">نسبة انتظام الاشتراكات</span>
            <span class="stat-card__value" style="color:var(--color-primary);">${paidRate}%</span>
          </div>
        </div>
      `;
    }

    if (filteredPayments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 24px; color:var(--color-text-muted);">لا توجد معاملات مالية مسجلة حالياً.</td></tr>`;
      return;
    }

    tbody.innerHTML = filteredPayments.map(p => `
      <tr>
        <td>
          <span style="display:inline-block; background:rgba(14, 165, 233, 0.1); border:1px solid var(--color-border); padding:2px 8px; border-radius:4px; font-family:monospace; font-weight:800; color:var(--color-primary);">
            #${p.opNumber || p.id}
          </span>
        </td>
        <td><small style="color:var(--color-text-muted);">${p.date}</small></td>
        <td>
          <a href="#" onclick="openStudentProfile('${p.studentId}'); return false;" style="color:#fff; font-weight:700; text-decoration:underline;">
            ${p.studentName}
          </a>
        </td>
        <td><span style="color:var(--color-text);">${p.group}</span><br><small style="color:var(--color-text-muted);">${p.educatorName || ''}</small></td>
        <td><strong class="amount-display" style="color:#10b981;">${Number(p.amountPaid).toLocaleString()} دج</strong></td>
        <td><span class="amount-display" style="color:${(p.currentBalance || 0) < 0 ? '#ef4444' : 'var(--color-text-muted)'};">${p.currentBalance || 0} دج</span></td>
        <td><span style="font-weight:700; color:var(--color-primary);">${p.sessionsRemaining || p.sessionsPurchased || 4} حصص</span></td>
        <td><span style="font-size:0.8rem; color:var(--color-text-muted);">${p.method || 'نقداً'}</span></td>
        <td style="text-align: center;">
          <div style="display:inline-flex; gap:6px;">
            <button class="btn btn--primary" style="padding:4px 10px; font-size:0.75rem; background:#0284c7;" onclick="openReceiptModal('${p.id}')">🖨️ طباعة الوصل</button>
            <button class="btn-icon" style="width:28px; height:28px; border:none; color:#ef4444;" onclick="deletePayment('${p.id}')">حذف</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // --- RECORD PAYMENT MODAL ---
  window.openRecordPaymentModal = function(presetStudentId = null) {
    const select = document.getElementById('payStudentSelect');
    const dateInput = document.getElementById('payDateTime');
    const students = getData('brainova_students');
    
    select.innerHTML = '<option value="">-- اختر الطالب --</option>' + students.map(s => `
      <option value="${s.id}" ${presetStudentId === s.id ? 'selected' : ''}>${s.name} (${s.group || s.level})</option>
    `).join('');

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    dateInput.value = now.toISOString().slice(0, 16);

    document.getElementById('recordPaymentModal').classList.add('active');
  };

  window.closeRecordPaymentModal = function() {
    document.getElementById('recordPaymentModal').classList.remove('active');
  };

  window.onPaymentStudentSelected = function() {
    const studentId = document.getElementById('payStudentSelect').value;
    const stu = getData('brainova_students').find(s => s.id === studentId);
    if (stu && stu.monthlyFee) {
      document.getElementById('payAmount').value = stu.monthlyFee;
    }
  };

  window.submitRecordPayment = function(e) {
    e.preventDefault();
    const studentId = document.getElementById('payStudentSelect').value;
    const amount = Number(document.getElementById('payAmount').value) || 0;
    const sessions = Number(document.getElementById('paySessions').value) || 4;
    const method = document.getElementById('payMethod').value;
    const rawDateTime = document.getElementById('payDateTime').value;
    const notes = document.getElementById('payNotes').value;
    const autoPrint = document.getElementById('autoPrintReceiptCheck').checked;

    const students = getData('brainova_students');
    const stu = students.find(s => s.id === studentId);
    if (!stu) {
      showToast('يرجى اختيار طالب صالح!', 'error');
      return;
    }

    const educators = getData('brainova_educators');
    const groups = getData('brainova_groups');
    const studentGroup = groups.find(g => g.name === stu.group);
    const educator = studentGroup ? educators.find(e => e.id === studentGroup.educatorId) : educators[0];

    const d = rawDateTime ? new Date(rawDateTime) : new Date();
    const formattedDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth()+1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const isoDate = d.toISOString();
    const timestamp = d.getTime();

    const opNumber = String(Math.floor(10000 + Math.random() * 90000));
    const prevBalance = stu.balance || 0;
    const currentBalance = prevBalance + amount;
    const currentSessions = (stu.sessionsRemaining || 0) + sessions;

    stu.balance = currentBalance;
    stu.sessionsRemaining = currentSessions;
    stu.lastPaymentDate = formattedDate;
    stu.lastPaymentIso = isoDate;
    stu.lastPaymentTimestamp = timestamp;
    stu.lastPaymentAmount = amount;
    saveData('brainova_students', students);

    const newPayment = {
      id: 'REC-' + opNumber,
      opNumber,
      studentId: stu.id,
      studentName: stu.name,
      level: stu.level,
      group: stu.group,
      educatorName: educator ? educator.name : 'عابد اسحاق تقي الدين',
      date: formattedDate,
      paidAtIso: isoDate,
      paidAtTimestamp: timestamp,
      amountPaid: amount,
      prevBalance,
      currentBalance,
      sessionsPurchased: sessions,
      sessionsRemaining: currentSessions,
      lastAttendance: stu.lastAttendance || formattedDate,
      username: stu.username || generateRandomCode(8),
      password: stu.password || generateRandomCode(8),
      method,
      status: 'paid',
      notes
    };

    const payments = getData('brainova_payments');
    payments.unshift(newPayment);
    saveData('brainova_payments', payments);

    closeRecordPaymentModal();
    showToast('تم تسجيل الدفعة بنجاح!', 'success');
    renderActiveView();

    if (autoPrint) {
      setTimeout(() => {
        openReceiptModal(newPayment.id);
      }, 200);
    }
  };

  window.deletePayment = function(id) {
    if (confirm('هل أنت متأكد من حذف هذا الوصل وسجل العملية؟')) {
      const payments = getData('brainova_payments').filter(p => p.id !== id);
      saveData('brainova_payments', payments);
      showToast('تم حذف الوصل بنجاح!', 'success');
      renderActiveView();
    }
  };

  function convertAmountToArabicWords(num) {
    const val = Number(num) || 0;
    if (val === 5000) return 'خمسة آلاف دينار جزائري فقط (5,000 دج)';
    if (val === 8000) return 'ثمانية آلاف دينار جزائري فقط (باقة طفلين - 8,000 دج)';
    if (val === 11000) return 'أحد عشر ألف دينار جزائري فقط (باقة 3 أطفال - 11,000 دج)';
    if (val === 2000) return 'ألفان دينار جزائري فقط';
    if (val === 3000) return 'ثلاثة آلاف دينار جزائري فقط';
    if (val === 4000) return 'أربعة آلاف دينار جزائري فقط';
    if (val === 6000) return 'ستة آلاف دينار جزائري فقط';
    if (val === 7000) return 'سبعة آلاف دينار جزائري فقط';
    if (val === 9000) return 'تسعة آلاف دينار جزائري فقط';
    if (val === 10000) return 'عشرة آلاف دينار جزائري فقط';
    if (val === 12000) return 'اثنا عشر ألف دينار جزائري فقط';
    if (val === 15000) return 'خمسة عشر ألف دينار جزائري فقط';
    return `${Number(val).toLocaleString()} دينار جزائري`;
  }

  let currentActiveReceiptPaymentId = null;

  // --- RECEIPT MODAL ---
  window.openReceiptModal = function(paymentId) {
    const payments = getData('brainova_payments');
    const payment = payments.find(p => p.id === paymentId) || payments[0];
    if (!payment) {
      showToast('لم يتم العثور على بيانات الوصل!', 'error');
      return;
    }

    currentActiveReceiptPaymentId = payment.id || paymentId;

    const students = getData('brainova_students');
    const stu = students.find(s => s.id === payment.studentId) || students[0];

    const opNum = payment.opNumber || (payment.id ? payment.id.replace('REC-', '') : '94789');
    const username = (stu && stu.username) ? stu.username : (payment.username || 'user');
    const password = (stu && stu.password) ? stu.password : (payment.password || 'pass');
    const exactAmount = Number(payment.amountPaid || 5000);

    const elOpNum = document.getElementById('rcptOpNumber');
    if (elOpNum) elOpNum.textContent = opNum;

    const elOpNumCell = document.getElementById('rcptOpNumberCell');
    if (elOpNumCell) elOpNumCell.textContent = opNum;

    const elStudent = document.getElementById('rcptStudentName');
    if (elStudent) elStudent.textContent = (stu && stu.name) || payment.studentName || '—';

    const elParent = document.getElementById('rcptParentName');
    if (elParent) elParent.textContent = (stu && stu.parentName) || payment.parentName || 'ولي أمر التلميذ';

    const elLevelGroup = document.getElementById('rcptLevelGroup');
    if (elLevelGroup) elLevelGroup.textContent = `${(stu && stu.level) || payment.level || 'المستوى الأول'} • ${(stu && stu.group) || payment.group || 'الفوج أ'}`;

    const elDateTime = document.getElementById('rcptDateTime');
    if (elDateTime) elDateTime.textContent = payment.date || new Date().toLocaleString('ar-DZ');

    const elMethod = document.getElementById('rcptMethod');
    if (elMethod) elMethod.textContent = payment.method || 'نقداً (Cash)';

    const elAmount = document.getElementById('rcptAmountPaid');
    if (elAmount) elAmount.textContent = `${exactAmount.toLocaleString()} دج`;

    const elWords = document.getElementById('rcptAmountWords');
    if (elWords) elWords.textContent = convertAmountToArabicWords(exactAmount);

    const elCurrentBalance = document.getElementById('rcptCurrentBalance');
    if (elCurrentBalance) {
      const remainingSessions = (stu && stu.sessionsRemaining !== undefined) ? stu.sessionsRemaining : (payment.sessionsPurchased || 4);
      const balanceAmount = (stu && stu.balance !== undefined) ? stu.balance : exactAmount;
      elCurrentBalance.textContent = `${remainingSessions} حصص متاحة / ${Number(balanceAmount).toLocaleString()} دج`;
    }
    
    const elUser = document.getElementById('rcptUsername');
    if (elUser) elUser.textContent = username;

    const elPass = document.getElementById('rcptPassword');
    if (elPass) elPass.textContent = password;

    const studentIdForUrl = (stu && stu.id) || payment.studentId || 'STU-001';
    const portalUrl = `${window.location.origin}${window.location.pathname.replace('dashboard.html', 'parent.html')}?id=${studentIdForUrl}&u=${encodeURIComponent(username)}&p=${encodeURIComponent(password)}`;
    
    const qrImg = document.getElementById('rcptQrCode');
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=2&data=${encodeURIComponent(portalUrl)}`;
    }

    document.getElementById('receiptModal').classList.add('active');
  };

  window.triggerAppPrint = function() {
    if (window.electronAPI && window.electronAPI.printReceipt) {
      window.electronAPI.printReceipt({ id: currentActiveReceiptPaymentId });
      return;
    }

    window.open(`print-receipt.html?id=${encodeURIComponent(currentActiveReceiptPaymentId || '')}`, '_blank');
  };

  window.closeReceiptModal = function() {
    document.getElementById('receiptModal').classList.remove('active');
  };

  // --- STUDENT PROFILE MODAL ---
    // --- STUDENT PROFILE MODAL (ORGANIZED DOSSIER) ---
    // --- STUDENT PROFILE MODAL (HIGH-DENSITY ORGANIZED DOSSIER) ---
  function openStudentProfile(studentId) {
    const stu = getData('brainova_students').find(s => s.id === studentId);
    if (!stu) return;

    const allPayments = getData('brainova_payments');
    const payments = allPayments.filter(p => p.studentId === studentId);
    const attendance = getData('brainova_attendance').filter(a => a.studentId === studentId);

    const totalAtt = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const attRate = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 100;
    const balance = Number(stu.balance) || 0;
    const sessions = Number(stu.sessionsRemaining) || 0;

    const timeline = getStudentPaymentTimeline(studentId, stu, allPayments);

    // Sort attendance by date descending
    const sortedAttendance = [...attendance].sort((a, b) => {
      const dateA = parseBrainovaDate(a.date) || new Date(0);
      const dateB = parseBrainovaDate(b.date) || new Date(0);
      return dateB - dateA;
    });

    const content = document.getElementById('studentProfileContent');
    content.innerHTML = `
      <!-- Hero Top Banner -->
      <div class="profile-hero-card">
        <div class="profile-hero-left">
          <div class="profile-avatar-box">${stu.name.trim().charAt(0)}</div>
          <div>
            <div class="profile-name-title">${stu.name}</div>
            <div class="profile-tags-row">
              <span class="status-pill status-pill--active"><span class="pill-dot"></span> ${stu.group || 'الفوج أ'}</span>
              ${(stu.sessionTime || (stu.startTime ? (stu.startTime + ' - ' + (stu.endTime || '')) : '')) ? `<span class="status-pill" style="background:rgba(0,188,212,0.12); color:#00E5FF; border:1px solid rgba(0,188,212,0.3); font-weight:700;">🕒 توقيت الحصة: ${stu.sessionTime || (stu.startTime + ' - ' + (stu.endTime || ''))}</span>` : ''}
              <span class="status-pill" style="background:rgba(56,189,248,0.1); color:#38BDF8; border:1px solid rgba(56,189,248,0.25);">${stu.level || 'المستوى الأول'}</span>
              <span style="font-family:monospace; font-size:0.72rem; color:var(--color-text-dim); background:rgba(255,255,255,0.05); padding:1px 6px; border-radius:4px;">ID: ${stu.id}</span>
            </div>
          </div>
        </div>

        <div class="profile-hero-kpi">
          <span style="font-size:0.7rem; color:var(--color-text-dim); font-weight:600;">الرصيد المالي الحالي</span>
          <span class="profile-kpi-val" style="color:${balance < 0 ? '#EF4444' : '#10B981'};">${balance.toLocaleString()} دج</span>
          <span style="font-size:0.72rem; color:#38BDF8; font-weight:700;">${sessions} حصص متبقية</span>
        </div>
      </div>

      <!-- 1. Academic & Guardian Information -->
      <div class="profile-section-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        البيانات الشخصية وولي الأمر
      </div>
      <div class="profile-info-grid">
        <div class="profile-info-cell">
          <div class="profile-cell-lbl">ولي الأمر</div>
          <div class="profile-cell-val">${stu.parentName || 'غير مسجل'}</div>
        </div>
        <div class="profile-info-cell">
          <div class="profile-cell-lbl">رقم هاتف الولي</div>
          <div class="profile-cell-val">
            <a href="tel:${stu.parentPhone}" dir="ltr" style="color:#38BDF8; font-family:monospace;">${stu.parentPhone || '—'}</a>
          </div>
        </div>
        <div class="profile-info-cell">
          <div class="profile-cell-lbl">الأستاذ المؤطر</div>
          <div class="profile-cell-val">${stu.educator || 'عابد اسحاق تقي الدين'}</div>
        </div>
        <div class="profile-info-cell">
          <div class="profile-cell-lbl">نسبة الالتزام بالحضور</div>
          <div class="profile-cell-val" style="color:#10B981;">${attRate}% (${presentCount}/${totalAtt} حصة)</div>
        </div>
      </div>

      <!-- 2. MONTHLY PAYMENT & RENEWAL TRACKER -->
      <div class="profile-section-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        تتبع الاشتراك الشهري وتاريخ التسديد
        <span class="payment-badge ${timeline.badgeClass}" style="margin-right:auto; font-size:0.75rem;">${timeline.statusLabel}</span>
      </div>
      <div style="background:rgba(15,23,42,0.6); border:1px solid ${timeline.status === 'overdue' ? 'rgba(239,68,68,0.4)' : (timeline.status === 'due_soon' ? 'rgba(245,158,11,0.4)' : 'rgba(56,189,248,0.25)')}; border-radius:var(--radius-sm); padding:14px; margin-bottom:14px;">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:10px; margin-bottom:10px;">
          <div style="background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:0.7rem; color:var(--color-text-dim);">🕒 تاريخ آخر تسديد</div>
            <div style="font-size:0.85rem; font-weight:800; color:#F8FAFC; margin-top:2px;">${timeline.lastDateStr}</div>
          </div>

          <div style="background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:0.7rem; color:var(--color-text-dim);">⏳ المدة المنقضية</div>
            <div style="font-size:0.85rem; font-weight:800; color:#38BDF8; margin-top:2px;">${timeline.elapsedText}</div>
          </div>

          <div style="background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:0.7rem; color:var(--color-text-dim);">📅 موعد التجديد القادم</div>
            <div style="font-size:0.85rem; font-weight:800; color:${timeline.status === 'overdue' ? '#EF4444' : '#10B981'}; margin-top:2px;">${timeline.renewalDateStr}</div>
          </div>

          <div style="background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:0.7rem; color:var(--color-text-dim);">💰 آخر مبلغ سُدد</div>
            <div style="font-size:0.85rem; font-weight:800; color:#10B981; margin-top:2px;">${timeline.lastAmount > 0 ? timeline.lastAmount.toLocaleString() + ' دج' : '—'}</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-top:1px dashed rgba(255,255,255,0.1); padding-top:10px;">
          <div style="font-size:0.8rem; color:${timeline.status === 'overdue' ? '#F87171' : (timeline.status === 'due_soon' ? '#FBBF24' : '#34D399')}; font-weight:700;">
            📌 ${timeline.renewalSummary}
          </div>
          <button type="button" class="btn btn--primary btn--small" onclick="closeStudentProfileModal(); openRecordPaymentModal('${stu.id}')" style="font-size:0.75rem;">
            💳 تسجيل تجديد الاشتراك
          </button>
        </div>
      </div>

      <!-- 3. DETAILED SESSIONS ATTENDANCE LOG WITH DATES -->
      <div class="profile-section-heading" style="justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          سجل الحصص التي درسها التلميذ بالتاريخ
          <span class="status-pill" style="background:rgba(16,185,129,0.1); color:#10B981; border:1px solid rgba(16,185,129,0.25); font-size:0.72rem;">درس ${presentCount} حصص</span>
        </div>
        <button type="button" class="btn btn--primary btn--small" onclick="openAddStudentSessionModal('${stu.id}')" style="font-size:0.75rem; padding:4px 8px; background:#0284C7;">
          ➕ تسجيل حصة حضور بالتاريخ
        </button>
      </div>

      ${sortedAttendance.length === 0 ? `
        <div style="text-align:center; padding:18px; background:rgba(255,255,255,0.02); border:1px dashed var(--color-border); border-radius:8px; color:var(--color-text-dim); font-size:0.82rem; margin-bottom:14px;">
          لا توجد حصص مسجلة بعد لهذا التلميذ.
          <br>
          <button type="button" class="btn btn--outline btn--small" style="margin-top:8px;" onclick="openAddStudentSessionModal('${stu.id}')">
            ➕ تسجيل أول حصة بالتاريخ الآن
          </button>
        </div>
      ` : `
        <div style="max-height:220px; overflow-y:auto; border:1px solid var(--color-border); border-radius:8px; margin-bottom:14px;">
          <table style="width:100%; border-collapse:collapse; font-size:0.78rem; text-align:right;">
            <thead>
              <tr style="background:rgba(255,255,255,0.04); border-bottom:1px solid var(--color-border); color:#94A3B8;">
                <th style="padding:6px 8px; width:28px;">#</th>
                <th style="padding:6px 8px;">التاريخ واليوم</th>
                <th style="padding:6px 8px;">التوقيت والفوج</th>
                <th style="padding:6px 8px;">الحالة</th>
                <th style="padding:6px 8px;">موضوع الدرس / المشروع</th>
                <th style="padding:6px 8px; text-align:center;">علامة التسديد</th>
                <th style="padding:6px 8px; text-align:center; width:36px;">حذف</th>
              </tr>
            </thead>
            <tbody>
              ${sortedAttendance.map((att, idx) => {
                const dayName = getArabicDayName(att.date);
                let statusBadge = '';
                if (att.status === 'present') {
                  statusBadge = '<span style="color:#10B981; font-weight:700;">✅ حاضر</span>';
                } else if (att.status === 'late') {
                  statusBadge = '<span style="color:#F59E0B; font-weight:700;">⏳ متأخر</span>';
                } else {
                  statusBadge = '<span style="color:#EF4444; font-weight:700;">❌ غائب</span>';
                }

                // 1. Check if payment was made on this date
                const matchedPayment = payments.find(p => {
                  const pDate = parseBrainovaDate(p.date || p.paidAtIso);
                  const aDate = parseBrainovaDate(att.date);
                  return pDate && aDate && pDate.toDateString() === aDate.toDateString();
                });

                // 2. Next payment after this session date
                const attDateObj = parseBrainovaDate(att.date);
                const nextPayment = payments
                  .filter(p => {
                    const pDate = parseBrainovaDate(p.paidAtIso || p.date);
                    return pDate && attDateObj && (pDate.getTime() >= attDateObj.getTime());
                  })
                  .sort((a, b) => (parseBrainovaDate(a.date || a.paidAtIso) - parseBrainovaDate(b.date || b.paidAtIso)))[0];

                // 3. Format exact payment date and time string
                let exactTimeStr = '';
                if (att.paidAt) {
                  if (att.paidAt.includes('T')) {
                    const d = new Date(att.paidAt);
                    exactTimeStr = !isNaN(d.getTime())
                      ? d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                      : att.paidAt;
                  } else {
                    exactTimeStr = att.paidAt;
                  }
                }

                let paymentMarkerHtml = '';
                if (att.paidMarker === 'paid_next') {
                  const displayTime = exactTimeStr || (nextPayment ? (nextPayment.date || nextPayment.paidAtIso) : '') || (att.date ? att.date + ' • الحصة التالية' : '');
                  const receiptExtra = nextPayment ? `<span style="font-size:0.67rem; color:#94A3B8; display:block;">وصل #${nextPayment.opNumber || nextPayment.id} • ${Number(nextPayment.amountPaid).toLocaleString()} دج</span>` : '';

                  paymentMarkerHtml = `
                    <div style="display:inline-flex; flex-direction:column; align-items:center; gap:2px;">
                      <div style="display:inline-flex; align-items:center; gap:4px;">
                        <span class="payment-badge paid" style="background:rgba(16,185,129,0.2); border:1px solid #10B981; color:#34D399; font-weight:800; font-size:0.72rem; padding:2px 8px; border-radius:4px;" title="تم تسجيل أنه دفع في الحصة التالية">
                          💳 دفع في الحصة التالية
                        </span>
                        <button type="button" style="background:none; border:none; color:#94A3B8; cursor:pointer; font-size:0.75rem;" onclick="toggleSessionPaymentMarker('${att.id}', '${stu.id}')" title="تغيير علامة التسديد">
                          🔄
                        </button>
                      </div>
                      ${displayTime ? `<span style="font-size:0.69rem; color:#38BDF8; font-weight:700; font-family:monospace; direction:ltr; display:inline-block;" title="التاريخ والوقت الدقيق للدفع">🕒 ${displayTime}</span>` : ''}
                      ${receiptExtra}
                    </div>
                  `;
                } else if (att.paidMarker === 'paid_this' || matchedPayment) {
                  const displayTime = exactTimeStr || (matchedPayment ? (matchedPayment.date || matchedPayment.paidAtIso) : '') || att.date;
                  const amt = matchedPayment ? `<span style="font-size:0.67rem; color:#94A3B8; display:block;">وصل #${matchedPayment.opNumber || matchedPayment.id} • ${Number(matchedPayment.amountPaid).toLocaleString()} دج</span>` : '';

                  paymentMarkerHtml = `
                    <div style="display:inline-flex; flex-direction:column; align-items:center; gap:2px;">
                      <div style="display:inline-flex; align-items:center; gap:4px;">
                        <span class="payment-badge paid" style="background:rgba(56,189,248,0.2); border:1px solid #38BDF8; color:#38BDF8; font-weight:800; font-size:0.72rem; padding:2px 8px; border-radius:4px;" title="سدد في هذه الحصة">
                          💰 سدد في هذه الحصة
                        </span>
                        <button type="button" style="background:none; border:none; color:#94A3B8; cursor:pointer; font-size:0.75rem;" onclick="toggleSessionPaymentMarker('${att.id}', '${stu.id}')" title="تغيير علامة التسديد">
                          🔄
                        </button>
                      </div>
                      ${displayTime ? `<span style="font-size:0.69rem; color:#10B981; font-weight:700; font-family:monospace; direction:ltr; display:inline-block;" title="التاريخ والوقت الدقيق للدفع">🕒 ${displayTime}</span>` : ''}
                      ${amt}
                    </div>
                  `;
                } else {
                  paymentMarkerHtml = `
                    <button type="button" class="btn btn--outline btn--small" style="padding:1px 6px; font-size:0.68rem; color:#94A3B8; border-color:rgba(255,255,255,0.15);" onclick="toggleSessionPaymentMarker('${att.id}', '${stu.id}')" title="انقر لوضع علامة أنه دفع في الحصة التالية بالتاريخ والوقت">
                      + تحديد كـ دفع
                    </button>
                  `;
                }

                return `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.03); background:${idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'};">
                    <td style="padding:6px 8px; color:var(--color-text-dim); font-family:monospace;">${sortedAttendance.length - idx}</td>
                    <td style="padding:6px 8px; font-weight:700; color:#F1F5F9;">
                      ${dayName ? dayName + ' ' : ''}${att.date}
                    </td>
                    <td style="padding:6px 8px; color:#94A3B8;">
                      ${att.sessionTime || '—'} <span style="font-size:0.7rem; color:var(--color-primary);">(${att.groupName || stu.group || 'الفوج'})</span>
                    </td>
                    <td style="padding:6px 8px;">
                      ${statusBadge}
                    </td>
                    <td style="padding:6px 8px; color:#CBD5E1;">
                      ${att.note || 'حصة تدريبية'}
                    </td>
                    <td style="padding:6px 8px; text-align:center;">
                      ${paymentMarkerHtml}
                    </td>
                    <td style="padding:6px 8px; text-align:center;">
                      <button type="button" style="background:none; border:none; color:#EF4444; cursor:pointer; font-size:0.85rem;" title="حذف الحصة" onclick="deleteStudentSessionRecord('${att.id}', '${stu.id}')">
                        🗑️
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}

      <!-- 4. Recent Receipts History -->
      <div class="profile-section-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        سجل الوصولات المالية الصادرة (${payments.length})
      </div>
      ${payments.length === 0 ? '<div style="color:var(--color-text-dim); font-size:0.78rem; margin-bottom:14px;">لا توجد وصولات مسجلة بعد.</div>' : `
        <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:14px;">
          ${payments.slice(0, 4).map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:6px 10px; border-radius:6px; border:1px solid var(--color-border); font-size:0.8rem;">
              <div>
                <strong style="color:var(--color-primary); font-family:monospace;">#${p.opNumber || p.id}</strong> — ${p.date} (${Number(p.amountPaid).toLocaleString()} دج)
              </div>
              <button class="btn btn--outline btn--small" onclick="openReceiptModal('${p.id}')">🖨️ طباعة الوصل</button>
            </div>
          `).join('')}
        </div>
      `}

      <!-- 5. Educational Notes -->
      <div class="profile-section-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        ملاحظات وتوجيهات تربوية خاصة بالتلميذ
      </div>
      <div style="background:rgba(245,158,11,0.03); border:1px solid rgba(245,158,11,0.2); border-radius:var(--radius-sm); padding:12px; margin-bottom:14px;">
        <textarea id="profileStudentNote" rows="2" class="form-input" placeholder="اكتب الملاحظات التربوية للتلميذ وتطوره في الروبوتيك..." style="width:100%; resize:vertical; font-size:0.82rem; margin-bottom:6px;">${stu.teacherNote || ''}</textarea>
        <div style="display:flex; justify-content:flex-end;">
          <button type="button" class="btn btn--primary btn--small" onclick="saveStudentTeacherNote('${stu.id}')">
            💾 حفظ الملاحظة التربوية
          </button>
        </div>
      </div>

      <!-- Actions Footer -->
      <div class="modal__actions">
        <button type="button" class="btn btn--outline" onclick="closeStudentProfileModal()">إغلاق</button>
        <button type="button" class="btn btn--outline" onclick="closeStudentProfileModal(); openStudentIdCard('${stu.id}');">🪪 بطاقة التلميذ</button>
        <button type="button" class="btn btn--outline" style="color:#25D366; border-color:rgba(37,211,102,0.3);" onclick="closeStudentProfileModal(); openWhatsAppDispatchModal('${stu.id}');"> واتساب الولي</button>
        <button type="button" class="btn btn--primary" onclick="closeStudentProfileModal(); openRecordPaymentModal('${stu.id}');">+ تسجيل دفعة</button>
      </div>
    `;

    const modalEl = document.getElementById('studentProfileModal');
    if (modalEl) modalEl.classList.add('active');
  }
  window.openStudentProfile = openStudentProfile;

  function closeStudentProfileModal() {
    const modalEl = document.getElementById('studentProfileModal');
    if (modalEl) modalEl.classList.remove('active');
  }
  window.closeStudentProfileModal = closeStudentProfileModal;

  // --- INDIVIDUAL STUDENT SESSION HANDLERS ---
  function openAddStudentSessionModal(studentId) {
    const stu = getData('brainova_students').find(s => s.id === studentId);
    if (!stu) return;

    const idEl = document.getElementById('sessionStudentId');
    if (idEl) idEl.value = studentId;
    const nameEl = document.getElementById('sessionStudentNameDisplay');
    if (nameEl) nameEl.textContent = `التلميذ: ${stu.name} (${stu.id})`;
    const grpEl = document.getElementById('sessionStudentGroupDisplay');
    if (grpEl) grpEl.textContent = `الفوج: ${stu.group || 'غير محدد'} • المستوى: ${stu.level || 'المستوى الأول'}`;
    
    // Default date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('sessionDateInput');
    if (dateInput) dateInput.value = today;
    
    const timeInput = document.getElementById('sessionTimeInput');
    if (timeInput) timeInput.value = '09:00 - 11:00';
    const groupInput = document.getElementById('sessionGroupInput');
    if (groupInput) groupInput.value = stu.group || 'الفوج أ';
    const statusInput = document.getElementById('sessionStatusInput');
    if (statusInput) statusInput.value = 'present';
    const topicInput = document.getElementById('sessionTopicInput');
    if (topicInput) topicInput.value = '';
    const markerInput = document.getElementById('sessionPaymentMarkerInput');
    if (markerInput) markerInput.value = 'paid_next';

    const dtInput = document.getElementById('sessionPaymentDateTimeInput');
    if (dtInput) {
      const now = new Date();
      const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      dtInput.value = localIso;
    }

    const deductCb = document.getElementById('sessionDeductCheckbox');
    if (deductCb) deductCb.checked = true;

    const modal = document.getElementById('addStudentSessionModal');
    if (modal) modal.classList.add('active');
  }
  window.openAddStudentSessionModal = openAddStudentSessionModal;

  function closeAddStudentSessionModal() {
    const modal = document.getElementById('addStudentSessionModal');
    if (modal) modal.classList.remove('active');
  }
  window.closeAddStudentSessionModal = closeAddStudentSessionModal;

  window.handleSessionStatusChange = function() {
    const status = document.getElementById('sessionStatusInput').value;
    const deductCb = document.getElementById('sessionDeductCheckbox');
    if (status === 'absent') {
      deductCb.checked = false;
    } else {
      deductCb.checked = true;
    }
  };

  window.submitAddStudentSession = function(event) {
    event.preventDefault();
    const studentId = document.getElementById('sessionStudentId').value;
    const sessionDate = document.getElementById('sessionDateInput').value;
    const sessionTime = document.getElementById('sessionTimeInput').value;
    const sessionStatus = document.getElementById('sessionStatusInput').value;
    const groupName = document.getElementById('sessionGroupInput').value.trim() || 'الفوج أ';
    const topic = document.getElementById('sessionTopicInput').value.trim();
    const paidMarker = document.getElementById('sessionPaymentMarkerInput')?.value || '';
    const deductSession = document.getElementById('sessionDeductCheckbox').checked;

    if (!studentId || !sessionDate) {
      showToast('يرجى تحديد تاريخ الحصة!', 'error');
      return;
    }

    const students = getData('brainova_students');
    const stu = students.find(s => s.id === studentId);
    if (!stu) {
      showToast('لم يتم العثور على التلميذ!', 'error');
      return;
    }

    let paidAtValue = null;
    if (paidMarker) {
      const dtInput = document.getElementById('sessionPaymentDateTimeInput')?.value;
      if (dtInput) {
        const d = new Date(dtInput);
        paidAtValue = !isNaN(d.getTime())
          ? d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          : dtInput;
      } else {
        const now = new Date();
        paidAtValue = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }
    }

    let allAttendance = getData('brainova_attendance');
    const newRecord = {
      id: 'ATT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      date: sessionDate,
      groupName,
      sessionTime,
      studentId: stu.id,
      studentName: stu.name,
      status: sessionStatus,
      paidMarker: paidMarker || null,
      paidMarkerLabel: paidMarker === 'paid_next' ? 'دفع في الحصة التالية' : (paidMarker === 'paid_this' ? 'سدد في هذه الحصة' : null),
      paidAt: paidAtValue,
      note: topic || (sessionStatus === 'present' ? 'حصة تدريبية مكتملة' : (sessionStatus === 'late' ? 'حضور متأخر' : 'غياب'))
    };

    allAttendance.unshift(newRecord);

    if (sessionStatus === 'present' || sessionStatus === 'late') {
      stu.lastAttendance = `${sessionDate} (${sessionTime})`;
      if (deductSession && (stu.sessionsRemaining || 0) > 0) {
        stu.sessionsRemaining = Math.max(0, stu.sessionsRemaining - 1);
      }
    }

    saveData('brainova_attendance', allAttendance);
    saveData('brainova_students', students);

    // Zero-click WhatsApp Bot Trigger for late / absent
    if (sessionStatus === 'late' || sessionStatus === 'absent') {
      triggerAutoAttendanceWhatsApp(stu, sessionStatus, sessionTime, sessionDate);
    }

    closeAddStudentSessionModal();
    const timeFeedback = paidAtValue ? ` • التسديد: ${paidAtValue}` : '';
    showToast(`✅ تم تسجيل الحصة بالتاريخ (${sessionDate})${timeFeedback} بنجاح!`, 'success');

    // Refresh profile modal and active views
    openStudentProfile(studentId);
    renderActiveView();
  };

  function toggleSessionPaymentMarker(attendanceId, studentId) {
    let allAttendance = getData('brainova_attendance');
    const att = allAttendance.find(a => a.id === attendanceId);
    if (!att) return;

    const now = new Date();
    const currentDateTimeStr = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    if (att.paidMarker === 'paid_next') {
      att.paidMarker = 'paid_this';
      att.paidMarkerLabel = 'سدد في هذه الحصة';
      att.paidAt = currentDateTimeStr;
      showToast(`✅ تم التغيير إلى: سدد في هذه الحصة (${currentDateTimeStr})`, 'success');
    } else if (att.paidMarker === 'paid_this') {
      att.paidMarker = null;
      att.paidMarkerLabel = null;
      att.paidAt = null;
      showToast('تمت إزالة علامة التسديد', 'info');
    } else {
      att.paidMarker = 'paid_next';
      att.paidMarkerLabel = 'دفع في الحصة التالية';
      att.paidAt = currentDateTimeStr;
      showToast(`✅ تم وضع علامة: دفع في الحصة التالية (${currentDateTimeStr})`, 'success');
    }

    saveData('brainova_attendance', allAttendance);
    openStudentProfile(studentId);
  }
  window.toggleSessionPaymentMarker = toggleSessionPaymentMarker;

  window.deleteStudentSessionRecord = function(attendanceId, studentId) {
    if (!confirm('هل أنت متأكد من حذف هذه الحصة من سجل التلميذ؟')) return;

    let allAttendance = getData('brainova_attendance');
    const record = allAttendance.find(a => a.id === attendanceId);
    if (!record) return;

    allAttendance = allAttendance.filter(a => a.id !== attendanceId);
    saveData('brainova_attendance', allAttendance);

    const students = getData('brainova_students');
    const stu = students.find(s => s.id === studentId);
    if (stu && (record.status === 'present' || record.status === 'late')) {
      stu.sessionsRemaining = (stu.sessionsRemaining || 0) + 1;
      saveData('brainova_students', students);
    }

    showToast('تم حذف الحصة واسترجاع الرصيد بنجاح!', 'success');
    openStudentProfile(studentId);
    renderActiveView();
  };

  // Save Teacher Note to Student for Parent Portal
  window.saveStudentTeacherNote = function(studentId) {
    const noteEl = document.getElementById('profileStudentNote');
    if (!noteEl) return;
    const noteText = noteEl.value.trim();

    const students = getData('brainova_students');
    const stu = students.find(s => s.id === studentId);
    if (!stu) {
      showToast('لم يتم العثور على بيانات الطالب!', 'error');
      return;
    }

    const nowStr = new Date().toLocaleDateString('ar-DZ') + ' ' + new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
    stu.teacherNote = noteText;
    stu.teacherNoteDate = nowStr;

    if (!Array.isArray(stu.teacherNotesHistory)) stu.teacherNotesHistory = [];
    if (noteText) {
      stu.teacherNotesHistory.unshift({
        text: noteText,
        date: nowStr,
        author: 'الأستاذ المشرف'
      });
    }

    saveData('brainova_students', students);
    showToast('✅ تم حفظ الملاحظة ونشرها في بوابة الولي بنجاح!', 'success');
    renderActiveView();
  };

  // Quick Note Modal Handlers
  let activeQuickNoteStudentId = null;

  window.openStudentNoteModal = function(studentId) {
    const stu = getData('brainova_students').find(s => s.id === studentId);
    if (!stu) {
      showToast('لم يتم العثور على بيانات الطالب!', 'error');
      return;
    }

    activeQuickNoteStudentId = studentId;
    document.getElementById('quickNoteStudentName').textContent = stu.name;
    document.getElementById('quickNoteStudentMeta').textContent = `${stu.group || 'بدون فوج'} • ${stu.level} • ولي الأمر: ${stu.parentName || 'غير مسجل'}`;
    document.getElementById('quickNoteText').value = stu.teacherNote || '';

    document.getElementById('quickNoteModal').classList.add('active');
  };

  window.closeQuickNoteModal = function() {
    document.getElementById('quickNoteModal').classList.remove('active');
    activeQuickNoteStudentId = null;
  };

  window.submitQuickNote = function() {
    if (!activeQuickNoteStudentId) return;
    const noteText = document.getElementById('quickNoteText').value.trim();

    const students = getData('brainova_students');
    const stu = students.find(s => s.id === activeQuickNoteStudentId);
    if (!stu) return;

    const nowStr = new Date().toLocaleDateString('ar-DZ') + ' ' + new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });
    stu.teacherNote = noteText;
    stu.teacherNoteDate = nowStr;

    if (!Array.isArray(stu.teacherNotesHistory)) stu.teacherNotesHistory = [];
    if (noteText) {
      stu.teacherNotesHistory.unshift({
        text: noteText,
        date: nowStr,
        author: 'الأستاذ المشرف'
      });
    }

    saveData('brainova_students', students);
    closeQuickNoteModal();
    showToast('✅ تم حفظ الملاحظة ونشرها في بوابة الولي بنجاح!', 'success');
    renderActiveView();
  };

  // --- STUDENT ID BADGE CARD GENERATOR ---
    window.openStudentIdCard = function(studentId) {
    const stu = getData('brainova_students').find(s => s.id === studentId);
    if (!stu) {
      showToast('لم يتم العثور على بيانات الطالب!', 'error');
      return;
    }

    const initial = stu.name.trim().charAt(0);
    const avatarEl = document.getElementById('idCardAvatarInitial');
    if (avatarEl) avatarEl.textContent = initial;
    document.getElementById('idCardStudentName').textContent = stu.name;
    document.getElementById('idCardLevel').textContent = stu.level || 'المستوى الأول: التفكير المنطقي';
    document.getElementById('idCardGroup').textContent = stu.group || 'الفوج أ';
    document.getElementById('idCardStudentId').textContent = `${stu.id}`;

    const portalUrl = `${window.location.origin}${window.location.pathname.replace('dashboard.html', 'parent.html')}?id=${stu.id}&u=${encodeURIComponent(stu.username || '')}&p=${encodeURIComponent(stu.password || '')}`;
    const qrImg = document.getElementById('idCardQrCode');
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=2&data=${encodeURIComponent(portalUrl)}`;
    }

    document.getElementById('studentIdCardModal').classList.add('active');
  };

  window.closeStudentIdCardModal = function() {
    document.getElementById('studentIdCardModal').classList.remove('active');
  };

    // --- REAL-TIME CAMERA ATTENDANCE SCANNER ENGINE ---
  let qrMediaStream = null;
  let qrScanInterval = null;
  let audioCtx = null;

  function playSuccessBeep() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High chime A5
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.12); // Chime up to A6
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch (e) {
      console.log('Audio beep notice:', e);
    }
  }

  window.openQrScannerModal = function() {
    const modal = document.getElementById('qrScannerModal');
    if (!modal) return;
    modal.classList.add('active');
    document.getElementById('qrScanResultBanner').style.display = 'none';
    document.getElementById('manualQrInput').value = '';

    const video = document.getElementById('qrScannerVideo');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && video) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } })
        .then(stream => {
          qrMediaStream = stream;
          video.srcObject = stream;
          startLiveDetectionLoop(video);
        })
        .catch(err => {
          console.warn("Camera access not available or blocked:", err);
          showToast('الكاميرا غير متصلة أو تم حظر الإذن. يمكنك استخدام الإدخال اليدوي أو قارئ USB.', 'error');
        });
    }
  };

  function startLiveDetectionLoop(video) {
    if (!('BarcodeDetector' in window)) {
      console.log('Native BarcodeDetector not available, relying on manual input / USB barcode.');
      return;
    }

    const barcodeDetector = new BarcodeDetector({ formats: ['qr_code', 'code_128', 'ean_13', 'code_39'] });
    let isProcessing = false;

    qrScanInterval = setInterval(async () => {
      if (isProcessing || video.readyState !== video.HAVE_ENOUGH_DATA) return;
      isProcessing = true;
      try {
        const barcodes = await barcodeDetector.detect(video);
        if (barcodes && barcodes.length > 0) {
          const code = barcodes[0].rawValue;
          if (code) {
            processScannedCode(code);
            // Throttle detection to avoid double scan
            await new Promise(r => setTimeout(r, 1800));
          }
        }
      } catch (err) {
        // Frame skipped
      } finally {
        isProcessing = false;
      }
    }, 150);
  }

  window.closeQrScannerModal = function() {
    const modal = document.getElementById('qrScannerModal');
    if (modal) modal.classList.remove('active');
    if (qrScanInterval) {
      clearInterval(qrScanInterval);
      qrScanInterval = null;
    }
    if (qrMediaStream) {
      qrMediaStream.getTracks().forEach(track => track.stop());
      qrMediaStream = null;
    }
  };

  window.handleManualQrSubmit = function() {
    const input = document.getElementById('manualQrInput');
    const val = input.value.trim();
    if (!val) return;
    processScannedCode(val);
    input.value = '';
  };

  function processScannedCode(scannedText) {
    const students = getData('brainova_students');
    let matchedStudent = null;

    // Search by ID param in URL (e.g. ?id=STU-001)
    if (scannedText.includes('id=')) {
      const match = scannedText.match(/id=([^&]+)/);
      if (match) {
        matchedStudent = students.find(s => String(s.id) === String(match[1]));
      }
    }

    if (!matchedStudent) {
      const cleanCode = scannedText.replace('#', '').trim();
      matchedStudent = students.find(s => 
        String(s.id).toLowerCase() === cleanCode.toLowerCase() || 
        s.name.includes(cleanCode) || 
        s.username === cleanCode
      );
    }

    if (!matchedStudent) {
      showToast('⚠️ لم يتم العثور على طالب مطابق لهذا الرمز!', 'error');
      return;
    }

    // Play audible feedback chime
    playSuccessBeep();

    // Mark present in attendance draft
    setAttendanceStatus(matchedStudent.id, 'present');

    // Show instant feedback card in Kiosk
    const banner = document.getElementById('qrScanResultBanner');
    const avatarEl = document.getElementById('qrScannedAvatar');
    const nameEl = document.getElementById('qrScannedStudentName');
    const detEl = document.getElementById('qrScannedDetails');

    if (banner && nameEl && detEl) {
      if (avatarEl) avatarEl.textContent = matchedStudent.name.trim().charAt(0);
      nameEl.textContent = matchedStudent.name;
      detEl.textContent = `الفوج: ${matchedStudent.group || 'غير محدد'} • الحصص المتبقية: ${matchedStudent.sessionsRemaining || 0}`;
      banner.style.display = 'block';
    }

    showToast(`🟢 تم تسجيل حضور الطالب: ${matchedStudent.name}`, 'success');
  }

  // --- 1-CLICK WHATSAPP DISPATCH SYSTEM ---
  let currentWaStudent = null;

  window.openWhatsAppDispatchModal = function(studentId, templateType = 'reminder') {
    const stu = getData('brainova_students').find(s => s.id === studentId);
    if (!stu) {
      showToast('لم يتم العثور على بيانات الطالب!', 'error');
      return;
    }

    currentWaStudent = stu;
    document.getElementById('waStudentNameDisplay').textContent = `الطالب: ${stu.name} (${stu.group || 'بدون فوج'})`;
    document.getElementById('waParentPhoneDisplay').textContent = stu.parentPhone || '0791 19 46 33';

    selectWaTemplate(templateType);
    document.getElementById('whatsappDispatchModal').classList.add('active');
  };

  window.closeWhatsAppDispatchModal = function() {
    document.getElementById('whatsappDispatchModal').classList.remove('active');
    currentWaStudent = null;
  };

  window.selectWaTemplate = function(type) {
    if (!currentWaStudent) return;
    const txtArea = document.getElementById('waMessageContent');
    const stu = currentWaStudent;

    if (type === 'reminder') {
      txtArea.value = `السلام عليكم ورحمة الله، ولي أمر الطالب (${stu.name}) المحترم 
نود تذكيركم بموعد حصة الروبوتيك القادمة لفوج (${stu.group || 'الروبوتيك'}) في مقر مدرسة Brainova Robotics.
نتمنى لبطلنا الصغير دوام التألق والنشاط! 🚀`;
    } else if (type === 'renewal') {
      txtArea.value = `السلام عليكم ورحمة الله، ولي أمر الطالب (${stu.name}) 💳
نحيطكم علماً بأن رصيد الحصص المتبقي لابنكم هو (${stu.sessionsRemaining || 0} حصص).
يرجى تجديد الاشتراك الشهري لمواصلة رحلة التدريب والمشاريع المبتكرة في النادي.
شكراً لثقتكم بمدرسة Brainova Robotics ✨`;
    } else if (type === 'kudos') {
      txtArea.value = `مرحباً ولي أمر الطالب (${stu.name}) 🌟
يسعدنا إعلامكم بالأداء المتميز والإبداع الكبير الذي أظهره بطلنا الصغير في ورشة الروبوتيك اليوم ونجاحه في إتمام مشروعه الميكانيكي والبرمجي!
فخورون بإنجازاته وبمشاركته معنا في مدرسة Brainova Robotics 👏`;
    }
  };

  window.executeWhatsAppDispatch = function(e) {
    e.preventDefault();
    if (!currentWaStudent) return;

    let phone = (currentWaStudent.parentPhone || '0791194633').replace(/\s+/g, '').replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '213' + phone.substring(1);
    } else if (!phone.startsWith('213')) {
      phone = '213' + phone;
    }

    const message = encodeURIComponent(document.getElementById('waMessageContent').value);
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, '_blank');
    closeWhatsAppDispatchModal();
    showToast('تم فتح محادثة الواتساب بنجاح!', 'success');
  };

  // --- REGISTRATIONS LOGIC ---
  function renderRegistrationsView() {
    const regs = filterData(getData('brainova_registrations'), searchQuery);
    renderRegistrationsTable(regs, 'allRegistrationsTableBody', true);
  }

    function renderRegistrationsTable(data, tableBodyId, showId = true) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;
    
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 22px; color:var(--color-text-dim);">لا توجد طلبات تسجيل معلقة حالياً.</td></tr>`;
      return;
    }
    
    tbody.innerHTML = data.map((reg) => {
      let actionsHTML = '';
      const regIdStr = String(reg.id);

      if (reg.status === 'pending') {
        actionsHTML = `
          <div style="display:inline-flex; gap:5px; align-items:center;">
            <button class="btn btn--small" style="background:#10B981; color:#fff; font-weight:700; padding:4px 9px;" onclick="acceptRegistration('${regIdStr}')" title="قبول الطلب وتفعيل التلميذ">قبول</button>
            <button class="btn btn--outline btn--small" style="padding:4px 8px;" onclick="openRegistrationDetails('${regIdStr}')" title="عرض التفاصيل">تفاصيل</button>
            <button class="btn btn--small" style="background:#25D366; color:#fff; padding:4px 8px;" onclick="openRegistrationWhatsApp('${regIdStr}')" title="مراسلة عبر واتساب">واتساب</button>
            <button class="btn btn--outline btn--small" style="border-color:rgba(239,68,68,0.4); color:#F87171; padding:4px 8px;" onclick="rejectRegistration('${regIdStr}')" title="رفض الطلب">رفض</button>
          </div>
        `;
      } else {
        actionsHTML = `
          <div style="display:inline-flex; gap:5px; align-items:center;">
            <button class="btn btn--outline btn--small" style="padding:4px 8px;" onclick="openRegistrationDetails('${regIdStr}')" title="عرض التفاصيل">تفاصيل</button>
            <button class="btn btn--small" style="background:#25D366; color:#fff; padding:4px 8px;" onclick="openRegistrationWhatsApp('${regIdStr}')" title="مراسلة عبر واتساب">واتساب</button>
            <button class="btn-icon" style="color:#F87171; border:none; padding:4px;" title="حذف" onclick="deleteRegistration('${regIdStr}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        `;
      }

      let statusBadge = '';
      if (reg.status === 'active') {
        statusBadge = '<span class="status-pill status-pill--active"><span class="pill-dot"></span> مقبول ومسجل</span>';
      } else if (reg.status === 'pending') {
        statusBadge = '<span class="status-pill status-pill--pending"><span class="pill-dot"></span> قيد المراجعة</span>';
      } else {
        statusBadge = '<span class="status-pill status-pill--rejected"><span class="pill-dot"></span> مرفوض</span>';
      }

      return `
        <tr>
          ${showId ? `<td><span style="font-family:monospace; color:var(--color-primary); font-weight:700;">${reg.id}</span></td>` : ''}
          <td>
            <div style="font-weight:700; color:#F8FAFC;">${reg.studentName}</div>
            <div style="color:var(--color-primary); font-size:0.75rem; margin-top:2px;">${reg.preferredLevel || 'المستوى الأول'}</div>
          </td>
          <td>
            <div style="color:#F1F5F9; font-weight:600;">${reg.parentName}</div>
          </td>
          <td>
            <a href="tel:${reg.parentPhone}" dir="ltr" style="color:#38BDF8; font-family:monospace; font-weight:600; font-size:0.84rem;">${reg.parentPhone}</a>
          </td>
          <td>
            <span style="font-size:0.78rem; color:var(--color-text-muted); font-family:monospace;">${reg.date || 'اليوم'}</span>
          </td>
          <td>${statusBadge}</td>
          <td style="text-align:center;">${actionsHTML}</td>
        </tr>
      `;
    }).join('');
  }

  // Registration Details Modal
  window.openRegistrationDetails = function(id) {
    const regs = getData('brainova_registrations');
    const reg = regs.find(r => String(r.id) === String(id));
    if (!reg) return;

    const modal = document.getElementById('regDetailsModal');
    const body = document.getElementById('regDetailsModalBody');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; background:var(--color-bg-darker); padding:12px 16px; border-radius:10px; border:1px solid var(--color-border); margin-bottom:16px;">
        <div style="font-size:2.2rem;"></div>
        <div style="flex:1;">
          <h3 style="margin:0; font-size:1.2rem; color:#fff;">${reg.studentName}</h3>
          <div style="color:var(--color-primary); font-weight:700; font-size:0.88rem;">${reg.preferredLevel || 'المستوى المقترح'}</div>
          <div style="font-size:0.75rem; color:var(--color-text-muted); margin-top:2px;">رقم الطلب: <code style="color:var(--color-accent); font-family:monospace;">${reg.id}</code></div>
        </div>
        <span class="status-badge ${reg.status === 'active' ? 'status-badge--active' : (reg.status === 'pending' ? 'status-badge--pending' : 'status-badge--rejected')}">
          ${reg.status === 'active' ? 'مقبول ومسجل' : (reg.status === 'pending' ? 'قيد المراجعة' : 'مرفوض')}
        </span>
      </div>

      <div class="profile-card-grid" style="margin-bottom:16px;">
        <div class="profile-card">
          <div class="profile-card__label">ولي الأمر</div>
          <div class="profile-card__value">${reg.parentName}</div>
        </div>
        <div class="profile-card">
          <div class="profile-card__label">رقم الهاتف</div>
          <div class="profile-card__value"><a href="tel:${reg.parentPhone}" dir="ltr" style="color:var(--color-primary); font-weight:700;">${reg.parentPhone}</a></div>
        </div>
        <div class="profile-card">
          <div class="profile-card__label">البريد الإلكتروني</div>
          <div class="profile-card__value">${reg.parentEmail || 'غير مدخل'}</div>
        </div>
        <div class="profile-card">
          <div class="profile-card__label">عمر الطالب والصف</div>
          <div class="profile-card__value">${reg.studentAge || '—'} ${reg.studentGrade ? `(${reg.studentGrade})` : ''}</div>
        </div>
        <div class="profile-card">
          <div class="profile-card__label">الخبرة السابقة</div>
          <div class="profile-card__value">${reg.experience || 'لا توجد'}</div>
        </div>
        <div class="profile-card">
          <div class="profile-card__label">الحصة المفضلة</div>
          <div class="profile-card__value">${reg.schedule || 'حصة اعتيادية'}</div>
        </div>
      </div>

      ${reg.notes ? `
        <div style="background:rgba(255,215,0,0.08); border:1px solid rgba(255,215,0,0.25); border-radius:10px; padding:12px 16px; margin-bottom:16px;">
          <div style="font-size:0.82rem; color:var(--gold); font-weight:700; margin-bottom:4px;"> ملاحظات واستفسارات الولي:</div>
          <div style="font-size:0.9rem; color:#F8FAFC; line-height:1.6;">${reg.notes}</div>
        </div>
      ` : ''}

      <div style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom:16px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;">
        <span>📅 تاريخ الإرسال: <strong style="color:#cbd5e1;">${reg.date || 'اليوم'}</strong></span>
        <span>🏷️ المصدر: <strong style="color:var(--color-accent);">${reg.source || 'الموقع الرئيسي'}</strong></span>
      </div>

      <div class="modal__actions" style="display:flex; gap:8px; flex-wrap:wrap;">
        <button type="button" class="btn btn--outline" onclick="closeRegistrationDetailsModal()">إغلاق</button>
        ${reg.status === 'pending' ? `
          <button type="button" class="btn btn--primary" style="background:#10B981;" onclick="acceptRegistration('${reg.id}'); closeRegistrationDetailsModal();">✅ قبول وتفعيل الطالب</button>
          <button type="button" class="btn btn--outline" style="border-color:#EF4444; color:#EF4444;" onclick="rejectRegistration('${reg.id}'); closeRegistrationDetailsModal();">❌ رفض الطلب</button>
        ` : ''}
        <button type="button" class="btn" style="background:#25D366; color:#fff;" onclick="openRegistrationWhatsApp('${reg.id}')"> مراسلة الولي عبر واتساب</button>
        <button type="button" class="btn-icon" style="color:#ef4444; border:none;" onclick="deleteRegistration('${reg.id}'); closeRegistrationDetailsModal();" title="حذف الطلب">حذف</button>
      </div>
    `;

    modal.classList.add('active');
  };

  window.closeRegistrationDetailsModal = function() {
    const modal = document.getElementById('regDetailsModal');
    if (modal) modal.classList.remove('active');
  };

  // Open WhatsApp with direct registration response
  window.openRegistrationWhatsApp = function(id) {
    const regs = getData('brainova_registrations');
    const reg = regs.find(r => String(r.id) === String(id));
    if (!reg) return;

    const phoneClean = (reg.parentPhone || '').replace(/\D/g, '');
    const phoneIntl = phoneClean.startsWith('0') ? '213' + phoneClean.slice(1) : (phoneClean.startsWith('213') ? phoneClean : '213' + phoneClean);
    const msg = encodeURIComponent(`مرحباً أستاذ/ة (${reg.parentName})، معكم إدارة مدرسة Brainova Robotics بخصوص طلب تسجيل ابنكم/ابنتكم (${reg.studentName}) في دورات الروبوتيك والذكاء الاصطناعي...`);
    
    window.open(`https://wa.me/${phoneIntl}?text=${msg}`, '_blank');
  };

  // Delete registration
  window.deleteRegistration = function(id) {
    if (confirm('هل أنت متأكد من حذف هذا التسجيل؟')) {
      const regs = getData('brainova_registrations').filter(r => String(r.id) !== String(id));
      saveData('brainova_registrations', regs);
      showToast('تم حذف الطلب بنجاح!', 'success');
      updateHeaderBadges();
      renderActiveView();
    }
  };

  // Accept Registration
  window.acceptRegistration = function(id) {
    const regs = getData('brainova_registrations');
    const index = regs.findIndex(r => String(r.id) === String(id));
    if (index === -1) return;
    
    regs[index].status = 'active';
    saveData('brainova_registrations', regs);

    const students = getData('brainova_students');
    const existing = students.find(s => s.name === regs[index].studentName || (s.parentPhone && s.parentPhone === regs[index].parentPhone));
    
    if (!existing) {
      const newStudentId = "STU-" + String(students.length + 1).padStart(3, '0');
      const planStr = regs[index].pricingPlan || '';
      const monthlyFee = planStr.includes('8000') ? 8000 : (planStr.includes('11000') ? 11000 : 5000);
      const newStudent = {
        id: newStudentId,
        name: regs[index].studentName,
        parentName: regs[index].parentName || "—",
        parentPhone: regs[index].parentPhone || "—",
        group: regs[index].group || regs[index].preferredGroup || "الفوج أ (السبت)",
        level: regs[index].preferredLevel || "المستوى الأول: Explorer",
        username: generateRandomCode(8),
        password: generateRandomCode(8),
        monthlyFee: monthlyFee,
        plan: planStr || 'طفل واحد (5,000 دج)',
        balance: 0,
        sessionsRemaining: 4,
        lastAttendance: "جديد",
        joinDate: new Date().toISOString().split('T')[0]
      };
      students.push(newStudent);
      saveData('brainova_students', students);
    }

    showToast(' تم قبول طلب التسجيل وتفعيل حساب الطالب بنجاح!', 'success');
    updateHeaderBadges();
    renderActiveView();
  };

  // Reject Registration
  window.rejectRegistration = function(id) {
    const regs = getData('brainova_registrations');
    const index = regs.findIndex(r => String(r.id) === String(id));
    if (index === -1) return;
    
    regs[index].status = 'rejected';
    saveData('brainova_registrations', regs);

    showToast('تم رفض طلب التسجيل.', 'error');
    updateHeaderBadges();
    renderActiveView();
  };

  // --- EDUCATORS ---
  function renderEducators() {
    const educators = filterData(getData('brainova_educators'), searchQuery);
    const tbody = document.getElementById('educatorsTableBody');
    if (!tbody) return;
    
    if (educators.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color:var(--color-text-muted);">لا توجد بيانات (No data)</td></tr>`;
      return;
    }
    
    tbody.innerHTML = educators.map(edu => {
      const groupCount = getData('brainova_groups').filter(g => g.educatorId === edu.id).length;
      return `
        <tr>
          <td><strong>${edu.name}</strong></td>
          <td>${edu.specialty}</td>
          <td><span style="font-weight:700; color:var(--color-primary);">${groupCount} أفواج</span></td>
          <td dir="ltr" style="text-align: right;"><a href="tel:${edu.phone}" style="color:var(--color-primary);">${edu.phone}</a></td>
          <td><button class="btn btn--outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="deleteEducator('${edu.id}')">حذف</button></td>
        </tr>
      `;
    }).join('');
  }

  // --- GROUPS (WITH AGE CATEGORIES & ROOM ASSIGNMENTS) ---
      function renderGroups() {
    const grid = document.getElementById('groupsGrid');
    if (!grid) return;

    const groups = getData('brainova_groups');
    const students = getData('brainova_students');
    const filter = document.getElementById('groupAgeFilter') ? document.getElementById('groupAgeFilter').value : 'all';

    let filtered = groups;
    if (filter !== 'all') {
      filtered = groups.filter(g => (g.ageCategory || '').includes(filter));
    }

    grid.innerHTML = filtered.map(g => {
      const studentCount = students.filter(s => s.group === g.name || (s.group && s.group.includes(g.name))).length;
      const schedules = getData('brainova_schedule') || [];
      const sch = schedules.find(s => s.groupId === g.id || s.groupName === g.name || (s.groupName && s.groupName.includes(g.name)));
      const dayStr = sch ? sch.day : (g.day || 'السبت');
      const timeSlot = sch ? `${sch.startTime} - ${sch.endTime}` : (g.timeSlot || '14:00 - 16:00');

      return `
        <div class="stat-card" style="padding: 16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight:800; color:#fff; margin-bottom:2px;">${g.name}</h3>
              <span style="font-size: 0.75rem; color:var(--color-primary); font-weight:700;">${g.level}</span>
            </div>
            <button class="btn-icon" style="color:var(--color-danger); border:none;" onclick="deleteGroup('${g.id}')" title="حذف">حذف</button>
          </div>
          <div style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom:6px;">
            <span> الفئة: <strong>${g.ageCategory || '8 - 11 سنة (ناشئين)'}</strong></span>
          </div>
          <div style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom:6px;">
            <span> القاعة: <strong>${g.room || 'قاعة Brainova'}</strong></span>
          </div>
          <div style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom:6px;">
            <span> الأستاذ: <strong>${g.educator || 'عابد اسحاق تقي الدين'}</strong></span>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.78rem; color:var(--color-text-muted); margin-bottom:12px; background:rgba(255,255,255,0.03); padding:6px 10px; border-radius:var(--radius-sm); border:1px solid var(--color-border);">
            <span>التوقيت الأسبوعي</span>
            <span style="color:var(--color-text); font-weight:700; font-family:monospace;">${dayStr} • ${timeSlot}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--color-border); padding-top: 8px; gap:6px; flex-wrap:wrap;">
            <span style="font-size:0.78rem; color:var(--color-text-muted);">الطلاب: <strong style="color:var(--color-text);">${studentCount} / ${g.maxStudents || 12}</strong></span>
            <div style="display:inline-flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn btn--primary btn--small" style="font-size:0.75rem; padding:5px 10px;" onclick="openQuickGroupAttendanceModal('${encodeURIComponent(g.name)}')">تسجيل الحضور</button>
              <button type="button" class="btn btn--outline btn--small" style="font-size:0.75rem; padding:5px 10px;" onclick="printGroupMonthlyAttendanceSheet('${encodeURIComponent(g.name)}')">طباعة القائمة</button>
              <button type="button" class="btn btn--outline btn--small" style="font-size:0.75rem; padding:5px 10px;" onclick="openGroupStudentsModal('${encodeURIComponent(g.name)}')">الطلاب (${studentCount})</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  window.renderGroups = renderGroups;

  // Navigation shortcuts to Attendance
  window.openAttendanceForGroup = function(encodedGroupName) {
    const groupName = decodeURIComponent(encodedGroupName);
    const navBtn = document.querySelector('[data-view="attendance"]');
    if (navBtn) navBtn.click();

    setTimeout(() => {
      const groupSelect = document.getElementById('attGroupSelect');
      if (groupSelect) {
        groupSelect.value = groupName;
        renderAttendance();
        showToast(`تم فتح شاشة الحضور لفوج (${groupName}) 📝`, 'info');
      }
    }, 100);
  };

  window.openAttendanceForSession = function(encodedGroupName, timeSlot) {
    const groupName = decodeURIComponent(encodedGroupName);
    const navBtn = document.querySelector('[data-view="attendance"]');
    if (navBtn) navBtn.click();

    setTimeout(() => {
      const groupSelect = document.getElementById('attGroupSelect');
      if (groupSelect) groupSelect.value = groupName;

      const timeSelect = document.getElementById('attSessionTimeSelect');
      if (timeSelect && timeSlot) {
        let matched = false;
        for (let opt of timeSelect.options) {
          if (opt.value.includes(timeSlot) || timeSlot.includes(opt.value)) {
            timeSelect.value = opt.value;
            matched = true;
            break;
          }
        }
        if (!matched) {
          const newOpt = new Option(timeSlot, timeSlot, true, true);
          timeSelect.add(newOpt);
        }
      }

      renderAttendance();
      showToast(`تم فتح سجل الحضور لحصة ${groupName} بتوقيت (${timeSlot}) 📝`, 'success');
    }, 100);
  };

  // --- GROUP STUDENTS ROSTER MODAL LOGIC ---
  window.__currentRosterGroupName = '';

  window.openGroupStudentsModal = function(encodedGroupName) {
    const groupName = decodeURIComponent(encodedGroupName);
    window.__currentRosterGroupName = groupName;

    const groups = getData('brainova_groups');
    const group = groups.find(g => g.name === groupName) || { name: groupName, educator: 'عابد اسحاق تقي الدين', room: 'قاعة Brainova', ageCategory: 'جميع الفئات' };
    const allStudents = getData('brainova_students');
    const groupStudents = allStudents.filter(s => s.group === groupName || (s.group && s.group.includes(groupName)));

    const titleEl = document.getElementById('groupRosterTitle');
    if (titleEl) titleEl.textContent = `طلاب ${group.name} (${groupStudents.length} تلميذ)`;

    const subEl = document.getElementById('groupRosterSubtitle');
    if (subEl) subEl.textContent = `المستوى: ${group.level || 'دورة الروبوتيك'} • الطاقة الاستيعابية: ${groupStudents.length} / ${group.maxStudents || 12}`;

    const eduEl = document.getElementById('groupRosterEducator');
    if (eduEl) eduEl.textContent = group.educator || 'عابد اسحاق تقي الدين';

    const roomEl = document.getElementById('groupRosterRoom');
    if (roomEl) roomEl.textContent = group.room || 'قاعة Brainova';

    const ageEl = document.getElementById('groupRosterAge');
    if (ageEl) ageEl.textContent = group.ageCategory || '8 - 11 سنة';

    const tbody = document.getElementById('groupStudentsTableBody');
    if (tbody) {
      if (groupStudents.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center; padding:36px 20px; color:var(--color-text-muted);">
              <div style="font-size:1.5rem; margin-bottom:8px;">👥</div>
              <strong style="color:var(--color-text);">لا يوجد طلاب مسجلين في هذا الفوج حتى الآن.</strong>
              <div style="margin-top:12px;">
                <button type="button" class="btn btn--primary btn--small" onclick="openAddStudentForCurrentGroup()">+ إضافة أول طالب لهذا الفوج الآن</button>
              </div>
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = groupStudents.map(stu => {
          const sessions = Number(stu.sessionsRemaining) || 0;
          const balance = Number(stu.balance) || 0;
          const cleanPhone = (stu.parentPhone || '').replace(/\D/g, '');
          const waPhone = cleanPhone.startsWith('0') ? '213' + cleanPhone.slice(1) : cleanPhone;

          return `
            <tr>
              <td><span style="font-family:monospace; font-weight:700; color:var(--color-primary);">${stu.id}</span></td>
              <td>
                <a href="#" onclick="closeGroupStudentsModal(); openStudentProfile('${stu.id}'); return false;" style="color:#fff; font-weight:700; text-decoration:underline;">
                  ${stu.name}
                </a>
                <br><small style="color:var(--color-text-muted);">${stu.level || ''}</small>
              </td>
              <td>
                <div style="font-weight:600; color:var(--color-text);">${stu.parentName || 'ولي الأمر'}</div>
                <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                  <a href="tel:${stu.parentPhone}" dir="ltr" style="font-size:0.8rem; color:var(--color-primary); font-family:monospace;">${stu.parentPhone || '—'}</a>
                  ${cleanPhone ? `
                    <a href="https://wa.me/${waPhone}" target="_blank" style="color:#25D366; font-size:0.75rem; text-decoration:none;" title="محادثة واتساب">💬</a>
                  ` : ''}
                </div>
              </td>
              <td>
                <div style="font-weight:700; color:${sessions > 0 ? '#10B981' : '#EF4444'};">
                  ${sessions > 0 ? `${sessions} حصص متبقية` : 'نفدت الحصص'}
                </div>
                <small style="color:var(--color-text-muted);">${balance > 0 ? `الرصيد: ${Number(balance).toLocaleString()} دج` : '0 دج'}</small>
              </td>
              <td style="text-align: center;">
                <div style="display:inline-flex; gap:6px;">
                  <button type="button" class="btn btn--outline btn--small" style="padding:4px 8px; font-size:0.75rem;" onclick="closeGroupStudentsModal(); openStudentProfile('${stu.id}')">الملف</button>
                  <button type="button" class="btn btn--primary btn--small" style="padding:4px 8px; font-size:0.75rem; background:#0284C7;" onclick="closeGroupStudentsModal(); openRecordPaymentModal('${stu.id}')">💳 دفع</button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    const modal = document.getElementById('groupStudentsModal');
    if (modal) modal.classList.add('active');
  };

  window.closeGroupStudentsModal = function() {
    const modal = document.getElementById('groupStudentsModal');
    if (modal) modal.classList.remove('active');
  };

  window.openAddStudentForCurrentGroup = function() {
    closeGroupStudentsModal();
    openAddStudentModal();
    const groupSelect = document.getElementById('newStudentGroup');
    if (groupSelect && window.__currentRosterGroupName) {
      groupSelect.value = window.__currentRosterGroupName;
    }
  };

  // ==========================================
  // QUICK GROUP ATTENDANCE LOGIC (DIRECTLY IN GROUPS VIEW)
  // ==========================================
  window.__quickAttGroupName = '';
  window.__quickAttDraft = {};

  function openQuickGroupAttendanceModal(encodedGroupName) {
    const groupName = decodeURIComponent(encodedGroupName || '').trim();
    if (!groupName) return;
    window.__quickAttGroupName = groupName;
    window.__quickAttDraft = {};

    const titleEl = document.getElementById('quickAttModalTitle');
    if (titleEl) {
      titleEl.textContent = 'تفقد حضور وغياب: ' + groupName;
    }

    // Set Date to Today
    const dateInput = document.getElementById('quickAttDate');
    if (dateInput) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }

    // Find scheduled time for this group
    const groups = getData('brainova_groups') || [];
    const g = groups.find(x => x.name === groupName || x.id === groupName);
    const schedules = getData('brainova_schedule') || [];
    const sch = schedules.find(s => s.groupId === (g ? g.id : '') || s.groupName === groupName || (s.groupName && s.groupName.includes(groupName)));
    const timeInput = document.getElementById('quickAttTime');
    if (timeInput) {
      const scheduledTime = sch ? `${sch.startTime} - ${sch.endTime}` : (g?.timeSlot || '14:00 - 16:00');
      timeInput.value = scheduledTime;
    }

    renderQuickAttendanceStudents();

    const modal = document.getElementById('quickGroupAttendanceModal');
    if (modal) modal.classList.add('active');
  }
  window.openQuickGroupAttendanceModal = openQuickGroupAttendanceModal;

  function closeQuickGroupAttendanceModal() {
    const modal = document.getElementById('quickGroupAttendanceModal');
    if (modal) modal.classList.remove('active');
  }
  window.closeQuickGroupAttendanceModal = closeQuickGroupAttendanceModal;

  function renderQuickAttendanceStudents() {
    const listEl = document.getElementById('quickAttStudentsList');
    if (!listEl) return;

    const groupName = window.__quickAttGroupName;
    const selectedDate = document.getElementById('quickAttDate')?.value || new Date().toISOString().slice(0, 10);
    const selectedTime = document.getElementById('quickAttTime')?.value || '14:00 - 16:00';

    const allStudents = getData('brainova_students') || [];
    const groupStudents = allStudents.filter(s => 
      s.group === groupName || 
      (s.group && s.group.includes(groupName)) ||
      (groupName && s.group && groupName.includes(s.group))
    );

    if (groupStudents.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:32px; color:var(--color-text-muted);">
          <div>لا يوجد طلاب مسجلين في هذا الفوج حتى الآن.</div>
        </div>
      `;
      return;
    }

    // Check existing attendance in database for this date, group, and time
    const allAttendance = getData('brainova_attendance') || [];
    const existingAtt = allAttendance.filter(a => 
      a.date === selectedDate && 
      (a.groupName === groupName || (a.groupName && a.groupName.includes(groupName))) &&
      (!a.sessionTime || a.sessionTime === selectedTime || selectedTime.includes(a.sessionTime))
    );

    // Initialize draft state if empty
    groupStudents.forEach(stu => {
      if (!window.__quickAttDraft[stu.id]) {
        const found = existingAtt.find(a => a.studentId === stu.id);
        window.__quickAttDraft[stu.id] = {
          status: found ? found.status : 'present',
          note: found ? (found.note || '') : ''
        };
      }
    });

    listEl.innerHTML = groupStudents.map(stu => {
      const state = window.__quickAttDraft[stu.id] || { status: 'present', note: '' };
      const status = state.status;
      const sessions = Number(stu.sessionsRemaining) || 0;

      const isPresent = status === 'present';
      const isLate = status === 'late';
      const isAbsent = status === 'absent';

      let rowBg = 'background:rgba(16,185,129,0.04); border-right:4px solid #10B981; border-bottom:1px solid var(--color-border);';
      let avatarBorder = 'border:1px solid rgba(16,185,129,0.4); background:rgba(16,185,129,0.12); color:#34D399;';
      let statusBadge = '<span style="background:rgba(16,185,129,0.15); color:#10B981; border:1px solid rgba(16,185,129,0.3); font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:10px;">حاضر</span>';

      if (isAbsent) {
        rowBg = 'background:rgba(239,68,68,0.08); border-right:4px solid #EF4444; border-bottom:1px solid rgba(239,68,68,0.2);';
        avatarBorder = 'border:1px solid rgba(239,68,68,0.4); background:rgba(239,68,68,0.15); color:#FCA5A5;';
        statusBadge = '<span style="background:rgba(239,68,68,0.18); color:#EF4444; border:1px solid rgba(239,68,68,0.35); font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:10px;">غائب</span>';
      } else if (isLate) {
        rowBg = 'background:rgba(245,158,11,0.06); border-right:4px solid #F59E0B; border-bottom:1px solid rgba(245,158,11,0.2);';
        avatarBorder = 'border:1px solid rgba(245,158,11,0.4); background:rgba(245,158,11,0.15); color:#FCD34D;';
        statusBadge = '<span style="background:rgba(245,158,11,0.18); color:#F59E0B; border:1px solid rgba(245,158,11,0.35); font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:10px;">متأخر</span>';
      }

      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; ${rowBg} gap:12px; flex-wrap:wrap; transition:all 0.15s ease;">
          <div style="display:flex; align-items:center; gap:10px; min-width:180px;">
            <div style="width:32px; height:32px; border-radius:50%; ${avatarBorder} display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem;">
              ${stu.name.trim().charAt(0)}
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="font-weight:700; color:var(--color-text); font-size:0.88rem;">${stu.name}</div>
                ${statusBadge}
              </div>
              <div style="font-size:0.75rem; color:var(--color-text-muted); margin-top:2px;">
                <span>${stu.parentPhone || '—'}</span> • <span>(${sessions} حصص متبقية)</span>
              </div>
            </div>
          </div>

          <!-- Status Segmented Control with Distinct Colors -->
          <div style="display:flex; align-items:center; background:rgba(0,0,0,0.35); padding:3px; border-radius:8px; border:1px solid var(--color-border); gap:3px;">
            <button type="button" 
              style="padding:5px 12px; font-size:0.75rem; font-weight:700; border-radius:6px; border:none; cursor:pointer; transition:all 0.15s ease;
              ${isPresent ? 'background:#10B981; color:#fff; box-shadow:0 1px 4px rgba(16,185,129,0.4);' : 'background:transparent; color:var(--color-text-muted);'}"
              onclick="setQuickStudentStatus('${stu.id}', 'present')">
              حاضر
            </button>

            <button type="button" 
              style="padding:5px 12px; font-size:0.75rem; font-weight:700; border-radius:6px; border:none; cursor:pointer; transition:all 0.15s ease;
              ${isLate ? 'background:#F59E0B; color:#0F172A; box-shadow:0 1px 4px rgba(245,158,11,0.4);' : 'background:transparent; color:var(--color-text-muted);'}"
              onclick="setQuickStudentStatus('${stu.id}', 'late')">
              متأخر
            </button>

            <button type="button" 
              style="padding:5px 12px; font-size:0.75rem; font-weight:700; border-radius:6px; border:none; cursor:pointer; transition:all 0.15s ease;
              ${isAbsent ? 'background:#EF4444; color:#fff; box-shadow:0 1px 4px rgba(239,68,68,0.4);' : 'background:transparent; color:var(--color-text-muted);'}"
              onclick="setQuickStudentStatus('${stu.id}', 'absent')">
              غائب
            </button>
          </div>

          <!-- Note Input -->
          <div style="flex:1; min-width:140px; max-width:200px;">
            <input type="text" class="form-input" placeholder="ملاحظة..." 
              value="${state.note || ''}" 
              style="height:28px; font-size:0.75rem; padding:3px 8px;" 
              oninput="setQuickStudentNote('${stu.id}', this.value)">
          </div>
        </div>
      `;
    }).join('');
  }
  window.renderQuickAttendanceStudents = renderQuickAttendanceStudents;

  function setQuickStudentStatus(studentId, status) {
    if (!window.__quickAttDraft[studentId]) {
      window.__quickAttDraft[studentId] = { status: 'present', note: '' };
    }
    window.__quickAttDraft[studentId].status = status;
    renderQuickAttendanceStudents();
  }
  window.setQuickStudentStatus = setQuickStudentStatus;

  function setQuickStudentNote(studentId, note) {
    if (!window.__quickAttDraft[studentId]) {
      window.__quickAttDraft[studentId] = { status: 'present', note: '' };
    }
    window.__quickAttDraft[studentId].note = note;
  }
  window.setQuickStudentNote = setQuickStudentNote;

  function setAllQuickAttendance(status) {
    Object.keys(window.__quickAttDraft).forEach(id => {
      window.__quickAttDraft[id].status = status;
    });
    renderQuickAttendanceStudents();
    showToast(status === 'present' ? 'تم تحديد جميع التلاميذ كحاضرين' : 'تم تحديد جميع التلاميذ كغائبين', 'info');
  }
  window.setAllQuickAttendance = setAllQuickAttendance;

  function saveQuickGroupAttendance() {
    const groupName = window.__quickAttGroupName;
    if (!groupName) return;

    const selectedDate = document.getElementById('quickAttDate')?.value || new Date().toISOString().slice(0, 10);
    const selectedTime = document.getElementById('quickAttTime')?.value || '14:00 - 16:00';

    let allAttendance = getData('brainova_attendance') || [];
    allAttendance = allAttendance.filter(a => !(a.date === selectedDate && a.groupName === groupName && (!a.sessionTime || a.sessionTime === selectedTime)));

    const students = getData('brainova_students') || [];
    let savedCount = 0;
    let lateOrAbsentCount = 0;

    for (const [studentId, data] of Object.entries(window.__quickAttDraft)) {
      const stu = students.find(s => s.id === studentId);
      allAttendance.push({
        id: 'ATT-' + Date.now() + '-' + studentId,
        date: selectedDate,
        groupName: groupName,
        sessionTime: selectedTime,
        studentId: studentId,
        studentName: stu ? stu.name : 'Unknown',
        status: data.status,
        note: data.note || ''
      });
      savedCount++;

      if (stu && (data.status === 'present' || data.status === 'late')) {
        stu.lastAttendance = `${selectedDate} (${selectedTime})`;
        if (stu.sessionsRemaining > 0) {
          stu.sessionsRemaining = Math.max(0, stu.sessionsRemaining - 1);
        }
      }

      // Zero-click WhatsApp alert if late or absent
      if (stu && (data.status === 'late' || data.status === 'absent')) {
        lateOrAbsentCount++;
        triggerAutoAttendanceWhatsApp(stu, data.status, selectedTime, selectedDate);
      }
    }

    saveData('brainova_attendance', allAttendance);
    saveData('brainova_students', students);

    closeQuickGroupAttendanceModal();
    showToast(`تم حفظ تفقد حضور وغياب (${savedCount}) تلميذ لفوج (${groupName}) بنجاح`, 'success');
    renderActiveView();
  }
  window.saveQuickGroupAttendance = saveQuickGroupAttendance;

  // ==========================================
  // 6.5 PRINTABLE MONTHLY ATTENDANCE SHEET (A4 LANDSCAPE)
  // ==========================================
  function openPrintAttendanceSheetModal(preselectedGroupName = '') {
    const groupSelect = document.getElementById('printSheetGroupSelect');
    if (groupSelect) {
      const groups = getData('brainova_groups') || [];
      groupSelect.innerHTML = groups.map(g => `<option value="${g.name}">${g.name} (${g.level || ''})</option>`).join('');
      if (preselectedGroupName) {
        groupSelect.value = preselectedGroupName;
      }
    }

    const monthSelect = document.getElementById('printSheetMonthSelect');
    if (monthSelect) {
      const monthNames = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const currentMonth = monthNames[new Date().getMonth()];
      monthSelect.value = currentMonth || 'سبتمبر';
    }

    const yearInput = document.getElementById('printSheetYearInput');
    if (yearInput) {
      yearInput.value = new Date().getFullYear();
    }

    const modal = document.getElementById('printAttendanceSheetModal');
    if (modal) modal.classList.add('active');
  }
  window.openPrintAttendanceSheetModal = openPrintAttendanceSheetModal;

  function closePrintAttendanceSheetModal() {
    const modal = document.getElementById('printAttendanceSheetModal');
    if (modal) modal.classList.remove('active');
  }
  window.closePrintAttendanceSheetModal = closePrintAttendanceSheetModal;

  function openPrintCurrentGroupAttendanceSheet() {
    const attGroupSelect = document.getElementById('attGroupSelect');
    const currentGroup = attGroupSelect ? attGroupSelect.value : '';
    openPrintAttendanceSheetModal(currentGroup);
  }
  window.openPrintCurrentGroupAttendanceSheet = openPrintCurrentGroupAttendanceSheet;

  function submitPrintMonthlyAttendanceSheet(e) {
    if (e) e.preventDefault();
    const groupSelect = document.getElementById('printSheetGroupSelect');
    const monthSelect = document.getElementById('printSheetMonthSelect');
    const yearInput = document.getElementById('printSheetYearInput');
    const extraRowsCheck = document.getElementById('printSheetAddExtraRows');

    const groupName = groupSelect ? groupSelect.value : '';
    const month = monthSelect ? monthSelect.value : 'سبتمبر';
    const year = yearInput ? yearInput.value : '2026';
    const addExtra = extraRowsCheck ? extraRowsCheck.checked : true;

    closePrintAttendanceSheetModal();
    printGroupMonthlyAttendanceSheet(groupName, month, year, addExtra);
  }
  window.submitPrintMonthlyAttendanceSheet = submitPrintMonthlyAttendanceSheet;

  function printGroupMonthlyAttendanceSheet(rawGroupName, month = '', year = '', addExtraRows = true) {
    const groupName = decodeURIComponent(rawGroupName || '').trim();
    if (!groupName) {
      showToast('يرجى تحديد الفوج أولاً للطباعة', 'error');
      return;
    }

    const groups = getData('brainova_groups') || [];
    const g = groups.find(x => x.name === groupName || x.id === groupName) || {
      name: groupName,
      level: 'المستوى الأول: تفكير منطقي',
      room: 'قاعة Brainova الرئيسية',
      educator: 'أ. عابد اسحاق تقي الدين',
      ageCategory: '8 - 12 سنة'
    };

    const schedule = getData('brainova_schedule') || [];
    const sch = schedule.find(s => s.groupId === g.id || s.groupName === g.name || (s.groupName && s.groupName.includes(g.name)));
    const dayStr = sch ? sch.day : (g.day || 'السبت');
    const timeStr = sch ? `${sch.startTime} - ${sch.endTime}` : (g.timeSlot || '14:00 - 16:00');
    const educatorName = g.educator || (sch ? sch.educatorName : '') || 'أ. عابد اسحاق تقي الدين';
    const roomName = g.room || (sch ? sch.room : '') || 'قاعة Brainova 1';

    const monthNames = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const currentMonth = month || monthNames[new Date().getMonth()] || 'سبتمبر';
    const currentYear = year || String(new Date().getFullYear());

    const allStudents = getData('brainova_students') || [];
    const groupStudents = allStudents.filter(s => 
      s.groupId === g.id || 
      s.group === g.name || 
      (s.group && s.group.includes(g.name)) ||
      (s.group && g.name && g.name.includes(s.group))
    );
    groupStudents.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ar'));

    const allPayments = getData('brainova_payments') || [];

    // Rows HTML
    let rowsHtml = '';
    groupStudents.forEach((stu, idx) => {
      const timeline = getStudentPaymentTimeline(stu.id, stu, allPayments);
      let payStatusText = 'مسدد ✅';
      let payStatusColor = '#15803d';
      if (timeline.status === 'overdue' || Number(stu.balance) < 0) {
        payStatusText = 'مستحق ⚠️';
        payStatusColor = '#b91c1c';
      } else if (!timeline.hasPayment) {
        payStatusText = 'جديد ⏳';
        payStatusColor = '#d97706';
      }

      rowsHtml += `
        <tr>
          <td style="font-weight:700; color:#475569;">${idx + 1}</td>
          <td class="student-cell">
            <div style="font-size:11.5px; font-weight:800; color:#0f172a;">${stu.name}</div>
            <div style="font-size:8.5px; color:#64748b; font-family:monospace;">ID: ${stu.id}</div>
          </td>
          <td style="font-family:monospace; font-size:9.5px; direction:ltr; font-weight:700;">${stu.parentPhone || '—'}</td>
          <!-- Session 1 -->
          <td>
            <div style="font-size:8px; color:#94a3b8;">[ &nbsp; &nbsp; / &nbsp; &nbsp; ]</div>
            <div class="check-boxes"><span><span class="box-sq"></span> ح</span><span><span class="box-sq"></span> ت</span><span><span class="box-sq"></span> غ</span></div>
          </td>
          <!-- Session 2 -->
          <td>
            <div style="font-size:8px; color:#94a3b8;">[ &nbsp; &nbsp; / &nbsp; &nbsp; ]</div>
            <div class="check-boxes"><span><span class="box-sq"></span> ح</span><span><span class="box-sq"></span> ت</span><span><span class="box-sq"></span> غ</span></div>
          </td>
          <!-- Session 3 -->
          <td>
            <div style="font-size:8px; color:#94a3b8;">[ &nbsp; &nbsp; / &nbsp; &nbsp; ]</div>
            <div class="check-boxes"><span><span class="box-sq"></span> ح</span><span><span class="box-sq"></span> ت</span><span><span class="box-sq"></span> غ</span></div>
          </td>
          <!-- Session 4 -->
          <td>
            <div style="font-size:8px; color:#94a3b8;">[ &nbsp; &nbsp; / &nbsp; &nbsp; ]</div>
            <div class="check-boxes"><span><span class="box-sq"></span> ح</span><span><span class="box-sq"></span> ت</span><span><span class="box-sq"></span> غ</span></div>
          </td>
          <!-- Session 5 -->
          <td>
            <div style="font-size:8px; color:#94a3b8;">[ &nbsp; &nbsp; / &nbsp; &nbsp; ]</div>
            <div class="check-boxes"><span><span class="box-sq"></span> ح</span><span><span class="box-sq"></span> ت</span><span><span class="box-sq"></span> غ</span></div>
          </td>
          <!-- Total -->
          <td style="font-weight:700; color:#475569;">&nbsp; / 4</td>
          <!-- Status -->
          <td style="font-weight:800; font-size:9.5px; color:${payStatusColor};">${payStatusText}</td>
          <!-- Notes -->
          <td>&nbsp;</td>
        </tr>
      `;
    });

    // Extra empty rows
    if (addExtraRows) {
      const extraCount = Math.max(3, 12 - groupStudents.length);
      for (let i = 0; i < extraCount; i++) {
        rowsHtml += `
          <tr style="background:#fff;">
            <td style="color:#cbd5e1; font-weight:700;">${groupStudents.length + i + 1}</td>
            <td class="student-cell" style="color:#94a3b8; font-style:italic;">............................................................</td>
            <td style="color:#cbd5e1;">........................</td>
            <td><div class="check-boxes"><span><span class="box-sq"></span> ح</span><span><span class="box-sq"></span> ت</span><span><span class="box-sq"></span> غ</span></div></td>
            <td><div class="check-boxes"><span><span class="box-sq"></span> ح</span><span><span class="box-sq"></span> ت</span><span><span class="box-sq"></span> غ</span></div></td>
            <td><div class="check-boxes"><span><span class="box-sq"></span> ح</span><span><span class="box-sq"></span> ت</span><span><span class="box-sq"></span> غ</span></div></td>
            <td><div class="check-boxes"><span><span class="box-sq"></span> ح</span><span><span class="box-sq"></span> ت</span><span><span class="box-sq"></span> غ</span></div></td>
            <td><div class="check-boxes"><span><span class="box-sq"></span> ح</span><span><span class="box-sq"></span> ت</span><span><span class="box-sq"></span> غ</span></div></td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        `;
      }
    }

    const printDateStr = new Date().toLocaleDateString('ar-DZ');

    const sheetHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>قائمة تفقد الحضور والمتابعة الشهرية — ${groupName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      color: #0f172a;
      background: #fff;
      margin: 0;
      padding: 12px 16px;
      font-size: 11px;
      line-height: 1.35;
    }
    .no-print {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #fff;
      padding: 10px 18px;
      border-radius: 8px;
      margin-bottom: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0; }
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }
    .sheet-title-badge {
      background: #0284C7;
      color: #fff;
      font-weight: 900;
      font-size: 15px;
      padding: 5px 18px;
      border-radius: 6px;
      display: inline-block;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(2,132,199,0.3);
    }
    .meta-box {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #334155;
      background: #f8fafc;
      margin-bottom: 8px;
      border-radius: 6px;
      overflow: hidden;
    }
    .meta-box td {
      padding: 5px 10px;
      border: 1px solid #cbd5e1;
      font-size: 11px;
    }
    .meta-label {
      font-weight: 800;
      color: #1e293b;
    }
    .meta-val {
      font-weight: 700;
      color: #0369a1;
    }
    .att-grid {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #0f172a;
      margin-bottom: 8px;
    }
    .att-grid th {
      background: #1e293b;
      color: #ffffff;
      border: 1px solid #334155;
      padding: 6px 3px;
      font-weight: 800;
      font-size: 10px;
      text-align: center;
    }
    .att-grid td {
      border: 1px solid #475569;
      padding: 4px 3px;
      font-size: 10px;
      text-align: center;
      vertical-align: middle;
    }
    .att-grid tr:nth-child(even) {
      background: #f8fafc;
    }
    .student-cell {
      text-align: right !important;
      padding-right: 8px !important;
    }
    .check-boxes {
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 8.5px;
      color: #475569;
      font-weight: 700;
    }
    .box-sq {
      display: inline-block;
      width: 10px;
      height: 10px;
      border: 1.2px solid #334155;
      background: #fff;
      border-radius: 2px;
      vertical-align: middle;
    }
    .pedagogy-box {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #334155;
      margin-bottom: 6px;
    }
    .pedagogy-box th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 800;
      font-size: 10px;
      padding: 4px 8px;
      text-align: right;
      border-bottom: 1px solid #cbd5e1;
    }
    .pedagogy-box td {
      padding: 4px 8px;
      font-size: 10px;
      border: 1px solid #cbd5e1;
      width: 50%;
    }
    .signatures-table {
      width: 100%;
      border-collapse: collapse;
    }
    .signatures-table td {
      width: 50%;
      text-align: center;
      padding: 4px 16px;
      vertical-align: top;
    }
    .sign-box {
      border: 1.5px dashed #64748b;
      border-radius: 6px;
      height: 52px;
      margin-top: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 9px;
      background: #f8fafc;
    }
  </style>
</head>
<body>

  <!-- Floating Bar for Browser Preview (Hidden on Print) -->
  <div class="no-print">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="font-size:1.3rem;">📄</span>
      <div>
        <strong style="font-size:0.95rem;">معاينة ورقة الحضور الشهرية — ${groupName}</strong>
        <div style="font-size:0.75rem; color:#94a3b8;">جاهزة للطباعة على ورق A4 بالعرض (Landscape)</div>
      </div>
    </div>
    <div style="display:flex; gap:10px;">
      <button onclick="window.print()" style="background:#0284C7; color:#fff; border:none; padding:7px 18px; border-radius:6px; font-weight:800; cursor:pointer; font-family:inherit; font-size:0.85rem;">
        🖨️ طباعة الورقة الآن (Print)
      </button>
      <button onclick="window.close()" style="background:rgba(255,255,255,0.1); color:#fff; border:none; padding:7px 14px; border-radius:6px; cursor:pointer; font-family:inherit; font-size:0.85rem;">
        ✕ إغلاق
      </button>
    </div>
  </div>

  <!-- Sheet Header -->
  <table class="header-table">
    <tr>
      <td style="width:30%; text-align:right;">
        <div style="font-size:13px; font-weight:900; color:#0284C7;">أكاديمية براينوفا للروبوتيك والذكاء الاصطناعي</div>
        <div style="font-size:9.5px; font-weight:700; color:#64748b; font-family:monospace; letter-spacing:0.5px;">BRAINOVA ROBOTICS & AI ACADEMY</div>
        <div style="font-size:9px; color:#475569; margin-top:2px;">ولاية أم البواقي • الهاتف: 0791 19 46 33</div>
      </td>
      <td style="width:40%; text-align:center;">
        <div class="sheet-title-badge">قائمة تفقد الحضور والمتابعة البيداغوجية الشهرية</div>
        <div style="font-size:9.5px; font-weight:800; color:#334155; margin-top:3px;">الموسم التكويني: 2026 / 2027 • شهر: <span style="color:#0284C7; font-size:11px;">${currentMonth} ${currentYear}</span></div>
      </td>
      <td style="width:30%; text-align:left; font-size:9.5px; color:#64748b;">
        <div><strong>المرجع:</strong> BR-ATT-${currentYear}</div>
        <div><strong>تاريخ الاستخراج:</strong> ${printDateStr}</div>
        <div><strong>دليل الرموز:</strong> [ح: حاضر] [ت: متأخر] [غ: غائب]</div>
      </td>
    </tr>
  </table>

  <!-- Meta Information -->
  <table class="meta-box">
    <tr>
      <td><span class="meta-label">الفوج التدريبي:</span> <span class="meta-val">${g.name}</span></td>
      <td><span class="meta-label">المستوى التعليمي:</span> <span class="meta-val">${g.level || 'المستوى الأول'}</span></td>
      <td><span class="meta-label">المؤطر المشرف:</span> <span class="meta-val">${educatorName}</span></td>
    </tr>
    <tr>
      <td><span class="meta-label">توقيت الحصة:</span> <span class="meta-val">${dayStr} (${timeStr})</span></td>
      <td><span class="meta-label">القاعة المخصصة:</span> <span class="meta-val">${roomName}</span></td>
      <td><span class="meta-label">عدد التلاميذ المقيدين:</span> <span class="meta-val">${groupStudents.length} تلاميذ</span></td>
    </tr>
  </table>

  <!-- Main Attendance Grid -->
  <table class="att-grid">
    <thead>
      <tr>
        <th style="width:28px;">N°</th>
        <th style="width:160px; text-align:right; padding-right:8px;">اسم ولقب التلميذ</th>
        <th style="width:88px;">هاتف الولي</th>
        <th style="width:90px;">الحصة 01<br><span style="font-size:8px; font-weight:normal; opacity:0.85;">تاريخ: ___/___</span></th>
        <th style="width:90px;">الحصة 02<br><span style="font-size:8px; font-weight:normal; opacity:0.85;">تاريخ: ___/___</span></th>
        <th style="width:90px;">الحصة 03<br><span style="font-size:8px; font-weight:normal; opacity:0.85;">تاريخ: ___/___</span></th>
        <th style="width:90px;">الحصة 04<br><span style="font-size:8px; font-weight:normal; opacity:0.85;">تاريخ: ___/___</span></th>
        <th style="width:90px;">الحصة 05 (تعويضية)<br><span style="font-size:8px; font-weight:normal; opacity:0.85;">تاريخ: ___/___</span></th>
        <th style="width:46px;">المجموع<br><span style="font-size:8px; font-weight:normal; opacity:0.85;">/ 4</span></th>
        <th style="width:72px;">الاشتراك</th>
        <th>ملاحظات المؤطر وتقييم الاستيعاب</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <!-- Pedagogical Session Topics Summary -->
  <table class="pedagogy-box">
    <thead>
      <tr>
        <th colspan="2">📘 المحتوى البيداغوجي المنجز خلال الشهر (يملأ من طرف المؤطر):</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>الحصة 1:</strong> ................................................................................................................</td>
        <td><strong>الحصة 2:</strong> ................................................................................................................</td>
      </tr>
      <tr>
        <td><strong>الحصة 3:</strong> ................................................................................................................</td>
        <td><strong>الحصة 4:</strong> ................................................................................................................</td>
      </tr>
    </tbody>
  </table>

  <!-- Signatures -->
  <table class="signatures-table">
    <tr>
      <td>
        <strong style="font-size:10px; color:#1e293b;">توقيع وملاحظة المؤطر المشرف:</strong>
        <div class="sign-box">توقيع الأستاذ(ة)</div>
      </td>
      <td>
        <strong style="font-size:10px; color:#1e293b;">تأشيرة وخاتم إدارة أكاديمية Brainova:</strong>
        <div class="sign-box">خاتم وتأشيرة الإدارة</div>
      </td>
    </tr>
  </table>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

    if (window.electronAPI && window.electronAPI.printDocument) {
      window.electronAPI.printDocument({
        title: `قائمة حضور ${groupName}`,
        html: sheetHtml
      });
      showToast(`جاري فتح ورقة الحضور الشهرية لفوج (${groupName}) للطباعة... 📄🖨️`, 'success');
    } else {
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(sheetHtml);
        w.document.close();
      } else {
        showToast('يرجى السماح بالنوافذ المنبثقة لطباعة الورقة', 'error');
      }
    }
  }
  window.printGroupMonthlyAttendanceSheet = printGroupMonthlyAttendanceSheet;

  // --- ROOMS & LABS SYSTEM ---
      function renderRooms() {
    const grid = document.getElementById('roomsGrid');
    if (!grid) return;

    const rooms = getData('brainova_rooms') || [];
    grid.innerHTML = rooms.map(r => {
      const isOcc = r.status === 'occupied';
      const isMaint = r.status === 'maintenance';
      const statusClass = isOcc ? 'status-pill--rejected' : (isMaint ? 'status-pill--pending' : 'status-pill--active');
      const statusLabel = isOcc ? 'مشغولة بحصة' : (isMaint ? 'قيد الصيانة' : 'متاحة وجاهزة');

      return `
        <div class="stat-card" style="padding: 16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight:800; color:#fff; margin-bottom:2px;">${r.name}</h3>
              <span style="font-size: 0.75rem; color:var(--color-text-muted);">${r.type}</span>
            </div>
            <span class="status-pill ${statusClass}"><span class="pill-dot"></span> ${statusLabel}</span>
          </div>
          <div style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom:6px;">
            <span> السعة: <strong style="color:#fff;">${r.capacity} مقعد</strong></span>
          </div>
          <div style="font-size:0.75rem; color:var(--color-text-dim); margin-bottom:12px; line-height:1.4;">
            <span> التجهيزات: ${r.equipment}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--color-border); padding-top: 8px;">
            <button class="btn btn--outline btn--small" onclick="toggleRoomStatus('${r.id}')">تبديل الحالة</button>
            <button class="btn-icon" style="color:var(--color-danger); border:none;" onclick="deleteRoom('${r.id}')" title="حذف">حذف</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Room Modals CRUD
  window.openAddRoomModal = function() {
    document.getElementById('addRoomForm').reset();
    document.getElementById('addRoomModal').classList.add('active');
  };

  window.closeAddRoomModal = function() {
    document.getElementById('addRoomModal').classList.remove('active');
  };

  window.submitAddRoom = function(e) {
    e.preventDefault();
    const name = document.getElementById('newRoomName').value.trim();
    const type = document.getElementById('newRoomType').value;
    const capacity = Number(document.getElementById('newRoomCapacity').value) || 12;
    const equipment = document.getElementById('newRoomEquipment').value.trim();
    const status = document.getElementById('newRoomStatus').value;

    const rooms = getData('brainova_rooms');
    rooms.push({
      id: 'ROOM-' + Date.now(),
      name,
      type,
      capacity,
      equipment,
      status,
      currentGroup: ''
    });

    saveData('brainova_rooms', rooms);
    closeAddRoomModal();
    showToast('تمت إضافة القاعة بنجاح!', 'success');
    renderActiveView();
  };

  window.toggleRoomStatus = function(id) {
    const rooms = getData('brainova_rooms');
    const room = rooms.find(r => r.id === id);
    if (!room) return;

    room.status = room.status === 'available' ? 'occupied' : 'available';
    saveData('brainova_rooms', rooms);
    showToast(`تم تغيير حالة ${room.name} إلى ${room.status === 'available' ? 'متاحة' : 'مشغولة'}`, 'success');
    renderActiveView();
  };

  window.deleteRoom = function(id) {
    if (confirm('هل أنت متأكد من حذف هذه القاعة؟')) {
      const rooms = getData('brainova_rooms').filter(r => r.id !== id);
      saveData('brainova_rooms', rooms);
      showToast('تم حذف القاعة بنجاح!', 'success');
      renderActiveView();
    }
  };

  // --- COURSES ---
  function renderCourses() {
    const courses = filterData(getData('brainova_courses'), searchQuery);
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    
    if (courses.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 20px; color:var(--color-text-muted);">لا توجد بيانات (No data)</div>`;
      return;
    }
    
    grid.innerHTML = courses.map(course => `
      <div class="stat-card">
        <div class="stat-card__info" style="width: 100%;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="stat-card__title" style="color: var(--color-accent);">${course.age || 'جميع الأعمار'}</span>
            <button class="btn-icon" style="width:28px; height:28px; border:none;" onclick="deleteCourse('${course.id}')">حذف</button>
          </div>
          <span class="stat-card__value" style="font-size: 1.1rem; font-family: var(--font-ar);">${course.name}</span>
          <div style="margin-top: 10px; font-size: 0.85rem; color: var(--color-text-muted);">
            <div> المدة: ${course.duration || '3 أشهر'}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- SCHEDULE ---
  function renderSchedule() {
    const grid = document.getElementById('scheduleGrid');
    if (!grid) return;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    const schedule = getData('brainova_schedule') || [];

    const lang = document.documentElement.lang || 'ar';
    const dayNames = {
      'Sunday':    { ar: 'الأحد',     fr: 'Dimanche', en: 'Sunday' },
      'Monday':    { ar: 'الإثنين',   fr: 'Lundi',    en: 'Monday' },
      'Tuesday':   { ar: 'الثلاثاء', fr: 'Mardi',    en: 'Tuesday' },
      'Wednesday': { ar: 'الأربعاء', fr: 'Mercredi', en: 'Wednesday' },
      'Thursday':  { ar: 'الخميس',   fr: 'Jeudi',    en: 'Thursday' },
      'Friday':    { ar: 'الجمعة',    fr: 'Vendredi', en: 'Friday' },
      'Saturday':  { ar: 'السبت',    fr: 'Samedi',   en: 'Saturday' }
    };

    // Helper: convert HH:MM to minutes
    function toMin(t) {
      if (!t) return 0;
      const [h, m] = t.split(':').map(Number);
      return h * 60 + (m || 0);
    }

    // Highlight current day
    const todayMap = { 0:'Sunday', 1:'Monday', 2:'Tuesday', 3:'Wednesday', 4:'Thursday', 5:'Friday', 6:'Saturday' };
    const todayKey = todayMap[new Date().getDay()];

    // Build grid HTML
    // Header row: empty corner + day names
    let html = `<div class="schedule-header" style="background:transparent;border:none;"></div>`;
    days.forEach(day => {
      const isToday = day === todayKey;
      html += `<div class="schedule-header" style="${isToday ? 'background:var(--color-primary-bg);color:var(--color-primary);' : ''}">${dayNames[day][lang]}</div>`;
    });

    // Time rows
    timeSlots.forEach((time, slotIdx) => {
      const slotStart = toMin(time);
      const slotEnd   = toMin(timeSlots[slotIdx + 1]) || slotStart + 60;

      html += `<div class="schedule-time-label">${time}</div>`;

      days.forEach(day => {
        // Find sessions whose startTime falls within this slot [slotStart, slotEnd)
        const sessions = schedule.filter(s => {
          const sStart = toMin(s.startTime);
          return s.day === day && sStart >= slotStart && sStart < slotEnd;
        });

        let sessionsHtml = '';
        sessions.forEach(s => {
          const timeSlotStr = `${s.startTime} - ${s.endTime}`;
          sessionsHtml += `
            <div class="schedule-session">
              <button class="schedule-session__delete" onclick="deleteSession('${s.id}')">&times;</button>
              <div class="schedule-session__title">${s.groupName}</div>
              <div style="font-size:0.73rem;">👨‍🏫 ${s.educatorName}</div>
              <div style="font-size:0.73rem;">⏰ ${timeSlotStr}</div>
              ${s.room ? `<div style="font-size:0.71rem;color:var(--color-text-muted);">🏛️ ${s.room}</div>` : ''}
              <button type="button" class="btn btn--primary btn--small" style="padding:3px 6px; font-size:0.69rem; margin-top:5px; width:100%; background:#0284C7; font-weight:700;" onclick="openAttendanceForSession('${encodeURIComponent(s.groupName)}', '${timeSlotStr}')">📝 تسجيل الحضور</button>
            </div>
          `;
        });

        html += `<div class="schedule-cell">${sessionsHtml}</div>`;
      });
    });

    grid.innerHTML = html;
  }


  // ==========================================
  // 6. CRUD MODALS LOGIC
  // ==========================================

  // Student Modals
  function onStudentGroupSelectChange() {
    const groupSelect = document.getElementById('newStudentGroup');
    const startInput = document.getElementById('newStudentStartTime');
    const endInput = document.getElementById('newStudentEndTime');
    if (!groupSelect || !startInput || !endInput) return;

    const selectedGroup = groupSelect.value;
    const schedule = getData('brainova_schedule') || [];
    const matched = schedule.find(s => s.groupName === selectedGroup || (s.groupName && s.groupName.includes(selectedGroup)));

    if (matched && matched.startTime && matched.endTime) {
      startInput.value = matched.startTime;
      endInput.value = matched.endTime;
    }
  }
  window.onStudentGroupSelectChange = onStudentGroupSelectChange;

  window.openAddStudentModal = function() {
    const groupSelect = document.getElementById('newStudentGroup');
    if (groupSelect) {
      const groups = getData('brainova_groups');
      groupSelect.innerHTML = groups.map(g => `<option value="${g.name}">${g.name}</option>`).join('');
      onStudentGroupSelectChange();
    }
    document.getElementById('addStudentModal').classList.add('active');
  };

  function closeAddStudentModal() {
    document.getElementById('addStudentModal').classList.remove('active');
  }
  window.closeAddStudentModal = closeAddStudentModal;

  window.setPaymentPreset = function(amount, sessions) {
    const amountInput = document.getElementById('payAmount');
    const sessionsInput = document.getElementById('paySessions');
    if (amountInput) amountInput.value = amount;
    if (sessionsInput) sessionsInput.value = sessions;
  };

  window.submitAddStudent = function(e) {
    e.preventDefault();
    const students = getData('brainova_students');
    const name = document.getElementById('newStudentName').value.trim();
    const parentName = document.getElementById('newStudentParentName') ? document.getElementById('newStudentParentName').value.trim() : '—';
    const parentPhone = document.getElementById('newStudentParentPhone') ? document.getElementById('newStudentParentPhone').value.trim() : '—';
    const group = document.getElementById('newStudentGroup').value;
    const level = document.getElementById('newStudentLevel').value;
    const startTime = document.getElementById('newStudentStartTime')?.value || '14:00';
    const endTime = document.getElementById('newStudentEndTime')?.value || '16:00';
    const sessionTime = `${startTime} - ${endTime}`;

    const planValue = document.getElementById('newStudentPlan') ? document.getElementById('newStudentPlan').value : '5000';
    const fee = Number(planValue) || 5000;

    const newStudent = {
      id: "STU-" + String(students.length + 1).padStart(3, '0'),
      name: name,
      group: group,
      level: level,
      startTime: startTime,
      endTime: endTime,
      sessionTime: sessionTime,
      parentName: parentName || "—",
      parentPhone: parentPhone || "—",
      username: generateRandomCode(8),
      password: generateRandomCode(8),
      monthlyFee: fee,
      plan: planValue === '8000' ? 'طفلين (خصم إخوة)' : (planValue === '11000' ? '3 أطفال (عائلي)' : 'طفل واحد'),
      balance: 0,
      sessionsRemaining: 4,
      lastAttendance: "جديد",
      joinedDate: new Date().toLocaleDateString('ar-DZ')
    };
    students.push(newStudent);
    saveData('brainova_students', students);
    closeAddStudentModal();
    showToast(`✅ تم تسجيل التلميذ (${name}) بفوج (${group}) وتوقيت (${sessionTime}) بنجاح! 🚀`, 'success');
    renderActiveView();
  };

  window.deleteStudent = function(id) {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      const students = getData('brainova_students').filter(s => s.id !== id);
      saveData('brainova_students', students);
      showToast('toast_updated', 'success');
      renderActiveView();
    }
  };

  // Group Modals
  window.openAddGroupModal = function() {
    const educators = getData('brainova_educators');
    const rooms = getData('brainova_rooms');

    const eduSelect = document.getElementById('newGroupEducator');
    if (eduSelect) {
      eduSelect.innerHTML = '<option value="">-- اختر الأستاذ (اختياري) --</option>' + educators.map(edu => `
        <option value="${edu.id}">${edu.name}</option>
      `).join('');
    }

    const roomSelect = document.getElementById('newGroupRoom');
    if (roomSelect) {
      roomSelect.innerHTML = '<option value="">-- اختر القاعة --</option>' + rooms.map(r => `
        <option value="${r.name}">${r.name} (${r.capacity} مقعد)</option>
      `).join('');
    }

    document.getElementById('addGroupForm').reset();
    document.getElementById('addGroupModal').classList.add('active');
  };

  window.closeAddGroupModal = function() {
    document.getElementById('addGroupModal').classList.remove('active');
  };

  window.submitAddGroup = function(e) {
    e.preventDefault();
    const name = document.getElementById('newGroupName').value.trim();
    const level = document.getElementById('newGroupLevel').value;
    const ageCategory = document.getElementById('newGroupAgeCategory').value;
    const room = document.getElementById('newGroupRoom').value;
    const educatorId = document.getElementById('newGroupEducator').value;
    const maxStudents = parseInt(document.getElementById('newGroupMaxStudents').value) || 12;

    const educators = getData('brainova_educators');
    const educator = educators.find(e => e.id === educatorId);

    const newGroup = {
      id: 'GRP-' + Date.now(),
      name,
      level,
      ageCategory,
      room,
      educatorId: educatorId || null,
      educatorName: educator ? educator.name : '',
      maxStudents,
      createdAt: new Date().toLocaleDateString('ar-DZ')
    };

    const groups = getData('brainova_groups');
    groups.push(newGroup);
    saveData('brainova_groups', groups);

    closeAddGroupModal();
    showToast('toast_saved', 'success');
    renderActiveView();
  };

  window.deleteGroup = function(id) {
    const schedules = getData('brainova_schedule').filter(s => s.groupId === id);
    if (schedules.length > 0) {
      alert('لا يمكن الحذف: الفوج مرتبط بجلسات في الجدول.');
      return;
    }
    if (confirm('هل تريد حذف هذا الفوج؟')) {
      const groups = getData('brainova_groups').filter(g => g.id !== id);
      saveData('brainova_groups', groups);
      showToast('toast_updated', 'success');
      renderActiveView();
    }
  };

  // Educator Modals
  window.openAddEducatorModal = function() {
    document.getElementById('addEducatorForm').reset();
    document.getElementById('addEducatorModal').classList.add('active');
  };

  window.closeAddEducatorModal = function() {
    document.getElementById('addEducatorModal').classList.remove('active');
  };

  window.submitAddEducator = function(e) {
    e.preventDefault();
    const name = document.getElementById('newEduName').value.trim();
    const specialty = document.getElementById('newEduSpecialty').value.trim();
    const phone = document.getElementById('newEduPhone').value.trim();

    const educators = getData('brainova_educators');
    educators.push({
      id: 'EDU-' + String(educators.length + 1).padStart(3, '0'),
      name,
      specialty,
      phone
    });

    saveData('brainova_educators', educators);
    closeAddEducatorModal();
    showToast('تمت إضافة المعلم بنجاح!', 'success');
    renderActiveView();
  };

  window.deleteEducator = function(id) {
    if (confirm('هل أنت متأكد من حذف هذا المعلم؟')) {
      const educators = getData('brainova_educators').filter(e => e.id !== id);
      saveData('brainova_educators', educators);
      showToast('toast_updated', 'success');
      renderActiveView();
    }
  };

  // Course Modals
  window.openAddCourseModal = function() {
    document.getElementById('addCourseForm').reset();
    document.getElementById('addCourseModal').classList.add('active');
  };

  window.closeAddCourseModal = function() {
    document.getElementById('addCourseModal').classList.remove('active');
  };

  window.submitAddCourse = function(e) {
    e.preventDefault();
    const name = document.getElementById('newCourseName').value.trim();
    const age = document.getElementById('newCourseAge').value.trim();
    const duration = document.getElementById('newCourseDuration').value.trim();

    const courses = getData('brainova_courses');
    courses.push({
      id: 'CRS-' + String(courses.length + 1).padStart(3, '0'),
      name,
      age,
      duration
    });

    saveData('brainova_courses', courses);
    closeAddCourseModal();
    showToast('تمت إضافة الدورة بنجاح!', 'success');
    renderActiveView();
  };

  window.deleteCourse = function(id) {
    if (confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
      const courses = getData('brainova_courses').filter(c => c.id !== id);
      saveData('brainova_courses', courses);
      showToast('toast_updated', 'success');
      renderActiveView();
    }
  };

  // Session / Timetable Modals
  window.openAddSessionModal = function() {
    const groupSelect = document.getElementById('sessionGroup');
    const educatorSelect = document.getElementById('sessionEducator');
    const roomSelect = document.getElementById('sessionRoom');
    
    const groups = getData('brainova_groups');
    const educators = getData('brainova_educators');
    const rooms = getData('brainova_rooms');
    
    groupSelect.innerHTML = groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
    educatorSelect.innerHTML = educators.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
    
    if (roomSelect) {
      roomSelect.innerHTML = rooms.map(r => `<option value="${r.name}">${r.name}</option>`).join('');
    }
    
    document.getElementById('addSessionModal').classList.add('active');
  };

  window.closeAddSessionModal = function() {
    document.getElementById('addSessionModal').classList.remove('active');
  };

  window.submitAddSession = function(e) {
    e.preventDefault();
    
    const groupId = document.getElementById('sessionGroup').value;
    const educatorId = document.getElementById('sessionEducator').value;
    const day = document.getElementById('sessionDay').value;
    const startTime = document.getElementById('sessionStart').value;
    const endTime = document.getElementById('sessionEnd').value;
    const room = document.getElementById('sessionRoom').value;

    if (startTime > '18:00' || endTime > '18:00') {
      showToast('أقصى وقت للحصص في الجدول الزمني هو الساعة 18:00', 'error');
      return;
    }
    
    const groups = getData('brainova_groups');
    const educators = getData('brainova_educators');
    const schedule = getData('brainova_schedule');
    
    const group = groups.find(g => g.id === groupId);
    const educator = educators.find(e => e.id === educatorId);
    
    const educatorConflict = schedule.some(s => 
      s.day === day && 
      s.educatorId === educatorId &&
      ((startTime >= s.startTime && startTime < s.endTime) || (endTime > s.startTime && endTime <= s.endTime))
    );
    
    if (educatorConflict) {
      showToast('toast_conflict_educator', 'error');
      return;
    }
    
    const groupConflict = schedule.some(s => 
      s.day === day && 
      s.groupId === groupId &&
      ((startTime >= s.startTime && startTime < s.endTime) || (endTime > s.startTime && endTime <= s.endTime))
    );
    
    if (groupConflict) {
      showToast('toast_conflict_group', 'error');
      return;
    }
    
    const newSession = {
      id: 'SCH-' + Date.now(),
      groupId,
      groupName: group ? group.name : 'Unknown',
      educatorId,
      educatorName: educator ? educator.name : 'Unknown',
      day,
      startTime,
      endTime,
      room
    };
    
    schedule.push(newSession);
    saveData('brainova_schedule', schedule);
    
    closeAddSessionModal();
    showToast('toast_session_added', 'success');
    renderActiveView();
  };

  window.deleteSession = function(id) {
    if (confirm('هل أنت متأكد من حذف هذه الحصة؟')) {
      const schedule = getData('brainova_schedule').filter(s => s.id !== id);
      saveData('brainova_schedule', schedule);
      showToast('toast_updated', 'success');
      renderActiveView();
    }
  };

  // Edit Registration Modal
  window.openEditRegModal = function(id) {
    const regs = getData('brainova_registrations');
    const reg = regs.find(r => r.id === Number(id));
    if (!reg) return;
    
    document.getElementById('editRegId').value = reg.id;
    document.getElementById('editRegStudentName').value = reg.studentName;
    document.getElementById('editRegParentName').value = reg.parentName;
    document.getElementById('editRegPhone').value = reg.parentPhone;
    
    document.getElementById('editRegModal').classList.add('active');
  };

  window.closeEditRegModal = function() {
    document.getElementById('editRegModal').classList.remove('active');
  };

  window.submitEditReg = function(e) {
    e.preventDefault();
    const id = Number(document.getElementById('editRegId').value);
    const regs = getData('brainova_registrations');
    const index = regs.findIndex(r => r.id === id);
    if (index === -1) return;
    
    regs[index].studentName = document.getElementById('editRegStudentName').value;
    regs[index].parentName = document.getElementById('editRegParentName').value;
    regs[index].parentPhone = document.getElementById('editRegPhone').value;
    
    saveData('brainova_registrations', regs);
    closeEditRegModal();
    showToast('toast_updated', 'success');
    renderActiveView();
  };

  // ==========================================
  // 7. EXPORT DATA (CSV)
  // ==========================================
  
  window.exportData = function(storageKey, fileNamePrefix) {
    const data = getData(storageKey);
    if (!data || data.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + (row[header] || '')).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${fileNamePrefix}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ==========================================
  // 8. INTERNATIONALIZATION (i18n)
  // ==========================================
  
  const dashTranslations = {
    fr: {
      dash_overview: "Aperçu", dash_students: "Étudiants", dash_educators: "Enseignants", dash_registrations: "Inscriptions",
      dash_groups: "Groupes & Âges", dash_rooms: "Salles", dash_courses: "Cours", dash_schedule: "Emploi du temps", dash_schedule_sub: "Gérer l'emploi du temps hebdomadaire.",
      dash_attendance: "Présences", dash_payments: "Paiements & Reçus", dash_settings: "Paramètres",
      dash_search: "Rechercher...", dash_admin: "Directeur", dash_total_students: "Total Étudiants",
      dash_students_sub: "Gérer tous les étudiants actuellement inscrits.", dash_add_student: "+ Ajouter",
      dash_id: "ID", dash_student_name: "Nom de l'étudiant", dash_group_name: "Groupe", dash_level_name: "Niveau", dash_action: "Action",
      dash_educators_sub: "Gérer le personnel enseignant.", dash_add_educator: "+ Enseignant",
      dash_educator_name: "Nom", dash_specialty: "Spécialité", dash_groups_count: "Groupes", dash_phone: "Téléphone", dash_parent_name: "Nom du parent",
      dash_edit: "Éditer", dash_profile: "Profil", dash_active: "Actif", dash_pending: "En attente", dash_rejected: "Rejeté",
      dash_add_student_title: "Ajouter un nouvel étudiant", dash_cancel: "Annuler", dash_save: "Enregistrer", dash_edit_reg_title: "Modifier l'inscription",
      dash_add_session: "+ Ajouter Session", dash_add_session_title: "Nouvelle Session", dash_day: "Jour", dash_start_time: "Heure de début", dash_end_time: "Heure de fin", dash_room: "Salle (Optionnel)",
      day_sun: "Dimanche", day_mon: "Lundi", day_tue: "Mardi", day_wed: "Mercredi", day_thu: "Jeudi", day_sat: "Samedi",
      toast_accepted: "Inscription acceptée!", toast_rejected: "Inscription rejetée.", toast_student_added: "Étudiant ajouté!", toast_updated: "Mise à jour réussie!", toast_saved: "Enregistré avec succès!", toast_error: "Veuillez remplir tous les champs obligatoires.",
      toast_session_added: "Session ajoutée!", toast_conflict_educator: "L'enseignant est déjà occupé à ce moment.", toast_conflict_group: "Le groupe a déjà une session à ce moment.", toast_conflict_room: "La salle est occupée."
    },
    en: {
      dash_overview: "Overview", dash_students: "Students", dash_educators: "Educators", dash_registrations: "Registrations",
      dash_groups: "Cohorts & Ages", dash_rooms: "Rooms", dash_courses: "Courses", dash_schedule: "Schedule", dash_schedule_sub: "Manage the weekly timetable.",
      dash_attendance: "Attendance", dash_payments: "Payments & Receipts", dash_settings: "Settings",
      dash_search: "Search...", dash_admin: "Admin", dash_total_students: "Total Students",
      dash_students_sub: "Manage all currently enrolled students.", dash_add_student: "+ Add Student",
      dash_id: "ID", dash_student_name: "Student Name", dash_group_name: "Group", dash_level_name: "Level", dash_action: "Action",
      dash_educators_sub: "Manage teaching staff.", dash_add_educator: "+ Add Educator",
      dash_educator_name: "Name", dash_specialty: "Specialty", dash_groups_count: "Groups", dash_phone: "Phone", dash_parent_name: "Parent Name",
      dash_edit: "Edit", dash_profile: "Profile", dash_active: "Active", dash_pending: "Pending", dash_rejected: "Rejected",
      dash_add_student_title: "Add New Student", dash_cancel: "Cancel", dash_save: "Save", dash_edit_reg_title: "Edit Registration",
      dash_add_session: "+ Add Session", dash_add_session_title: "New Session", dash_day: "Day", dash_start_time: "Start Time", dash_end_time: "End Time", dash_room: "Room (Optional)",
      day_sun: "Sunday", day_mon: "Monday", day_tue: "Tuesday", day_wed: "Wednesday", day_thu: "Thursday", day_sat: "Saturday",
      toast_accepted: "Registration accepted!", toast_rejected: "Registration rejected.", toast_student_added: "Student added!", toast_updated: "Updated successfully!", toast_saved: "Saved successfully!", toast_error: "Please fill in all required fields.",
      toast_session_added: "Session added!", toast_conflict_educator: "Educator is busy at this time.", toast_conflict_group: "Group already has a session at this time.", toast_conflict_room: "Room is already booked."
    },
    ar: {
      dash_overview: "نظرة عامة", dash_students: "الطلاب", dash_educators: "المعلمون", dash_registrations: "التسجيلات",
      dash_groups: "الأفواج والفئات", dash_rooms: "القاعات", dash_courses: "الدورات", dash_schedule: "الجدول", dash_schedule_sub: "تنظيم الحصص الأسبوعية للأفواج.",
      dash_attendance: "الحضور والغياب", dash_payments: "المدفوعات والوصولات", dash_settings: "الإعدادات",
      dash_search: "ابحث...", dash_admin: "المدير", dash_total_students: "إجمالي الطلاب",
      dash_students_sub: "إدارة جميع الطلاب المسجلين حالياً.", dash_add_student: "+ إضافة طالب",
      dash_id: "رقم التعريف", dash_student_name: "اسم الطالب", dash_group_name: "الفوج", dash_level_name: "المستوى", dash_action: "الإجراء",
      dash_educators_sub: "إدارة طاقم التدريس وتعييناتهم.", dash_add_educator: "+ إضافة معلم",
      dash_educator_name: "اسم المعلم", dash_specialty: "التخصص", dash_groups_count: "عدد الأفواج", dash_phone: "الهاتف", dash_parent_name: "اسم الولي",
      dash_edit: "تعديل", dash_profile: "ملف", dash_active: "نشط", dash_pending: "قيد الانتظار", dash_rejected: "مرفوض",
      dash_add_student_title: "إضافة طالب جديد", dash_cancel: "إلغاء", dash_save: "حفظ", dash_edit_reg_title: "تعديل التسجيل",
      dash_add_session: "+ إضافة حصة", dash_add_session_title: "إضافة حصة جديدة", dash_day: "اليوم", dash_start_time: "وقت البداية", dash_end_time: "وقت النهاية", dash_room: "القاعة (اختياري)",
      day_sun: "الأحد", day_mon: "الإثنين", day_tue: "الثلاثاء", day_wed: "الأربعاء", day_thu: "الخميس", day_sat: "السبت",
      toast_accepted: "تم قبول التسجيل!", toast_rejected: "تم رفض التسجيل.", toast_student_added: "تم إضافة الطالب!", toast_updated: "تم التحديث بنجاح!", toast_saved: "تم الحفظ بنجاح!", toast_error: "يرجى ملء جميع الحقول المطلوبة.",
      toast_session_added: "تمت إضافة الحصة بنجاح!", toast_conflict_educator: "المعلم لديه حصة أخرى في نفس الوقت.", toast_conflict_group: "الفوج لديه حصة أخرى في نفس الوقت.", toast_conflict_room: "القاعة محجوزة في هذا الوقت."
    }
  };

  function updateDashboardLanguage(lang) {
    const t = dashTranslations[lang];
    if (!t) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        const badge = el.querySelector('.sidebar-badge');
        const icon = el.querySelector('.icon');
        let newHtml = t[key];
        if (badge) newHtml += ` <span id="regBadge" class="sidebar-badge" style="${badge.style.cssText}">${badge.textContent}</span>`;
        if (icon) newHtml = `<span class="icon">${icon.innerHTML}</span> ` + newHtml;
        if (icon || badge) el.innerHTML = newHtml;
        else el.textContent = t[key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) el.placeholder = t[key];
    });
  }

  // ==========================================
  // 9. REAL-TIME REGISTRATIONS & LIVE SYNC
  // ==========================================
  let lastKnownRegCount = (getData('brainova_registrations') || []).length;

  function checkRealtimeUpdates() {
    const currentRegs = getData('brainova_registrations') || [];
    if (currentRegs.length > lastKnownRegCount) {
      const latestReg = currentRegs[0];
      lastKnownRegCount = currentRegs.length;

      showToast(`🔔 استلمت طلب تسجيل جديد (${latestReg.studentName || 'طالب جديد'} - ${latestReg.parentName || 'ولي الأمر'})!`, 'success');
      updateHeaderBadges();
      if (currentView === 'overview' || currentView === 'registrations') {
        renderActiveView();
      }
    } else {
      lastKnownRegCount = currentRegs.length;
    }
  }

  // Real-time cross-tab synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === 'brainova_registrations' || e.key === 'brainova_students' || e.key === 'brainova_payments' || e.key === 'brainova_attendance') {
      updateHeaderBadges();
      renderActiveView();
      checkRealtimeUpdates();
    }
  });

  // Polling check every 2 seconds
  setInterval(checkRealtimeUpdates, 2000);

  // ── SETTINGS: Backup / Restore / Logout / Portal
  window.doBackupExport = async function() {
    if (!window.electronAPI) { showToast('يتطلب تشغيل التطبيق', 'error'); return; }
    const result = await window.electronAPI.backup.export();
    const statusEl = document.getElementById('backupStatus');
    if (result.ok) {
      if (statusEl) statusEl.textContent = '✅ تم حفظ النسخة الاحتياطية بنجاح!';
      showToast('تم التصدير بنجاح!', 'success');
    } else {
      if (statusEl) statusEl.textContent = '';
      showToast('تم إلغاء العملية', 'info');
    }
  };

  window.doBackupImport = async function() {
    if (!window.electronAPI) { showToast('يتطلب تشغيل التطبيق', 'error'); return; }
    const result = await window.electronAPI.backup.import();
    const statusEl = document.getElementById('backupStatus');
    if (result.ok) {
      // Reload data from store after import
      Object.keys(MemoryCache).forEach(k => delete MemoryCache[k]);
      await loadFromPersistentStore();
      initializeData();
      renderAll();
      if (statusEl) statusEl.textContent = '✅ تم استعادة البيانات بنجاح!';
      showToast('تمت الاستعادة! جارٍ إعادة تحميل البيانات...', 'success');
    } else {
      if (statusEl) statusEl.textContent = result.error ? '❌ ' + result.error : '';
      showToast('تم إلغاء العملية', 'info');
    }
  };

  window.doLogout = function() {
    if (window.electronAPI && window.electronAPI.logout) {
      window.electronAPI.logout();
    }
  };

  window.promptFactoryReset = function() {
    const confirmation = prompt("⚠️ تحذير: هذه العملية ستقوم بتصفير جميع بيانات الطلاب، الحصص، الحضور، والمدفوعات لتبدأ قاعدة بيانات نظيفة للعمل الفعلي.\n\nللمتابعة ومسح البيانات، اكتب كلمة 'تصفير' أدناه:");
    if (confirmation === 'تصفير') {
      const emptyData = {
        brainova_students: [],
        brainova_educators: [
          { id: "EDU-001", name: "أستاذ الروبوتيك والبرمجة", specialty: "LEGO & Arduino", phone: "0791194633", groups: 0, active: true }
        ],
        brainova_groups: [
          { id: "GRP-001", name: "الفوج الأول (مبتدئ)", ageGroup: "6-9 سنوات", educator: "أستاذ الروبوتيك والبرمجة", studentsCount: 0, maxStudents: 12, schedule: "السبت (10:00 - 12:00)", status: "active" },
          { id: "GRP-002", name: "الفوج الثاني (متقدم)", ageGroup: "10-14 سنة", educator: "أستاذ الروبوتيك والبرمجة", studentsCount: 0, maxStudents: 12, schedule: "الجمعة (14:00 - 16:00)", status: "active" }
        ],
        brainova_rooms: [
          { id: "ROOM-001", name: "مختبر الروبوتيك الرئيسي", capacity: 15, equipment: "LEGO SPIKE, mBot2, PCs", status: "متاح" },
          { id: "ROOM-002", name: "قاعة البرمجة والإلكترونيات", capacity: 12, equipment: "Micro:bit, Arduino, Laptops", status: "متاح" }
        ],
        brainova_courses: [
          { id: "CRS-001", name: "أساسيات الروبوتيك والـ Scratch", level: "المستوى الأول", duration: "3 أشهر", sessionsCount: 12, price: 2000, desc: "مقدمة شاملة للبرمجة والميكانيك" },
          { id: "CRS-002", name: "برمجة الروبوتات LEGO SPIKE Prime", level: "المستوى الثاني", duration: "3 أشهر", sessionsCount: 12, price: 2500, desc: "بناء آليات الروبوت والحساسات الذكية" }
        ],
        brainova_schedule: [],
        brainova_attendance: [],
        brainova_payments: [],
        brainova_registrations: []
      };

      Object.entries(emptyData).forEach(([k, v]) => {
        saveData(k, v);
      });

      showToast('✅ تم تصفير قاعدة البيانات وتهيئتها للعمل الفعلي بنجاح!', 'success');
      renderAll();
    } else if (confirmation !== null) {
      alert('لم تتم كتابة كلمة "تصفير" بشكل صحيح. تم إلغاء العملية بأمان.');
    }
  };

  window.loadSampleData = function() {
    if (!confirm('هل تريد توليد بيانات تجريبية (طلاب، أفواج، مدفوعات) لمعاينة واجهات النظام؟')) return;

    const sampleStudents = [
      { id: "STU-001", name: "أحمد بن علي", age: 10, grade: "الرابعة ابتدائي", group: "الفوج الأول (مبتدئ)", level: "Level 1 — Explorer", parentName: "عمر بن علي", parentPhone: "0661234567", balance: 2000, sessionsRemaining: 4, active: true, username: "ahmed2026", password: "123" },
      { id: "STU-002", name: "مريم بوزيد", age: 12, grade: "الأولى متوسط", group: "الفوج الثاني (متقدم)", level: "Level 3 — Creator", parentName: "كريم بوزيد", parentPhone: "0550112233", balance: 0, sessionsRemaining: 3, active: true, username: "meriem2026", password: "123" },
      { id: "STU-003", name: "ياسين خليل", age: 8, grade: "الثالثة ابتدائي", group: "الفوج الأول (مبتدئ)", level: "Level 1 — Explorer", parentName: "فاروق خليل", parentPhone: "0770998877", balance: 2000, sessionsRemaining: 4, active: true, username: "yacine2026", password: "123" }
    ];

    const samplePayments = [
      { id: "REC-94801", studentId: "STU-001", studentName: "أحمد بن علي", amountPaid: 2000, date: new Date().toLocaleString('ar-DZ'), method: "نقداً (Cash)", month: "أكتوبر 2026", group: "الفوج الأول (مبتدئ)", level: "Level 1 — Explorer" },
      { id: "REC-94802", studentId: "STU-002", studentName: "مريم بوزيد", amountPaid: 2500, date: new Date().toLocaleString('ar-DZ'), method: "نقداً (Cash)", month: "أكتوبر 2026", group: "الفوج الثاني (متقدم)", level: "Level 3 — Creator" }
    ];

    saveData('brainova_students', sampleStudents);
    saveData('brainova_payments', samplePayments);
    showToast('✅ تم توليد البيانات التجريبية بنجاح!', 'success');
    renderAll();
  };

  window.handleSaveAdminPassword = function(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsernameInput').value.trim();
    const newPass = document.getElementById('adminNewPassword').value;
    const confirmPass = document.getElementById('adminConfirmPassword').value;

    if (!username || !newPass) {
      alert('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    if (newPass !== confirmPass) {
      alert('⚠️ كلمة المرور الجديدة وتأكيدها غير متطابقين!');
      return;
    }

    const users = getData('brainova_users') || [
      { id: 'admin-001', username: 'admin', password: 'brainova2026', role: 'admin', name: 'إدارة الأكاديمية' }
    ];

    const adminIndex = users.findIndex(u => u.role === 'admin' || u.id === 'admin-001');
    if (adminIndex !== -1) {
      users[adminIndex].username = username;
      users[adminIndex].password = newPass;
    } else {
      users.unshift({ id: 'admin-001', username: username, password: newPass, role: 'admin', name: 'إدارة الأكاديمية' });
    }

    saveData('brainova_users', users);
    if (window.electronAPI && window.electronAPI.saveUsers) {
      window.electronAPI.saveUsers(users);
    }

    document.getElementById('adminNewPassword').value = '';
    document.getElementById('adminConfirmPassword').value = '';
    showToast('✅ تم تحديث اسم المستخدم وكلمة المرور بنجاح!', 'success');
  };

  window.copyPortalUrl = function() {
    const urlEl = document.getElementById('portalUrl');
    if (urlEl && urlEl.textContent !== '—') {
      navigator.clipboard.writeText(urlEl.textContent);
      showToast('تم نسخ الرابط!', 'success');
    }
  };

  async function loadSettingsInfo() {
    // Load portal QR
    if (window.electronAPI && window.electronAPI.getPortalInfo) {
      try {
        const info = await window.electronAPI.getPortalInfo();
        const urlEl = document.getElementById('portalUrl');
        if (urlEl) urlEl.textContent = info.url;

        const qrContainer = document.getElementById('portalQrContainer');
        if (qrContainer && info.qr) {
          qrContainer.innerHTML = `
            <img src="${info.qr}" style="width:180px; height:180px; border-radius:8px; border:3px solid rgba(2,132,199,0.3);" alt="QR Code">
            <div style="font-size:0.78rem; color:var(--color-text-dim); text-align:center; line-height:1.6;">
              امسح هذا الرمز بكاميرا هاتفك<br>
              <span style="color:#38BDF8; font-weight:700;">${info.ip}:${info.port}</span>
            </div>
          `;
        } else if (qrContainer) {
          qrContainer.innerHTML = `<div style="color:var(--color-text-dim); font-size:0.84rem;">QR غير متاح — ${info.url}</div>`;
        }
      } catch(e) {}
    }

    // Load current user info in settings
    if (window.__currentUser) {
      const nameEl = document.getElementById('settingsUserName');
      const roleEl = document.getElementById('settingsUserRole');
      if (nameEl) nameEl.textContent = window.__currentUser.name;
      if (roleEl) roleEl.textContent = window.__currentUser.role === 'admin' ? 'مدير النظام — وصول كامل' : 'مؤطر — وصول محدود';
    }
  }

  // renderCurrentView — called after persistent store loads
  function renderCurrentView() {
    renderAll();
    loadCurrentUser();
  }

  // Load settings info when settings view is opened
  const origNavigateToView = window.navigateToView;
  document.querySelectorAll('[data-view]').forEach(link => {
    link.addEventListener('click', () => {
      const view = link.getAttribute('data-view');
      if (view === 'settings') {
        setTimeout(loadSettingsInfo, 100);
      } else if (view === 'whatsapp') {
        setTimeout(renderWhatsAppView, 50);
      }
    });
  });

  // ==========================================
  // 10. ZERO-CLICK WHATSAPP AUTOMATION BOT
  // ==========================================
  const DEFAULT_WA_SETTINGS = {
    autoAttendance: true,
    autoPayment: true,
    guardianMaster: true,
    guardianSessionLate: true,
    guardianPreSession: true,
    guardianOverdue: true,
    lateTemplate: 'السلام عليكم السيد(ة) {parent} المحترم(ة)، ولي أمر التلميذ(ة) {student}،\nنعلمكم بتأخره عن موعد حصة الروبوتيك اليوم المقررة على الساعة {time} (فوج: {group}) بأكاديمية Brainova.\nنرجو الاطمئنان عليه.',
    absentTemplate: 'السلام عليكم السيد(ة) {parent} المحترم(ة)، ولي أمر التلميذ(ة) {student}،\nسجلنا غياب التلميذ(ة) اليوم عن حصة الروبوتيك المقررة على الساعة {time} بأكاديمية Brainova.\nنتمنى له السلامة والتوفيق.',
    overdueTemplate: 'تحية طيبة السيد(ة) {parent} المحترم(ة)، ولي أمر التلميذ(ة) {student}،\nنود تذكيركم بانتهاء اشتراك الشهر في تدريب الروبوتيك بأكاديمية Brainova (آخر تسديد: {last_payment} - منذ {days_ago} يوماً).\nيرجى تسوية مستحقات الشهر القادم لضمان استمرارية الحصص.\nشكراً لثقتكم بأكاديمية Brainova.',
    preSessionTemplate: 'تحية طيبة السيد(ة) {parent} المحترم(ة)، ولي أمر التلميذ(ة) {student}،\nنود تذكيركم بموعد حصة الروبوتيك اليوم المقررة على الساعة {time} (فوج: {group}) بأكاديمية Brainova.\nنرجو تشريفنا بالحضور في الوقت المحدد. شكراً لتعاونكم.'
  };

  function getWhatsAppSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem('brainova_wa_settings') || 'null');
      return { ...DEFAULT_WA_SETTINGS, ...(saved || {}) };
    } catch (e) {
      return DEFAULT_WA_SETTINGS;
    }
  }
  window.getWhatsAppSettings = getWhatsAppSettings;

  function saveWhatsAppSettings() {
    const autoAtt = document.getElementById('waAutoAttendanceToggle')?.checked ?? true;
    const autoPay = document.getElementById('waAutoPaymentToggle')?.checked ?? true;
    const guardianMaster = document.getElementById('waGuardianMasterToggle')?.checked ?? true;
    const guardianSessionLate = document.getElementById('waGuardianSessionLateToggle')?.checked ?? true;
    const guardianPreSession = document.getElementById('waGuardianPreSessionToggle')?.checked ?? true;
    const guardianOverdue = document.getElementById('waGuardianOverdueToggle')?.checked ?? true;

    const lateTpl = document.getElementById('waLateTemplateInput')?.value || DEFAULT_WA_SETTINGS.lateTemplate;
    const overdueTpl = document.getElementById('waOverdueTemplateInput')?.value || DEFAULT_WA_SETTINGS.overdueTemplate;

    const newSettings = {
      ...getWhatsAppSettings(),
      autoAttendance: autoAtt,
      autoPayment: autoPay,
      guardianMaster,
      guardianSessionLate,
      guardianPreSession,
      guardianOverdue,
      lateTemplate: lateTpl,
      overdueTemplate: overdueTpl
    };

    localStorage.setItem('brainova_wa_settings', JSON.stringify(newSettings));
    showToast('✅ تم حفظ إعدادات وقوالب مراقب الواتساب الذكي بنجاح!', 'success');
  }
  window.saveWhatsAppSettings = saveWhatsAppSettings;

  // Render WhatsApp View
  async function renderWhatsAppView() {
    const settings = getWhatsAppSettings();

    const lateEl = document.getElementById('waLateTemplateInput');
    if (lateEl && !lateEl.value) lateEl.value = settings.lateTemplate;

    const overdueEl = document.getElementById('waOverdueTemplateInput');
    if (overdueEl && !overdueEl.value) overdueEl.value = settings.overdueTemplate;

    const attToggle = document.getElementById('waAutoAttendanceToggle');
    if (attToggle) attToggle.checked = settings.autoAttendance !== false;

    const payToggle = document.getElementById('waAutoPaymentToggle');
    if (payToggle) payToggle.checked = settings.autoPayment !== false;

    const gMaster = document.getElementById('waGuardianMasterToggle');
    if (gMaster) gMaster.checked = settings.guardianMaster !== false;

    const gSessionLate = document.getElementById('waGuardianSessionLateToggle');
    if (gSessionLate) gSessionLate.checked = settings.guardianSessionLate !== false;

    const gPreSession = document.getElementById('waGuardianPreSessionToggle');
    if (gPreSession) gPreSession.checked = settings.guardianPreSession !== false;

    const gOverdue = document.getElementById('waGuardianOverdueToggle');
    if (gOverdue) gOverdue.checked = settings.guardianOverdue !== false;

    populateWaStudentAutoSelect();
    renderWaQueues();
    renderWaGuardianLogs();
    await refreshWhatsAppStatus();
  }
  window.renderWhatsAppView = renderWhatsAppView;

  // Refresh status from main process
  async function refreshWhatsAppStatus() {
    if (!window.electronAPI || !window.electronAPI.whatsapp) {
      updateWhatsAppUI({ status: 'disconnected' });
      return;
    }
    try {
      const status = await window.electronAPI.whatsapp.getStatus();
      updateWhatsAppUI(status);
    } catch (e) {
      updateWhatsAppUI({ status: 'disconnected' });
    }
  }
  window.refreshWhatsAppStatus = refreshWhatsAppStatus;

  function updateWhatsAppUI(statusObj) {
    const isConnected = statusObj?.status === 'connected' || statusObj?.connected;
    const headerBadge = document.getElementById('waHeaderStatusBadge');
    const sidebarDot = document.getElementById('waSidebarStatusDot');
    const qrBox = document.getElementById('waQrBox');
    const connectedBox = document.getElementById('waConnectedBox');
    const phoneDisplay = document.getElementById('waConnectedPhoneDisplay');
    const qrImg = document.getElementById('waQrImage');
    const qrPlaceholder = document.getElementById('waQrPlaceholder');

    if (sidebarDot) {
      sidebarDot.style.background = isConnected ? '#10B981' : '#EF4444';
      sidebarDot.style.boxShadow = isConnected ? '0 0 6px #10B981' : 'none';
    }

    if (headerBadge) {
      if (isConnected) {
        headerBadge.style.background = 'rgba(16,185,129,0.15)';
        headerBadge.style.color = '#10B981';
        headerBadge.style.borderColor = 'rgba(16,185,129,0.3)';
        headerBadge.textContent = `🟢 متصل بالواتساب (+${statusObj.phone || ''})`;
      } else if (statusObj?.status === 'waiting_qr') {
        headerBadge.style.background = 'rgba(245,158,11,0.15)';
        headerBadge.style.color = '#F59E0B';
        headerBadge.style.borderColor = 'rgba(245,158,11,0.3)';
        headerBadge.textContent = '🟡 في انتظار مسح رمز QR';
      } else {
        headerBadge.style.background = 'rgba(239,68,68,0.15)';
        headerBadge.style.color = '#EF4444';
        headerBadge.style.borderColor = 'rgba(239,68,68,0.3)';
        headerBadge.textContent = '🔴 غير متصل بالواتساب';
      }
    }

    if (isConnected) {
      if (qrBox) qrBox.style.display = 'none';
      if (connectedBox) connectedBox.style.display = 'block';
      if (phoneDisplay) phoneDisplay.textContent = `+${statusObj.phone || ''} (${statusObj.name || 'Brainova'})`;
    } else {
      if (connectedBox) connectedBox.style.display = 'none';
      if (qrBox) qrBox.style.display = 'block';

      if (statusObj?.qr) {
        if (qrImg) {
          qrImg.src = statusObj.qr;
          qrImg.style.display = 'block';
        }
        if (qrPlaceholder) qrPlaceholder.style.display = 'none';
      }
    }
  }

  // Start WhatsApp Client
  async function startWhatsAppClient() {
    if (!window.electronAPI || !window.electronAPI.whatsapp) {
      showToast('ميزة البوت متاحة فقط داخل تطبيق الديسكتوب', 'error');
      return;
    }
    const qrPlaceholder = document.getElementById('waQrPlaceholder');
    const qrImg = document.getElementById('waQrImage');
    if (qrPlaceholder) {
      qrPlaceholder.textContent = 'جاري توليد رمز QR، انتظر ثوانٍ...';
      qrPlaceholder.style.display = 'block';
    }
    if (qrImg) qrImg.style.display = 'none';

    showToast('جاري تشغيل بوت الواتساب وتوليد الرمز...', 'info');
    await window.electronAPI.whatsapp.start();
  }
  window.startWhatsAppClient = startWhatsAppClient;

  // Logout WhatsApp
  async function logoutWhatsApp() {
    if (!confirm('هل أنت متأكد من قطع اتصال بوت الواتساب؟')) return;
    if (!window.electronAPI || !window.electronAPI.whatsapp) return;
    await window.electronAPI.whatsapp.logout();
    showToast('تم قطع الاتصال بالواتساب بنجاح', 'info');
    refreshWhatsAppStatus();
  }
  window.logoutWhatsApp = logoutWhatsApp;

  // Send Test WhatsApp Message
  async function sendTestWhatsAppMessage() {
    const phone = document.getElementById('waTestPhone')?.value.trim();
    const message = document.getElementById('waTestMessage')?.value.trim();
    if (!phone || !message) {
      showToast('يرجى إدخال رقم الهاتف ونص الرسالة للتجربة!', 'error');
      return;
    }
    if (!window.electronAPI || !window.electronAPI.whatsapp) {
      showToast('ميزة البوت متاحة داخل تطبيق الديسكتوب', 'error');
      return;
    }

    showToast('جاري إرسال الرسالة التجريبية...', 'info');
    const res = await window.electronAPI.whatsapp.sendMessage(phone, message);
    if (res && res.success) {
      showToast(`✅ تم إرسال الرسالة التجريبية بنجاح إلى (${phone})!`, 'success');
    } else {
      showToast(`فشل الإرسال: ${res?.error || 'خطأ غير معروف'}`, 'error');
    }
  }
  window.sendTestWhatsAppMessage = sendTestWhatsAppMessage;

  // --- AUTOMATIC STUDENT & PARENT AUTO-SELECTION ---
  function populateWaStudentAutoSelect() {
    const select = document.getElementById('waStudentAutoSelect');
    if (!select) return;
    const students = getData('brainova_students');
    const currentVal = select.value;

    select.innerHTML = '<option value="">-- اضغط هنا لاختيار تلميذ وولي أمر أوتوماتيكياً --</option>' +
      students.map(s => {
        const pName = s.parentName && s.parentName.trim() ? s.parentName.trim() : 'غير مسجل';
        const phone = s.parentPhone || 'بدون هاتف';
        return `<option value="${s.id}">${s.name} | الولي: ${pName} (${phone})</option>`;
      }).join('');

    if (currentVal) select.value = currentVal;
  }
  window.populateWaStudentAutoSelect = populateWaStudentAutoSelect;

  function handleWaStudentAutoSelectChange() {
    const select = document.getElementById('waStudentAutoSelect');
    const parentNameEl = document.getElementById('waAutoParentName');
    const phoneEl = document.getElementById('waTestPhone');
    if (!select) return;

    const studentId = select.value;
    if (!studentId) {
      if (parentNameEl) parentNameEl.value = '';
      if (phoneEl) phoneEl.value = '';
      const msgEl = document.getElementById('waTestMessage');
      if (msgEl) msgEl.value = '';
      return;
    }

    const students = getData('brainova_students');
    const stu = students.find(s => s.id === studentId);
    if (!stu) return;

    const parentName = stu.parentName && stu.parentName.trim() ? stu.parentName.trim() : `ولي أمر ${stu.name}`;
    if (parentNameEl) parentNameEl.value = parentName;
    if (phoneEl) phoneEl.value = stu.parentPhone || '';

    // Automatically load overdue or late template for this selected student
    loadAutoTemplateForSelected('overdue');
  }
  window.handleWaStudentAutoSelectChange = handleWaStudentAutoSelectChange;

  function loadAutoTemplateForSelected(type) {
    const select = document.getElementById('waStudentAutoSelect');
    const msgEl = document.getElementById('waTestMessage');
    if (!select || !msgEl) return;

    const studentId = select.value;
    if (!studentId) {
      showToast('يرجى اختيار التلميذ من القائمة أولاً ليتم تجهيز الرسالة باسمه واسم وليه أوتوماتيكياً!', 'info');
      return;
    }

    const students = getData('brainova_students');
    const allPayments = getData('brainova_payments');
    const stu = students.find(s => s.id === studentId);
    if (!stu) return;

    const settings = getWhatsAppSettings();
    const parentName = stu.parentName && stu.parentName.trim() ? stu.parentName.trim() : `ولي أمر ${stu.name}`;
    const timeline = getStudentPaymentTimeline(stu.id, stu, allPayments);

    let template = settings.overdueTemplate;
    if (type === 'late') template = settings.lateTemplate;
    else if (type === 'absent') template = settings.absentTemplate;

    const text = template
      .replace(/{student}/g, stu.name)
      .replace(/{parent}/g, parentName)
      .replace(/{group}/g, stu.group || 'الفوج العام')
      .replace(/{time}/g, stu.sessionTime || '16:00 - 18:00')
      .replace(/{date}/g, new Date().toLocaleDateString('ar-DZ'))
      .replace(/{last_payment}/g, timeline.lastDateStr)
      .replace(/{days_ago}/g, String(timeline.daysElapsed));

    msgEl.value = text;
    showToast(`تم تجهيز الرسالة لولي أمر (${stu.name}) أوتوماتيكياً!`, 'success');
  }
  window.loadAutoTemplateForSelected = loadAutoTemplateForSelected;

  // --- LIVE QUEUES: AUTOMATICALLY DETECTED PARENTS & STUDENTS ---
  function renderWaQueues() {
    const students = getData('brainova_students');
    const allPayments = getData('brainova_payments');
    const allAttendance = getData('brainova_attendance');

    // 1. Overdue Queue
    const overdueStudents = students.filter(s => {
      const timeline = getStudentPaymentTimeline(s.id, s, allPayments);
      return timeline.status === 'overdue';
    });

    const overdueCountEl = document.getElementById('waOverdueCountBadge');
    const overdueListCountEl = document.getElementById('waOverdueListCount');
    const overdueTbody = document.getElementById('waOverdueTableBody');

    if (overdueCountEl) overdueCountEl.textContent = overdueStudents.length;
    if (overdueListCountEl) overdueListCountEl.textContent = overdueStudents.length;

    if (overdueTbody) {
      if (overdueStudents.length === 0) {
        overdueTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:18px; color:var(--color-text-dim);">🎉 رائع! لا يوجد أي تلاميذ متأخرين عن تسديد الشهر حالياً.</td></tr>`;
      } else {
        overdueTbody.innerHTML = overdueStudents.map(s => {
          const timeline = getStudentPaymentTimeline(s.id, s, allPayments);
          const pName = s.parentName && s.parentName.trim() ? s.parentName.trim() : `ولي أمر ${s.name}`;
          const phone = s.parentPhone || '<span style="color:#EF4444;">غير مسجل</span>';
          return `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:10px 12px; font-weight:700; color:#f8fafc;">${s.name}</td>
              <td style="padding:10px 12px; color:#38BDF8; font-weight:600;">${pName}</td>
              <td style="padding:10px 12px; font-family:monospace;">${phone}</td>
              <td style="padding:10px 12px; color:#94A3B8;">${timeline.lastDateStr}</td>
              <td style="padding:10px 12px;"><span style="color:#EF4444; font-weight:700;">${timeline.elapsedText}</span></td>
              <td style="padding:10px 12px; text-align:center;">
                <button type="button" class="btn btn--outline btn--small" style="font-size:0.75rem; color:#25D366; border-color:rgba(37,211,102,0.4);" onclick="sendIndividualWaPaymentReminder('${s.id}')">
                  ⚡ إرسال للولي
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // 2. Attendance Late/Absent Queue
    const todayStr = new Date().toISOString().slice(0, 10);
    let todayAtt = allAttendance.filter(a => a.date === todayStr && (a.status === 'late' || a.status === 'absent'));
    if (todayAtt.length === 0) {
      todayAtt = allAttendance.filter(a => a.status === 'late' || a.status === 'absent').slice(0, 10);
    }

    const attCountEl = document.getElementById('waAttendanceCountBadge');
    const attListCountEl = document.getElementById('waAttendanceListCount');
    const attTbody = document.getElementById('waAttendanceTableBody');

    if (attCountEl) attCountEl.textContent = todayAtt.length;
    if (attListCountEl) attListCountEl.textContent = todayAtt.length;

    if (attTbody) {
      if (todayAtt.length === 0) {
        attTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:18px; color:var(--color-text-dim);">✅ سجل الحضور ممتاز، لا يوجد متأخرون أو غائبون مسجلون.</td></tr>`;
      } else {
        attTbody.innerHTML = todayAtt.map(a => {
          const stu = students.find(s => s.id === a.studentId) || {};
          const pName = stu.parentName && stu.parentName.trim() ? stu.parentName.trim() : `ولي أمر ${a.studentName || 'التلميذ'}`;
          const phone = stu.parentPhone || '<span style="color:#EF4444;">غير مسجل</span>';
          const statusBadge = a.status === 'late' 
            ? '<span style="color:#F59E0B; background:rgba(245,158,11,0.1); padding:2px 8px; border-radius:4px; font-weight:700;">متأخر ⏳</span>'
            : '<span style="color:#EF4444; background:rgba(239,68,68,0.1); padding:2px 8px; border-radius:4px; font-weight:700;">غائب ❌</span>';
          return `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:10px 12px; font-weight:700; color:#f8fafc;">${a.studentName || stu.name}</td>
              <td style="padding:10px 12px; color:#38BDF8; font-weight:600;">${pName}</td>
              <td style="padding:10px 12px; font-family:monospace;">${phone}</td>
              <td style="padding:10px 12px; color:#94A3B8;">${a.groupName || stu.group || '—'} (${a.sessionTime || '—'})</td>
              <td style="padding:10px 12px;">${statusBadge}</td>
              <td style="padding:10px 12px; text-align:center;">
                <button type="button" class="btn btn--outline btn--small" style="font-size:0.75rem; color:#25D366; border-color:rgba(37,211,102,0.4);" onclick="sendIndividualWaAttendanceAlert('${a.id}')">
                  ⚡ إرسال للولي
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }
  window.renderWaQueues = renderWaQueues;

  function switchWaQueueTab(tab) {
    const overdueSec = document.getElementById('waQueueOverdueSection');
    const attSec = document.getElementById('waQueueAttendanceSection');
    const overdueBtn = document.getElementById('waQueueTabOverdueBtn');
    const attBtn = document.getElementById('waQueueTabAttendanceBtn');

    if (tab === 'overdue') {
      if (overdueSec) overdueSec.style.display = 'block';
      if (attSec) attSec.style.display = 'none';
      if (overdueBtn) { overdueBtn.className = 'btn btn--primary btn--small'; }
      if (attBtn) { attBtn.className = 'btn btn--outline btn--small'; }
    } else {
      if (overdueSec) overdueSec.style.display = 'none';
      if (attSec) attSec.style.display = 'block';
      if (overdueBtn) { overdueBtn.className = 'btn btn--outline btn--small'; }
      if (attBtn) { attBtn.className = 'btn btn--primary btn--small'; }
    }
  }
  window.switchWaQueueTab = switchWaQueueTab;

  async function sendIndividualWaPaymentReminder(studentId) {
    if (!window.electronAPI || !window.electronAPI.whatsapp) {
      showToast('ميزة البوت متاحة فقط داخل تطبيق الديسكتوب', 'error');
      return;
    }
    const waStatus = await window.electronAPI.whatsapp.getStatus();
    if (!waStatus || !waStatus.connected) {
      showToast('بوت الواتساب غير متصل حالياً! يرجى ربط الرقم أولاً.', 'error');
      return;
    }

    const students = getData('brainova_students');
    const allPayments = getData('brainova_payments');
    const s = students.find(item => item.id === studentId);
    if (!s || !s.parentPhone) {
      showToast('رقم هاتف ولي الأمر غير مسجل لهذا التلميذ!', 'error');
      return;
    }

    const settings = getWhatsAppSettings();
    const timeline = getStudentPaymentTimeline(s.id, s, allPayments);
    const parentName = s.parentName && s.parentName.trim() ? s.parentName.trim() : `ولي أمر ${s.name}`;

    const text = settings.overdueTemplate
      .replace(/{student}/g, s.name)
      .replace(/{parent}/g, parentName)
      .replace(/{last_payment}/g, timeline.lastDateStr)
      .replace(/{days_ago}/g, String(timeline.daysElapsed));

    showToast(`جاري إرسال تذكير لولي أمر (${s.name})...`, 'info');
    const res = await window.electronAPI.whatsapp.sendMessage(s.parentPhone, text);
    if (res && res.success) {
      s.lastWaReminderDate = new Date().toISOString().slice(0, 10);
      saveData('brainova_students', students);
      showToast(`✅ تم إرسال تذكير التسديد لولي أمر (${s.name}) بنجاح!`, 'success');
      renderWaQueues();
    } else {
      showToast(`فشل الإرسال: ${res?.error || 'خطأ غير معروف'}`, 'error');
    }
  }
  window.sendIndividualWaPaymentReminder = sendIndividualWaPaymentReminder;

  async function sendIndividualWaAttendanceAlert(attendanceId) {
    if (!window.electronAPI || !window.electronAPI.whatsapp) {
      showToast('ميزة البوت متاحة فقط داخل تطبيق الديسكتوب', 'error');
      return;
    }
    const waStatus = await window.electronAPI.whatsapp.getStatus();
    if (!waStatus || !waStatus.connected) {
      showToast('بوت الواتساب غير متصل حالياً! يرجى ربط الرقم أولاً.', 'error');
      return;
    }

    const allAttendance = getData('brainova_attendance');
    const students = getData('brainova_students');
    const att = allAttendance.find(a => a.id === attendanceId);
    if (!att) return;

    const s = students.find(item => item.id === att.studentId);
    if (!s || !s.parentPhone) {
      showToast('رقم هاتف ولي الأمر غير مسجل!', 'error');
      return;
    }

    const settings = getWhatsAppSettings();
    const parentName = s.parentName && s.parentName.trim() ? s.parentName.trim() : `ولي أمر ${s.name}`;
    const template = att.status === 'late' ? settings.lateTemplate : settings.absentTemplate;

    const text = template
      .replace(/{student}/g, s.name)
      .replace(/{parent}/g, parentName)
      .replace(/{group}/g, att.groupName || s.group || '—')
      .replace(/{time}/g, att.sessionTime || '—')
      .replace(/{date}/g, att.date || 'اليوم');

    showToast(`جاري إرسال تنبيه الحضور لولي أمر (${s.name})...`, 'info');
    const res = await window.electronAPI.whatsapp.sendMessage(s.parentPhone, text);
    if (res && res.success) {
      showToast(`✅ تم إرسال تنبيه الحضور لولي أمر (${s.name}) بنجاح!`, 'success');
    } else {
      showToast(`فشل الإرسال: ${res?.error || 'خطأ غير معروف'}`, 'error');
    }
  }
  window.sendIndividualWaAttendanceAlert = sendIndividualWaAttendanceAlert;

  async function triggerBatchAttendanceAlerts() {
    if (!window.electronAPI || !window.electronAPI.whatsapp) {
      showToast('ميزة البوت متاحة فقط داخل تطبيق الديسكتوب', 'error');
      return;
    }
    const waStatus = await window.electronAPI.whatsapp.getStatus();
    if (!waStatus || !waStatus.connected) {
      showToast('بوت الواتساب غير متصل حالياً! يرجى ربط الرقم أولاً.', 'error');
      return;
    }

    const allAttendance = getData('brainova_attendance');
    const students = getData('brainova_students');
    const settings = getWhatsAppSettings();

    const todayStr = new Date().toISOString().slice(0, 10);
    let todayAtt = allAttendance.filter(a => a.date === todayStr && (a.status === 'late' || a.status === 'absent'));
    if (todayAtt.length === 0) {
      todayAtt = allAttendance.filter(a => a.status === 'late' || a.status === 'absent').slice(0, 10);
    }

    if (todayAtt.length === 0) {
      showToast('لا يوجد طلاب مسجلون كمتأخرين أو غائبين حالياً!', 'info');
      return;
    }

    showToast(`جاري إرسال تنبيهات الحضور لـ (${todayAtt.length}) من الأولياء آلياً...`, 'info');
    let count = 0;
    for (const att of todayAtt) {
      const s = students.find(item => item.id === att.studentId);
      if (!s || !s.parentPhone) continue;

      const parentName = s.parentName && s.parentName.trim() ? s.parentName.trim() : `ولي أمر ${s.name}`;
      const template = att.status === 'late' ? settings.lateTemplate : settings.absentTemplate;
      const text = template
        .replace(/{student}/g, s.name)
        .replace(/{parent}/g, parentName)
        .replace(/{group}/g, att.groupName || s.group || '—')
        .replace(/{time}/g, att.sessionTime || '—')
        .replace(/{date}/g, att.date || 'اليوم');

      const res = await window.electronAPI.whatsapp.sendMessage(s.parentPhone, text);
      if (res && res.success) count++;
      await new Promise(r => setTimeout(r, 2500));
    }

    showToast(`✅ تم إرسال (${count}) تنبيهات حضور للأولياء بنجاح!`, 'success');
  }
  window.triggerBatchAttendanceAlerts = triggerBatchAttendanceAlerts;

  // --- TRIGGER 1: AUTO ATTENDANCE (ZERO-CLICK) ---
  async function triggerAutoAttendanceWhatsApp(student, status, time, date) {
    if (!window.electronAPI || !window.electronAPI.whatsapp) return;
    const settings = getWhatsAppSettings();
    if (!settings.autoAttendance) return;
    if (!student || !student.parentPhone) return;

    try {
      const waStatus = await window.electronAPI.whatsapp.getStatus();
      if (!waStatus || !waStatus.connected) return;

      const parentName = student.parentName && student.parentName.trim() ? student.parentName.trim() : `ولي أمر ${student.name}`;
      const template = status === 'late' ? settings.lateTemplate : settings.absentTemplate;
      const text = template
        .replace(/{student}/g, student.name || 'التلميذ')
        .replace(/{parent}/g, parentName)
        .replace(/{group}/g, student.group || 'الفوج')
        .replace(/{time}/g, time || '—')
        .replace(/{date}/g, date || 'اليوم');

      const res = await window.electronAPI.whatsapp.sendMessage(student.parentPhone, text);
      if (res && res.success) {
        showToast(`🤖 أرسل البوت تنبيهاً تلقائياً لولي أمر (${student.name}) عبر واتساب`, 'success');
      }
    } catch (e) {
      console.error('[WhatsApp Auto Attendance Error]:', e);
    }
  }
  window.triggerAutoAttendanceWhatsApp = triggerAutoAttendanceWhatsApp;

  // --- TRIGGER 2: BATCH & AUTOMATIC PAYMENT REMINDERS (ZERO-CLICK) ---
  async function triggerBatchPaymentReminders(isSilentAuto = false) {
    if (!window.electronAPI || !window.electronAPI.whatsapp) {
      if (!isSilentAuto) showToast('ميزة البوت متاحة فقط داخل تطبيق الديسكتوب', 'error');
      return;
    }

    const waStatus = await window.electronAPI.whatsapp.getStatus();
    if (!waStatus || !waStatus.connected) {
      if (!isSilentAuto) showToast('بوت الواتساب غير متصل! يرجى ربط الرقم أولاً من قسم البوت.', 'error');
      return;
    }

    const settings = getWhatsAppSettings();
    const students = getData('brainova_students');
    const allPayments = getData('brainova_payments');

    // Find overdue students
    const overdueStudents = students.filter(s => {
      const timeline = getStudentPaymentTimeline(s.id, s, allPayments);
      return timeline.status === 'overdue' && s.parentPhone;
    });

    if (overdueStudents.length === 0) {
      if (!isSilentAuto) showToast('لا يوجد طلاب متأخرون عن التسديد حالياً! كل الاشتراكات مسواة 👍', 'success');
      return;
    }

    if (!isSilentAuto) {
      showToast(`جاري إرسال تذكيرات التسديد لـ (${overdueStudents.length}) من الأولياء آلياً...`, 'info');
    }

    let sentCount = 0;
    const todayStr = new Date().toISOString().slice(0, 10);

    for (const s of overdueStudents) {
      // Avoid sending reminder more than once every 4 days
      if (s.lastWaReminderDate === todayStr) continue;

      const timeline = getStudentPaymentTimeline(s.id, s, allPayments);
      const parentName = s.parentName && s.parentName.trim() ? s.parentName.trim() : `ولي أمر ${s.name}`;

      const text = settings.overdueTemplate
        .replace(/{student}/g, s.name)
        .replace(/{parent}/g, parentName)
        .replace(/{last_payment}/g, timeline.lastDateStr)
        .replace(/{days_ago}/g, String(timeline.daysElapsed));

      const res = await window.electronAPI.whatsapp.sendMessage(s.parentPhone, text);
      if (res && res.success) {
        sentCount++;
        s.lastWaReminderDate = todayStr;
      }
      // Small safety delay between messages
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if (sentCount > 0) {
      saveData('brainova_students', students);
      showToast(`✅ أرسل البوت (${sentCount}) تذكير تسديد عبر واتساب للأولياء بنجاح!`, 'success');
      renderWaQueues();
    } else if (!isSilentAuto) {
      showToast('تم إرسال تذكيرات لهؤلاء الأولياء اليوم مسبقاً لمنع التكرار.', 'info');
    }
  }
  window.triggerBatchPaymentReminders = triggerBatchPaymentReminders;

  // ==========================================
  // 11. AUTONOMOUS AI GUARDIAN & REAL-TIME ENGINE
  // ==========================================
  function getWaGuardianLogs() {
    try {
      return JSON.parse(localStorage.getItem('brainova_wa_guardian_logs') || '[]');
    } catch(e) { return []; }
  }

  function addWaGuardianLog(msg) {
    const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logs = getWaGuardianLogs();
    logs.unshift(`[${timeStr}] ${msg}`);
    if (logs.length > 50) logs.pop();
    localStorage.setItem('brainova_wa_guardian_logs', JSON.stringify(logs));
    renderWaGuardianLogs();
  }
  window.addWaGuardianLog = addWaGuardianLog;

  function renderWaGuardianLogs() {
    const logBox = document.getElementById('waGuardianLiveLog');
    if (!logBox) return;
    const logs = getWaGuardianLogs();
    if (logs.length === 0) {
      logBox.innerHTML = '<span style="color:#64748B;">🤖 المراقب الآلي في حالة استعداد وجاهز لبدء دورات الفحص...</span>';
    } else {
      logBox.innerHTML = logs.map(l => `<div>${l}</div>`).join('');
    }
  }
  window.renderWaGuardianLogs = renderWaGuardianLogs;

  function clearWaGuardianLogs() {
    localStorage.removeItem('brainova_wa_guardian_logs');
    renderWaGuardianLogs();
    showToast('تم مسح سجل قرارات المراقب الآلي.', 'info');
  }
  window.clearWaGuardianLogs = clearWaGuardianLogs;

  // --- FULL AUTONOMOUS AUDIT & DISPATCH CYCLE ---
  async function runAutonomousGuardianLoop(isManual = false) {
    if (!window.electronAPI || !window.electronAPI.whatsapp) {
      if (isManual) showToast('ميزة المراقب المستقل متاحة داخل تطبيق الديسكتوب فقط', 'error');
      return;
    }

    const settings = getWhatsAppSettings();
    const statusBadge = document.getElementById('waGuardianStatusBadge');

    if (settings.guardianMaster === false) {
      if (statusBadge) {
        statusBadge.textContent = '🔴 المراقب معطل من الإعدادات';
        statusBadge.style.color = '#EF4444';
        statusBadge.style.background = 'rgba(239,68,68,0.15)';
        statusBadge.style.borderColor = 'rgba(239,68,68,0.3)';
      }
      if (isManual) showToast('المراقب المستقل معطل حالياً من الخيارات!', 'info');
      return;
    }

    // Check WhatsApp connection
    let waStatus = { connected: false };
    try {
      waStatus = await window.electronAPI.whatsapp.getStatus();
    } catch(e) {}

    if (!waStatus || !waStatus.connected) {
      if (statusBadge) {
        statusBadge.textContent = '🟡 في انتظار اتصال البوت بالواتساب';
        statusBadge.style.color = '#F59E0B';
        statusBadge.style.background = 'rgba(245,158,11,0.15)';
        statusBadge.style.borderColor = 'rgba(245,158,11,0.3)';
      }
      if (isManual) showToast('بوت الواتساب غير متصل حالياً! يرجى مسح رمز QR ليعمل المراقب.', 'error');
      return;
    }

    if (statusBadge) {
      statusBadge.textContent = '🟢 نشط ويعمل في الخلفية';
      statusBadge.style.color = '#10B981';
      statusBadge.style.background = 'rgba(16,185,129,0.15)';
      statusBadge.style.borderColor = 'rgba(16,185,129,0.3)';
    }

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    let sentAlerts = {};
    try {
      sentAlerts = JSON.parse(localStorage.getItem('brainova_wa_sent_alerts') || '{}');
    } catch(e) { sentAlerts = {}; }

    // Clean old alerts keys if not today
    if (sentAlerts.__date !== todayStr) {
      sentAlerts = { __date: todayStr };
    }

    let actionsCount = 0;

    // ──────────────────────────────────────────────────────────
    // 1. AUTONOMOUS AUDIT: OVERDUE MONTHLY PAYMENTS
    // ──────────────────────────────────────────────────────────
    if (settings.guardianOverdue) {
      const students = getData('brainova_students');
      const allPayments = getData('brainova_payments');

      const overdueStudents = students.filter(s => {
        const timeline = getStudentPaymentTimeline(s.id, s, allPayments);
        return timeline.status === 'overdue' && s.parentPhone;
      });

      for (const s of overdueStudents) {
        if (s.lastWaReminderDate === todayStr) continue;

        const timeline = getStudentPaymentTimeline(s.id, s, allPayments);
        const parentName = s.parentName && s.parentName.trim() ? s.parentName.trim() : `ولي أمر ${s.name}`;

        const text = settings.overdueTemplate
          .replace(/{student}/g, s.name)
          .replace(/{parent}/g, parentName)
          .replace(/{last_payment}/g, timeline.lastDateStr)
          .replace(/{days_ago}/g, String(timeline.daysElapsed));

        const res = await window.electronAPI.whatsapp.sendMessage(s.parentPhone, text);
        if (res && res.success) {
          s.lastWaReminderDate = todayStr;
          actionsCount++;
          addWaGuardianLog(`💳 [تسديد أوتوماتيكي] تم إرسال تذكير انتهاء الشهر لولي أمر (${s.name})`);
        }
        await new Promise(r => setTimeout(r, 2500));
      }

      if (actionsCount > 0) {
        saveData('brainova_students', students);
      }
    }

    // ──────────────────────────────────────────────────────────
    // 2. AUTONOMOUS AUDIT: SESSIONS TIMING & REAL-TIME LATE ALERTS
    // ──────────────────────────────────────────────────────────
    if (settings.guardianSessionLate || settings.guardianPreSession) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = days[now.getDay()];
      const curMin = now.getHours() * 60 + now.getMinutes();

      const schedule = getData('brainova_schedule') || [];
      const students = getData('brainova_students');
      const allAttendance = getData('brainova_attendance');

      const todaySessions = schedule.filter(s => s.day === currentDay);

      for (const session of todaySessions) {
        const [sh, sm] = (session.startTime || '00:00').split(':').map(Number);
        const startMin = sh * 60 + (sm || 0);

        const enrolledMap = new Map();
        students.forEach(s => {
          if (s.groupId === session.groupId || s.group === session.groupName || (s.group && session.groupName && (s.group.includes(session.groupName) || session.groupName.includes(s.group)))) {
            enrolledMap.set(s.id, s);
          }
        });
        const enrolledStudents = Array.from(enrolledMap.values());

        // A) Pre-Session Reminder (30-40 min before start)
        if (settings.guardianPreSession && curMin >= startMin - 40 && curMin < startMin) {
          const preKey = `pre_session_${session.id}_${todayStr}`;
          if (!sentAlerts[preKey]) {
            sentAlerts[preKey] = true;
            localStorage.setItem('brainova_wa_sent_alerts', JSON.stringify(sentAlerts));

            let preCount = 0;
            for (const stu of enrolledStudents) {
              if (!stu.parentPhone) continue;
              const parentName = stu.parentName && stu.parentName.trim() ? stu.parentName.trim() : `ولي أمر ${stu.name}`;
              const text = (settings.preSessionTemplate || DEFAULT_WA_SETTINGS.preSessionTemplate)
                .replace(/{student}/g, stu.name)
                .replace(/{parent}/g, parentName)
                .replace(/{group}/g, session.groupName || 'الفوج')
                .replace(/{time}/g, session.startTime || '—');

              const res = await window.electronAPI.whatsapp.sendMessage(stu.parentPhone, text);
              if (res && res.success) preCount++;
              await new Promise(r => setTimeout(r, 2000));
            }
            addWaGuardianLog(`🕒 [تذكير مسبق] أرسل البوت تذكيراً لحصة (${session.startTime}) لـ (${preCount}) أولياء في (${session.groupName}).`);
          }
        }

        // B) Real-Time Late / Absent Detection (15 to 70 min after start)
        if (settings.guardianSessionLate && curMin >= startMin + 15 && curMin <= startMin + 75) {
          const todayAtt = allAttendance.filter(a => a.date === todayStr);

          for (const stu of enrolledStudents) {
            if (!stu.parentPhone) continue;
            const att = todayAtt.find(a => a.studentId === stu.id);

            // If marked late or absent
            if (att && (att.status === 'late' || att.status === 'absent')) {
              const lateKey = `late_${stu.id}_${todayStr}`;
              if (!sentAlerts[lateKey]) {
                sentAlerts[lateKey] = true;
                localStorage.setItem('brainova_wa_sent_alerts', JSON.stringify(sentAlerts));

                const parentName = stu.parentName && stu.parentName.trim() ? stu.parentName.trim() : `ولي أمر ${stu.name}`;
                const tpl = att.status === 'late' ? settings.lateTemplate : settings.absentTemplate;
                const text = tpl
                  .replace(/{student}/g, stu.name)
                  .replace(/{parent}/g, parentName)
                  .replace(/{group}/g, session.groupName || stu.group || '—')
                  .replace(/{time}/g, session.startTime || '—')
                  .replace(/{date}/g, 'اليوم');

                const res = await window.electronAPI.whatsapp.sendMessage(stu.parentPhone, text);
                if (res && res.success) {
                  addWaGuardianLog(`⏳ [تأخر آلي] رصد تأخر (${stu.name}) عن حصة (${session.startTime}) وتم إرسال تنبيه لوالده.`);
                }
                await new Promise(r => setTimeout(r, 2000));
              }
            }
          }
        }
      }
    }

    renderWaQueues();
    if (isManual) {
      showToast('✅ اكتملت دورة الفحص والتحليل الذاتي بنجاح!', 'success');
    }
  }
  window.runAutonomousGuardianLoop = runAutonomousGuardianLoop;

  // Setup IPC listeners on DOM ready
  if (window.electronAPI && window.electronAPI.whatsapp) {
    window.electronAPI.whatsapp.onQr((qr) => {
      updateWhatsAppUI({ status: 'waiting_qr', qr });
    });
    window.electronAPI.whatsapp.onStatus((status) => {
      updateWhatsAppUI(status);
    });
    setTimeout(refreshWhatsAppStatus, 1500);

    // Initial Guardian audit after 8 seconds of startup
    setTimeout(() => {
      runAutonomousGuardianLoop(false);
    }, 8000);

    // Autonomous Heartbeat: runs every 60 seconds completely in background!
    setInterval(() => {
      runAutonomousGuardianLoop(false);
    }, 60000);
  }

  // Initial render (fallback if loadFromPersistentStore already ran)
  renderAll();
});

