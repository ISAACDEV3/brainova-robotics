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

  window.getData = function(key) {
    if (MemoryCache[key] !== undefined) return MemoryCache[key];
    try {
      MemoryCache[key] = JSON.parse(localStorage.getItem(key) || 'null');
      if (MemoryCache[key] === null) MemoryCache[key] = [];
    } catch(e) {
      MemoryCache[key] = [];
    }
    return MemoryCache[key];
  };

  window.saveData = function(key, data) {
    MemoryCache[key] = data;
    // Sync to localStorage (fast, synchronous UI layer)
    requestAnimationFrame(() => {
      localStorage.setItem(key, JSON.stringify(data));
    });
    // Sync to electron-store (persistent disk storage, fire-and-forget)
    if (window.electronAPI && window.electronAPI.store) {
      window.electronAPI.store.set(key, data);
    }
  };

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

  window.showToast = function(messageKey, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : '⚠️');
    
    const currentLang = document.documentElement.lang || 'ar';
    const text = dashTranslations[currentLang]?.[messageKey] || messageKey;
    
    toast.innerHTML = `<span>${icon}</span> <span>${text}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 200);
    }, 2500);
  };

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
  
  window.renderAll = function() {
    updateHeaderBadges();
    renderActiveView();
  };

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



  // --- STUDENTS ---
  function renderStudents() {
    const students = filterData(getData('brainova_students'), searchQuery);
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color:var(--color-text-muted);">لا توجد بيانات (No data)</td></tr>`;
      return;
    }
    
    tbody.innerHTML = students.map(stu => {
      const balance = Number(stu.balance) || 0;
      const sessions = Number(stu.sessionsRemaining) || 0;
      let badgeHtml = '';
      if (sessions > 0) {
        badgeHtml = `<span class="payment-badge paid">✅ ${sessions} حصص (${balance} دج)</span>`;
      } else if (balance < 0) {
        badgeHtml = `<span class="payment-badge overdue">⚠️ دين: ${balance} دج</span>`;
      } else {
        badgeHtml = `<span class="payment-badge partial">⏳ نفدت الحصص</span>`;
      }

      return `
        <tr>
          <td><span style="font-family:monospace; font-weight:700; color:var(--color-primary);">${stu.id}</span></td>
          <td>
            <a href="#" onclick="openStudentProfile('${stu.id}'); return false;" style="color:#fff; font-weight:700; text-decoration:underline;">
              ${stu.name}
            </a>
          </td>
          <td><span style="color:var(--color-text-muted);">${stu.group || 'غير محدد'}</span><br><small style="color:var(--color-accent);">${stu.level || ''}</small></td>
          <td>
            <div>${stu.parentName || '—'}</div>
            <a href="tel:${stu.parentPhone}" dir="ltr" style="color:var(--color-primary); font-size:0.85rem;">${stu.parentPhone || '—'}</a>
          </td>
          <td>${badgeHtml}</td>
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

    const allStudents = getData('brainova_students');
    const groupStudents = allStudents.filter(s => s.group === selectedGroup);
    const existingRecords = getData('brainova_attendance').filter(a => a.date === selectedDate && (a.groupName === selectedGroup || a.groupId === selectedGroup));

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
                <a href="https://wa.me/${stu.parentPhone.replace(/\D/g, '').replace(/^0/, '213')}?text=${encodeURIComponent('السلام عليكم ولي أمر التلميذ(ة) ' + stu.name + '، نعلمكم بغياب الطالب عن ورشة الروبوتيك المقررة اليوم بتاريخ ' + selectedDate + '. يرجى التواصل معنا في حال وجود أي استفسار.')}" target="_blank" class="btn btn--outline btn--small" style="color:#25D366; border-color:rgba(37,211,102,0.3);" title="إشعار الولي عبر واتساب">
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
    const selectedGroup = groupSelect.value;
    const selectedDate = dateInput.value;

    let allAttendance = getData('brainova_attendance');
    allAttendance = allAttendance.filter(a => !(a.date === selectedDate && a.groupName === selectedGroup));

    const students = getData('brainova_students');
    const nowStr = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    for (const [studentId, data] of Object.entries(activeAttendanceDraft)) {
      const stu = students.find(s => s.id === studentId);
      allAttendance.push({
        id: 'ATT-' + Date.now() + '-' + studentId,
        date: selectedDate,
        groupName: selectedGroup,
        studentId,
        studentName: stu ? stu.name : 'Unknown',
        status: data.status,
        note: data.note
      });

      if (stu && (data.status === 'present' || data.status === 'late')) {
        stu.lastAttendance = `${selectedDate} ${nowStr}`;
        if (stu.sessionsRemaining > 0) {
          stu.sessionsRemaining = Math.max(0, stu.sessionsRemaining - 1);
        }
      }
    }

    saveData('brainova_attendance', allAttendance);
    saveData('brainova_students', students);
    showToast('تم حفظ سجل الحضور والغياب بنجاح!', 'success');
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

    const opNumber = String(Math.floor(10000 + Math.random() * 90000));
    const prevBalance = stu.balance || 0;
    const currentBalance = prevBalance + amount;
    const currentSessions = (stu.sessionsRemaining || 0) + sessions;

    stu.balance = currentBalance;
    stu.sessionsRemaining = currentSessions;
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

  // --- RECEIPT MODAL ---
  window.openReceiptModal = function(paymentId) {
    const payments = getData('brainova_payments');
    const payment = payments.find(p => p.id === paymentId) || payments[0];
    if (!payment) {
      showToast('لم يتم العثور على بيانات الوصل!', 'error');
      return;
    }

    const students = getData('brainova_students');
    const stu = students.find(s => s.id === payment.studentId) || students[0];

    const opNum = payment.opNumber || (payment.id ? payment.id.replace('REC-', '') : '94789');
    const username = (stu && stu.username) ? stu.username : (payment.username || 'user');
    const password = (stu && stu.password) ? stu.password : (payment.password || 'pass');

    document.getElementById('rcptOpNumber').textContent = opNum;
    document.getElementById('rcptOpNumberCell').textContent = opNum;
    document.getElementById('rcptStudentName').textContent = (stu && stu.name) || payment.studentName || '—';
    document.getElementById('rcptLevelGroup').textContent = `${(stu && stu.level) || payment.level || 'المستوى الأول'} • ${(stu && stu.group) || payment.group || 'الفوج أ'}`;
    document.getElementById('rcptDateTime').textContent = payment.date || new Date().toLocaleString('ar-DZ');
    document.getElementById('rcptAmountPaid').textContent = `${Number(payment.amountPaid || 2000).toLocaleString()} دج`;

    document.getElementById('rcptPrevBalance').textContent = `${payment.prevBalance || 0} دج`;
    document.getElementById('rcptCurrentBalance').textContent = `${stu ? stu.sessionsRemaining : (payment.sessionsPurchased || 4)} حصص متبقية / ${stu ? stu.balance : (payment.amountPaid || 2000)} دج`;
    
    document.getElementById('rcptUsername').textContent = username;
    document.getElementById('rcptPassword').textContent = password;

    const studentIdForUrl = (stu && stu.id) || payment.studentId || 'STU-001';
    const portalUrl = `${window.location.origin}${window.location.pathname.replace('dashboard.html', 'parent.html')}?id=${studentIdForUrl}&u=${encodeURIComponent(username)}&p=${encodeURIComponent(password)}`;
    
    const qrImg = document.getElementById('rcptQrCode');
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=2&data=${encodeURIComponent(portalUrl)}`;
    }

    document.getElementById('receiptModal').classList.add('active');
  };

  window.triggerAppPrint = function() {
    if (window.electronAPI && window.electronAPI.print) {
      window.electronAPI.print();
    } else {
      window.print();
    }
  };

  window.closeReceiptModal = function() {
    document.getElementById('receiptModal').classList.remove('active');
  };

  // --- STUDENT PROFILE MODAL ---
    // --- STUDENT PROFILE MODAL (ORGANIZED DOSSIER) ---
    // --- STUDENT PROFILE MODAL (HIGH-DENSITY ORGANIZED DOSSIER) ---
  window.openStudentProfile = function(studentId) {
    const stu = getData('brainova_students').find(s => s.id === studentId);
    if (!stu) return;

    const payments = getData('brainova_payments').filter(p => p.studentId === studentId);
    const attendance = getData('brainova_attendance').filter(a => a.studentId === studentId);

    const totalAtt = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const attRate = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 100;
    const balance = Number(stu.balance) || 0;
    const sessions = Number(stu.sessionsRemaining) || 0;

    const portalUrl = `${window.location.origin}${window.location.pathname.replace('dashboard.html', 'parent.html')}?id=${stu.id}&u=${encodeURIComponent(stu.username || '')}&p=${encodeURIComponent(stu.password || '')}`;

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

      <!-- 2. Parent Portal & QR Access -->
      <div class="profile-section-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01"/></svg>
        بيانات الدخول لبوابة الولي ورمز QR
      </div>
      <div class="portal-access-box">
        <div style="flex:1;">
          <div style="font-size:0.82rem; margin-bottom:4px;">
            المستخدم: <code style="color:#38BDF8; font-weight:800; font-family:monospace; background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px;">${stu.username || 'user' + stu.id}</code>
          </div>
          <div style="font-size:0.82rem; margin-bottom:8px;">
            كلمة المرور: <code style="color:#38BDF8; font-weight:800; font-family:monospace; background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px;">${stu.password || '123456'}</code>
          </div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn btn--outline btn--small" onclick="navigator.clipboard.writeText('المستخدم: ' + '${stu.username || ''}' + ' | كلمة المرور: ' + '${stu.password || ''}'); showToast('تم نسخ بيانات الدخول!', 'success');">
              نسخ البيانات
            </button>
            <a href="${portalUrl}" target="_blank" class="btn btn--primary btn--small">
              فتح البوابة
            </a>
          </div>
        </div>
        <div style="text-align:center;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=2&data=${encodeURIComponent(portalUrl)}" alt="QR" style="width:58px; height:58px; border-radius:6px; background:#fff; padding:2px; display:block;">
          <span style="font-size:0.65rem; color:var(--color-text-dim); margin-top:2px; display:block;">QR الدخول</span>
        </div>
      </div>

      <!-- 3. Teacher Note to Parent -->
      <div class="profile-section-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        توجيه وملاحظة لولي الأمر (تظهر في بوابته)
      </div>
      <div style="background:rgba(245,158,11,0.03); border:1px solid rgba(245,158,11,0.2); border-radius:var(--radius-sm); padding:12px; margin-bottom:12px;">
        <textarea id="profileStudentNote" rows="2" class="form-input" placeholder="اكتب ملاحظتك التربوية للتلميذ..." style="width:100%; resize:vertical; font-size:0.82rem; margin-bottom:6px;">${stu.teacherNote || ''}</textarea>
        <div style="display:flex; justify-content:flex-end;">
          <button type="button" class="btn btn--primary btn--small" onclick="saveStudentTeacherNote('${stu.id}')">
            حفظ ونشر الملاحظة
          </button>
        </div>
      </div>

      <!-- 4. Recent Receipts -->
      <div class="profile-section-heading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        سجل الوصولات المالية الصادرة
      </div>
      ${payments.length === 0 ? '<div style="color:var(--color-text-dim); font-size:0.78rem; margin-bottom:14px;">لا توجد وصولات مسجلة بعد.</div>' : `
        <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:14px;">
          ${payments.slice(0, 3).map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:6px 10px; border-radius:6px; border:1px solid var(--color-border); font-size:0.8rem;">
              <div>
                <strong style="color:var(--color-primary); font-family:monospace;">#${p.opNumber || p.id}</strong> — ${p.date} (${Number(p.amountPaid).toLocaleString()} دج)
              </div>
              <button class="btn btn--outline btn--small" onclick="openReceiptModal('${p.id}')">طباعة الوصل</button>
            </div>
          `).join('')}
        </div>
      `}

      <!-- Actions Footer -->
      <div class="modal__actions">
        <button type="button" class="btn btn--outline" onclick="closeStudentProfileModal()">إغلاق</button>
        <button type="button" class="btn btn--outline" onclick="closeStudentProfileModal(); openStudentIdCard('${stu.id}');">🪪 بطاقة التلميذ</button>
        <button type="button" class="btn btn--outline" style="color:#25D366; border-color:rgba(37,211,102,0.3);" onclick="closeStudentProfileModal(); openWhatsAppDispatchModal('${stu.id}');"> واتساب الولي</button>
        <button type="button" class="btn btn--primary" onclick="closeStudentProfileModal(); openRecordPaymentModal('${stu.id}');">+ تسجيل دفعة</button>
      </div>
    `;

    document.getElementById('studentProfileModal').classList.add('active');
  };

  window.closeStudentProfileModal = function() {
    document.getElementById('studentProfileModal').classList.remove('active');
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
      const newStudentId = (10000 + Math.floor(Math.random() * 90000)).toString();
      const newStudent = {
        id: newStudentId,
        name: regs[index].studentName,
        parentName: regs[index].parentName,
        parentPhone: regs[index].parentPhone,
        group: regs[index].preferredLevel ? `الفوج (${regs[index].preferredLevel.split(':')[0]})` : "الفوج أ (صباحي)",
        level: regs[index].preferredLevel || "المستوى الثاني: Builder (8 - 11 سنة)",
        username: generateRandomCode(8), password: generateRandomCode(8),
        balance: 2000,
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
          <div style="font-size:0.8rem; color:var(--color-text-muted); margin-bottom:12px;">
            <span> الأستاذ: <strong>${g.educator || 'عابد اسحاق تقي الدين'}</strong></span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--color-border); padding-top: 8px;">
            <span style="font-size:0.78rem; color:var(--color-text-muted);">الطلاب: <strong style="color:#fff;">${studentCount} / ${g.maxStudents || 12}</strong></span>
            <button class="btn btn--outline btn--small" onclick="document.querySelector('[data-view=\'students\']').click();">عرض الطلاب</button>
          </div>
        </div>
      `;
    }).join('');
  }

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
          sessionsHtml += `
            <div class="schedule-session">
              <button class="schedule-session__delete" onclick="deleteSession('${s.id}')">&times;</button>
              <div class="schedule-session__title">${s.groupName}</div>
              <div style="font-size:0.73rem;"> ${s.educatorName}</div>
              <div style="font-size:0.73rem;"> ${s.startTime} - ${s.endTime}</div>
              ${s.room ? `<div style="font-size:0.71rem;color:var(--color-text-muted);"> ${s.room}</div>` : ''}
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
  window.openAddStudentModal = function() {
    const groupSelect = document.getElementById('newStudentGroup');
    if (groupSelect) {
      const groups = getData('brainova_groups');
      groupSelect.innerHTML = groups.map(g => `<option value="${g.name}">${g.name}</option>`).join('');
    }
    document.getElementById('addStudentModal').classList.add('active');
  };

  window.closeAddStudentModal = function() {
    document.getElementById('addStudentModal').classList.remove('active');
  };

  window.submitAddStudent = function(e) {
    e.preventDefault();
    const students = getData('brainova_students');
    const newStudent = {
      id: "STU-" + String(students.length + 1).padStart(3, '0'),
      name: document.getElementById('newStudentName').value,
      group: document.getElementById('newStudentGroup').value,
      level: document.getElementById('newStudentLevel').value,
      parentName: "—",
      parentPhone: "—",
      username: generateRandomCode(8), password: generateRandomCode(8),
      monthlyFee: 2000,
      balance: 0,
      sessionsRemaining: 0,
      lastAttendance: "جديد",
      joinedDate: new Date().toLocaleDateString('ar-DZ')
    };
    students.push(newStudent);
    saveData('brainova_students', students);
    closeAddStudentModal();
    showToast('toast_student_added', 'success');
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
      }
    });
  });

  // Initial render (fallback if loadFromPersistentStore already ran)
  renderAll();
});

