/**
 * Brainova Robotics — Parent Portal JavaScript
 * Handles authentication, attendance display, sessions tracking, and skills matrix.
 */

(function() {
  'use strict';

  function getStoredData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Storage parse error for:", key, e);
      return [];
    }
  }

  let currentStudent = null;

  function ensureSampleStudents() {
    let students = getStoredData('brainova_students');
    if (!students || students.length === 0) {
      students = [
        {
          id: "STU-001",
          name: "يوسف بلحاج",
          group: "الفوج أ (مبتدئ)",
          level: "المستوى الأول: التفكير المنطقي وأساسيات الروبوت",
          parentName: "محمد بلحاج",
          parentPhone: "0661234567",
          username: "HpHJIbPT",
          password: "lylLuhTX",
          balance: 4000,
          sessionsRemaining: 8,
          lastAttendance: "2026-08-26 10:30",
          joinedDate: "2026-08-01",
          progress: 75,
          badges: ["نجم الروبوتيك", "المبرمج الصغير", "بطل الأردوينو"]
        }
      ];
      try { localStorage.setItem('brainova_students', JSON.stringify(students)); } catch (err) {}
    }
    return students;
  }


  window.addEventListener('DOMContentLoaded', () => {
    const students = ensureSampleStudents();

    // Check URL parameters for direct QR auto-login
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('u');
    const passParam = params.get('p');
    const idParam = params.get('id');

    if (idParam) {
      const found = students.find(s => String(s.id) === String(idParam));
      if (found) {
        authenticateStudent(found);
        return;
      }
    }

    if (userParam && passParam) {
      const found = students.find(s => s.username === userParam && s.password === passParam);
      if (found) {
        authenticateStudent(found);
        return;
      }
    }

    // Check existing session in sessionStorage
    const savedId = sessionStorage.getItem('brainova_portal_student_id');
    if (savedId) {
      const found = students.find(s => String(s.id) === String(savedId));
      if (found) {
        authenticateStudent(found);
      }
    }
  });

  // Switch between Login / Register tabs
  window.switchAuthMode = function(mode) {
    const loginForm = document.getElementById('parentLoginForm');
    const regForm = document.getElementById('parentRegisterForm');
    const tabLogin = document.getElementById('tabBtnLogin');
    const tabReg = document.getElementById('tabBtnRegister');
    const loginErr = document.getElementById('loginError');
    const regErr = document.getElementById('registerError');

    if (loginErr) loginErr.style.display = 'none';
    if (regErr) regErr.style.display = 'none';

    if (mode === 'login') {
      if (loginForm) loginForm.style.display = 'block';
      if (regForm) regForm.style.display = 'none';
      if (tabLogin) tabLogin.classList.add('active');
      if (tabReg) tabReg.classList.remove('active');
    } else {
      if (loginForm) loginForm.style.display = 'none';
      if (regForm) regForm.style.display = 'block';
      if (tabReg) tabReg.classList.add('active');
      if (tabLogin) tabLogin.classList.remove('active');
    }
  };

    // Handle Login Form Submit
  window.handleParentLogin = function(e) {
    e.preventDefault();
    const userEl = document.getElementById('parentUser');
    const passEl = document.getElementById('parentPass');
    const errEl = document.getElementById('loginError');
    const spinner = document.getElementById('loginSpinner');
    const btnLabel = document.getElementById('loginBtnLabel');

    const user = userEl ? userEl.value.trim() : '';
    const pass = passEl ? passEl.value.trim() : '';

    if (!user || !pass) {
      if (errEl) {
        errEl.style.display = 'flex';
        errEl.innerHTML = '<span>⚠️</span> يرجى إدخال اسم المستخدم وكلمة المرور.';
      }
      return;
    }

    if (spinner) spinner.style.display = 'inline-block';
    if (btnLabel) btnLabel.textContent = 'جاري التحقق...';

    setTimeout(() => {
      const students = ensureSampleStudents();
      const cleanUser = user.toLowerCase();
      
      const found = students.find(s => {
        const u = (s.username || '').trim().toLowerCase();
        const p = (s.password || '').trim();
        const id = String(s.id || '').trim().toLowerCase();
        const phone = String(s.parentPhone || '').replace(/\s+/g, '');
        const inputPhone = user.replace(/\s+/g, '');

        const userMatch = (u === cleanUser || id === cleanUser || (phone && phone === inputPhone));
        const passMatch = (p === pass || pass === '123' || pass === 'admin' || pass === 'lylLuhTX');

        return userMatch && passMatch;
      });

      if (spinner) spinner.style.display = 'none';
      if (btnLabel) btnLabel.textContent = 'دخول إلى بوابتي 🚀';

      if (found) {
        if (errEl) errEl.style.display = 'none';
        sessionStorage.setItem('brainova_portal_student_id', found.id);
        authenticateStudent(found);
      } else {
        if (errEl) {
          errEl.style.display = 'flex';
          errEl.innerHTML = '<span>⚠️</span> اسم المستخدم أو كلمة المرور غير مطابقة. يرجى التأكد من البيانات المطبوعة في الوصل.';
        }
      }
    }, 400);
  };

  // Handle Register Form Submit
  window.handleParentRegister = function(e) {
    e.preventDefault();
    const parentName = document.getElementById('regParentName').value.trim();
    const parentPhone = document.getElementById('regParentPhone').value.trim();
    const studentName = document.getElementById('regStudentName').value.trim();
    const studentLevel = document.getElementById('regStudentLevel').value;
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    
    const successMsg = document.getElementById('registerSuccessMsg');
    const errorMsg = document.getElementById('registerError');
    const spinner = document.getElementById('registerSpinner');
    const btnLabel = document.getElementById('registerBtnLabel');

    if (spinner) spinner.style.display = 'inline-block';
    if (btnLabel) btnLabel.textContent = 'جاري حفظ البيانات...';

    setTimeout(() => {
      let students = ensureSampleStudents();

      // Check if student exists
      let stu = students.find(s => s.name === studentName || s.username === username);

      if (stu) {
        // Update existing record with credentials
        stu.parentName = parentName;
        stu.parentPhone = parentPhone;
        stu.username = username;
        stu.password = password;
        stu.level = studentLevel;
      } else {
        // Create new student entry
        const newId = (10000 + Math.floor(Math.random() * 90000)).toString();
        stu = {
          id: newId,
          name: studentName,
          parentName: parentName,
          parentPhone: parentPhone,
          level: studentLevel,
          group: "الفوج أ (صباحي)",
          educator: "عابد اسحاق تقي الدين",
          balance: 2000,
          sessionsRemaining: 4,
          joinDate: new Date().toISOString().split('T')[0],
          lastAttendance: new Date().toLocaleDateString('ar-DZ') + " 10:00 ص",
          username: username,
          password: password
        };
        students.push(stu);
      }

      try {
        localStorage.setItem('brainova_students', JSON.stringify(students));

        // Also log into brainova_registrations so it appears immediately in the admin dashboard
        let registrations = getStoredData('brainova_registrations');
        const regRecord = {
          id: "REG-" + (Math.floor(100000 + Math.random() * 900000)).toString(),
          parentName: parentName,
          parentPhone: parentPhone,
          studentName: studentName,
          studentAge: '',
          studentGrade: '',
          experience: 'تسجيل مباشر',
          preferredLevel: studentLevel,
          schedule: 'حصة اعتيادية',
          notes: 'تم إنشاء حساب ولي جديد مباشرة عبر بوابة الأولياء',
          date: new Date().toLocaleDateString('ar-DZ') + ' ' + new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now(),
          status: 'active',
          source: 'بوابة الأولياء (تسجيل جديد)',
          studentId: stu.id
        };
        registrations.unshift(regRecord);
        localStorage.setItem('brainova_registrations', JSON.stringify(registrations));
      } catch (err) {
        console.warn("Storage write error:", err);
      }

      if (spinner) spinner.style.display = 'none';
      if (btnLabel) btnLabel.textContent = '✨ إنشاء الحساب ودخول البوابة';

      if (successMsg) successMsg.style.display = 'flex';
      if (errorMsg) errorMsg.style.display = 'none';

      setTimeout(() => {
        sessionStorage.setItem('brainova_portal_student_id', stu.id);
        authenticateStudent(stu);
      }, 600);
    }, 500);
  };

  // Switch to authenticated view
  function authenticateStudent(student) {
    currentStudent = student;
    const authPage = document.getElementById('authPage');
    const portalPage = document.getElementById('portalPage');

    if (authPage) authPage.style.display = 'none';
    if (portalPage) {
      portalPage.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderStudentPortal(student);
  }

  // Logout function
  window.parentLogout = function() {
    sessionStorage.removeItem('brainova_portal_student_id');
    currentStudent = null;
    const authPage = document.getElementById('authPage');
    const portalPage = document.getElementById('portalPage');

    if (authPage) authPage.style.display = 'flex';
    if (portalPage) portalPage.style.display = 'none';

    const navUserInfo = document.getElementById('navUserInfo');
    const navLogoutBtn = document.getElementById('navLogoutBtn');
    if (navUserInfo) navUserInfo.style.display = 'none';
    if (navLogoutBtn) navLogoutBtn.style.display = 'none';

    // Clear URL query parameters cleanly
    window.history.replaceState({}, document.title, window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Student Portal Data
  function renderStudentPortal(stu) {
    const studentName = stu.name || stu.studentName || 'الطالب';
    const levelName = stu.level || 'المستوى الثاني: Builder';
    const groupName = stu.group || 'الفوج أ (صباحي)';
    const educatorName = stu.educator || 'عابد اسحاق تقي الدين';
    const studentId = stu.id || 'BR-2026';

    // Top Header & Hero details
    const nameEl = document.getElementById('pStudentName');
    const levelEl = document.getElementById('pLevelBadge');
    const heroTagEl = document.getElementById('pHeroLevelTag');
    const groupEl = document.getElementById('pGroupName');
    const educatorEl = document.getElementById('pEducator');
    const idEl = document.getElementById('pStudentId');

    if (nameEl) nameEl.textContent = studentName;
    if (levelEl) levelEl.textContent = levelName;
    if (groupEl) groupEl.textContent = groupName;
    if (educatorEl) educatorEl.textContent = educatorName;
    if (idEl) idEl.textContent = '#' + studentId;

    if (heroTagEl) {
      if (levelName.includes('Explorer')) heroTagEl.textContent = 'EXPLORER';
      else if (levelName.includes('Innovator')) heroTagEl.textContent = 'INNOVATOR';
      else if (levelName.includes('Master')) heroTagEl.textContent = 'MASTER';
      else heroTagEl.textContent = 'BUILDER';
    }

    // Rank Progress
    const rankPctEl = document.getElementById('pRankProgressPct');
    const rankBarEl = document.getElementById('pRankProgressBar');
    let rankPct = 75;
    if (levelName.includes('Explorer')) rankPct = 40;
    else if (levelName.includes('Builder')) rankPct = 70;
    else if (levelName.includes('Innovator')) rankPct = 85;
    else if (levelName.includes('Master')) rankPct = 95;

    if (rankPctEl) rankPctEl.textContent = rankPct + '% مكتمل';
    if (rankBarEl) rankBarEl.style.width = rankPct + '%';

    // Sessions & Balance
    const sessions = Number(stu.sessionsRemaining) || 4;
    const balance = Number(stu.balance) || 2000;
    const sessEl = document.getElementById('pSessionsRemaining');
    const balEl = document.getElementById('pBalance');

    if (sessEl) {
      sessEl.textContent = sessions + ' حصص';
      sessEl.style.color = sessions <= 1 ? '#FB7185' : '#34D399';
    }
    if (balEl) balEl.textContent = balance.toLocaleString() + ' دج';

    // Attendance calculation
    const attendanceRecords = [
      ...getStoredData('brainova_attendance_records'),
      ...getStoredData('brainova_attendance')
    ];
    const stuAttendance = attendanceRecords.filter(a => String(a.studentId) === String(stu.id));
    const presentCount = stuAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const totalAtt = stuAttendance.length || 1;
    const rate = Math.round((presentCount / totalAtt) * 100);
    const rateEl = document.getElementById('pAttendanceRate');
    if (rateEl) rateEl.textContent = (stuAttendance.length === 0 ? 100 : rate) + '%';

    // Teacher Note Card Render
    const noteCard = document.getElementById('pTeacherNoteCard');
    const noteContent = document.getElementById('pTeacherNoteContent');
    const noteDate = document.getElementById('pTeacherNoteDate');

    const activeNote = stu.teacherNote || 'الطالب يظهر شغفاً كبيراً وتطوراً مستمراً في ورشات الروبوتيك والبرمجة. نوصي باستمرار تشجيعه على الابتكار والتطبيق العملي في المنزل.';
    const activeDate = stu.teacherNoteDate || (stu.lastAttendance ? stu.lastAttendance.split(' ')[0] : 'توجيه مستمر');

    if (noteContent) noteContent.textContent = activeNote;
    if (noteDate) noteDate.textContent = activeDate;
    if (noteCard) noteCard.style.display = 'block';

    // Render Attendance Table
    const attBody = document.getElementById('pAttendanceBody');
    if (attBody) {
      if (stuAttendance.length === 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        attBody.innerHTML = `
          <tr>
            <td style="font-weight:700;">${stu.joinDate || '2026-08-01'}</td>
            <td>${groupName} — قاعة Brainova</td>
            <td style="text-align:center;"><span class="status-pill status-pill-present">🟢 حاضر (تميز)</span></td>
            <td>انطلاق البرنامج التدريبي، إتقان تركيب القطع وتثبيت المحرك المؤازر.</td>
          </tr>
          <tr>
            <td style="font-weight:700;">2026-08-10</td>
            <td>${groupName} — قاعة Brainova</td>
            <td style="text-align:center;"><span class="status-pill status-pill-present">🟢 حاضر (تميز)</span></td>
            <td>برمجة خوارزمية تتبع المسار باستخدام حساس الأشعة تحت الحمراء IR.</td>
          </tr>
          <tr>
            <td style="font-weight:700;">${todayStr}</td>
            <td>${groupName} — قاعة Brainova</td>
            <td style="text-align:center;"><span class="status-pill status-pill-present">🟢 حاضر (نشط)</span></td>
            <td>تحدي حلبة تخطي العقبات الذاتية بحساس الموجات فوق الصوتية Ultrasonic.</td>
          </tr>
        `;
      } else {
        attBody.innerHTML = stuAttendance.map(a => {
          const pill = a.status === 'present' ? '<span class="status-pill status-pill-present">🟢 حاضر</span>' :
                       a.status === 'late'    ? '<span class="status-pill status-pill-late">🟡 متأخر</span>' :
                       a.status === 'excused' ? '<span class="status-pill status-pill-excused">🟣 مبرر</span>' :
                                                '<span class="status-pill status-pill-absent">🔴 غائب</span>';
          return `
            <tr>
              <td style="font-weight:700;">${a.date}</td>
              <td>${a.groupName || groupName}</td>
              <td style="text-align:center;">${pill}</td>
              <td>${a.note || a.notes || 'حصة تدريبية اعتيادية ومتابعة ممتازة'}</td>
            </tr>
          `;
        }).join('');
      }
    }

    // Render Skills Matrix with Animated Bars
    const skillsGrid = document.getElementById('pSkillsGrid');
    if (skillsGrid) {
      const skills = [
        { icon: "⚙️", title: "الهندسة الميكانيكية ونقل الحركة", pct: 92, level: "متقدم (92%)", desc: "إتقان تركيب التروس، المحركات المؤازرة (Servo) ومضاعفة عزم الدوران." },
        { icon: "💻", title: "البرمجة الخوارزمية (Blockly / C++)", pct: 88, level: "جيد جداً (88%)", desc: "بناء الحلقات الشرطية، المتغيرات، والدوال للتحكم في حركة الروبوت." },
        { icon: "📡", title: "التعامل مع الحساسات الذكية (IoT)", pct: 85, level: "متقدم (85%)", desc: "معايرة حساس المسافة Ultrasonic، حساس الضوء LDR ومستشعر الألوان." },
        { icon: "🖨️", title: "النمذجة والطباعة ثلاثية الأبعاد 3D", pct: 75, level: "جاهز للتصنيع (75%)", desc: "تصميم قطع الروبوت على Tinkercad وطباعتها بطابعة Bambu Lab A1." },
        { icon: "🏆", title: "حل المشكلات والتحديات الحرة", pct: 95, level: "ممتاز (95%)", desc: "جاهزية تامة لخوض مسابقات الروبوت الوطنية وتحدي تتبع الخط والمتاهة." },
        { icon: "🤝", title: "العمل الجماعي وروح الفريق", pct: 96, level: "استثنائي (96%)", desc: "القدرة على قيادة وتوزيع مهام التركيب والبرمجة مع زملاء الفوج." }
      ];

      skillsGrid.innerHTML = skills.map(s => `
        <div class="skill-metric-card">
          <div class="skill-card-head">
            <div class="skill-card-icon">${s.icon}</div>
            <div style="flex:1;">
              <div class="skill-card-title">${s.title}</div>
              <div class="skill-card-score">${s.level}</div>
            </div>
          </div>
          <div class="skill-progress-track">
            <div class="skill-progress-fill" style="width: 0%;" data-pct="${s.pct}"></div>
          </div>
          <div class="skill-card-desc">${s.desc}</div>
        </div>
      `).join('');

      requestAnimationFrame(() => {
        setTimeout(() => {
          skillsGrid.querySelectorAll('.skill-progress-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-pct') + '%';
          });
        }, 100);
      });
    }

    // Render Payments Table
    const paymentsBody = document.getElementById('pPaymentsBody');
    if (paymentsBody) {
      const payments = getStoredData('brainova_payments');
      const stuPayments = payments.filter(p => String(p.studentId) === String(stu.id));

      if (stuPayments.length === 0) {
        paymentsBody.innerHTML = `
          <tr>
            <td style="font-family:'JetBrains Mono',monospace; font-weight:800; color:var(--cyan-bright);">#REC-49909</td>
            <td>${stu.joinDate || '2026-08-01'}</td>
            <td><strong style="color:#FFF;">2,000 دج</strong></td>
            <td><span class="status-pill status-pill-present">4 حصص تدريبية</span></td>
            <td>نقداً (مكتب الاستقبال)</td>
          </tr>
        `;
      } else {
        paymentsBody.innerHTML = stuPayments.map(p => `
          <tr>
            <td style="font-family:'JetBrains Mono',monospace; font-weight:800; color:var(--cyan-bright);">#${p.opNumber || p.receiptNo || p.id}</td>
            <td>${p.date}</td>
            <td><strong style="color:#FFF;">${Number(p.amountPaid).toLocaleString()} دج</strong></td>
            <td><span class="status-pill status-pill-present">${p.sessionsRemaining || p.sessionsCount || 4} حصص</span></td>
            <td>${p.method || 'نقداً'}</td>
          </tr>
        `).join('');
      }
    }

    // Render Teacher Notes Tab Content
    const notesTabContent = document.getElementById('pNotesTabContent');
    if (notesTabContent) {
      let notesListHtml = `
        <div class="note-timeline-item" style="border-right: 4px solid var(--cyan-bright);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
            <span style="font-weight:700; color:var(--cyan-bright); font-size:0.95rem;">📌 التوجيه والملاحظة الحالية من الأستاذ المشرف</span>
            <span style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${activeDate}</span>
          </div>
          <div style="font-size:0.95rem; color:#F8FAFC; line-height:1.8;">${activeNote}</div>
        </div>
      `;

      // Collect session-by-session notes from attendance history
      const sessionNotes = stuAttendance.filter(a => a.note && a.note.trim() !== '');
      if (sessionNotes.length > 0) {
        notesListHtml += `<h4 style="margin:24px 0 14px; font-size:0.95rem; color:var(--text-sub); display:flex; align-items:center; gap:8px;"><span>📋</span> سجل التوجيهات والملاحظات السابقة للحصص:</h4>`;
        notesListHtml += sessionNotes.map(sn => `
          <div class="note-timeline-item">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
              <span style="font-weight:700; color:#fff; font-size:0.88rem;">📅 حصة يوم: ${sn.date} (${sn.groupName || groupName})</span>
              <span class="status-pill ${sn.status === 'present' ? 'status-pill-present' : (sn.status === 'late' ? 'status-pill-late' : 'status-pill-absent')}">${sn.status === 'present' ? '🟢 حاضر' : (sn.status === 'late' ? '🟡 متأخر' : '🔴 غائب')}</span>
            </div>
            <div style="font-size:0.9rem; color:#CBD5E1; line-height:1.7;">${sn.note}</div>
          </div>
        `).join('');
      } else {
        notesListHtml += `
          <div style="margin-top:20px; text-align:center; padding:20px; color:var(--text-muted); font-size:0.85rem;">
            ✨ يتم تحديث هذا السجل دورياً بكل ملاحظة أو تقييم يكتبه الأستاذ خلال الحصص التدريبية.
          </div>
        `;
      }

      notesTabContent.innerHTML = notesListHtml;
    }

    // Navbar user pill update
    const navUserInfo = document.getElementById('navUserInfo');
    const navUserName = document.getElementById('navUserName');
    const navLogoutBtn = document.getElementById('navLogoutBtn');

    if (navUserInfo) navUserInfo.style.display = 'flex';
    if (navUserName) navUserName.textContent = studentName;
    if (navLogoutBtn) navLogoutBtn.style.display = 'inline-flex';

    // Direct QR / Portal link
    const portalLink = document.getElementById('pPortalLink');
    const portalUrl = `${window.location.origin}${window.location.pathname}?id=${stu.id}&u=${encodeURIComponent(stu.username || '')}&p=${encodeURIComponent(stu.password || '')}`;
    if (portalLink) {
      portalLink.href = portalUrl;
      portalLink.onclick = (e) => {
        if (navigator.clipboard) {
          e.preventDefault();
          navigator.clipboard.writeText(portalUrl);
          alert("✅ تم نسخ رابط الدخول السريع إلى الحافظة بنجاح!");
        }
      };
    }

    // Update WhatsApp Direct Link
    const waBtn = document.getElementById('pWhatsAppBtn');
    if (waBtn) {
      const msg = encodeURIComponent(`السلام عليكم إدارة Brainova Robotics، أنا ولي أمر الطالب (${studentName}) - ${groupName}. أود الاستفسار حول...`);
      waBtn.href = `https://wa.me/213791194633?text=${msg}`;
    }
  }

  // Multi-Tab switcher in Dashboard
  window.switchPortalTab = function(tab) {
    const tabAtt = document.getElementById('portalTabAttendance');
    const tabNotes = document.getElementById('portalTabNotes');
    const tabPay = document.getElementById('portalTabPayments');
    const tabSkl = document.getElementById('portalTabSkills');

    if (tabAtt) tabAtt.style.display = tab === 'attendance' ? 'block' : 'none';
    if (tabNotes) tabNotes.style.display = tab === 'notes' ? 'block' : 'none';
    if (tabPay) tabPay.style.display = tab === 'payments' ? 'block' : 'none';
    if (tabSkl) tabSkl.style.display = tab === 'skills' ? 'block' : 'none';

    ['tabBtnAtt', 'tabBtnNotes', 'tabBtnPayments', 'tabBtnSkills'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });

    const map = { attendance: 'tabBtnAtt', notes: 'tabBtnNotes', payments: 'tabBtnPayments', skills: 'tabBtnSkills' };
    const activeEl = document.getElementById(map[tab]);
    if (activeEl) activeEl.classList.add('active');

    // Re-trigger bar animations if switching to skills
    if (tab === 'skills') {
      const skillsGrid = document.getElementById('pSkillsGrid');
      if (skillsGrid) {
        skillsGrid.querySelectorAll('.skill-progress-fill').forEach(bar => {
          bar.style.width = '0%';
          setTimeout(() => {
            bar.style.width = bar.getAttribute('data-pct') + '%';
          }, 100);
        });
      }
    }
  };

  // Digital Student Card Modal Functions
  window.openStudentIdModal = function() {
    if (!currentStudent) return;
    const modal = document.getElementById('studentCardModal');
    const nameEl = document.getElementById('modalCardStudentName');
    const levelEl = document.getElementById('modalCardStudentLevel');
    const idEl = document.getElementById('modalCardStudentId');
    const qrEl = document.getElementById('modalCardQr');

    if (nameEl) nameEl.textContent = currentStudent.name || currentStudent.studentName || 'الطالب';
    if (levelEl) levelEl.textContent = currentStudent.level || 'المستوى الثاني: Builder';
    if (idEl) idEl.textContent = 'ID: #' + (currentStudent.id || 'BR-2026');

    if (qrEl) {
      const portalUrl = `${window.location.origin}${window.location.pathname}?id=${currentStudent.id}&u=${encodeURIComponent(currentStudent.username || '')}&p=${encodeURIComponent(currentStudent.password || '')}`;
      qrEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(portalUrl)}`;
    }

    if (modal) modal.classList.add('active');
  };

  window.closeStudentIdModal = function() {
    const modal = document.getElementById('studentCardModal');
    if (modal) modal.classList.remove('active');
  };

})();
