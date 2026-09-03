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
            saveData(key, defaultGroups);
          } else if (key === 'brainova_rooms' && (!parsed || parsed.length === 0)) {
            saveData(key, defaultRooms);
          } else if (key === 'brainova_schedule' && (!parsed || parsed.length === 0)) {
            saveData(key, defaultSchedule);
          } else {
            MemoryCache[key] = parsed;
          }
        } catch(e) {
          saveData(key, defaultData[key]);
        }
      }
    }

    // Auto-heal orphaned student groups so students never lose their group
    try {
      const currentGroups = getData('brainova_groups') || [];
      const currentStudents = getData('brainova_students') || [];
      let groupsUpdated = false;
      currentStudents.forEach(stu => {
        if (stu.group && stu.group.trim()) {
          const trimmedGroup = stu.group.trim();
          const exists = currentGroups.some(g => g.name && g.name.trim().toLowerCase() === trimmedGroup.toLowerCase());
          if (!exists) {
            currentGroups.push({
              id: 'GRP-' + Date.now() + '-' + Math.floor(Math.random() * 100),
              name: trimmedGroup,
              level: stu.level || 'المستوى الأول',
              ageCategory: 'جميع الفئات',
              room: 'قاعة Brainova الرئيسية',
              educatorId: 'EDU-001',
              educatorName: 'عابد اسحاق تقي الدين',
              maxStudents: 12,
              startTime: stu.startTime || '14:00',
              endTime: stu.endTime || '16:00'
            });
            groupsUpdated = true;
          }
        }
      });
      if (groupsUpdated) {
        saveData('brainova_groups', currentGroups);
      }
    } catch(e) {}
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

    // ── Last 6 Months Executive SVG Area Chart
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

      const total6 = last6.reduce((acc, x) => acc + x.value, 0);
      const avgMonthly = Math.round(total6 / 6);
      const maxVal = Math.max(...last6.map(x => x.value), 5000);

      const w = 500;
      const h = 130;
      const padX = 32;
      const padTop = 16;
      const padBottom = 26;
      const plotH = h - padTop - padBottom;
      const plotW = w - (padX * 2);
      const stepX = plotW / (last6.length - 1 || 1);

      const points = last6.map((m, idx) => {
        const x = padX + (idx * stepX);
        const y = padTop + plotH - ((m.value / maxVal) * plotH);
        return { x, y, ...m };
      });

      const lineD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
      const areaD = `${lineD} L ${points[points.length - 1].x.toFixed(1)} ${padTop + plotH} L ${points[0].x.toFixed(1)} ${padTop + plotH} Z`;

      chartContainer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 6px;">
          <div style="font-size:0.75rem; color:#94A3B8;">
            إجمالي 6 أشهر: <strong style="color:#38BDF8; font-family:monospace;">${total6.toLocaleString()} دج</strong>
          </div>
          <div style="font-size:0.72rem; color:#94A3B8;">
            المعدل الشهري: <strong style="color:#10B981; font-family:monospace;">${avgMonthly.toLocaleString()} دج</strong>
          </div>
        </div>
        <div style="position:relative; width:100%;">
          <svg class="analytics-chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0284C7" stop-opacity="0.28"/>
                <stop offset="100%" stop-color="#0284C7" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <!-- Gridlines -->
            <line x1="${padX}" y1="${padTop}" x2="${w - padX}" y2="${padTop}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>
            <line x1="${padX}" y1="${padTop + (plotH / 2)}" x2="${w - padX}" y2="${padTop + (plotH / 2)}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>
            <line x1="${padX}" y1="${padTop + plotH}" x2="${w - padX}" y2="${padTop + plotH}" stroke="rgba(255,255,255,0.1)"/>

            <!-- Area & Line -->
            <path d="${areaD}" fill="url(#chartAreaGrad)" />
            <path d="${lineD}" fill="none" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

            <!-- Nodes & Labels -->
            ${points.map(p => `
              <circle class="analytics-chart-dot" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="${p.isCurrent ? '#10B981' : '#0F172A'}" stroke="${p.isCurrent ? '#10B981' : '#38BDF8'}" stroke-width="2">
                <title>${p.label}: ${p.value.toLocaleString()} دج</title>
              </circle>
              <text x="${p.x.toFixed(1)}" y="${p.y < 35 ? p.y + 16 : p.y - 8}" font-size="9" font-weight="700" fill="${p.isCurrent ? '#10B981' : '#E2E8F0'}" text-anchor="middle" font-family="monospace">${p.value > 0 ? (p.value >= 1000 ? Math.round(p.value/1000) + 'k' : p.value) : '0'}</text>
              <text x="${p.x.toFixed(1)}" y="${h - 6}" font-size="10" fill="${p.isCurrent ? '#38BDF8' : '#94A3B8'}" font-weight="${p.isCurrent ? '700' : '500'}" text-anchor="middle" font-family="inherit">${p.label}</text>
            `).join('')}
          </svg>
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

    // ── Retention & Risk Prediction Radar
    const retentionContainer = document.getElementById('retentionRadarContainer');
    if (retentionContainer) {
      const atRiskStudents = students.map(s => ({
        student: s,
        risk: calculateStudentRetentionRisk(s)
      })).filter(item => item.risk.level === 'high' || item.risk.level === 'medium')
        .sort((a, b) => b.risk.score - a.risk.score);

      const highRiskCount = atRiskStudents.filter(item => item.risk.level === 'high').length;
      const medRiskCount = atRiskStudents.filter(item => item.risk.level === 'medium').length;

      if (atRiskStudents.length === 0) {
        retentionContainer.innerHTML = `
          <div style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.25); border-radius:10px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:1.2rem;">🛡️</span>
              <div>
                <strong style="color:#10B981; font-size:0.88rem;">رادار استبقاء الطلاب ممتاز (Zero Retention Risk)</strong>
                <div style="font-size:0.75rem; color:#94A3B8;">كافة الطلاب منتظمون في الحضور ولا توجد مخاطر انقطاع أو تأخرات حرجة.</div>
              </div>
            </div>
            <span class="status-pill status-pill--active" style="font-size:0.75rem;">100% نسبة استقرار</span>
          </div>
        `;
      } else {
        retentionContainer.innerHTML = `
          <div class="card" style="border:1px solid rgba(239,68,68,0.28); background:linear-gradient(145deg, rgba(30,15,20,0.6) 0%, rgba(15,23,42,0.85) 100%); border-radius:12px; padding:16px 18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:34px; height:34px; border-radius:8px; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); display:flex; align-items:center; justify-content:center; color:#EF4444; font-size:1rem;">
                  ⚠️
                </div>
                <div>
                  <h3 class="card__title" style="margin:0; font-size:1.02rem; color:#F8FAFC;">رادار التنبؤ بالغياب والانسحاب (Retention & Risk Radar)</h3>
                  <p style="font-size:0.76rem; color:#94A3B8; margin:2px 0 0 0;">رصد استباقي للطلاب المعرضين للانقطاع لتمكين الإدارة من التدخل الودي وإنقاذ الاشتراكات.</p>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                ${highRiskCount > 0 ? `<span class="risk-pill-high">🔴 ${highRiskCount} خطر مرتفع</span>` : ''}
                ${medRiskCount > 0 ? `<span class="risk-pill-medium">🟡 ${medRiskCount} متابعة وتدارك</span>` : ''}
                <button class="btn btn--outline btn--small" style="font-size:0.75rem;" onclick="document.querySelector('[data-view=\\'students\\']').click(); document.getElementById('studentSubFilter').value = 'risk_high'; renderStudents();">
                  عرض كل الحالات
                </button>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
              ${atRiskStudents.slice(0, 4).map(item => {
                const s = item.student;
                const r = item.risk;
                const isHigh = r.level === 'high';
                return `
                  <div class="${isHigh ? 'risk-card-high' : 'risk-card-medium'}" style="padding:12px 14px; border-radius:8px; display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
                    <div>
                      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                        <div>
                          <div style="font-weight:700; font-size:0.88rem; color:#fff;">${s.name}</div>
                          <div style="font-size:0.74rem; color:#94A3B8;">${s.group || 'غير محدد'} • ${s.level || ''}</div>
                        </div>
                        <span class="${isHigh ? 'risk-pill-high' : 'risk-pill-medium'}">${isHigh ? 'خطر مرتفع' : 'خطر متوسط'}</span>
                      </div>
                      <div style="font-size:0.74rem; color:#CBD5E1; line-height:1.5;">
                        ${r.reasons.map(reason => `<div>• ${reason}</div>`).join('')}
                      </div>
                    </div>
                    <div style="display:flex; gap:6px; align-items:center; padding-top:6px; border-top:1px solid rgba(255,255,255,0.06);">
                      <button class="btn btn--small" style="background:#25D366; color:#fff; font-size:0.72rem; padding:3px 8px; flex:1;" onclick="openFriendlyRetentionWhatsApp('${s.id}')">
                        💬 رسالة تدارك ودية
                      </button>
                      <button class="btn btn--outline btn--small" style="font-size:0.72rem; padding:3px 8px; border-color:rgba(16,185,129,0.35); color:#10B981;" onclick="openPedagogicalReportModal('${s.id}')">
                        📊 تقييم
                      </button>
                      <button class="btn btn--outline btn--small" style="font-size:0.72rem; padding:3px 6px;" onclick="openStudentProfile('${s.id}')">
                        الملف
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
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
                    <button class="btn btn--primary btn--small" onclick="openAttendanceForSession('${encodeURIComponent(sch.groupName)}', '${sch.startTime && sch.endTime ? `${sch.startTime} - ${sch.endTime}` : ''}')" style="font-size:0.76rem; padding:4px 10px; background:#0284C7; font-weight:700;">
                      تسجيل الحضور
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



  // --- UTILITY: PARSE DATE STRING ROBUSTLY & EXACT GROUP MATCHING ---
  function cleanDateDigits(str) {
    if (!str) return '';
    return String(str)
      .replace(/[\u200E\u200F\u202A-\u202E]/g, '')
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
      .trim();
  }

  function parseBrainovaDate(dateStr) {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;
    const str = cleanDateDigits(dateStr);
    if (!str) return null;

    // ISO format YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const d = new Date(str);
      if (!isNaN(d.getTime())) return d;
    }

    // DD/MM/YYYY or DD-MM-YYYY (with optional HH:mm)
    const match = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      const hour = match[4] !== undefined ? parseInt(match[4], 10) : 12;
      const min = match[5] !== undefined ? parseInt(match[5], 10) : 0;
      const d = new Date(year, month, day, hour, min);
      if (!isNaN(d.getTime())) return d;
    }

    const fallback = new Date(str);
    return isNaN(fallback.getTime()) ? null : fallback;
  }
  window.parseBrainovaDate = parseBrainovaDate;

  function isStudentInGroup(student, groupName) {
    if (!student || !student.group || !groupName) return false;
    return String(student.group).trim().toLowerCase() === String(groupName).trim().toLowerCase();
  }
  window.isStudentInGroup = isStudentInGroup;

  function getArabicDayName(dateStr) {
    const d = parseBrainovaDate(dateStr);
    if (!d) return '';
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[d.getDay()] || '';
  }
  window.getArabicDayName = getArabicDayName;

  function formatIsoDate(d) {
    if (!d || isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  window.formatIsoDate = formatIsoDate;

  // --- DYNAMIC GROUP ATTENDANCE CYCLE & SCHEDULE CALCULATION ---
  const daysMap = {
    'الأحد': 0, 'الاحد': 0, 'sunday': 0,
    'الإثنين': 1, 'الاثنين': 1, 'monday': 1,
    'الثلاثاء': 2, 'tuesday': 2,
    'الأربعاء': 3, 'الاربعاء': 3, 'wednesday': 3,
    'الخميس': 4, 'thursday': 4,
    'الجمعة': 5, 'friday': 5,
    'السبت': 6, 'saturday': 6
  };

  function getNextDateForDayName(dayName, fromDate = new Date(), lastSessionDateStr = null) {
    if (!dayName) return null;
    const cleanDay = String(dayName).trim().toLowerCase();
    const targetDay = daysMap[cleanDay];
    if (targetDay === undefined) return null;

    const current = new Date(fromDate);
    current.setHours(12, 0, 0, 0);
    const currentDay = current.getDay();

    let daysToAdd = (targetDay - currentDay + 7) % 7;

    // If today is the target day (daysToAdd === 0)
    // Check if attendance for today was already recorded:
    if (daysToAdd === 0 && lastSessionDateStr === formatIsoDate(current)) {
      daysToAdd = 7;
    }

    const nextDate = new Date(current.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    return formatIsoDate(nextDate);
  }
  window.getNextDateForDayName = getNextDateForDayName;

  function getGroupWeeklyCycleInfo(groupName, allAttendance = null) {
    if (!groupName) {
      const today = new Date().toISOString().slice(0, 10);
      return {
        hasPreviousSession: false,
        lastSessionDate: null,
        lastDayName: 'السبت',
        nextSessionDate: today,
        nextDayName: 'السبت',
        daysSinceLastSession: null,
        scheduledDay: 'السبت',
        scheduledTime: '14:00 - 16:00',
        badgeText: 'جاهز للحصة الأولى',
        badgeStyle: 'background:rgba(56,189,248,0.15); color:#38BDF8; border:1px solid rgba(56,189,248,0.3);',
        suggestedDate: today,
        allDates: []
      };
    }

    const allGroups = getData('brainova_groups') || [];
    const matchedGroup = allGroups.find(x => isStudentInGroup({ group: x.name }, groupName) || x.id === groupName);
    const schedules = getData('brainova_schedule') || [];
    const sch = schedules.find(s => s.groupId === (matchedGroup ? matchedGroup.id : '') || isStudentInGroup({ group: s.groupName }, groupName));
    const scheduledDay = sch ? sch.day : (matchedGroup?.day || 'السبت');
    const scheduledTime = sch ? `${sch.startTime} - ${sch.endTime}` : (matchedGroup?.timeSlot || '14:00 - 16:00');

    const attList = allAttendance || getData('brainova_attendance') || [];
    const groupAtt = attList.filter(a => isStudentInGroup({ group: a.groupName }, groupName));
    const rawDates = [...new Set(groupAtt.map(a => a.date))].filter(Boolean);

    rawDates.sort((a, b) => {
      const da = parseBrainovaDate(a) || new Date(0);
      const db = parseBrainovaDate(b) || new Date(0);
      return da - db;
    });

    const now = new Date();
    now.setHours(12, 0, 0, 0);
    const todayStr = formatIsoDate(now);

    const lastDateStr = rawDates.length > 0 ? rawDates[rawDates.length - 1] : null;
    let diffDays = null;
    let nextDateStr = '';
    let nextDayName = '';
    let lastDayName = '';

    let isLastMakeup = false;
    let lastSessionTime = scheduledTime;

    if (lastDateStr) {
      lastDayName = getArabicDayName(lastDateStr);
      const lastDate = parseBrainovaDate(lastDateStr) || new Date();
      lastDate.setHours(12, 0, 0, 0);
      const diffMs = now.getTime() - lastDate.getTime();
      diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      const lastAttRecords = groupAtt.filter(a => a.date === lastDateStr);
      isLastMakeup = lastAttRecords.some(a => a.sessionType === 'makeup' || (a.note && a.note.includes('تعويض')));
      if (lastAttRecords[0]?.sessionTime) {
        lastSessionTime = lastAttRecords[0].sessionTime;
      }

      // If last session was a temporary makeup session, regular schedule can resume or advance +7 days
      const nextRegularDateStr = getNextDateForDayName(scheduledDay, now, lastDateStr);
      const nextPlusSevenDate = new Date(lastDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      const nextPlusSevenDateStr = formatIsoDate(nextPlusSevenDate);

      if (isLastMakeup && nextRegularDateStr && nextRegularDateStr !== lastDateStr) {
        nextDateStr = nextRegularDateStr;
      } else {
        nextDateStr = nextPlusSevenDateStr;
      }
      nextDayName = getArabicDayName(nextDateStr);
    } else {
      // For a new group with no recorded attendance yet:
      nextDateStr = getNextDateForDayName(scheduledDay, now, null) || todayStr;
      nextDayName = getArabicDayName(nextDateStr) || scheduledDay;
    }

    const hasStudiedToday = (lastDateStr === todayStr);
    const isDueToday = (nextDateStr === todayStr) || (diffDays !== null && diffDays >= 7 && diffDays % 7 === 0);

    let badgeText = '';
    let badgeStyle = '';

    if (hasStudiedToday) {
      if (isLastMakeup) {
        badgeText = `🔄 تم تسجيل حصة تعويضية اليوم (${lastSessionTime}) بنجاح • الموعد القادم: ${nextDayName} ${nextDateStr}`;
        badgeStyle = 'background:rgba(168,85,247,0.15); color:#C084FC; border:1px solid rgba(168,85,247,0.35); font-weight:700;';
      } else {
        badgeText = `✅ تم تسجيل حضور اليوم (${scheduledTime}) • الحصة القادمة: ${nextDayName} ${nextDateStr}`;
        badgeStyle = 'background:rgba(16,185,129,0.15); color:#10B981; border:1px solid rgba(16,185,129,0.3);';
      }
    } else if (isDueToday) {
      badgeText = `🔴 موعد الحصة اليوم: ${nextDayName} ${nextDateStr} (${scheduledTime})!`;
      badgeStyle = 'background:rgba(239,68,68,0.18); color:#EF4444; border:1px solid rgba(239,68,68,0.35); font-weight:700;';
    } else if (diffDays !== null && diffDays > 7) {
      badgeText = `⚠️ انقضى أسبوع (${diffDays} يوماً) — موعد الحصة: ${nextDayName} ${nextDateStr}`;
      badgeStyle = 'background:rgba(245,158,11,0.18); color:#F59E0B; border:1px solid rgba(245,158,11,0.35); font-weight:700;';
    } else if (diffDays !== null && diffDays > 0) {
      const remainingDays = 7 - diffDays;
      const makeupNotice = isLastMakeup ? ' (تعويضية 🔄)' : '';
      badgeText = `⏳ الحصة القادمة: ${nextDayName} ${nextDateStr} (بعد ${remainingDays} ${remainingDays === 1 ? 'يوم' : 'أيام'})${makeupNotice}`;
      badgeStyle = 'background:rgba(56,189,248,0.12); color:#38BDF8; border:1px solid rgba(56,189,248,0.3);';
    } else {
      badgeText = `🆕 الموعد القادم: ${nextDayName} ${nextDateStr} (${scheduledTime})`;
      badgeStyle = 'background:rgba(56,189,248,0.15); color:#38BDF8; border:1px solid rgba(56,189,248,0.3);';
    }

    // Suggested date for recording attendance:
    const suggestedDate = (diffDays !== null && diffDays >= 7) ? (isDueToday ? todayStr : nextDateStr) : nextDateStr;

    return {
      hasPreviousSession: !!lastDateStr,
      lastSessionDate: lastDateStr,
      lastDayName: lastDayName || scheduledDay,
      lastSessionTime,
      isLastMakeup,
      nextSessionDate: nextDateStr,
      nextDayName: nextDayName || scheduledDay,
      scheduledDay,
      scheduledTime,
      daysSinceLastSession: diffDays,
      isDueToday,
      hasStudiedToday,
      badgeText,
      badgeStyle,
      suggestedDate,
      allDates: rawDates
    };
  }
  window.getGroupWeeklyCycleInfo = getGroupWeeklyCycleInfo;

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
      if (stuObj && (stuObj.lastPaymentIso || stuObj.lastPaymentDate)) {
        const payDate = parseBrainovaDate(stuObj.lastPaymentIso || stuObj.lastPaymentDate) || new Date();
        const now = new Date();
        const diffMs = now.getTime() - payDate.getTime();
        const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        const renewalTimestamp = payDate.getTime() + (30 * 24 * 60 * 60 * 1000);
        const renewalDate = new Date(renewalTimestamp);
        const renewalDateStr = `${String(renewalDate.getDate()).padStart(2, '0')}/${String(renewalDate.getMonth() + 1).padStart(2, '0')}/${renewalDate.getFullYear()}`;
        const daysRemaining = Math.ceil((renewalTimestamp - now.getTime()) / (1000 * 60 * 60 * 24));
        const remSessions = stuObj.sessionsRemaining !== undefined ? stuObj.sessionsRemaining : 4;
        
        let status = 'active';
        let statusLabel = 'اشتراك ساري';
        let badgeClass = 'paid';
        let renewalSummary = `متبقي ${daysRemaining} يوماً (${remSessions} حصص) • استحقاق: ${renewalDateStr}`;

        if (remSessions <= 0) {
          status = 'due_soon';
          statusLabel = 'نفدت الحصص (مستحق للتجديد)';
          badgeClass = 'partial';
          renewalSummary = `استهلك جميع الحصص (0 متبقية) • استحقاق التجديد: ${renewalDateStr}`;
        } else if (daysRemaining <= 0) {
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
          lastDateStr: stuObj.lastPaymentDate || renewalDateStr,
          daysElapsed: diffDays,
          weeksElapsed: Math.floor(diffDays / 7),
          elapsedText: diffDays === 0 ? 'دفع اليوم' : `دفع منذ ${diffDays} يوم`,
          renewalDate,
          renewalDateStr,
          daysRemaining,
          renewalSummary,
          lastAmount: stuObj.lastPaymentAmount || stuObj.monthlyFee || 5000,
          lastOpNumber: '—',
          paymentsCount: 1,
          allStudentPayments: []
        };
      }

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

    const remSessions = stuObj && stuObj.sessionsRemaining !== undefined ? stuObj.sessionsRemaining : (lastPayment.sessionsRemaining || 0);

    let status = 'active';
    let statusLabel = 'اشتراك ساري';
    let badgeClass = 'paid';
    let renewalSummary = '';

    if (remSessions <= 0) {
      status = 'due_soon';
      statusLabel = 'نفدت الحصص (مستحق للتجديد)';
      badgeClass = 'partial';
      renewalSummary = `استهلك جميع الحصص (0 متبقية) • استحقاق التجديد: ${renewalDateStr}`;
    } else if (daysRemaining > 5) {
      status = 'active';
      statusLabel = 'اشتراك ساري';
      badgeClass = 'paid';
      renewalSummary = `متبقي ${daysRemaining} يوماً (${remSessions} حصص) • استحقاق: ${renewalDateStr}`;
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
        if (subFilter === 'risk_high') {
          return calculateStudentRetentionRisk(stu).level === 'high';
        }
        if (subFilter === 'risk_medium') {
          return calculateStudentRetentionRisk(stu).level === 'medium';
        }
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
            ${(() => {
              const rk = calculateStudentRetentionRisk(stu);
              if (rk.level === 'high') {
                return `<div style="margin-top:3px;"><span class="risk-pill-high" title="${rk.reasons.join(' • ')}">⚠️ ${rk.reasons[0] || 'خطر انقطاع'}</span></div>`;
              } else if (rk.level === 'medium') {
                return `<div style="margin-top:3px;"><span class="risk-pill-medium" title="${rk.reasons.join(' • ')}">🟡 ${rk.reasons[0] || 'متابعة'}</span></div>`;
              }
              return '';
            })()}
          </td>
          <td>
            <span style="font-weight:700; color:#F8FAFC;">${stu.group || 'غير محدد'}</span>
            ${stu.day ? `<div style="font-size:0.75rem; color:#FBBF24; font-weight:700; margin-top:2px;">📅 يوم الدراسة: ${stu.day}</div>` : ''}
            ${(stu.sessionTime || (stu.startTime ? (stu.startTime + ' - ' + (stu.endTime || '')) : '')) ? `<div style="font-size:0.75rem; color:#00E5FF; font-weight:700; margin-top:1px;">🕒 ${stu.sessionTime || (stu.startTime + ' - ' + (stu.endTime || ''))}</div>` : ''}
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
              <button class="btn btn--outline btn--small" style="padding: 4px 6px; font-size: 0.75rem; border-color:rgba(16,185,129,0.35); color:#10B981;" title="التقرير البيداغوجي والتقييم الشهري" onclick="openPedagogicalReportModal('${stu.id}')">تقييم</button>
              <button class="btn btn--outline btn--small" style="padding: 4px 6px; font-size: 0.75rem; color:#F59E0B; border-color:rgba(245,158,11,0.35);" title="تعديل بيانات التلميذ والفوج" onclick="openEditStudentModal('${stu.id}')">✏️ تعديل</button>
              <button class="btn btn--outline btn--small" style="padding: 4px 6px; font-size: 0.75rem; border-color:rgba(56,189,248,0.35); color:#38BDF8;" title="بطاقة الطالب الذكية (CR80)" onclick="openStudentIdCard('${stu.id}')">بطاقة</button>
              <button class="btn btn--small" style="padding: 4px 6px; font-size: 0.75rem; background:#25D366; color:#fff;" title="إشعار واتساب للولي" onclick="openWhatsAppDispatchModal('${stu.id}')">واتساب</button>
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

    if (window.__selectedAttendanceGroup) {
      const target = window.__selectedAttendanceGroup.trim().toLowerCase();
      let found = false;
      for (let opt of groupSelect.options) {
        if (opt.value.trim().toLowerCase() === target || opt.value.toLowerCase().includes(target) || target.includes(opt.value.toLowerCase())) {
          groupSelect.value = opt.value;
          found = true;
          break;
        }
      }
      if (!found) {
        groupSelect.add(new Option(window.__selectedAttendanceGroup, window.__selectedAttendanceGroup, true, true));
        groupSelect.value = window.__selectedAttendanceGroup;
      }
      window.__selectedAttendanceGroup = '';
    }

    if (window.__selectedAttendanceTime && timeSelect) {
      const targetTime = window.__selectedAttendanceTime.trim();
      let foundTime = false;
      for (let opt of timeSelect.options) {
        if (opt.value.includes(targetTime) || targetTime.includes(opt.value)) {
          timeSelect.value = opt.value;
          foundTime = true;
          break;
        }
      }
      if (!foundTime) {
        timeSelect.add(new Option(targetTime, targetTime, true, true));
        timeSelect.value = targetTime;
      }
      window.__selectedAttendanceTime = '';
    }

    const selectedGroup = groupSelect.value || (groups[0] ? groups[0].name : '');
    const allAttendance = getData('brainova_attendance') || [];
    const cycle = getGroupWeeklyCycleInfo(selectedGroup, allAttendance);

    if (!window.__lastRenderedAttGroup || window.__lastRenderedAttGroup !== selectedGroup) {
      window.__lastRenderedAttGroup = selectedGroup;
      if (!window.__preserveAttDate) {
        dateInput.value = cycle.suggestedDate;
      }
      window.__preserveAttDate = false;
    } else if (!dateInput.value) {
      dateInput.value = cycle.suggestedDate;
    }

    const selectedDate = dateInput.value;
    const selectedTime = timeSelect ? timeSelect.value : '09:00 - 11:00';

    const allStudents = getData('brainova_students');
    const groupStudents = allStudents.filter(s => isStudentInGroup(s, selectedGroup));
    const existingRecords = allAttendance.filter(a => a.date === selectedDate && isStudentInGroup({ group: a.groupName }, selectedGroup) && (!a.sessionTime || a.sessionTime === selectedTime));

    const typeSelect = document.getElementById('attSessionTypeSelect');
    if (typeSelect && existingRecords.length > 0 && existingRecords[0].sessionType) {
      typeSelect.value = existingRecords[0].sessionType;
    }

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
      const status = draft.status;
      const isPresent = status === 'present';
      const isLate = status === 'late';
      const isAbsent = status === 'absent';

      let rowClass = 'att-row-present';
      let avatarBorder = 'border:1px solid rgba(16,185,129,0.4); background:rgba(16,185,129,0.12); color:#34D399;';
      let statusBadge = '<span class="badge-status-present">حاضر</span>';

      if (isAbsent) {
        rowClass = 'att-row-absent';
        avatarBorder = 'border:1px solid rgba(239,68,68,0.4); background:rgba(239,68,68,0.15); color:#FCA5A5;';
        statusBadge = '<span class="badge-status-absent">غائب</span>';
      } else if (isLate) {
        rowClass = 'att-row-late';
        avatarBorder = 'border:1px solid rgba(245,158,11,0.4); background:rgba(245,158,11,0.15); color:#FCD34D;';
        statusBadge = '<span class="badge-status-late">متأخر</span>';
      }

      return `
        <tr id="att-row-${stu.id}" class="${rowClass}">
          <!-- Student Info Column -->
          <td>
            <div class="student-att-meta">
              <div class="student-att-avatar" id="att-avatar-${stu.id}" style="${avatarBorder}">${stu.name.trim().charAt(0)}</div>
              <div class="student-att-info">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="student-att-name">${stu.name}</span>
                  <span id="att-badge-${stu.id}">${statusBadge}</span>
                </div>
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
              <button type="button" class="att-seg-btn ${isPresent ? 'is-active-present' : ''}" onclick="setAttendanceStatus('${stu.id}', 'present')">حاضر</button>
              <button type="button" class="att-seg-btn ${isLate ? 'is-active-late' : ''}" onclick="setAttendanceStatus('${stu.id}', 'late')">متأخر</button>
              <button type="button" class="att-seg-btn ${isAbsent ? 'is-active-absent' : ''}" onclick="setAttendanceStatus('${stu.id}', 'absent')">غائب</button>
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

    const row = document.getElementById(`att-row-${studentId}`);
    if (row) {
      row.classList.remove('att-row-present', 'att-row-absent', 'att-row-late');
      if (status === 'absent') row.classList.add('att-row-absent');
      else if (status === 'late') row.classList.add('att-row-late');
      else row.classList.add('att-row-present');
    }

    const badge = document.getElementById(`att-badge-${studentId}`);
    if (badge) {
      if (status === 'absent') badge.innerHTML = '<span class="badge-status-absent">غائب</span>';
      else if (status === 'late') badge.innerHTML = '<span class="badge-status-late">متأخر</span>';
      else badge.innerHTML = '<span class="badge-status-present">حاضر</span>';
    }

    const avatar = document.getElementById(`att-avatar-${studentId}`);
    if (avatar) {
      if (status === 'absent') avatar.style.cssText = 'border:1px solid rgba(239,68,68,0.4); background:rgba(239,68,68,0.15); color:#FCA5A5;';
      else if (status === 'late') avatar.style.cssText = 'border:1px solid rgba(245,158,11,0.4); background:rgba(245,158,11,0.15); color:#FCD34D;';
      else avatar.style.cssText = 'border:1px solid rgba(16,185,129,0.4); background:rgba(16,185,129,0.12); color:#34D399;';
    }

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

  window.attJumpToNextSession = function() {
    const groupSelect = document.getElementById('attGroupSelect');
    const selectedGroup = groupSelect ? groupSelect.value : '';
    const allAtt = getData('brainova_attendance') || [];
    const cycle = getGroupWeeklyCycleInfo(selectedGroup, allAtt);
    const dateInput = document.getElementById('attDateSelect');
    if (dateInput) {
      dateInput.value = cycle.nextSessionDate;
      window.__preserveAttDate = true;
      renderAttendance();
      showToast(`🗓️ تم الانتقال لموعد الحصة القادمة (${cycle.nextDayName} ${cycle.nextSessionDate})`, 'success');
    }
  };

  window.attJumpToPrevSession = function() {
    const groupSelect = document.getElementById('attGroupSelect');
    const selectedGroup = groupSelect ? groupSelect.value : '';
    const allAtt = getData('brainova_attendance') || [];
    const cycle = getGroupWeeklyCycleInfo(selectedGroup, allAtt);
    if (cycle.hasPreviousSession) {
      const dateInput = document.getElementById('attDateSelect');
      if (dateInput) {
        dateInput.value = cycle.lastSessionDate;
        window.__preserveAttDate = true;
        renderAttendance();
        showToast(`⏮️ تم الانتقال إلى الحصة السابقة المسجلة (${cycle.lastSessionDate})`, 'info');
      }
    } else {
      showToast('لا توجد حصص سابقة مسجلة لهذا الفوج', 'info');
    }
  };

  window.saveAttendanceRecord = function() {
    const groupSelect = document.getElementById('attGroupSelect');
    const dateInput = document.getElementById('attDateSelect');
    const timeSelect = document.getElementById('attSessionTimeSelect');
    const typeSelect = document.getElementById('attSessionTypeSelect');
    const selectedGroup = groupSelect.value;
    const selectedDate = dateInput.value;
    const selectedTime = timeSelect ? timeSelect.value : '09:00 - 11:00';
    const selectedType = typeSelect ? typeSelect.value : 'regular';

    let allAttendance = getData('brainova_attendance') || [];
    const existingAttForSession = allAttendance.filter(a => 
      a.date === selectedDate && 
      isStudentInGroup({ group: a.groupName }, selectedGroup) && 
      (!a.sessionTime || a.sessionTime === selectedTime || selectedTime.includes(a.sessionTime))
    );

    // Keep all other sessions intact in history - remove only exact matching records being replaced
    allAttendance = allAttendance.filter(a => !(
      a.date === selectedDate && 
      isStudentInGroup({ group: a.groupName }, selectedGroup) && 
      (!a.sessionTime || a.sessionTime === selectedTime || selectedTime.includes(a.sessionTime))
    ));

    const students = getData('brainova_students') || [];
    let savedCount = 0;

    for (const [studentId, data] of Object.entries(activeAttendanceDraft)) {
      const stu = students.find(s => s.id === studentId);
      allAttendance.push({
        id: 'ATT-' + Date.now() + '-' + studentId + '-' + Math.floor(Math.random() * 1000),
        date: selectedDate,
        groupName: selectedGroup,
        sessionTime: selectedTime,
        sessionType: selectedType,
        studentId,
        studentName: stu ? stu.name : 'Unknown',
        status: data.status,
        note: data.note || (selectedType === 'makeup' ? 'حصة تعويضية' : '')
      });
      savedCount++;

      // Safe deduction logic: only deduct if not already deducted in a previous save of this session
      const prevRecord = existingAttForSession.find(a => a.studentId === studentId);
      const wasDeducted = prevRecord && (prevRecord.status === 'present' || prevRecord.status === 'late');
      const isNowPresentOrLate = data.status === 'present' || data.status === 'late';

      if (stu) {
        if (isNowPresentOrLate && !wasDeducted) {
          if (stu.sessionsRemaining > 0) {
            stu.sessionsRemaining = Math.max(0, stu.sessionsRemaining - 1);
          }
          stu.lastAttendance = `${selectedDate} (${selectedTime})`;
        } else if (!isNowPresentOrLate && wasDeducted) {
          stu.sessionsRemaining = (stu.sessionsRemaining || 0) + 1;
        }
      }

      // Zero-click WhatsApp Bot Trigger for late / absent
      if (stu && (data.status === 'late' || data.status === 'absent')) {
        triggerAutoAttendanceWhatsApp(stu, data.status, selectedTime, selectedDate, selectedType);
      }
    }

    saveData('brainova_attendance', allAttendance);
    saveData('brainova_students', students);
    const typeMsg = selectedType === 'makeup' ? ' (حصة تعويضية 🔄)' : (selectedType === 'extra' ? ' (حصة استثنائية ⭐)' : '');
    showToast(`✅ تم حفظ وتثبيت سجل حضور وغياب (${savedCount}) تلميذ لفوج (${selectedGroup}) بتاريخ (${selectedDate})${typeMsg} بنجاح!`, 'success');
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

    // Subscription Validity, First Session Date, and Expected Renewal Date
    const daysMap = { 'الأحد': 0, 'الاحد': 0, 'الإثنين': 1, 'الاثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الاربعاء': 3, 'الخميس': 4, 'الجمعة': 5, 'السبت': 6 };
    const payBaseDate = parseBrainovaDate(payment.paidAtIso || payment.date) || new Date();
    const purchasedSessions = payment.sessionsPurchased || 4;

    const elValidity = document.getElementById('rcptSubscriptionValidity');
    if (elValidity) {
      elValidity.textContent = `${purchasedSessions} حصص (${purchasedSessions === 4 ? 'اشتراك شهري' : 'باقة تدريبية'})`;
    }

    const elFirstSession = document.getElementById('rcptFirstSessionDate');
    if (elFirstSession) {
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
        elFirstSession.textContent = `${dayName} ${day}/${m}/${y} (${timeStr})`;
      } else {
        elFirstSession.textContent = stu && stu.startDate ? `${stu.startDate} (${timeStr})` : `الحصة القادمة (${timeStr})`;
      }
    }

    const elRenewal = document.getElementById('rcptRenewalDate');
    if (elRenewal) {
      const renewalDateObj = new Date(payBaseDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      const ry = renewalDateObj.getFullYear();
      const rm = String(renewalDateObj.getMonth() + 1).padStart(2, '0');
      const rday = String(renewalDateObj.getDate()).padStart(2, '0');
      elRenewal.textContent = `${rday}/${rm}/${ry}`;
    }

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
              ${stu.day ? `<span class="status-pill" style="background:rgba(245,158,11,0.15); color:#FBBF24; border:1px solid rgba(245,158,11,0.3); font-weight:700;">📅 يوم الدراسة: ${stu.day}</span>` : ''}
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
                let rowBorder = 'border-right:3px solid #10B981; background:rgba(16,185,129,0.02);';
                if (att.status === 'present') {
                  statusBadge = '<span class="badge-status-present">حاضر</span>';
                  rowBorder = 'border-right:3px solid #10B981; background:rgba(16,185,129,0.03);';
                } else if (att.status === 'late') {
                  statusBadge = '<span class="badge-status-late">متأخر</span>';
                  rowBorder = 'border-right:3px solid #F59E0B; background:rgba(245,158,11,0.05);';
                } else {
                  statusBadge = '<span class="badge-status-absent">غائب</span>';
                  rowBorder = 'border-right:3px solid #EF4444; background:rgba(239,68,68,0.07);';
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
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.03); ${rowBorder}">
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
        <button type="button" class="btn btn--outline" style="color:#F59E0B; border-color:rgba(245,158,11,0.35);" onclick="closeStudentProfileModal(); openEditStudentModal('${stu.id}');">✏️ تعديل الفوج والبيانات</button>
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
    showToast('✅ تم حفظ الملاحظة التربوية بنجاح', 'success');
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

  // --- STUDENT ID BADGE CARD GENERATOR (CR80 & A4 BATCH) ---
  let currentIdCardStudentId = null;

  window.generateBarcodeSvg = function(code) {
    const bars = [];
    const str = String(code || 'BRAINOVA').toUpperCase();
    let x = 6;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const pattern = [(charCode % 3) + 1, ((charCode >> 2) % 3) + 1, ((charCode >> 4) % 2) + 1, 1];
      pattern.forEach((w, idx) => {
        if (idx % 2 === 0) {
          bars.push(`<rect x="${x}" y="0" width="${w * 1.5}" height="28" fill="#FFFFFF"/>`);
        }
        x += (w * 1.5) + 1.2;
      });
      x += 2;
    }
    return `<svg width="100%" height="28" viewBox="0 0 ${Math.max(x + 6, 120)} 28" xmlns="http://www.w3.org/2000/svg">${bars.join('')}</svg>`;
  };

  window.getStudentBadgeHtml = async function(stu) {
    let qrDataUrl = '';
    const scanCode = `BRAINOVA:ID=${stu.id}`;
    if (window.electronAPI && window.electronAPI.generateQr) {
      try {
        qrDataUrl = await window.electronAPI.generateQr(scanCode);
      } catch (e) {
        qrDataUrl = '';
      }
    }
    if (!qrDataUrl) {
      qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=2&data=${encodeURIComponent(scanCode)}`;
    }
    const barcodeSvg = generateBarcodeSvg(stu.id);

    return `
      <div class="cr80-print-card" style="width:85.6mm; height:54mm; background:linear-gradient(135deg, #0A1324 0%, #0F1D38 100%); color:#FFFFFF; border:1px solid #1E293B; border-radius:3.5mm; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; padding:3.5mm 4.5mm; box-sizing:border-box; position:relative; -webkit-print-color-adjust:exact; print-color-adjust:exact;">
        <!-- Top Ribbon -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(56,189,248,0.25); padding-bottom:2mm;">
          <div style="display:flex; align-items:center; gap:2mm;">
            <div style="width:5.5mm; height:5.5mm; background:#0284C7; border-radius:1mm; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:9pt; color:#fff;">B</div>
            <div>
              <div style="font-size:7.5pt; font-weight:800; color:#F8FAFC; letter-spacing:0.3px;">BRAINOVA ROBOTICS & AI</div>
              <div style="font-size:5.5pt; color:#38BDF8; font-weight:600;">بطاقة التلميذ المعتمدة 2026/2027</div>
            </div>
          </div>
          <span style="font-size:5.5pt; color:#10B981; border:1px solid rgba(16,185,129,0.4); background:rgba(16,185,129,0.1); padding:0.5mm 1.5mm; border-radius:1mm; font-weight:700;">طالب نشط</span>
        </div>

        <!-- Middle Body -->
        <div style="display:flex; justify-content:space-between; align-items:center; gap:2.5mm; margin:1.5mm 0;">
          <!-- Photo / Initials & Details -->
          <div style="display:flex; align-items:center; gap:2.5mm; flex:1; min-width:0;">
            <div style="width:14mm; height:16mm; background:rgba(56,189,248,0.12); border:1px solid #0284C7; border-radius:1.5mm; display:flex; align-items:center; justify-content:center; font-size:16pt; font-weight:800; color:#38BDF8; flex-shrink:0;">
              ${stu.name ? stu.name.trim().charAt(0) : 'ط'}
            </div>
            <div style="min-width:0; flex:1;">
              <div style="font-size:8.5pt; font-weight:800; color:#FFFFFF; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${stu.name}</div>
              <div style="font-size:6pt; color:#38BDF8; font-weight:700; margin-top:0.5mm;">${stu.level || 'المستوى الأول: الروبوتيك'}</div>
              <div style="font-size:5.5pt; color:#CBD5E1; margin-top:0.5mm;">الفوج: <strong style="color:#FFF;">${stu.group || 'الفوج أ'}</strong></div>
              <div style="font-size:5.5pt; color:#94A3B8; margin-top:0.5mm;">الولي: ${stu.parentPhone || '—'}</div>
            </div>
          </div>

          <!-- QR Code for Attendance Scanner -->
          <div style="display:flex; flex-direction:column; align-items:center; flex-shrink:0;">
            <div style="width:15mm; height:15mm; background:#FFFFFF; padding:0.8mm; border-radius:1.2mm; display:flex; align-items:center; justify-content:center;">
              <img src="${qrDataUrl}" style="width:100%; height:100%; display:block;" alt="QR">
            </div>
            <span style="font-size:5pt; font-family:monospace; color:#38BDF8; font-weight:700; margin-top:0.5mm;">${stu.id}</span>
          </div>
        </div>

        <!-- Bottom Footer with Barcode -->
        <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:1.5mm; display:flex; justify-content:space-between; align-items:flex-end;">
          <div style="font-size:5pt; color:#64748B;">
            <div>أكاديمية براينوفا — أم البواقي</div>
            <div style="color:#94A3B8; font-family:monospace; direction:ltr;">0791 19 46 33</div>
          </div>
          <div style="width:34mm; opacity:0.85;">
            ${barcodeSvg}
          </div>
        </div>
      </div>
    `;
  };

  window.openStudentIdCard = async function(studentId) {
    const stu = getData('brainova_students').find(s => s.id === studentId);
    if (!stu) {
      showToast('لم يتم العثور على بيانات الطالب!', 'error');
      return;
    }

    currentIdCardStudentId = studentId;
    const initial = stu.name.trim().charAt(0);
    const avatarEl = document.getElementById('idCardAvatarInitial');
    if (avatarEl) avatarEl.textContent = initial;
    document.getElementById('idCardStudentName').textContent = stu.name;
    document.getElementById('idCardLevel').textContent = stu.level || 'المستوى الأول: التفكير المنطقي';
    document.getElementById('idCardGroup').textContent = stu.group || 'الفوج أ';
    document.getElementById('idCardStudentId').textContent = `${stu.id}`;

    const scanCode = `BRAINOVA:ID=${stu.id}`;
    const qrImg = document.getElementById('idCardQrCode');
    if (qrImg) {
      if (window.electronAPI && window.electronAPI.generateQr) {
        try {
          const localQr = await window.electronAPI.generateQr(scanCode);
          if (localQr) qrImg.src = localQr;
          else qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=2&data=${encodeURIComponent(scanCode)}`;
        } catch (e) {
          qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=2&data=${encodeURIComponent(scanCode)}`;
        }
      } else {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=2&data=${encodeURIComponent(scanCode)}`;
      }
    }

    document.getElementById('studentIdCardModal').classList.add('active');
  };

  window.closeStudentIdCardModal = function() {
    document.getElementById('studentIdCardModal').classList.remove('active');
    currentIdCardStudentId = null;
  };

  window.confirmPrintCurrentStudentBadge = function() {
    if (currentIdCardStudentId) {
      printStudentBadge(currentIdCardStudentId);
    } else {
      showToast('لم يتم تحديد طالب!', 'error');
    }
  };

  window.printStudentBadge = async function(studentId) {
    const stu = getData('brainova_students').find(s => s.id === studentId);
    if (!stu) { showToast('بيانات التلميذ غير موجودة!', 'error'); return; }

    const badgeHtml = await getStudentBadgeHtml(stu);
    const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>بطاقة تلميذ - ${stu.name}</title>
  <style>
    @page { size: 85.6mm 54mm; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', system-ui, sans-serif; }
    body { width: 85.6mm; height: 54mm; margin: 0; padding: 0; background: #0A1324; -webkit-print-color-adjust: exact; print-color-adjust: exact; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  ${badgeHtml}
</body>
</html>`;

    if (window.electronAPI && window.electronAPI.printDocument) {
      window.electronAPI.printDocument({ html: fullHtml, title: `بطاقة_التلميذ_${stu.name}` });
      showToast(`تم إرسال بطاقة التلميذ (${stu.name}) للطباعة! 🪪`, 'success');
    } else {
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(fullHtml);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); }, 500);
      }
    }
  };

  // --- BATCH GROUP ID BADGES (A4 SHEET) ---
  window.openBatchBadgesModal = function(defaultGroup) {
    const groups = getData('brainova_groups');
    const select = document.getElementById('batchBadgesGroupSelect');
    if (!select) return;

    select.innerHTML = groups.map(g => `<option value="${g.name}">${g.name} (${g.level || ''})</option>`).join('');
    if (defaultGroup) {
      select.value = decodeURIComponent(defaultGroup);
    }

    updateBatchBadgesPreview();
    document.getElementById('batchBadgesModal').classList.add('active');
  };

  window.closeBatchBadgesModal = function() {
    const modal = document.getElementById('batchBadgesModal');
    if (modal) modal.classList.remove('active');
  };

  window.updateBatchBadgesPreview = function() {
    const select = document.getElementById('batchBadgesGroupSelect');
    const infoEl = document.getElementById('batchBadgesPreviewInfo');
    if (!select || !infoEl) return;

    const groupName = select.value;
    const students = getData('brainova_students').filter(s => isStudentInGroup(s, groupName));
    const pagesCount = Math.ceil(students.length / 8) || 1;

    infoEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span>الطلاب المسجلون بالفوج: <strong style="color:#38BDF8; font-size:1rem;">${students.length}</strong></span>
        <span>عدد صفحات A4: <strong style="color:#10B981;">${pagesCount} صفحة</strong> (8 بطاقات بالصفحة)</span>
      </div>
      <div style="font-size:0.75rem; color:#94A3B8; margin-top:6px;">
        مجهزة بمسافات وهوامش قياسية وخطوط قص دقيقة لسهولة التقطيع والتغليف الحراري (Lamination).
      </div>
    `;
  };

  window.confirmPrintGroupBadges = function() {
    const select = document.getElementById('batchBadgesGroupSelect');
    if (!select || !select.value) {
      showToast('يرجى اختيار فوج أولاً!', 'error');
      return;
    }
    printGroupBadges(select.value);
    closeBatchBadgesModal();
  };

  window.printGroupBadges = async function(groupName) {
    const students = getData('brainova_students').filter(s => isStudentInGroup(s, groupName));
    if (students.length === 0) {
      showToast('لا يوجد طلاب مسجلين في هذا الفوج لطباعة بطاقاتهم!', 'error');
      return;
    }

    showToast(`جارٍ تجهيز ${students.length} بطاقة لفوج (${groupName})...`, 'info');

    const badgesHtmlArray = [];
    for (const stu of students) {
      const cardHtml = await getStudentBadgeHtml(stu);
      badgesHtmlArray.push(`
        <div style="page-break-inside:avoid; border:1px dashed #64748B; border-radius:3.5mm; padding:1px; background:#070D19;">
          ${cardHtml}
        </div>
      `);
    }

    const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>بطاقات طلاب فوج - ${groupName}</title>
  <style>
    @page { size: A4 portrait; margin: 10mm 8mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', system-ui, sans-serif; }
    body { width: 100%; background: #FFFFFF; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .sheet-header { text-align: center; margin-bottom: 6mm; border-bottom: 1px solid #E2E8F0; padding-bottom: 2mm; }
    .sheet-header h2 { font-size: 13pt; color: #0F172A; }
    .sheet-header p { font-size: 8pt; color: #64748B; margin-top: 1mm; }
    .cards-grid { display: grid; grid-template-columns: 85.6mm 85.6mm; gap: 6mm 6mm; justify-content: center; }
  </style>
</head>
<body>
  <div class="sheet-header">
    <h2>أكاديمية براينوفا للروبوتيك والذكاء الاصطناعي — بطاقات طلاب ${groupName}</h2>
    <p>إجمالي البطاقات: ${students.length} بطاقة • قص على الخطوط المتقطعة للتغليف الحراري (Lamination)</p>
  </div>
  <div class="cards-grid">
    ${badgesHtmlArray.join('')}
  </div>
</body>
</html>`;

    if (window.electronAPI && window.electronAPI.printDocument) {
      window.electronAPI.printDocument({ html: fullHtml, title: `بطاقات_فوج_${groupName}` });
      showToast(`تم إرسال ورقة بطاقات (${groupName}) للطباعة بنجاح!`, 'success');
    } else {
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(fullHtml);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); }, 500);
      }
    }
  };

  // ==========================================================================
  // COMMAND PALETTE (CTRL + K) ENGINE
  // ==========================================================================
  let cmdPaletteActiveIndex = 0;
  let cmdPaletteCurrentItems = [];

  window.openCommandPalette = function() {
    const overlay = document.getElementById('cmdPaletteOverlay');
    const input = document.getElementById('cmdPaletteInput');
    if (!overlay || !input) return;

    overlay.style.display = 'flex';
    input.value = '';
    cmdPaletteActiveIndex = 0;
    renderCommandPaletteResults('');
    setTimeout(() => input.focus(), 50);
  };

  window.closeCommandPalette = function(event) {
    const overlay = document.getElementById('cmdPaletteOverlay');
    if (!overlay) return;
    overlay.style.display = 'none';
  };

  window.onCmdPaletteInput = function(val) {
    cmdPaletteActiveIndex = 0;
    renderCommandPaletteResults(val.trim());
  };

  window.onCmdPaletteKeydown = function(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeCommandPalette();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdPaletteCurrentItems.length > 0) {
        cmdPaletteActiveIndex = (cmdPaletteActiveIndex + 1) % cmdPaletteCurrentItems.length;
        updateCmdPaletteActiveHighlight();
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdPaletteCurrentItems.length > 0) {
        cmdPaletteActiveIndex = (cmdPaletteActiveIndex - 1 + cmdPaletteCurrentItems.length) % cmdPaletteCurrentItems.length;
        updateCmdPaletteActiveHighlight();
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (cmdPaletteCurrentItems[cmdPaletteActiveIndex]) {
        executeCommandPaletteAction(cmdPaletteCurrentItems[cmdPaletteActiveIndex]);
      }
      return;
    }
  };

  function updateCmdPaletteActiveHighlight() {
    const container = document.getElementById('cmdPaletteResults');
    if (!container) return;
    const items = container.querySelectorAll('.cmd-item');
    items.forEach((item, idx) => {
      if (idx === cmdPaletteActiveIndex) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  function renderCommandPaletteResults(query) {
    const container = document.getElementById('cmdPaletteResults');
    if (!container) return;

    const q = (query || '').toLowerCase().trim();
    const students = getData('brainova_students');
    const groups = getData('brainova_groups');

    const staticActions = [
      { id: 'act_add_student', label: 'تسجيل تلميذ جديد', sub: 'فتح نافذة إضافة طالب جديد', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>', type: 'action', run: () => openAddStudentModal() },
      { id: 'act_attendance', label: 'تفقد الحضور والجلسات', sub: 'الانتقال إلى جدول تسجيل الحضور اليومي', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>', type: 'nav', target: 'attendance' },
      { id: 'act_qr_scan', label: 'ماسح الحضور الذكي بالكاميرا', sub: 'مسح بطاقات الطلاب بالكاميرا تلقائياً', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>', type: 'action', run: () => openQrScannerModal() },
      { id: 'act_batch_badges', label: 'طباعة بطاقات الفوج (A4)', sub: 'توليد ورقة A4 مجمعة لبطاقات طلاب الفوج', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>', type: 'action', run: () => openBatchBadgesModal() },
      { id: 'act_backup_export', label: 'تصدير نسخة احتياطية فورية', sub: 'حفظ ملف قاعدة البيانات بالكامل', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>', type: 'action', run: () => doBackupExport() },
      { id: 'act_whatsapp_hub', label: 'الوصي الآلي لواتساب (Guardian)', sub: 'إدارة الروبوت والمحادثات المباشرة', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>', type: 'nav', target: 'whatsapp' },
      { id: 'act_schedule', label: 'جدول الحصص والقاعات', sub: 'عرض الحصص والمختبرات', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', type: 'nav', target: 'schedule' }
    ];

    let matchedActions = [];
    let matchedStudents = [];
    let matchedGroups = [];

    if (!q) {
      matchedActions = staticActions;
      matchedStudents = students.slice(0, 4);
      matchedGroups = groups.slice(0, 3);
    } else {
      matchedActions = staticActions.filter(a => a.label.toLowerCase().includes(q) || a.sub.toLowerCase().includes(q));
      matchedStudents = students.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.parentPhone && s.parentPhone.includes(q)) ||
        (s.id && s.id.toLowerCase().includes(q)) ||
        (s.parentName && s.parentName.toLowerCase().includes(q))
      ).slice(0, 6);
      matchedGroups = groups.filter(g =>
        g.name.toLowerCase().includes(q) ||
        (g.level && g.level.toLowerCase().includes(q))
      ).slice(0, 4);
    }

    cmdPaletteCurrentItems = [];
    let html = '';

    if (matchedActions.length > 0) {
      html += `<div class="cmd-category-header">إجراءات سريعة</div>`;
      matchedActions.forEach(a => {
        const itemIndex = cmdPaletteCurrentItems.length;
        cmdPaletteCurrentItems.push(a);
        html += `
          <div class="cmd-item ${itemIndex === cmdPaletteActiveIndex ? 'active' : ''}" onclick="executeCommandPaletteActionByIndex(${itemIndex})">
            <div class="cmd-item-left">
              <div class="cmd-item-icon">${a.icon}</div>
              <div>
                <div style="font-weight:700;">${a.label}</div>
                <div style="font-size:0.72rem; color:#64748B;">${a.sub}</div>
              </div>
            </div>
            <span class="cmd-item-badge">أمر</span>
          </div>
        `;
      });
    }

    if (matchedStudents.length > 0) {
      html += `<div class="cmd-category-header" style="margin-top:6px;">الطلاب</div>`;
      matchedStudents.forEach(stu => {
        const itemObj = {
          id: `stu_${stu.id}`,
          label: stu.name,
          type: 'student',
          run: () => openStudentProfile(stu.id)
        };
        const itemIndex = cmdPaletteCurrentItems.length;
        cmdPaletteCurrentItems.push(itemObj);
        html += `
          <div class="cmd-item ${itemIndex === cmdPaletteActiveIndex ? 'active' : ''}" onclick="executeCommandPaletteActionByIndex(${itemIndex})">
            <div class="cmd-item-left">
              <div class="cmd-item-icon" style="color:#10B981;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div style="font-weight:700;">${stu.name}</div>
                <div style="font-size:0.72rem; color:#64748B;">${stu.group || 'بدون فوج'} • ${stu.parentPhone || 'بدون هاتف'}</div>
              </div>
            </div>
            <span class="cmd-item-badge">${stu.id}</span>
          </div>
        `;
      });
    }

    if (matchedGroups.length > 0) {
      html += `<div class="cmd-category-header" style="margin-top:6px;">الأفواج</div>`;
      matchedGroups.forEach(grp => {
        const itemObj = {
          id: `grp_${grp.id}`,
          label: grp.name,
          type: 'group',
          run: () => openQuickGroupAttendanceModal(encodeURIComponent(grp.name))
        };
        const itemIndex = cmdPaletteCurrentItems.length;
        cmdPaletteCurrentItems.push(itemObj);
        html += `
          <div class="cmd-item ${itemIndex === cmdPaletteActiveIndex ? 'active' : ''}" onclick="executeCommandPaletteActionByIndex(${itemIndex})">
            <div class="cmd-item-left">
              <div class="cmd-item-icon" style="color:#F59E0B;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <div style="font-weight:700;">${grp.name}</div>
                <div style="font-size:0.72rem; color:#64748B;">${grp.level || ''} • ${grp.ageCategory || ''}</div>
              </div>
            </div>
            <span class="cmd-item-badge">فوج</span>
          </div>
        `;
      });
    }

    const rooms = getData('brainova_rooms') || [];
    let matchedRooms = [];
    if (!q) {
      matchedRooms = rooms.slice(0, 3);
    } else {
      matchedRooms = rooms.filter(r =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.type && r.type.toLowerCase().includes(q)) ||
        (r.educatorName && r.educatorName.toLowerCase().includes(q))
      ).slice(0, 3);
    }

    if (matchedRooms.length > 0) {
      html += `<div class="cmd-category-header" style="margin-top:6px;">القاعات والمخابر</div>`;
      matchedRooms.forEach(rm => {
        const itemObj = {
          id: `room_${rm.id}`,
          label: rm.name,
          type: 'room',
          run: () => openRoomDetailsModal(rm.id)
        };
        const itemIndex = cmdPaletteCurrentItems.length;
        cmdPaletteCurrentItems.push(itemObj);
        html += `
          <div class="cmd-item ${itemIndex === cmdPaletteActiveIndex ? 'active' : ''}" onclick="executeCommandPaletteActionByIndex(${itemIndex})">
            <div class="cmd-item-left">
              <div class="cmd-item-icon" style="color:#38BDF8;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M3 7v14"/><path d="M21 7v14"/><path d="M7 21V11a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10"/><path d="M12 14v1"/></svg>
              </div>
              <div>
                <div style="font-weight:700;">${rm.name}</div>
                <div style="font-size:0.72rem; color:#64748B;">${rm.type || 'قاعة تدريب'} • استعراض الأستاذ والطلاب</div>
              </div>
            </div>
            <span class="cmd-item-badge">قاعة</span>
          </div>
        `;
      });
    }

    if (cmdPaletteCurrentItems.length === 0) {
      html = `<div style="text-align:center; padding:32px 16px; color:#64748B; font-size:0.86rem;">لم يتم العثور على أي نتائج مطابقة لـ "${query}"</div>`;
    }

    container.innerHTML = html;
  }

  window.executeCommandPaletteActionByIndex = function(index) {
    if (cmdPaletteCurrentItems[index]) {
      executeCommandPaletteAction(cmdPaletteCurrentItems[index]);
    }
  };

  function executeCommandPaletteAction(item) {
    closeCommandPalette();
    if (!item) return;

    if (item.type === 'nav') {
      const navBtn = document.querySelector(`[data-view="${item.target}"]`);
      if (navBtn) navBtn.click();
    } else if (typeof item.run === 'function') {
      item.run();
    }
  }

  // Global keybindings
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === 'Escape') {
      const overlay = document.getElementById('cmdPaletteOverlay');
      if (overlay && overlay.style.display !== 'none') {
        closeCommandPalette();
      }
    }
  });

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
      const maxIdNum = students.reduce((max, s) => {
        const num = parseInt(String(s.id).replace(/\D/g, ''), 10);
        return !isNaN(num) ? Math.max(max, num) : max;
      }, 0);
      const newStudentId = "STU-" + String(maxIdNum + 1).padStart(3, '0');
      const planStr = regs[index].pricingPlan || '';
      const monthlyFee = planStr.includes('8000') ? 8000 : (planStr.includes('11000') ? 11000 : 5000);
      const todayIso = new Date().toISOString().split('T')[0];
      const newStudent = {
        id: newStudentId,
        name: regs[index].studentName,
        parentName: regs[index].parentName || "—",
        parentPhone: regs[index].parentPhone || "—",
        group: regs[index].group || regs[index].preferredGroup || "الفوج أ (مبتدئ)",
        level: regs[index].preferredLevel || "المستوى الأول",
        username: generateRandomCode(8),
        password: generateRandomCode(8),
        monthlyFee: monthlyFee,
        plan: planStr || 'طفل واحد (5,000 دج)',
        balance: 0,
        sessionsRemaining: 0,
        lastAttendance: "جديد",
        joinedDate: todayIso,
        startDate: todayIso
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
      const studentCount = students.filter(s => isStudentInGroup(s, g.name)).length;
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
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.78rem; color:var(--color-text-muted); margin-bottom:8px; background:rgba(255,255,255,0.03); padding:6px 10px; border-radius:var(--radius-sm); border:1px solid var(--color-border);">
            <span>التوقيت الأسبوعي</span>
            <span style="color:var(--color-text); font-weight:700; font-family:monospace;">${dayStr} • ${timeSlot}</span>
          </div>

          <!-- Weekly Session Cycle Box -->
          ${(() => {
            const allAttendance = getData('brainova_attendance') || [];
            const cycle = getGroupWeeklyCycleInfo(g.name, allAttendance);
            return `
              <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-border); border-radius:var(--radius-sm); padding:8px 10px; margin-bottom:10px; font-size:0.78rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <span style="color:var(--color-text-muted);">📅 موعد الحصة القادمة:</span>
                  <strong style="color:#38BDF8; font-weight:700; font-size:0.84rem;">${cycle.nextDayName} ${cycle.nextSessionDate || '—'}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                  <span style="color:var(--color-text-muted);">🕒 آخر حصة مسجلة:</span>
                  <span style="color:${cycle.hasPreviousSession ? '#10B981' : '#94A3B8'}; font-weight:600;">
                    ${cycle.hasPreviousSession ? `${cycle.lastDayName} ${cycle.lastSessionDate}` : 'لا توجد حصص سابقة'}
                    ${cycle.isLastMakeup ? '<span style="background:rgba(168,85,247,0.18); color:#C084FC; font-size:0.68rem; padding:1px 6px; border-radius:4px; font-weight:700; margin-right:4px;">تعويضية 🔄</span>' : ''}
                  </span>
                </div>
                <div>
                  <span class="status-pill" style="${cycle.badgeStyle}; font-size:0.72rem; padding:3px 8px; border-radius:6px; display:inline-block;">${cycle.badgeText}</span>
                </div>
              </div>
            `;
          })()}

          <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--color-border); padding-top: 8px; gap:6px; flex-wrap:wrap;">
            <span style="font-size:0.78rem; color:var(--color-text-muted);">الطلاب: <strong style="color:var(--color-text);">${studentCount} / ${g.maxStudents || 12}</strong></span>
            <div style="display:inline-flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn btn--primary btn--small" style="font-size:0.75rem; padding:5px 10px;" onclick="openQuickGroupAttendanceModal('${encodeURIComponent(g.name)}')">تسجيل الحضور</button>
              <button type="button" class="btn btn--outline btn--small" style="font-size:0.75rem; padding:5px 10px; color:#F59E0B; border-color:rgba(245,158,11,0.4);" onclick="openEditGroupModal('${g.id}')">✏️ تعديل الفوج</button>
              <button type="button" class="btn btn--outline btn--small" style="font-size:0.75rem; padding:5px 10px;" onclick="printGroupMonthlyAttendanceSheet('${encodeURIComponent(g.name)}')">طباعة القائمة</button>
              <button type="button" class="btn btn--outline btn--small" style="font-size:0.75rem; padding:5px 10px;" onclick="openBatchBadgesModal('${encodeURIComponent(g.name)}')">بطاقات الفوج</button>
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
    const rawGroupName = decodeURIComponent(encodedGroupName || '').trim();
    if (!rawGroupName) return;

    // 1. Resolve exact group from database
    const allGroups = getData('brainova_groups') || [];
    const matchedGroup = allGroups.find(g => 
      g.name.trim().toLowerCase() === rawGroupName.toLowerCase() || 
      g.id === rawGroupName ||
      g.name.trim().toLowerCase().includes(rawGroupName.toLowerCase()) ||
      rawGroupName.toLowerCase().includes(g.name.trim().toLowerCase())
    );
    const targetGroupName = matchedGroup ? matchedGroup.name : rawGroupName;

    // 2. Open dedicated Quick Group Attendance modal directly for this exact group & time!
    openQuickGroupAttendanceModal(encodeURIComponent(targetGroupName), timeSlot);

    // 3. Also prime Attendance View so if user visits it, it is 100% synchronized for this exact group!
    window.__selectedAttendanceGroup = targetGroupName;
    if (timeSlot) window.__selectedAttendanceTime = timeSlot;
  };

  // --- GROUP STUDENTS ROSTER MODAL LOGIC ---
  window.__currentRosterGroupName = '';

  window.openGroupStudentsModal = function(encodedGroupName) {
    const groupName = decodeURIComponent(encodedGroupName);
    window.__currentRosterGroupName = groupName;

    const groups = getData('brainova_groups');
    const group = groups.find(g => g.name === groupName) || { name: groupName, educator: 'عابد اسحاق تقي الدين', room: 'قاعة Brainova', ageCategory: 'جميع الفئات' };
    const allStudents = getData('brainova_students');
    const groupStudents = allStudents.filter(s => isStudentInGroup(s, groupName));

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
                  <button type="button" class="btn btn--outline btn--small" style="padding:4px 8px; font-size:0.75rem; color:#F59E0B; border-color:rgba(245,158,11,0.35);" onclick="closeGroupStudentsModal(); openEditStudentModal('${stu.id}')">✏️ تعديل</button>
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
      onStudentGroupSelectChange();
    }
  };

  // ==========================================
  // QUICK GROUP ATTENDANCE LOGIC (DIRECTLY IN GROUPS VIEW)
  // ==========================================
  window.__quickAttGroupName = '';
  window.__quickAttDraft = {};
  window.__quickAttDraftDate = '';

  function openQuickGroupAttendanceModal(encodedGroupName, customTimeSlot) {
    const rawGroupName = decodeURIComponent(encodedGroupName || '').trim();
    if (!rawGroupName) return;

    // Resolve exact group from database to make sure capitalization and naming match 100%
    const groups = getData('brainova_groups') || [];
    const matchedGroup = groups.find(x => 
      x.name.trim().toLowerCase() === rawGroupName.toLowerCase() || 
      x.id === rawGroupName ||
      x.name.trim().toLowerCase().includes(rawGroupName.toLowerCase()) ||
      rawGroupName.toLowerCase().includes(x.name.trim().toLowerCase())
    );
    const groupName = matchedGroup ? matchedGroup.name : rawGroupName;

    window.__quickAttGroupName = groupName;
    window.__quickAttDraft = {};
    window.__quickAttDraftDate = '';

    const allAttendance = getData('brainova_attendance') || [];
    const cycle = getGroupWeeklyCycleInfo(groupName, allAttendance);

    const titleEl = document.getElementById('quickAttModalTitle');
    if (titleEl) {
      titleEl.textContent = 'تفقد حضور وغياب: ' + groupName + (customTimeSlot ? ` (${customTimeSlot})` : '');
    }

    // Set Date to suggested weekly date (next weekly date +7 days or today)
    const dateInput = document.getElementById('quickAttDate');
    if (dateInput) {
      dateInput.value = cycle.suggestedDate;
      window.__quickAttDraftDate = cycle.suggestedDate;
    }

    // Find scheduled time for this group
    const schedules = getData('brainova_schedule') || [];
    const sch = schedules.find(s => s.groupId === (matchedGroup ? matchedGroup.id : '') || isStudentInGroup({ group: s.groupName }, groupName));
    const timeInput = document.getElementById('quickAttTime');
    if (timeInput) {
      const scheduledTime = customTimeSlot || (sch ? `${sch.startTime} - ${sch.endTime}` : (matchedGroup?.timeSlot || '14:00 - 16:00'));
      timeInput.value = scheduledTime;
    }

    // Update cycle display in modal
    const cycleHeader = document.getElementById('quickAttCycleHeader');
    if (cycleHeader) {
      cycleHeader.innerHTML = `${cycle.hasPreviousSession ? 'آخر حصة: <span style="color:#10B981;">' + cycle.lastDayName + ' ' + cycle.lastSessionDate + '</span> • ' : ''}<span style="color:#38BDF8;">موعد الحصة القادمة: ${cycle.nextDayName} ${cycle.nextSessionDate}</span>`;
    }
    const scheduleLabel = document.getElementById('quickAttScheduleLabel');
    if (scheduleLabel) {
      scheduleLabel.textContent = `${cycle.scheduledDay} • ${cycle.scheduledTime}`;
    }
    const nextDateLabel = document.getElementById('quickAttNextDateLabel');
    if (nextDateLabel) {
      nextDateLabel.textContent = `${cycle.nextDayName} ${cycle.nextSessionDate}`;
    }
    const prevDateLabel = document.getElementById('quickAttPrevDateLabel');
    if (prevDateLabel) {
      prevDateLabel.textContent = cycle.hasPreviousSession ? `${cycle.lastDayName} ${cycle.lastSessionDate}` : 'لا توجد';
    }
    const prevWeekBtn = document.getElementById('quickAttPrevWeekBtn');
    if (prevWeekBtn) {
      prevWeekBtn.style.display = cycle.hasPreviousSession ? 'inline-flex' : 'none';
    }

    const typeSelect = document.getElementById('quickAttSessionType');
    if (typeSelect) typeSelect.value = 'regular';

    renderQuickAttendanceStudents();

    const modal = document.getElementById('quickGroupAttendanceModal');
    if (modal) modal.classList.add('active');
  }
  window.openQuickGroupAttendanceModal = openQuickGroupAttendanceModal;

  window.onQuickAttSessionTypeChange = function() {
    const type = document.getElementById('quickAttSessionType')?.value || 'regular';
    const noticeEl = document.getElementById('quickAttArchiveNotice');
    const selectedDate = document.getElementById('quickAttDate')?.value || '';
    const selectedTime = document.getElementById('quickAttTime')?.value || '';
    if (noticeEl) {
      if (type === 'makeup') {
        noticeEl.innerHTML = `<span style="color:#C084FC; font-weight:700;">🔄 وضع الحصة التعويضية (${selectedDate} • ${selectedTime}) — يمكنك إدخال أي وقت وتاريخ للتعويض بحرية تامة دون أي قيود.</span>`;
      } else if (type === 'extra') {
        noticeEl.innerHTML = `<span style="color:#F59E0B; font-weight:700;">⭐ حصة استثنائية / إضافية (${selectedDate} • ${selectedTime}) — ورشة خاصة أو نشاط تدريبي إضافي.</span>`;
      } else {
        renderQuickAttendanceStudents();
      }
    }
  };

  window.quickAttJumpToPrevSession = function() {
    const groupName = window.__quickAttGroupName;
    const allAttendance = getData('brainova_attendance') || [];
    const cycle = getGroupWeeklyCycleInfo(groupName, allAttendance);
    if (cycle.hasPreviousSession) {
      const dateInput = document.getElementById('quickAttDate');
      if (dateInput) {
        dateInput.value = cycle.lastSessionDate;
        window.__quickAttDraft = {};
        window.__quickAttDraftDate = cycle.lastSessionDate;
        renderQuickAttendanceStudents();
        showToast(`⏮️ تم الانتقال إلى الحصة السابقة المسجلة (${cycle.lastSessionDate})`, 'info');
      }
    } else {
      showToast('لا توجد حصص سابقة مسجلة لهذا الفوج', 'info');
    }
  };

  window.quickAttJumpToNextSession = function() {
    const groupName = window.__quickAttGroupName;
    const allAttendance = getData('brainova_attendance') || [];
    const cycle = getGroupWeeklyCycleInfo(groupName, allAttendance);
    const dateInput = document.getElementById('quickAttDate');
    if (dateInput) {
      dateInput.value = cycle.nextSessionDate;
      window.__quickAttDraft = {};
      window.__quickAttDraftDate = cycle.nextSessionDate;
      renderQuickAttendanceStudents();
      showToast(`🗓️ تم الانتقال لموعد الحصة القادمة (${cycle.nextDayName} ${cycle.nextSessionDate})`, 'success');
    }
  };

  window.quickAttJumpToToday = function() {
    const todayStr = new Date().toISOString().slice(0, 10);
    const dateInput = document.getElementById('quickAttDate');
    if (dateInput) {
      dateInput.value = todayStr;
      window.__quickAttDraft = {};
      window.__quickAttDraftDate = todayStr;
      renderQuickAttendanceStudents();
    }
  };

  window.switchToFullAttendanceViewFromQuickModal = function() {
    const groupName = window.__quickAttGroupName;
    const timeVal = document.getElementById('quickAttTime')?.value;
    const dateVal = document.getElementById('quickAttDate')?.value;

    closeQuickGroupAttendanceModal();

    window.__selectedAttendanceGroup = groupName;
    if (timeVal) window.__selectedAttendanceTime = timeVal;

    const navBtn = document.querySelector('[data-view="attendance"]');
    if (navBtn) navBtn.click();

    setTimeout(() => {
      if (dateVal) {
        const dateInput = document.getElementById('attDateSelect');
        if (dateInput) dateInput.value = dateVal;
      }
      renderAttendance();
      showToast(`تم فتح سجل الحضور الكامل لفوج "${groupName}" 📝`, 'success');
    }, 120);
  };

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

    // If user changed date picker manually, reset draft for that date
    if (window.__quickAttDraftDate !== selectedDate) {
      window.__quickAttDraft = {};
      window.__quickAttDraftDate = selectedDate;
    }

    const allStudents = getData('brainova_students') || [];
    const groupStudents = allStudents.filter(s => isStudentInGroup(s, groupName));

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
      isStudentInGroup({ group: a.groupName }, groupName) &&
      (!a.sessionTime || a.sessionTime === selectedTime || selectedTime.includes(a.sessionTime))
    );

    // Update Archive Notice Badge
    const noticeEl = document.getElementById('quickAttArchiveNotice');
    if (noticeEl) {
      if (existingAtt.length > 0) {
        noticeEl.innerHTML = `<span style="color:#F59E0B;">⚠️ هذه الحصة مسجلة سابقاً في الأرشيف بتاريخ (${selectedDate}) — يمكنك مراجعة الغيابات وتعديلها.</span>`;
      } else {
        noticeEl.innerHTML = `<span style="color:#10B981;">✨ حصة أسبوعية جديدة (${selectedDate}) — لم تسجل بعد، جاهزة لرصد الغيابات وتثبيتها في الأرشيف.</span>`;
      }
    }

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

          <div style="flex:1; min-width:150px;">
            <input type="text" class="form-input" style="height:32px; font-size:0.8rem;" 
              placeholder="ملاحظة خاصة بالطالب..." 
              value="${state.note || ''}" 
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
    const selectedType = document.getElementById('quickAttSessionType')?.value || 'regular';

    let allAttendance = getData('brainova_attendance') || [];
    const existingAttForSession = allAttendance.filter(a => 
      a.date === selectedDate && 
      isStudentInGroup({ group: a.groupName }, groupName) && 
      (!a.sessionTime || a.sessionTime === selectedTime || selectedTime.includes(a.sessionTime))
    );

    // Keep all other sessions intact in history - remove only exact matching records being replaced
    allAttendance = allAttendance.filter(a => !(
      a.date === selectedDate && 
      isStudentInGroup({ group: a.groupName }, groupName) && 
      (!a.sessionTime || a.sessionTime === selectedTime || selectedTime.includes(a.sessionTime))
    ));

    const students = getData('brainova_students') || [];
    let savedCount = 0;
    let lateOrAbsentCount = 0;

    for (const [studentId, data] of Object.entries(window.__quickAttDraft)) {
      const stu = students.find(s => s.id === studentId);
      allAttendance.push({
        id: 'ATT-' + Date.now() + '-' + studentId + '-' + Math.floor(Math.random() * 1000),
        date: selectedDate,
        groupName: groupName,
        sessionTime: selectedTime,
        sessionType: selectedType,
        studentId: studentId,
        studentName: stu ? stu.name : 'Unknown',
        status: data.status,
        note: data.note || (selectedType === 'makeup' ? 'حصة تعويضية' : '')
      });
      savedCount++;

      // Safe deduction logic: only deduct if not already deducted in a previous save of this session
      const prevRecord = existingAttForSession.find(a => a.studentId === studentId);
      const wasDeducted = prevRecord && (prevRecord.status === 'present' || prevRecord.status === 'late');
      const isNowPresentOrLate = data.status === 'present' || data.status === 'late';

      if (stu) {
        if (isNowPresentOrLate && !wasDeducted) {
          if (stu.sessionsRemaining > 0) {
            stu.sessionsRemaining = Math.max(0, stu.sessionsRemaining - 1);
          }
          stu.lastAttendance = `${selectedDate} (${selectedTime})`;
        } else if (!isNowPresentOrLate && wasDeducted) {
          stu.sessionsRemaining = (stu.sessionsRemaining || 0) + 1;
        }
      }

      // Zero-click WhatsApp alert if late or absent
      if (stu && (data.status === 'late' || data.status === 'absent')) {
        lateOrAbsentCount++;
        triggerAutoAttendanceWhatsApp(stu, data.status, selectedTime, selectedDate, selectedType);
      }
    }

    saveData('brainova_attendance', allAttendance);
    saveData('brainova_students', students);

    const typeMsg = selectedType === 'makeup' ? ' (حصة تعويضية 🔄)' : (selectedType === 'extra' ? ' (حصة استثنائية ⭐)' : '');
    closeQuickGroupAttendanceModal();
    showToast(`✅ تم حفظ حضور وغياب (${savedCount}) تلميذ لفوج (${groupName}) بتاريخ (${selectedDate} - ${selectedTime})${typeMsg} بنجاح!`, 'success');
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
    const groupStudents = allStudents.filter(s => s.groupId === g.id || isStudentInGroup(s, g.name));
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
  // --- ROOMS & LABS SYSTEM (ROOM DETAILS, EDUCATORS & STUDENTS ROSTER) ---
  let currentActiveRoomId = null;
  let currentActiveRoomStudents = [];

  function getRoomDetails(r) {
    const allGroups = getData('brainova_groups') || [];
    const allStudents = getData('brainova_students') || [];
    const allSchedule = getData('brainova_schedule') || [];
    const allEducators = getData('brainova_educators') || [];

    // Match groups assigned to this room
    const roomGroups = allGroups.filter(g => 
      (g.room && g.room.trim().toLowerCase() === r.name.trim().toLowerCase()) ||
      (r.currentGroup && r.currentGroup.trim().toLowerCase() === g.name.trim().toLowerCase()) ||
      allSchedule.some(s => s.room && s.room.trim().toLowerCase() === r.name.trim().toLowerCase() && (s.groupId === g.id || s.groupName === g.name))
    );

    // Match educator teaching in this room
    let educatorName = r.educatorName || '';
    if (!educatorName && roomGroups.length > 0) {
      const gWithEdu = roomGroups.find(g => g.educatorName);
      if (gWithEdu) educatorName = gWithEdu.educatorName;
    }
    if (!educatorName) {
      const schedWithEdu = allSchedule.find(s => s.room && s.room.trim().toLowerCase() === r.name.trim().toLowerCase() && s.educatorName);
      if (schedWithEdu) educatorName = schedWithEdu.educatorName;
    }
    if (!educatorName && allEducators.length === 1) {
      educatorName = allEducators[0].name;
    }

    const eduObj = allEducators.find(e => e.name && e.name.trim().toLowerCase() === (educatorName || '').trim().toLowerCase()) || {};

    // Match students in this room
    const groupNamesSet = new Set(roomGroups.map(g => g.name.trim().toLowerCase()));
    if (r.currentGroup) groupNamesSet.add(r.currentGroup.trim().toLowerCase());

    const roomStudents = allStudents.filter(stu => {
      if (!stu.group) return false;
      return groupNamesSet.has(stu.group.trim().toLowerCase()) || (stu.room && stu.room.trim().toLowerCase() === r.name.trim().toLowerCase());
    });

    // Match scheduled sessions in this room
    const roomSessions = allSchedule.filter(s => s.room && s.room.trim().toLowerCase() === r.name.trim().toLowerCase());

    return {
      room: r,
      roomGroups,
      roomStudents,
      roomSessions,
      educatorName: educatorName || '',
      educatorSpecialty: eduObj.specialty || '',
      educatorPhone: eduObj.phone || '',
      occupancyPercent: Math.min(100, Math.round((roomStudents.length / (r.capacity || 1)) * 100))
    };
  }

  function renderRooms() {
    const grid = document.getElementById('roomsGrid');
    if (!grid) return;

    const rooms = getData('brainova_rooms') || [];
    const allStudents = getData('brainova_students') || [];

    // Render Room Stats Grid
    const statsGrid = document.getElementById('roomStatsGrid');
    if (statsGrid) {
      const totalRooms = rooms.length;
      const availableRooms = rooms.filter(r => r.status === 'available').length;
      const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
      
      let totalAssignedStudents = 0;
      rooms.forEach(r => {
        const det = getRoomDetails(r);
        totalAssignedStudents += det.roomStudents.length;
      });

      statsGrid.innerHTML = `
        <div class="stat-card" style="padding: 16px;">
          <div class="stat-card__label" style="font-size:0.8rem; color:#94A3B8;">إجمالي القاعات والمخابر</div>
          <div class="stat-card__value" style="font-size:1.6rem; color:#F8FAFC; margin-top:4px;">${totalRooms}</div>
          <div style="font-size:0.75rem; color:#38BDF8; margin-top:4px;">مجهزة بأحدث التقنيات</div>
        </div>
        <div class="stat-card" style="padding: 16px;">
          <div class="stat-card__label" style="font-size:0.8rem; color:#94A3B8;">القاعات الجاهزة والمتاحة</div>
          <div class="stat-card__value" style="font-size:1.6rem; color:#10B981; margin-top:4px;">${availableRooms}</div>
          <div style="font-size:0.75rem; color:#10B981; margin-top:4px;">جاهزة لاستقبال الحصص</div>
        </div>
        <div class="stat-card" style="padding: 16px;">
          <div class="stat-card__label" style="font-size:0.8rem; color:#94A3B8;">القاعات المشغولة حالياً</div>
          <div class="stat-card__value" style="font-size:1.6rem; color:#F59E0B; margin-top:4px;">${occupiedRooms}</div>
          <div style="font-size:0.75rem; color:#F59E0B; margin-top:4px;">حصص تدريبية جارية</div>
        </div>
      `;
    }

    if (rooms.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 40px; background: rgba(15,23,42,0.4); border-radius:12px; border:1px dashed var(--color-border);">
          <div style="font-size:1rem; font-weight:700; color:#F8FAFC; margin-bottom:6px;">لا توجد قاعات مسجلة حالياً</div>
          <p style="font-size:0.82rem; color:#94A3B8; margin-bottom:16px;">انقر على زر "إضافة قاعة" لإنشاء قاعة وتحديد الأستاذ المشرف عليها والأفواج.</p>
          <button class="btn btn--primary btn--small" onclick="openAddRoomModal()">+ إضافة قاعة جديدة</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = rooms.map(r => {
      const details = getRoomDetails(r);
      const isOcc = r.status === 'occupied';
      const isMaint = r.status === 'maintenance';
      const statusClass = isOcc ? 'status-pill--pending' : (isMaint ? 'status-pill--rejected' : 'status-pill--active');
      const statusLabel = isOcc ? 'مشغولة بحصة' : (isMaint ? 'قيد الصيانة' : 'متاحة وجاهزة');

      const groupNames = details.roomGroups.map(g => g.name).join('، ') || r.currentGroup || 'لم يحدد فوج بعد';
      const studentsCount = details.roomStudents.length;

      return `
        <div class="stat-card" style="padding: 18px; display:flex; flex-direction:column; justify-content:space-between; border: 1px solid rgba(56, 189, 248, 0.2); background: linear-gradient(145deg, rgba(11, 19, 43, 0.85) 0%, rgba(7, 13, 25, 0.95) 100%); border-radius: 12px;">
          <div>
            <!-- Top Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <h3 style="font-size: 1.1rem; font-weight:800; color:#fff; margin-bottom:3px;">${r.name}</h3>
                <span style="font-size: 0.76rem; color:#94A3B8;">${r.type || 'قاعة تدريب'}</span>
              </div>
              <span class="status-pill ${statusClass}"><span class="pill-dot"></span> ${statusLabel}</span>
            </div>

            <!-- Assigned Educator Block -->
            <div style="background:rgba(15, 23, 42, 0.7); border:1px solid rgba(56, 189, 248, 0.2); border-radius:8px; padding:10px 12px; margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                <span style="font-size:0.7rem; color:#38BDF8; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">الأستاذ المدرس للقاعة</span>
                ${details.educatorSpecialty ? `<span style="font-size:0.7rem; color:#94A3B8;">${details.educatorSpecialty}</span>` : ''}
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="width:30px; height:30px; border-radius:6px; background:rgba(56,189,248,0.15); color:#38BDF8; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.85rem;">
                    ${details.educatorName ? details.educatorName.charAt(0) : '—'}
                  </div>
                  <div>
                    <div style="font-weight:700; color:#F8FAFC; font-size:0.88rem;">${details.educatorName || 'لم يعين أستاذ بعد'}</div>
                    ${details.educatorPhone ? `<div style="font-size:0.72rem; color:#64748B;" dir="ltr">${details.educatorPhone}</div>` : ''}
                  </div>
                </div>
              </div>
            </div>

            <!-- Students & Group Capacity Block -->
            <div style="background:rgba(15, 23, 42, 0.4); border:1px solid rgba(255, 255, 255, 0.05); border-radius:8px; padding:10px 12px; margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-size:0.78rem; color:#CBD5E1;">الأفواج المقررة:</span>
                <span style="font-size:0.78rem; font-weight:700; color:#38BDF8; max-width:60%; text-align:left; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${groupNames}">
                  ${groupNames}
                </span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-size:0.78rem; color:#CBD5E1;">الطلاب الموجودين بالقاعة:</span>
                <span style="font-size:0.82rem; font-weight:800; color:${studentsCount > 0 ? '#10B981' : '#94A3B8'};">
                  ${studentsCount} طالب / ${r.capacity} مقعد
                </span>
              </div>
              <!-- Mini Occupancy Bar -->
              <div style="width:100%; height:5px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden;">
                <div style="width:${details.occupancyPercent}%; height:100%; background:${details.occupancyPercent >= 100 ? '#EF4444' : '#10B981'}; border-radius:999px; transition:width 0.3s ease;"></div>
              </div>
              <div style="font-size:0.72rem; color:#64748B; margin-top:7px; line-height:1.4;">
                التجهيزات: ${r.equipment || 'لا توجد تجهيزات مسجلة'}
              </div>
            </div>
          </div>

          <!-- Actions Bar -->
          <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid rgba(255,255,255,0.07); padding-top: 10px; gap:6px;">
            <button class="btn btn--primary btn--small" style="flex:1; justify-content:center; font-size:0.78rem; background:linear-gradient(135deg, #0284C7, #0369A1);" onclick="openRoomDetailsModal('${r.id}')">
              استعراض الطلاب (${studentsCount})
            </button>
            <button class="btn btn--outline btn--small" style="font-size:0.76rem;" onclick="openEditRoomModal('${r.id}')" title="تعديل بيانات القاعة">
              تعديل
            </button>
            <button class="btn btn--outline btn--small" style="font-size:0.76rem;" onclick="toggleRoomStatus('${r.id}')" title="تبديل حالة القاعة">
              الحالة
            </button>
            <button class="btn-icon" style="color:var(--color-danger); border:none; width:28px; height:28px;" onclick="deleteRoom('${r.id}')" title="حذف القاعة">
              حذف
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- ROOM DETAILS & STUDENTS ROSTER MODAL ---
  window.openRoomDetailsModal = function(roomId) {
    const rooms = getData('brainova_rooms') || [];
    const r = rooms.find(rm => rm.id === roomId);
    if (!r) return;

    currentActiveRoomId = roomId;
    const details = getRoomDetails(r);
    currentActiveRoomStudents = details.roomStudents;

    // Set Title
    document.getElementById('roomDetailsTitle').textContent = `تفاصيل ${r.name}`;
    document.getElementById('roomDetailsSubtitle').textContent = `${r.type || 'قاعة تدريب'} • السعة: ${r.capacity} مقعد • إجمالي الطلاب: ${details.roomStudents.length}`;

    // Render Header Card
    const headerCard = document.getElementById('roomDetailsHeaderCard');
    if (headerCard) {
      const scheduleHtml = details.roomSessions.length > 0
        ? details.roomSessions.map(s => `
            <span style="display:inline-flex; align-items:center; gap:4px; font-size:0.75rem; background:rgba(56,189,248,0.12); color:#38BDF8; padding:3px 8px; border-radius:6px; font-weight:600;">
              📅 ${s.day || ''} (${s.startTime} - ${s.endTime}) • ${s.groupName || ''}
            </span>
          `).join(' ')
        : '<span style="font-size:0.75rem; color:#64748B;">لا توجد حصص مجدولة حالياً لهذه القاعة</span>';

      headerCard.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <!-- Educator Card -->
          <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(56,189,248,0.22); border-radius:10px; padding:14px;">
            <div style="font-size:0.72rem; color:#38BDF8; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
              الأستاذ المدرس للقاعة
            </div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
              <div style="width:38px; height:38px; border-radius:8px; background:rgba(56,189,248,0.18); border:1px solid rgba(56,189,248,0.3); color:#38BDF8; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1rem;">
                ${details.educatorName ? details.educatorName.charAt(0) : '—'}
              </div>
              <div>
                <div style="font-size:1rem; font-weight:800; color:#F8FAFC;">${details.educatorName || 'لم يتم تعيين أستاذ بعد'}</div>
                <div style="font-size:0.78rem; color:#94A3B8;">${details.educatorSpecialty || 'مؤطر روبوتيك وذكاء اصطناعي'}</div>
              </div>
            </div>
            ${details.educatorPhone ? `<div style="font-size:0.78rem; color:#64748B;">📞 الهاتف: <span dir="ltr" style="color:#CBD5E1;">${details.educatorPhone}</span></div>` : ''}
          </div>

          <!-- Room Specs Card -->
          <div style="background:rgba(15,23,42,0.75); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:0.72rem; color:#94A3B8; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">بيانات الاستيعاب والتجهيزات</span>
              <span class="status-pill ${r.status === 'available' ? 'status-pill--active' : (r.status === 'occupied' ? 'status-pill--pending' : 'status-pill--rejected')}" style="font-size:0.7rem; padding:2px 8px;">
                ${r.status === 'available' ? 'متاحة' : (r.status === 'occupied' ? 'مشغولة' : 'صيانة')}
              </span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.8rem;">
              <span style="color:#94A3B8;">طاقة الاستيعاب:</span>
              <span style="font-weight:700; color:#fff;">${details.roomStudents.length} / ${r.capacity} مقعد (${details.occupancyPercent}%)</span>
            </div>
            <div style="font-size:0.78rem; color:#94A3B8; line-height:1.4;">
              <span>التجهيزات:</span>
              <span style="color:#E2E8F0;">${r.equipment || 'حواسيب وأجهزة روبوت'}</span>
            </div>
          </div>
        </div>

        <!-- Schedule Slots Row -->
        <div style="margin-top:10px; background:rgba(15,23,42,0.5); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <span style="font-size:0.78rem; font-weight:700; color:#CBD5E1;">الحصص المجدولة في القاعة:</span>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${scheduleHtml}
          </div>
        </div>
      `;
    }

    // Reset Search
    const searchInput = document.getElementById('roomStudentsSearchInput');
    if (searchInput) searchInput.value = '';

    renderRoomStudentsTable(details.roomStudents);
    document.getElementById('roomDetailsModal').classList.add('active');
  };

  window.closeRoomDetailsModal = function() {
    const modal = document.getElementById('roomDetailsModal');
    if (modal) modal.classList.remove('active');
  };

  function renderRoomStudentsTable(studentsList) {
    const tbody = document.getElementById('roomStudentsTableBody');
    const heading = document.getElementById('roomStudentsHeading');
    if (heading) {
      heading.textContent = `قائمة الطلاب في القاعة (${studentsList.length} طالب)`;
    }

    if (!tbody) return;

    if (studentsList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:32px 14px; color:#94A3B8;">
            <div style="font-size:0.95rem; font-weight:700; color:#F8FAFC; margin-bottom:6px;">لا يوجد طلاب مقيدون في هذه القاعة حالياً</div>
            <div style="font-size:0.78rem; color:#64748B;">يمكنك إسناد فوج لهذه القاعة من قسم الأفواج أو تعيين القاعة عند إنشاء فوج جديد.</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = studentsList.map((stu, index) => {
      const avatarInitial = (stu.name || 'ط').trim().charAt(0);
      const remainingColor = stu.sessionsRemaining > 1 ? '#10B981' : (stu.sessionsRemaining === 1 ? '#F59E0B' : '#EF4444');

      return `
        <tr>
          <td style="text-align:center; font-family:monospace; color:#64748B; font-weight:700;">${index + 1}</td>
          <td>
            <div style="display:flex; align-items:center; gap:8px;">
              <div style="width:30px; height:30px; border-radius:6px; background:rgba(56,189,248,0.12); color:#38BDF8; font-weight:700; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">
                ${avatarInitial}
              </div>
              <div>
                <div style="font-weight:700; color:#F8FAFC;">${stu.name}</div>
                <div style="font-family:monospace; font-size:0.72rem; color:#64748B;">${stu.id}</div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-weight:700; color:#38BDF8;">${stu.group || '—'}</div>
            <div style="font-size:0.75rem; color:#94A3B8;">${stu.level || ''}</div>
          </td>
          <td>
            <div>${stu.parentName || '—'}</div>
            ${stu.parentPhone ? `<a href="tel:${stu.parentPhone}" dir="ltr" style="color:#0284C7; font-size:0.8rem;">${stu.parentPhone}</a>` : '—'}
          </td>
          <td>
            <span style="font-weight:800; color:${remainingColor}; background:rgba(255,255,255,0.04); padding:3px 8px; border-radius:6px; font-size:0.78rem; display:inline-block;">
              ${stu.sessionsRemaining !== undefined ? `${stu.sessionsRemaining} حصص` : '—'}
            </span>
          </td>
          <td style="text-align:center;">
            <div style="display:inline-flex; gap:4px;">
              <button class="btn btn--outline btn--small" style="padding:3px 7px; font-size:0.75rem;" title="الملف الشامل" onclick="closeRoomDetailsModal(); openStudentProfile('${stu.id}')">الملف</button>
              <button class="btn btn--outline btn--small" style="padding:3px 7px; font-size:0.75rem; border-color:rgba(56,189,248,0.35); color:#38BDF8;" title="بطاقة التلميذ" onclick="closeRoomDetailsModal(); openStudentIdCard('${stu.id}')">بطاقة</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.filterRoomStudentsList = function() {
    const q = (document.getElementById('roomStudentsSearchInput')?.value || '').trim().toLowerCase();
    if (!q) {
      renderRoomStudentsTable(currentActiveRoomStudents);
      return;
    }

    const filtered = currentActiveRoomStudents.filter(stu => {
      const n = (stu.name || '').toLowerCase();
      const id = (stu.id || '').toLowerCase();
      const p = (stu.parentPhone || '').toLowerCase();
      const g = (stu.group || '').toLowerCase();
      return n.includes(q) || id.includes(q) || p.includes(q) || g.includes(q);
    });

    renderRoomStudentsTable(filtered);
  };

  // --- EDIT ROOM MODAL ---
  window.openEditRoomModal = function(roomId) {
    const rooms = getData('brainova_rooms') || [];
    const r = rooms.find(rm => rm.id === roomId);
    if (!r) return;

    document.getElementById('editRoomId').value = r.id;
    document.getElementById('editRoomName').value = r.name || '';
    document.getElementById('editRoomType').value = r.type || 'قاعة تدريب تفاعلية';
    document.getElementById('editRoomCapacity').value = r.capacity || 14;
    document.getElementById('editRoomEquipment').value = r.equipment || '';
    document.getElementById('editRoomStatus').value = r.status || 'available';

    // Populate Educators Dropdown
    const educators = getData('brainova_educators') || [];
    const eduSelect = document.getElementById('editRoomEducator');
    if (eduSelect) {
      eduSelect.innerHTML = `<option value="">-- اختياري (تحديد أستاذ) --</option>` +
        educators.map(e => `<option value="${e.name}" ${r.educatorName === e.name ? 'selected' : ''}>${e.name} (${e.specialty || ''})</option>`).join('');
    }

    // Populate Groups Dropdown
    const groups = getData('brainova_groups') || [];
    const grpSelect = document.getElementById('editRoomGroup');
    if (grpSelect) {
      grpSelect.innerHTML = `<option value="">-- اختياري (تحديد فوج) --</option>` +
        groups.map(g => `<option value="${g.name}" ${r.currentGroup === g.name ? 'selected' : ''}>${g.name}</option>`).join('');
    }

    document.getElementById('editRoomModal').classList.add('active');
  };

  window.closeEditRoomModal = function() {
    const modal = document.getElementById('editRoomModal');
    if (modal) modal.classList.remove('active');
  };

  window.editCurrentRoomFromModal = function() {
    if (!currentActiveRoomId) return;
    closeRoomDetailsModal();
    openEditRoomModal(currentActiveRoomId);
  };

  window.submitEditRoom = function(e) {
    e.preventDefault();
    const id = document.getElementById('editRoomId').value;
    const rooms = getData('brainova_rooms') || [];
    const r = rooms.find(rm => rm.id === id);
    if (!r) return;

    r.name = document.getElementById('editRoomName').value.trim();
    r.type = document.getElementById('editRoomType').value;
    r.capacity = Number(document.getElementById('editRoomCapacity').value) || 14;
    r.equipment = document.getElementById('editRoomEquipment').value.trim();
    r.status = document.getElementById('editRoomStatus').value;
    r.educatorName = document.getElementById('editRoomEducator').value;
    r.currentGroup = document.getElementById('editRoomGroup').value;

    saveData('brainova_rooms', rooms);
    closeEditRoomModal();
    showToast('تم تحديث بيانات القاعة بنجاح!', 'success');
    renderActiveView();
  };

  // --- PRINT ROOM STUDENTS ROSTER (A4) ---
  window.printCurrentRoomStudentRoster = function() {
    if (!currentActiveRoomId) return;
    const rooms = getData('brainova_rooms') || [];
    const r = rooms.find(rm => rm.id === currentActiveRoomId);
    if (!r) return;

    const details = getRoomDetails(r);
    const dateStr = new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });

    const rowsHtml = details.roomStudents.length > 0
      ? details.roomStudents.map((stu, i) => `
          <tr>
            <td style="text-align:center; font-weight:bold;">${i + 1}</td>
            <td style="font-weight:bold;">${stu.name}</td>
            <td style="text-align:center; font-family:monospace;">${stu.id}</td>
            <td style="text-align:center;">${stu.group || '—'}</td>
            <td style="text-align:center;" dir="ltr">${stu.parentPhone || '—'}</td>
            <td style="text-align:center; font-weight:bold;">${stu.sessionsRemaining !== undefined ? stu.sessionsRemaining : '—'}</td>
            <td style="min-width:120px;"></td>
          </tr>
        `).join('')
      : `<tr><td colspan="7" style="text-align:center; padding:20px;">لا يوجد طلاب مقيدون في هذه القاعة</td></tr>`;

    // Extra empty blank rows for annotations
    let extraRows = '';
    for (let j = details.roomStudents.length + 1; j <= Math.max(details.roomStudents.length + 3, 10); j++) {
      extraRows += `
        <tr style="color:#94a3b8;">
          <td style="text-align:center;">${j}</td>
          <td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
      `;
    }

    const printHtml = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>كشف طلاب وتفقد القاعة - ${r.name}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm 15mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          body { background: #fff; color: #0F172A; padding: 15px; font-size: 11pt; line-height: 1.4; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284C7; padding-bottom: 12px; margin-bottom: 15px; }
          .academy-title { font-size: 18pt; font-weight: 800; color: #0369A1; }
          .academy-sub { font-size: 9pt; color: #475569; margin-top: 2px; }
          .sheet-title { text-align: center; font-size: 15pt; font-weight: 800; margin: 10px 0; color: #0F172A; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 6px; padding: 10px 14px; margin-bottom: 15px; font-size: 9.5pt; }
          .meta-item { display: flex; gap: 6px; }
          .meta-label { font-weight: bold; color: #334155; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 9.5pt; }
          th, td { border: 1px solid #94A3B8; padding: 6px 8px; }
          th { background: #E2E8F0; color: #0F172A; font-weight: 700; text-align: center; }
          .signatures { display: flex; justify-content: space-between; margin-top: 30px; page-break-inside: avoid; }
          .sig-box { width: 45%; border: 1px dashed #94A3B8; border-radius: 6px; padding: 12px; text-align: center; height: 90px; }
          .sig-title { font-weight: bold; font-size: 10pt; color: #334155; margin-bottom: 40px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="academy-title">Brainova Robotics Academy</div>
            <div class="academy-sub">أكاديمية الروبوتيك والذكاء الاصطناعي للأطفال والناشئين • أم البواقي</div>
          </div>
          <div style="text-align:left; font-size:9pt; color:#475569;">
            <div>تاريخ الاستخراج: ${dateStr}</div>
            <div>السنة الدراسية: 2026 / 2027</div>
          </div>
        </div>

        <div class="sheet-title">كشف تفقد وحضور القاعة: ${r.name}</div>

        <div class="meta-grid">
          <div class="meta-item"><span class="meta-label">الأستاذ المشرف:</span> <span>${details.educatorName || 'غير محدد'}</span></div>
          <div class="meta-item"><span class="meta-label">تخصص المؤطر:</span> <span>${details.educatorSpecialty || 'روبوتيك وذكاء اصطناعي'}</span></div>
          <div class="meta-item"><span class="meta-label">طاقة الاستيعاب:</span> <span>${details.roomStudents.length} مسجل / ${r.capacity} مقعد</span></div>
          <div class="meta-item"><span class="meta-label">نوع وتجهيزات القاعة:</span> <span>${r.type} (${r.equipment || 'حواسيب وأجهزة'})</span></div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width:30px;">#</th>
              <th>اسم ولقب الطالب</th>
              <th style="width:75px;">المعرف</th>
              <th style="width:110px;">الفوج</th>
              <th style="width:90px;">هاتف الولي</th>
              <th style="width:70px;">الحصص</th>
              <th style="width:140px;">ملاحظات وتوقيع المؤطر</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
            ${extraRows}
          </tbody>
        </table>

        <div class="signatures">
          <div class="sig-box">
            <div class="sig-title">توقيع وملاحظات الأستاذ المشرف على القاعة</div>
          </div>
          <div class="sig-box">
            <div class="sig-title">ختم وتأشيرة إدارة الأكاديمية</div>
          </div>
        </div>
      </body>
      </html>
    `;

    if (window.electronAPI && window.electronAPI.printDocument) {
      window.electronAPI.printDocument({
        html: printHtml,
        title: `كشف طلاب القاعة - ${r.name}`
      });
      showToast('جارٍ إرسال كشف القاعة للطباعة...', 'info');
    } else {
      const win = window.open('', '_blank');
      win.document.write(printHtml);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 500);
    }
  };

  // --- ROOM MODALS CRUD ---
  window.openAddRoomModal = function() {
    const form = document.getElementById('addRoomForm');
    if (form) form.reset();

    // Populate Educators
    const educators = getData('brainova_educators') || [];
    const eduSelect = document.getElementById('newRoomEducator');
    if (eduSelect) {
      eduSelect.innerHTML = `<option value="">-- اختياري (تحديد أستاذ) --</option>` +
        educators.map(e => `<option value="${e.name}">${e.name} (${e.specialty || ''})</option>`).join('');
    }

    // Populate Groups
    const groups = getData('brainova_groups') || [];
    const grpSelect = document.getElementById('newRoomGroup');
    if (grpSelect) {
      grpSelect.innerHTML = `<option value="">-- اختياري (تحديد فوج) --</option>` +
        groups.map(g => `<option value="${g.name}">${g.name}</option>`).join('');
    }

    document.getElementById('addRoomModal').classList.add('active');
  };

  window.closeAddRoomModal = function() {
    const modal = document.getElementById('addRoomModal');
    if (modal) modal.classList.remove('active');
  };

  window.submitAddRoom = function(e) {
    e.preventDefault();
    const name = document.getElementById('newRoomName').value.trim();
    const type = document.getElementById('newRoomType').value;
    const capacity = Number(document.getElementById('newRoomCapacity').value) || 12;
    const equipment = document.getElementById('newRoomEquipment').value.trim();
    const status = document.getElementById('newRoomStatus').value;
    const educatorName = document.getElementById('newRoomEducator')?.value || '';
    const currentGroup = document.getElementById('newRoomGroup')?.value || '';

    const rooms = getData('brainova_rooms') || [];
    rooms.push({
      id: 'ROOM-' + Date.now(),
      name,
      type,
      capacity,
      equipment,
      status,
      educatorName,
      currentGroup
    });

    saveData('brainova_rooms', rooms);
    closeAddRoomModal();
    showToast('تمت إضافة القاعة بنجاح!', 'success');
    renderActiveView();
  };

  window.toggleRoomStatus = function(id) {
    const rooms = getData('brainova_rooms') || [];
    const room = rooms.find(r => r.id === id);
    if (!room) return;

    room.status = room.status === 'available' ? 'occupied' : 'available';
    saveData('brainova_rooms', rooms);
    showToast(`تم تغيير حالة ${room.name} إلى ${room.status === 'available' ? 'متاحة' : 'مشغولة'}`, 'success');
    renderActiveView();
  };

  window.deleteRoom = function(id) {
    if (confirm('هل أنت متأكد من حذف هذه القاعة؟')) {
      const rooms = getData('brainova_rooms') || [];
      const updated = rooms.filter(r => r.id !== id);
      saveData('brainova_rooms', updated);
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
  function onStudentDayChange() {
    const daySelect = document.getElementById('newStudentDay');
    const startDateInput = document.getElementById('newStudentStartDate');
    if (!daySelect || !startDateInput) return;
    const selectedDay = daySelect.value;
    const nextDate = getNextDateForDayName(selectedDay, new Date());
    if (nextDate) {
      startDateInput.value = nextDate;
    }
  }
  window.onStudentDayChange = onStudentDayChange;

  function onStudentGroupSelectChange() {
    const groupSelect = document.getElementById('newStudentGroup');
    const daySelect = document.getElementById('newStudentDay');
    const startInput = document.getElementById('newStudentStartTime');
    const endInput = document.getElementById('newStudentEndTime');
    if (!groupSelect) return;

    const selectedGroup = groupSelect.value;
    const schedule = getData('brainova_schedule') || [];
    const matched = schedule.find(s => isStudentInGroup({ group: s.groupName }, selectedGroup));
    const groups = getData('brainova_groups') || [];
    const matchedGroup = groups.find(g => isStudentInGroup({ group: g.name }, selectedGroup));

    if (daySelect) {
      const day = matched?.day || matchedGroup?.day || 'السبت';
      daySelect.value = day;
      onStudentDayChange();
    }

    if (matched && matched.startTime && matched.endTime) {
      if (startInput) startInput.value = matched.startTime;
      if (endInput) endInput.value = matched.endTime;
    } else if (matchedGroup?.timeSlot && matchedGroup.timeSlot.includes('-')) {
      const [st, et] = matchedGroup.timeSlot.split('-').map(t => t.trim());
      if (startInput && st) startInput.value = st;
      if (endInput && et) endInput.value = et;
    }
  }
  window.onStudentGroupSelectChange = onStudentGroupSelectChange;

  window.openAddStudentModal = function() {
    const groupSelect = document.getElementById('newStudentGroup');
    if (groupSelect) {
      const groups = getData('brainova_groups') || [];
      groupSelect.innerHTML = groups.map(g => `<option value="${g.name}">${g.name}</option>`).join('');
      onStudentGroupSelectChange();
    }
    const startDateInput = document.getElementById('newStudentStartDate');
    if (startDateInput) {
      startDateInput.value = new Date().toISOString().slice(0, 10);
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
    const students = getData('brainova_students') || [];
    const name = document.getElementById('newStudentName').value.trim();
    const parentName = document.getElementById('newStudentParentName') ? document.getElementById('newStudentParentName').value.trim() : '—';
    const parentPhone = document.getElementById('newStudentParentPhone') ? document.getElementById('newStudentParentPhone').value.trim() : '—';
    const group = document.getElementById('newStudentGroup').value;
    const level = document.getElementById('newStudentLevel').value;
    const day = document.getElementById('newStudentDay')?.value || 'السبت';
    const startTime = document.getElementById('newStudentStartTime')?.value || '14:00';
    const endTime = document.getElementById('newStudentEndTime')?.value || '16:00';
    const sessionTime = `${startTime} - ${endTime}`;

    const planValue = document.getElementById('newStudentPlan') ? document.getElementById('newStudentPlan').value : '5000';
    const fee = Number(planValue) || 5000;

    const startDateInput = document.getElementById('newStudentStartDate')?.value;
    const startDate = startDateInput || new Date().toISOString().slice(0, 10);
    const registerFirstSession = document.getElementById('newStudentRegisterFirstSession')?.checked || false;
    const payInitial = document.getElementById('newStudentPayInitial')?.checked || false;

    // Safe Non-Duplicate ID Generation
    const maxIdNum = students.reduce((max, s) => {
      const num = parseInt(String(s.id).replace(/\D/g, ''), 10);
      return !isNaN(num) ? Math.max(max, num) : max;
    }, 0);
    const newStudentId = "STU-" + String(maxIdNum + 1).padStart(3, '0');

    let initialSessions = payInitial ? 4 : 0;
    let initialBalance = payInitial ? fee : 0;

    const newStudent = {
      id: newStudentId,
      name: name,
      group: group,
      level: level,
      day: day,
      startTime: startTime,
      endTime: endTime,
      sessionTime: sessionTime,
      parentName: parentName || "—",
      parentPhone: parentPhone || "—",
      username: generateRandomCode(8),
      password: generateRandomCode(8),
      monthlyFee: fee,
      plan: planValue === '8000' ? 'طفلين (خصم إخوة)' : (planValue === '11000' ? '3 أطفال (عائلي)' : 'طفل واحد'),
      balance: initialBalance,
      sessionsRemaining: initialSessions,
      lastAttendance: "جديد",
      joinedDate: startDate,
      startDate: startDate
    };

    // 1. If initial payment was made at registration, record it with 100% precision
    if (payInitial) {
      const now = new Date();
      const opNumber = String(Math.floor(10000 + Math.random() * 90000));
      const formattedPaymentDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth()+1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const isoPaymentDate = now.toISOString();
      const timestamp = now.getTime();

      newStudent.lastPaymentDate = formattedPaymentDate;
      newStudent.lastPaymentIso = isoPaymentDate;
      newStudent.lastPaymentTimestamp = timestamp;
      newStudent.lastPaymentAmount = fee;

      const newPayment = {
        id: 'REC-' + opNumber,
        opNumber,
        studentId: newStudentId,
        studentName: name,
        level,
        group,
        educatorName: 'عابد اسحاق تقي الدين',
        date: formattedPaymentDate,
        paidAtIso: isoPaymentDate,
        paidAtTimestamp: timestamp,
        amountPaid: fee,
        prevBalance: 0,
        currentBalance: fee,
        sessionsPurchased: 4,
        sessionsRemaining: 4,
        lastAttendance: 'جديد',
        method: 'نقداً (Cash)',
        status: 'paid',
        notes: 'تسديد الاشتراك الأول عند التسجيل'
      };
      const payments = getData('brainova_payments') || [];
      payments.unshift(newPayment);
      saveData('brainova_payments', payments);
    }

    // 2. If first session attendance is recorded
    if (registerFirstSession) {
      let allAttendance = getData('brainova_attendance') || [];
      allAttendance.unshift({
        id: 'ATT-' + Date.now() + '-' + newStudentId,
        date: startDate,
        groupName: group,
        sessionTime: sessionTime,
        studentId: newStudentId,
        studentName: name,
        status: 'present',
        paidMarker: payInitial ? 'paid_this' : null,
        note: 'الحصة الافتتاحية الأولى'
      });
      saveData('brainova_attendance', allAttendance);
      newStudent.lastAttendance = `${startDate} (${sessionTime})`;
      if (newStudent.sessionsRemaining > 0) {
        newStudent.sessionsRemaining = Math.max(0, newStudent.sessionsRemaining - 1);
      }
    }

    students.push(newStudent);
    saveData('brainova_students', students);
    closeAddStudentModal();
    showToast(`✅ تم تسجيل التلميذ (${name}) بفوج (${group}) بدقة! 🚀`, 'success');
    renderActiveView();
  };

  // --- EDIT STUDENT & GROUP LOGIC ---
  window.openEditStudentModal = function(studentId) {
    const students = getData('brainova_students') || [];
    const stu = students.find(s => s.id === studentId);
    if (!stu) {
      showToast('لم يتم العثور على التلميذ!', 'error');
      return;
    }

    const groups = getData('brainova_groups') || [];
    const groupSelect = document.getElementById('editStudentGroup');
    if (groupSelect) {
      groupSelect.innerHTML = groups.map(g => `<option value="${g.name}" ${isStudentInGroup(stu, g.name) ? 'selected' : ''}>${g.name}</option>`).join('');
      // If current student's group is not in list, add it as selected
      if (stu.group && !groups.some(g => isStudentInGroup(stu, g.name))) {
        groupSelect.add(new Option(stu.group, stu.group, true, true));
      }
    }

    document.getElementById('editStudentId').value = stu.id;
    document.getElementById('editStudentName').value = stu.name || '';
    document.getElementById('editStudentParentName').value = stu.parentName !== '—' ? (stu.parentName || '') : '';
    document.getElementById('editStudentParentPhone').value = stu.parentPhone !== '—' ? (stu.parentPhone || '') : '';
    document.getElementById('editStudentLevel').value = stu.level || 'المستوى الأول';

    const daySelect = document.getElementById('editStudentDay');
    if (daySelect) {
      daySelect.value = stu.day || 'السبت';
    }

    document.getElementById('editStudentStartTime').value = stu.startTime || '14:00';
    document.getElementById('editStudentEndTime').value = stu.endTime || '16:00';
    document.getElementById('editStudentSessionsRemaining').value = stu.sessionsRemaining !== undefined ? stu.sessionsRemaining : 4;
    document.getElementById('editStudentMonthlyFee').value = stu.monthlyFee || 5000;

    const modal = document.getElementById('editStudentModal');
    if (modal) modal.classList.add('active');
  };

  window.closeEditStudentModal = function() {
    const modal = document.getElementById('editStudentModal');
    if (modal) modal.classList.remove('active');
  };

  window.onEditStudentGroupSelectChange = function() {
    const groupSelect = document.getElementById('editStudentGroup');
    const daySelect = document.getElementById('editStudentDay');
    const startInput = document.getElementById('editStudentStartTime');
    const endInput = document.getElementById('editStudentEndTime');
    if (!groupSelect) return;

    const selectedGroup = groupSelect.value;
    const schedule = getData('brainova_schedule') || [];
    const matched = schedule.find(s => isStudentInGroup({ group: s.groupName }, selectedGroup));
    const groups = getData('brainova_groups') || [];
    const matchedGroup = groups.find(g => isStudentInGroup({ group: g.name }, selectedGroup));

    if (daySelect) {
      daySelect.value = matched?.day || matchedGroup?.day || 'السبت';
    }

    if (matched && matched.startTime && matched.endTime) {
      if (startInput) startInput.value = matched.startTime;
      if (endInput) endInput.value = matched.endTime;
    } else if (matchedGroup?.timeSlot && matchedGroup.timeSlot.includes('-')) {
      const [st, et] = matchedGroup.timeSlot.split('-').map(t => t.trim());
      if (startInput && st) startInput.value = st;
      if (endInput && et) endInput.value = et;
    }
  };

  window.submitEditStudent = function(e) {
    e.preventDefault();
    const studentId = document.getElementById('editStudentId').value;
    const students = getData('brainova_students') || [];
    const stu = students.find(s => s.id === studentId);
    if (!stu) return;

    const prevGroup = stu.group;
    stu.name = document.getElementById('editStudentName').value.trim();
    stu.parentName = document.getElementById('editStudentParentName').value.trim() || '—';
    stu.parentPhone = document.getElementById('editStudentParentPhone').value.trim() || '—';
    stu.group = document.getElementById('editStudentGroup').value;
    stu.level = document.getElementById('editStudentLevel').value;
    stu.day = document.getElementById('editStudentDay')?.value || 'السبت';
    stu.startTime = document.getElementById('editStudentStartTime').value || '14:00';
    stu.endTime = document.getElementById('editStudentEndTime').value || '16:00';
    stu.sessionTime = `${stu.startTime} - ${stu.endTime}`;
    stu.sessionsRemaining = Math.max(0, parseInt(document.getElementById('editStudentSessionsRemaining').value, 10) || 0);
    stu.monthlyFee = Math.max(0, parseInt(document.getElementById('editStudentMonthlyFee').value, 10) || 5000);

    saveData('brainova_students', students);
    closeEditStudentModal();
    const groupChangedMsg = prevGroup !== stu.group ? ` وتم نقله إلى (${stu.group})` : '';
    showToast(`✅ تم تحديث بيانات التلميذ (${stu.name})${groupChangedMsg} بنجاح!`, 'success');
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
    const day = document.getElementById('newGroupDay')?.value || 'السبت';
    const timeSlot = document.getElementById('newGroupTimeSlot')?.value.trim() || '14:00 - 16:00';
    const level = document.getElementById('newGroupLevel').value;
    const ageCategory = document.getElementById('newGroupAgeCategory').value;
    const room = document.getElementById('newGroupRoom').value;
    const educatorId = document.getElementById('newGroupEducator').value;
    const maxStudents = parseInt(document.getElementById('newGroupMaxStudents').value) || 12;

    const educators = getData('brainova_educators') || [];
    const educator = educators.find(e => e.id === educatorId);

    const newGroup = {
      id: 'GRP-' + Date.now(),
      name,
      day,
      timeSlot,
      level,
      ageCategory,
      room,
      educatorId: educatorId || null,
      educatorName: educator ? educator.name : '',
      maxStudents,
      createdAt: new Date().toLocaleDateString('ar-DZ')
    };

    const groups = getData('brainova_groups') || [];
    groups.push(newGroup);
    saveData('brainova_groups', groups);

    // Also record in schedule
    const schedules = getData('brainova_schedule') || [];
    const [st, et] = timeSlot.includes('-') ? timeSlot.split('-').map(t => t.trim()) : [timeSlot, ''];
    schedules.push({
      id: 'SCH-' + Date.now(),
      groupId: newGroup.id,
      groupName: name,
      day: day,
      startTime: st || '14:00',
      endTime: et || '16:00',
      room: room,
      educatorId: educatorId,
      educator: educator ? educator.name : ''
    });
    saveData('brainova_schedule', schedules);

    closeAddGroupModal();
    showToast(`✅ تم إنشاء الفوج (${name}) بموعد (${day} ${timeSlot}) بنجاح!`, 'success');
    renderActiveView();
  };

  window.openEditGroupModal = function(id) {
    const groups = getData('brainova_groups') || [];
    const g = groups.find(x => x.id === id || x.name === id);
    if (!g) return;

    document.getElementById('editGroupId').value = g.id;
    document.getElementById('editGroupName').value = g.name;

    const schedules = getData('brainova_schedule') || [];
    const sch = schedules.find(s => s.groupId === g.id || isStudentInGroup({ group: s.groupName }, g.name));

    const daySelect = document.getElementById('editGroupDay');
    if (daySelect) {
      daySelect.value = sch ? sch.day : (g.day || 'السبت');
    }

    const timeInput = document.getElementById('editGroupTimeSlot');
    if (timeInput) {
      timeInput.value = sch ? `${sch.startTime} - ${sch.endTime}` : (g.timeSlot || '14:00 - 16:00');
    }

    const levelSelect = document.getElementById('editGroupLevel');
    if (levelSelect) levelSelect.value = g.level || 'المستوى الأول';

    const ageSelect = document.getElementById('editGroupAgeCategory');
    if (ageSelect) ageSelect.value = g.ageCategory || '8 - 11 سنة (ناشئين)';

    const roomSelect = document.getElementById('editGroupRoom');
    if (roomSelect) {
      const rooms = getData('brainova_rooms') || [];
      roomSelect.innerHTML = rooms.map(r => `<option value="${r.name}" ${r.name === g.room ? 'selected' : ''}>${r.name}</option>`).join('');
    }

    const eduSelect = document.getElementById('editGroupEducator');
    if (eduSelect) {
      const educators = getData('brainova_educators') || [];
      eduSelect.innerHTML = educators.map(e => `<option value="${e.id}" ${e.id === g.educatorId ? 'selected' : ''}>${e.name}</option>`).join('');
    }

    const maxInput = document.getElementById('editGroupMaxStudents');
    if (maxInput) maxInput.value = g.maxStudents || 12;

    const modal = document.getElementById('editGroupModal');
    if (modal) modal.classList.add('active');
  };

  window.closeEditGroupModal = function() {
    const modal = document.getElementById('editGroupModal');
    if (modal) modal.classList.remove('active');
  };

  window.submitEditGroup = function(e) {
    e.preventDefault();
    const id = document.getElementById('editGroupId').value;
    const groups = getData('brainova_groups') || [];
    const groupIdx = groups.findIndex(g => g.id === id);
    if (groupIdx === -1) return;

    const oldName = groups[groupIdx].name;
    const newName = document.getElementById('editGroupName').value.trim();
    const newDay = document.getElementById('editGroupDay').value;
    const newTimeSlot = document.getElementById('editGroupTimeSlot').value.trim() || '14:00 - 16:00';
    const newLevel = document.getElementById('editGroupLevel').value;
    const newAgeCategory = document.getElementById('editGroupAgeCategory').value;
    const newRoom = document.getElementById('editGroupRoom').value;
    const newEducatorId = document.getElementById('editGroupEducator').value;
    const educators = getData('brainova_educators') || [];
    const educator = educators.find(x => x.id === newEducatorId);
    const newMaxStudents = parseInt(document.getElementById('editGroupMaxStudents').value) || 12;

    groups[groupIdx].name = newName;
    groups[groupIdx].day = newDay;
    groups[groupIdx].timeSlot = newTimeSlot;
    groups[groupIdx].level = newLevel;
    groups[groupIdx].ageCategory = newAgeCategory;
    groups[groupIdx].room = newRoom;
    groups[groupIdx].educatorId = newEducatorId || null;
    groups[groupIdx].educatorName = educator ? educator.name : '';
    groups[groupIdx].maxStudents = newMaxStudents;

    saveData('brainova_groups', groups);

    // Also sync with schedule
    const schedules = getData('brainova_schedule') || [];
    let schIdx = schedules.findIndex(s => s.groupId === id || s.groupName === oldName);
    const [st, et] = newTimeSlot.includes('-') ? newTimeSlot.split('-').map(t => t.trim()) : [newTimeSlot, ''];
    if (schIdx !== -1) {
      schedules[schIdx].groupName = newName;
      schedules[schIdx].day = newDay;
      if (st) schedules[schIdx].startTime = st;
      if (et) schedules[schIdx].endTime = et;
      schedules[schIdx].room = newRoom;
      schedules[schIdx].educatorId = newEducatorId;
      schedules[schIdx].educator = educator ? educator.name : '';
    } else {
      schedules.push({
        id: 'SCH-' + Date.now(),
        groupId: id,
        groupName: newName,
        day: newDay,
        startTime: st || '14:00',
        endTime: et || '16:00',
        room: newRoom,
        educatorId: newEducatorId,
        educator: educator ? educator.name : ''
      });
    }
    saveData('brainova_schedule', schedules);

    // If name changed, sync students and attendance
    if (oldName !== newName) {
      const students = getData('brainova_students') || [];
      students.forEach(s => {
        if (isStudentInGroup(s, oldName)) s.group = newName;
      });
      saveData('brainova_students', students);

      const attendance = getData('brainova_attendance') || [];
      attendance.forEach(a => {
        if (isStudentInGroup({ group: a.groupName }, oldName)) a.groupName = newName;
      });
      saveData('brainova_attendance', attendance);
    }

    closeEditGroupModal();
    showToast(`✅ تم تحديث يوم وتوقيت الفوج بنجاح (${newDay} - ${newTimeSlot})`, 'success');
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
  // ── ENHANCED DATABASE BACKUP & RESTORE ENGINE ────────────────────────────
  window.doBackupExport = async function() {
    const backupPayload = {
      application: "Brainova Robotics Management OS",
      version: "2026.2",
      exportedAt: new Date().toISOString(),
      environment: window.electronAPI ? "desktop" : "browser",
      meta: {
        totalStudents: getData('brainova_students').length,
        totalGroups: getData('brainova_groups').length,
        totalAttendanceRecords: getData('brainova_attendance').length,
        totalPayments: getData('brainova_payments').length
      },
      data: {
        brainova_students: getData('brainova_students'),
        brainova_groups: getData('brainova_groups'),
        brainova_attendance: getData('brainova_attendance'),
        brainova_payments: getData('brainova_payments'),
        brainova_schedule: getData('brainova_schedule'),
        brainova_educators: getData('brainova_educators'),
        brainova_courses: getData('brainova_courses'),
        brainova_rooms: getData('brainova_rooms'),
        brainova_registrations: getData('brainova_registrations'),
        brainova_users: getData('brainova_users')
      }
    };

    if (window.electronAPI && window.electronAPI.backup && window.electronAPI.backup.export) {
      const result = await window.electronAPI.backup.export();
      const statusEl = document.getElementById('backupStatus');
      if (result.ok) {
        if (statusEl) statusEl.textContent = `✅ تم حفظ النسخة بنجاح (${backupPayload.meta.totalStudents} طالب، ${backupPayload.meta.totalGroups} فوج)`;
        showToast('تم تصدير النسخة الاحتياطية بنجاح!', 'success');
      } else {
        showToast('تم إلغاء التصدير', 'info');
      }
    } else {
      // Direct file download fallback
      const jsonStr = JSON.stringify(backupPayload, null, 2);
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `Brainova_Backup_${dateStr}.brainovabackup`;
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      const statusEl = document.getElementById('backupStatus');
      if (statusEl) statusEl.textContent = `✅ تم تنزيل النسخة (${backupPayload.meta.totalStudents} طالب، ${backupPayload.meta.totalGroups} فوج)`;
      showToast('تم تنزيل النسخة الاحتياطية بنجاح!', 'success');
    }
  };

  window.doBackupImport = async function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.brainovabackup';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const raw = JSON.parse(event.target.result);
          const data = raw.data || raw;

          if (!data || typeof data !== 'object') {
            throw new Error('الملف لا يحتوي على هيكل بيانات صالح');
          }

          const stuCount = (data.brainova_students || []).length;
          const grpCount = (data.brainova_groups || []).length;
          const attCount = (data.brainova_attendance || []).length;
          const payCount = (data.brainova_payments || []).length;

          const confirmed = confirm(
            `تأكيد استعادة قاعدة البيانات:\n\n` +
            `• عدد الطلاب: ${stuCount}\n` +
            `• عدد الأفواج: ${grpCount}\n` +
            `• سجلات الحضور: ${attCount}\n` +
            `• المدفوعات: ${payCount}\n\n` +
            `تحذير: هذه العملية ستقوم باستبدال البيانات الحالية بالكامل. هل أنت متأكد من المتابعة؟`
          );

          if (!confirmed) {
            showToast('تم إلغاء الاستعادة', 'info');
            return;
          }

          // Write each key to persistent store
          const keys = ['brainova_students', 'brainova_groups', 'brainova_attendance', 'brainova_payments', 'brainova_schedule', 'brainova_educators', 'brainova_courses', 'brainova_rooms', 'brainova_registrations', 'brainova_users'];
          keys.forEach(k => {
            if (data[k]) {
              saveData(k, data[k]);
            }
          });

          // Invalidate memory cache & reload
          Object.keys(MemoryCache).forEach(k => delete MemoryCache[k]);
          await loadFromPersistentStore();
          initializeData();
          renderAll();

          const statusEl = document.getElementById('backupStatus');
          if (statusEl) statusEl.textContent = `✅ تمت استعادة البيانات بنجاح (${stuCount} طالب، ${grpCount} فوج)`;
          showToast('تمت استعادة قاعدة البيانات بنجاح وتحديث كافة الأقسام!', 'success');

        } catch (err) {
          showToast(`خطأ في قراءة ملف النسخة الاحتياطية: ${err.message}`, 'error');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  function autoSaveLocalBackupSnapshot() {
    try {
      const snapshot = {
        timestamp: new Date().toISOString(),
        studentsCount: (getData('brainova_students') || []).length,
        attendanceCount: (getData('brainova_attendance') || []).length,
        paymentsCount: (getData('brainova_payments') || []).length
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('brainova_last_snapshot_meta', JSON.stringify(snapshot));
      }
    } catch (e) {
      // Ignored
    }
  }
  window.autoSaveLocalBackupSnapshot = autoSaveLocalBackupSnapshot;
  setInterval(autoSaveLocalBackupSnapshot, 15 * 60 * 1000);

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
    loadWaAiSettings();
    loadWaChatLogs();
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
  async function triggerAutoAttendanceWhatsApp(student, status, time, date, sessionType = 'regular') {
    if (!window.electronAPI || !window.electronAPI.whatsapp) return;
    const settings = getWhatsAppSettings();
    if (!settings.autoAttendance) return;
    if (!student || !student.parentPhone) return;

    try {
      const waStatus = await window.electronAPI.whatsapp.getStatus();
      if (!waStatus || !waStatus.connected) return;

      const parentName = student.parentName && student.parentName.trim() ? student.parentName.trim() : `ولي أمر ${student.name}`;
      const template = status === 'late' ? settings.lateTemplate : settings.absentTemplate;
      const typeNotice = sessionType === 'makeup' ? ' (حصة تعويضية 🔄)' : (sessionType === 'extra' ? ' (حصة استثنائية ⭐)' : '');
      const text = template
        .replace(/{student}/g, student.name || 'التلميذ')
        .replace(/{parent}/g, parentName)
        .replace(/{group}/g, (student.group || 'الفوج') + typeNotice)
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
        statusBadge.textContent = 'معطل';
        statusBadge.style.color = '#EF4444';
        statusBadge.style.background = 'rgba(239,68,68,0.15)';
        statusBadge.style.borderColor = 'rgba(239,68,68,0.3)';
      }
      if (isManual) showToast('الإرسال التلقائي معطل حالياً', 'info');
      return;
    }

    // Check WhatsApp connection
    let waStatus = { connected: false };
    try {
      waStatus = await window.electronAPI.whatsapp.getStatus();
    } catch(e) {}

    if (!waStatus || !waStatus.connected) {
      if (statusBadge) {
        statusBadge.textContent = 'في انتظار الاتصال';
        statusBadge.style.color = '#F59E0B';
        statusBadge.style.background = 'rgba(245,158,11,0.15)';
        statusBadge.style.borderColor = 'rgba(245,158,11,0.3)';
      }
      if (isManual) showToast('يرجى ربط الواتساب بمسح رمز QR أولاً', 'error');
      return;
    }

    if (statusBadge) {
      statusBadge.textContent = 'يعمل في الخلفية';
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
          if (s.groupId === session.groupId || isStudentInGroup(s, session.groupName)) {
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


  // ═══════════════════════════════════════════════════════════════════════════
  // ── RETENTION RISK ENGINE, PEDAGOGICAL REPORTS & AI WHATSAPP RECEPTIONIST ──
  // ═══════════════════════════════════════════════════════════════════════════

  function calculateStudentRetentionRisk(student) {
    if (!student) return { level: 'healthy', score: 0, reasons: [] };

    const attendance = getData('brainova_attendance') || [];
    const payments = getData('brainova_payments') || [];

    const stuAtt = attendance
      .filter(a => a.studentId === student.id || a.studentName === student.name)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const stuPayments = payments
      .filter(p => p.studentId === student.id || p.studentName === student.name)
      .sort((a, b) => (b.date || b.paymentDate || '').localeCompare(a.date || a.paymentDate || ''));

    const remSessions = student.sessionsRemaining !== undefined ? Number(student.sessionsRemaining) : 4;

    let score = 0;
    const reasons = [];

    // 1. Consecutive Absences
    let consecutiveAbsences = 0;
    for (let i = 0; i < stuAtt.length; i++) {
      if (stuAtt[i].status === 'absent') {
        consecutiveAbsences++;
      } else {
        break;
      }
    }

    if (consecutiveAbsences >= 3) {
      score += 50;
      reasons.push(`غائب ${consecutiveAbsences} حصص متتالية`);
    } else if (consecutiveAbsences === 2) {
      score += 35;
      reasons.push('غائب حصتين متتاليتين');
    } else if (consecutiveAbsences === 1) {
      score += 15;
      reasons.push('غياب في آخر حصة');
    }

    // 2. Remaining Sessions Status
    if (remSessions <= 0) {
      score += 40;
      reasons.push(`نفاد رصيد الحصص (${remSessions} حصة)`);
    } else if (remSessions === 1) {
      score += 20;
      reasons.push('متبقي حصة واحدة فقط');
    }

    // 3. Payment Status / Days since last payment
    const lastPay = stuPayments[0];
    if (lastPay) {
      const payDate = new Date(lastPay.date || lastPay.paymentDate || lastPay.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - payDate) / (1000 * 60 * 60 * 24));
      if (diffDays > 35) {
        score += 25;
        reasons.push(`تأخر تجديد الاشتراك (${diffDays} يوم)`);
      } else if (diffDays > 25 && remSessions <= 1) {
        score += 15;
        reasons.push('اقتراب موعد التجديد دون تسديد');
      }
    } else {
      score += 20;
      reasons.push('لم يسدد أي دفعة بعد');
    }

    let level = 'healthy';
    if (score >= 45) {
      level = 'high';
    } else if (score >= 25) {
      level = 'medium';
    }

    return {
      level,
      score,
      reasons,
      consecutiveAbsences,
      remSessions,
      lastPayment: lastPay || null,
      latestAttendance: stuAtt[0] || null
    };
  }
  window.calculateStudentRetentionRisk = calculateStudentRetentionRisk;

  // ── PEDAGOGICAL PROGRESS REPORTS ──
  let currentPedagogicalStudentId = null;
  let currentPedagogicalReportVariant = 0;

  function generateStudentPedagogicalReport(studentId, variant = 0) {
    const student = (getData('brainova_students') || []).find(s => s.id === studentId);
    if (!student) return '';

    const attendance = (getData('brainova_attendance') || []).filter(a => a.studentId === student.id || a.studentName === student.name);
    const groups = getData('brainova_groups') || [];
    const group = groups.find(g => g.name === student.group);
    const educatorName = (group && group.educatorName) ? group.educatorName : (student.educator || 'طاقم تدريس Brainova');

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const attRate = total > 0 ? Math.round((present / total) * 100) : 100;
    const rem = student.sessionsRemaining !== undefined ? student.sessionsRemaining : 4;

    const notesWithContent = attendance.filter(a => a.note && a.note.trim().length > 2);
    const latestNote = notesWithContent.length > 0 ? notesWithContent[notesWithContent.length - 1].note : null;
    const todayStr = new Date().toLocaleDateString('ar-DZ', { month: 'long', year: 'numeric' });

    if (variant === 0) {
      return `تقرير المتابعة والتقييم البيداغوجي والتقني الشهري 🤖✨
أكاديمية Brainova Robotics للروبوتيك والذكاء الاصطناعي
📅 دورة: ${todayStr}

عناية ولي الأمر الفاضل: ${student.parentName || 'المحترم'}
السلام عليكم ورحمة الله وبركاته،

يسر الطاقم البيداغوجي موافاتكم بتقرير المتابعة الشهري للتلميذ(ة):
• الاسم الكامل: ${student.name} (المعرف: ${student.id})
• الفوج: ${student.group || 'فوج الروبوتيك'} | المستوى: ${student.level || 'المستوى الأول'}
• الأستاذ المؤطر: ${educatorName}

1️⃣ المواظبة والانضباط العام:
• نسبة الالتزام بالحضور: ${attRate}% (${present} من أصل ${total} حصة مسجلة).
• رصيد الحصص المتبقي في الاشتراك الحالي: ${rem} حصص.
${attRate >= 80 ? '• ملاحظة الانضباط: مواظبة ممتازة وحضور في الموعد بكل حيوية وشغف.' : '• ملاحظة الانضباط: نوصي بمزيد من الالتزام لتفادي انقطاع تسلسل المشاريع التطبيقية.'}

2️⃣ التقييم التقني والمهارات المكتسبة:
• التفكير المنطقي والبرمجة: تفاعل إيجابي مع المفاهيم الخوارزمية، وحل التحديات البرمجية بشكل تصاعدي ملحوظ.
• التركيب الميكانيكي والحساسات: دقة في تجميع نماذج الروبوت والتعامل السليم مع العتاد والمحركات.
• روح الفريق والإبداع: مشاركة فعالة مع زملاء الفوج وحرص دائم على اختبار وتجربة الأفكار الجديدة.
${latestNote ? `• ملاحظة المؤطر الميدانية: "${latestNote}"` : ''}

3️⃣ توصيات وتوجيهات للشهر القادم:
• تشجيع التلميذ(ة) على استعراض ما تعلمه ومواصلة الشغف في المنزل.
${rem <= 1 ? '⚠️ تنبيه إداري لطيف: الاشتراك الشهري قارب على الانتهاء، يرجى التنسيق مع الإدارة لتجديد الاشتراك لضمان استمرارية مقعد التلميذ بالفوج.' : '• الاشتراك منتظم وساري المفعول.'}

مع خالص تحيات إدارة وأساتذة Brainova Robotics 🚀
أم البواقي، الجزائر`;
    } else {
      return `كشف التقييم والتقدم البيداغوجي — Brainova Robotics 🎓
📅 شهر: ${todayStr}

أهلاً بحضرتكم، نضع بين أيديكم ملخص المسار التدريبي للابن(ة) المتميز(ة):
👤 التلميذ: ${student.name}
🏫 الفوج: ${student.group || 'فوج التدريب'} (${student.level || 'مبتدئ'})
👨‍🏫 إشراف: ${educatorName}

📊 مؤشرات الأداء والمواظبة:
- معدل الحضور الفعلي: ${attRate}%
- الحصص المتبقية بالرصيد: ${rem} حصة
- التفاعل الصفي: ممتاز ومتعاون جداً مع زملائه

💡 التطور المهاري:
- إتقان تركيب الأجزاء الروبوتية وبرمجتها بنجاح.
- قدرة جيدة على حل المشكلات التقنية وتجاوز الأخطاء أثناء التجربة.
${latestNote ? `- ملاحظة إضافية: "${latestNote}"` : ''}

نتمنى لبطلنا الصغير دوام التألق والنجاح في عالم التكنولوجيا والروبوتيك!
إدارة Brainova Robotics`;
    }
  }

  function openPedagogicalReportModal(studentId) {
    const student = (getData('brainova_students') || []).find(s => s.id === studentId);
    if (!student) return;

    currentPedagogicalStudentId = studentId;
    currentPedagogicalReportVariant = 0;

    const modal = document.getElementById('pedagogicalReportModal');
    const title = document.getElementById('pedagogicalModalTitle');
    const subtitle = document.getElementById('pedagogicalModalSubtitle');
    const metricsCard = document.getElementById('pedagogicalMetricsCard');
    const textEl = document.getElementById('pedagogicalReportText');

    if (title) title.textContent = `التقرير البيداغوجي والتقييم: ${student.name}`;
    if (subtitle) subtitle.textContent = `فوج: ${student.group || 'غير محدد'} • ولي الأمر: ${student.parentName || '—'} (${student.parentPhone || '—'})`;

    const attendance = (getData('brainova_attendance') || []).filter(a => a.studentId === student.id || a.studentName === student.name);
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const attRate = total > 0 ? Math.round((present / total) * 100) : 100;
    const rem = student.sessionsRemaining !== undefined ? student.sessionsRemaining : 4;
    const risk = calculateStudentRetentionRisk(student);

    if (metricsCard) {
      metricsCard.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; text-align:center;">
          <div style="background:rgba(255,255,255,0.03); padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:0.72rem; color:#94A3B8;">نسبة الالتزام</div>
            <div style="font-size:1.1rem; font-weight:800; color:${attRate >= 80 ? '#10B981' : '#F59E0B'};">${attRate}%</div>
          </div>
          <div style="background:rgba(255,255,255,0.03); padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:0.72rem; color:#94A3B8;">الحصص المنجزة</div>
            <div style="font-size:1.1rem; font-weight:800; color:#38BDF8;">${present} حصة</div>
          </div>
          <div style="background:rgba(255,255,255,0.03); padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:0.72rem; color:#94A3B8;">الحصص المتبقية</div>
            <div style="font-size:1.1rem; font-weight:800; color:${rem > 0 ? '#10B981' : '#EF4444'};">${rem} حصص</div>
          </div>
          <div style="background:rgba(255,255,255,0.03); padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:0.72rem; color:#94A3B8;">مؤشر الاستبقاء</div>
            <div style="font-size:0.82rem; font-weight:800; margin-top:4px;">
              ${risk.level === 'healthy' ? '<span class="status-pill status-pill--active">منتظم ومستقر</span>' : (risk.level === 'medium' ? '<span class="risk-pill-medium">متابعة مطلوبة</span>' : '<span class="risk-pill-high">خطر انقطاع</span>')}
            </div>
          </div>
        </div>
      `;
    }

    if (textEl) {
      textEl.value = generateStudentPedagogicalReport(studentId, 0);
    }

    if (modal) modal.classList.add('active');
  }

  function closePedagogicalReportModal() {
    const modal = document.getElementById('pedagogicalReportModal');
    if (modal) modal.classList.remove('active');
  }

  function regenerateCurrentPedagogicalReport() {
    if (!currentPedagogicalStudentId) return;
    currentPedagogicalReportVariant = currentPedagogicalReportVariant === 0 ? 1 : 0;
    const textEl = document.getElementById('pedagogicalReportText');
    if (textEl) {
      textEl.value = generateStudentPedagogicalReport(currentPedagogicalStudentId, currentPedagogicalReportVariant);
      showToast('🔄 تم تحديث صياغة التقرير بنجاح', 'info');
    }
  }

  async function sendCurrentPedagogicalReportViaWhatsApp() {
    if (!currentPedagogicalStudentId) return;
    const student = (getData('brainova_students') || []).find(s => s.id === currentPedagogicalStudentId);
    if (!student || !student.parentPhone) {
      showToast('⚠️ لا يوجد رقم هاتف مسجل لولي أمر هذا التلميذ!', 'warning');
      return;
    }

    const textEl = document.getElementById('pedagogicalReportText');
    const reportText = textEl ? textEl.value.trim() : '';
    if (!reportText) {
      showToast('⚠️ نص التقرير فارغ!', 'warning');
      return;
    }

    if (window.electronAPI && window.electronAPI.whatsapp) {
      showToast('جاري إرسال التقرير البيداغوجي عبر واتساب...', 'info');
      try {
        const res = await window.electronAPI.whatsapp.sendMessage(student.parentPhone, reportText);
        if (res.success) {
          showToast(`✅ تم إرسال التقرير البيداغوجي لولي أمر ${student.name} بنجاح!`, 'success');
          closePedagogicalReportModal();
        } else {
          showToast(`⚠️ تعذر الإرسال: ${res.error}`, 'warning');
        }
      } catch (err) {
        showToast(`❌ خطأ في الإرسال: ${err.message}`, 'danger');
      }
    } else {
      let cleanPhone = String(student.parentPhone).replace(/[^\d]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '213' + cleanPhone.substring(1);
      const url = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(reportText)}`;
      window.open(url, '_blank');
      showToast('تم فتح واتساب لإرسال التقرير', 'info');
      closePedagogicalReportModal();
    }
  }

  function printCurrentPedagogicalReport() {
    if (!currentPedagogicalStudentId) return;
    const student = (getData('brainova_students') || []).find(s => s.id === currentPedagogicalStudentId);
    if (!student) return;

    const textEl = document.getElementById('pedagogicalReportText');
    const reportText = textEl ? textEl.value.trim() : '';

    const html = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>التقرير البيداغوجي — ${student.name}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #fff; color: #0f172a; margin: 0; padding: 15px; direction: rtl; }
          .header { border-bottom: 2px solid #0284C7; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; }
          .academy-title { font-size: 20px; font-weight: 800; color: #0284C7; }
          .academy-sub { font-size: 11px; color: #64748B; margin-top: 2px; }
          .report-box { white-space: pre-wrap; font-size: 13px; line-height: 1.8; color: #1E293B; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 18px; border-radius: 8px; }
          .footer-sign { display: flex; justify-content: space-between; margin-top: 35px; padding-top: 15px; }
          .sign-col { text-align: center; width: 180px; }
          .sign-line { border-bottom: 1px dashed #94A3B8; margin-top: 45px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="academy-title">Brainova Robotics Academy</div>
            <div class="academy-sub">أكاديمية الروبوتيك والذكاء الاصطناعي — أم البواقي، الجزائر</div>
          </div>
          <div style="text-align: left; font-size: 12px; color: #64748B;">
            <div>تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-DZ')}</div>
            <div>رقم التلميذ: ${student.id}</div>
          </div>
        </div>

        <div class="report-box">${reportText}</div>

        <div class="footer-sign">
          <div class="sign-col">
            <div style="font-weight: 700; font-size: 13px;">الأستاذ المؤطر</div>
            <div style="font-size: 11px; color: #64748B;">${student.educator || 'عابد اسحاق تقي الدين'}</div>
            <div class="sign-line"></div>
          </div>
          <div class="sign-col">
            <div style="font-weight: 700; font-size: 13px;">تأشيرة وخاتم الإدارة</div>
            <div style="font-size: 11px; color: #64748B;">أكاديمية Brainova</div>
            <div class="sign-line"></div>
          </div>
        </div>
      </body>
      </html>
    `;

    if (window.electronAPI && window.electronAPI.printReceipt) {
      window.electronAPI.printReceipt(html);
    } else {
      const w = window.open('', '_blank');
      w.document.write(html);
      w.document.close();
      w.focus();
      setTimeout(() => { w.print(); w.close(); }, 300);
    }
  }

  function openFriendlyRetentionWhatsApp(studentId) {
    const student = (getData('brainova_students') || []).find(s => s.id === studentId);
    if (!student || !student.parentPhone) {
      showToast('⚠️ لا يوجد رقم هاتف مسجل لولي الأمر!', 'warning');
      return;
    }

    const rem = student.sessionsRemaining !== undefined ? student.sessionsRemaining : 4;
    const msg = `السلام عليكم ورحمة الله وبركاته 🌸
تحية طيبة من إدارة أكاديمية Brainova Robotics، نأمل أن تكونوا والتلميذ(ة) العزيز(ة) "${student.name}" بأفضل حال.

نود الاطمئنان عنكم بخصوص فوج "${student.group || 'الروبوتيك'}"، حيث افتقدنا حضور بطلنا الصغير ونتمنى أن يكون المانع خيراً.
نحن دوماً هنا لتنسيق أي تعويض للحصص ودعم مساره التطبيقي المشوق.

يسعدنا دوماً تواصلكم الكريم وتشريفكم لنا! 🤖✨
إدارة أكاديمية Brainova Robotics`;

    if (window.electronAPI && window.electronAPI.whatsapp) {
      const phoneInput = document.getElementById('waTestPhone');
      const textInput = document.getElementById('waTestMessage');
      if (phoneInput && textInput) {
        phoneInput.value = student.parentPhone;
        textInput.value = msg;
        document.querySelector('[data-view="whatsapp"]').click();
        showToast(`تم تجهيز رسالة التدارك الودية لولي أمر ${student.name}`, 'info');
      } else {
        window.electronAPI.whatsapp.sendMessage(student.parentPhone, msg).then(res => {
          if (res.success) {
            showToast(`✅ تم إرسال رسالة التدارك لولي أمر ${student.name} بنجاح!`, 'success');
          } else {
            showToast(`⚠️ تعذر الإرسال: ${res.error}`, 'warning');
          }
        });
      }
    } else {
      let cleanPhone = String(student.parentPhone).replace(/[^\d]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '213' + cleanPhone.substring(1);
      window.open(`https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank');
    }
  }

  // ── AI RECEPTIONIST SETTINGS & LOGS ──
  async function saveWaAiSettings() {
    const toggle = document.getElementById('waAiAgentToggle');
    const keyInput = document.getElementById('waAiApiKeyInput');
    const enabled = toggle ? toggle.checked : true;
    const apiKey = keyInput ? keyInput.value.trim() : '';

    const badge = document.getElementById('waAiAgentBadge');
    if (badge) {
      badge.textContent = enabled ? 'نشط وجاهز' : 'معطل';
      badge.className = enabled ? 'status-pill status-pill--active' : 'status-pill status-pill--danger';
    }

    if (window.electronAPI && window.electronAPI.whatsapp && window.electronAPI.whatsapp.setAiSettings) {
      try {
        await window.electronAPI.whatsapp.setAiSettings({ enabled, apiKey });
        showToast('تم حفظ الإعدادات بنجاح', 'success');
      } catch (e) {
        showToast('خطأ في حفظ الإعدادات: ' + e.message, 'danger');
      }
    } else {
      localStorage.setItem('brainova_ai_settings', JSON.stringify({ enabled, apiKey }));
      showToast('تم حفظ الإعدادات بنجاح', 'success');
    }
  }

  async function loadWaAiSettings() {
    if (window.electronAPI && window.electronAPI.whatsapp && window.electronAPI.whatsapp.getAiSettings) {
      try {
        const s = await window.electronAPI.whatsapp.getAiSettings();
        const toggle = document.getElementById('waAiAgentToggle');
        const keyInput = document.getElementById('waAiApiKeyInput');
        const badge = document.getElementById('waAiAgentBadge');
        if (toggle && typeof s.enabled === 'boolean') {
          toggle.checked = s.enabled;
          if (badge) {
            badge.textContent = s.enabled ? 'نشط وجاهز' : 'معطل';
            badge.className = s.enabled ? 'status-pill status-pill--active' : 'status-pill status-pill--danger';
          }
        }
        if (keyInput) keyInput.placeholder = s.hasApiKey ? 'API KEY (مسجل)' : 'API KEY';
      } catch (e) {}
    }
  }

  async function loadWaChatLogs() {
    const tbody = document.getElementById('waAiChatLogsTableBody');
    if (!tbody) return;

    if (window.electronAPI && window.electronAPI.whatsapp && window.electronAPI.whatsapp.getChatLogs) {
      try {
        const logs = await window.electronAPI.whatsapp.getChatLogs();
        renderWaAiChatLogs(logs);
      } catch (e) {}
    }
  }

  function renderWaAiChatLogs(logs) {
    const tbody = document.getElementById('waAiChatLogsTableBody');
    if (!tbody) return;

    if (!logs || logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#64748B;">لا توجد محادثات واردة من الأولياء حتى الآن. البوت يستمع للرسائل الواردة على مدار الساعة!</td></tr>';
      return;
    }

    tbody.innerHTML = logs.map(l => `
      <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
        <td style="padding:8px 12px; font-weight:700; color:#F8FAFC;">${l.studentName || 'زائر جديد'}</td>
        <td style="padding:8px 12px; font-family:monospace; color:#38BDF8;">${l.phone || '—'}</td>
        <td style="padding:8px 12px; color:#CBD5E1; max-width:240px; white-space:pre-wrap;">${l.incomingText}</td>
        <td style="padding:8px 12px; color:#A7F3D0; max-width:320px; white-space:pre-wrap; line-height:1.4;">${l.replyText}</td>
        <td style="padding:8px 12px; text-align:center;">
          <span class="status-pill" style="font-size:0.68rem; background:rgba(56,189,248,0.1); color:#38BDF8; border:1px solid rgba(56,189,248,0.2);">${l.aiEngine || 'AI'}</span>
        </td>
      </tr>
    `).join('');
  }

  window.openPedagogicalReportModal = openPedagogicalReportModal;
  window.closePedagogicalReportModal = closePedagogicalReportModal;
  window.regenerateCurrentPedagogicalReport = regenerateCurrentPedagogicalReport;
  window.sendCurrentPedagogicalReportViaWhatsApp = sendCurrentPedagogicalReportViaWhatsApp;
  window.printCurrentPedagogicalReport = printCurrentPedagogicalReport;
  window.openFriendlyRetentionWhatsApp = openFriendlyRetentionWhatsApp;
  window.saveWaAiSettings = saveWaAiSettings;
  window.loadWaAiSettings = loadWaAiSettings;
  window.loadWaChatLogs = loadWaChatLogs;
  window.renderWaAiChatLogs = renderWaAiChatLogs;

  // Listen for real-time incoming messages logged
  if (window.electronAPI && window.electronAPI.whatsapp && window.electronAPI.whatsapp.onMessageLogged) {
    window.electronAPI.whatsapp.onMessageLogged((log) => {
      loadWaChatLogs();
      showToast(`🤖 رد آلي جديد على ${log.studentName}: "${log.incomingText.slice(0, 25)}..."`, 'info');
    });
  }

  // --- CLOUD AUTO-UPDATER EVENTS & UI TRIGGER ---
  window.checkAppUpdates = function() {
    if (window.electronAPI && window.electronAPI.checkForUpdates) {
      showToast('🔍 جاري فحص المستودع السحابي للتأكد من وجود تحديثات...', 'info');
      window.electronAPI.checkForUpdates();
    } else {
      showToast('فحص التحديثات التلقائية متاح داخل التطبيق المثبت (Production Build)', 'info');
    }
  };

  if (window.electronAPI) {
    if (window.electronAPI.onUpdateAvailable) {
      window.electronAPI.onUpdateAvailable((ver) => {
        showToast(`🚀 يتوفر تحديث جديد للبرنامج (v${ver})! جاري التحميل في الخلفية...`, 'info');
      });
    }
    if (window.electronAPI.onUpdateDownloaded) {
      window.electronAPI.onUpdateDownloaded((ver) => {
        showToast(`✅ تم اكتمال تحميل التحديث الجديد (v${ver}) بنجاح!`, 'success');
      });
    }
  }

  // Initial render (fallback if loadFromPersistentStore already ran)
  renderAll();
});

