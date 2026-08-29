/* ==========================================================================
   BRAINOVA ROBOTICS — Official Main JavaScript Engine
   Stats counter, Multi-step form, Gallery filter, Lightbox, FAQ accordion, Lang switch
   ========================================================================== */

(function() {
  'use strict';

  // ── 1. NAVBAR SCROLL & MOBILE TOGGLE ────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('nav--scrolled', window.scrollY > 40);
    }
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // ── 2. STATS COUNTER ANIMATION ──────────────────────────────────────────
  function initStatsCounter() {
    const stats = document.querySelectorAll('.hero__stat-number, .achieve-card__number');
    let animated = false;

    function countUp() {
      stats.forEach(el => {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 35);
      });
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        countUp();
      }
    }, { threshold: 0.3 });

    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) observer.observe(heroStats);
  }

  // ── 3. GALLERY CATEGORY FILTER ──────────────────────────────────────────
  const galleryFilters = document.querySelectorAll('.gallery__filter');
  const galleryItems = document.querySelectorAll('.gallery__item');

  galleryFilters.forEach(filterBtn => {
    filterBtn.addEventListener('click', () => {
      galleryFilters.forEach(b => b.classList.remove('active'));
      filterBtn.classList.add('active');

      const filterVal = filterBtn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ── 4. LIGHTBOX MODAL ───────────────────────────────────────────────────
  window.openLightbox = function(src) {
    const modal = document.getElementById('galleryLightbox');
    const img = document.getElementById('lightboxImg');
    if (modal && img) {
      img.src = src;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeLightbox = function(e) {
    if (e.target.id === 'galleryLightbox' || e.target.classList.contains('lightbox-close')) {
      const modal = document.getElementById('galleryLightbox');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  };

  // ── 5. MULTI-STEP REGISTRATION FORM ─────────────────────────────────────
  window.goToStep = function(stepNumber) {
    const steps = document.querySelectorAll('.form-step');
    const indicators = document.querySelectorAll('.form-progress__step');

    steps.forEach(s => s.classList.remove('active'));
    indicators.forEach(ind => {
      const stepIdx = parseInt(ind.getAttribute('data-step'), 10);
      ind.classList.toggle('active', stepIdx === stepNumber);
      ind.classList.toggle('completed', stepIdx < stepNumber);
    });

    const targetStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (targetStep) targetStep.classList.add('active');
  };

  window.handleMultiStepRegistration = function(e) {
    e.preventDefault();
    const parentName   = document.getElementById('parentName').value.trim();
    const parentPhone  = document.getElementById('parentPhone').value.trim();
    const parentEmail  = document.getElementById('parentEmail').value.trim();
    const studentName  = document.getElementById('studentName').value.trim();
    const studentAge   = document.getElementById('studentAge').value;
    const studentGrade = document.getElementById('studentGrade').value.trim();
    const level        = document.getElementById('preferredLevel').value;
    const schedule     = document.getElementById('schedule').value;
    const notes        = document.getElementById('notes').value.trim();

    const successEl = document.getElementById('formSuccess');

    try {
      let regs = [];
      try {
        regs = JSON.parse(localStorage.getItem('brainova_registrations') || '[]');
      } catch (err) {
        regs = [];
      }

      const newRecord = {
        id: "REG-" + Math.floor(100000 + Math.random() * 900000),
        studentName: studentName,
        studentAge: studentAge,
        studentGrade: studentGrade,
        parentName: parentName,
        parentPhone: parentPhone,
        parentEmail: parentEmail,
        preferredLevel: level,
        schedule: schedule,
        notes: notes || 'تسجيل عبر الموقع الرسمي',
        status: 'pending',
        date: new Date().toLocaleDateString('ar-DZ') + ' ' + new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
        source: 'الموقع الرسمي'
      };

      regs.unshift(newRecord);
      localStorage.setItem('brainova_registrations', JSON.stringify(regs));

      if (window.electronAPI && window.electronAPI.store) {
        window.electronAPI.store.set('brainova_registrations', regs);
      }

      if (successEl) {
        successEl.style.display = 'block';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      document.getElementById('regForm').reset();
    } catch (err) {
      alert('تم استلام طلب التسجيل بنجاح! شكراً لك.');
    }
  };

  // ── 6. FAQ ACCORDION ────────────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq__question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
      });
    }
  });

  // ── 7. LANGUAGE SWITCHER (AR / FR) ──────────────────────────────────────
  const langSwitch = document.getElementById('langSwitch');
  let currentLang = 'AR';

  if (langSwitch) {
    langSwitch.addEventListener('click', () => {
      currentLang = currentLang === 'AR' ? 'FR' : 'AR';
      langSwitch.querySelector('.lang-switch__current').textContent = currentLang === 'AR' ? 'FR' : 'AR';
      document.documentElement.setAttribute('dir', currentLang === 'AR' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', currentLang === 'AR' ? 'ar' : 'fr');
    });
  }

  // ── INITIALIZE ON LOAD ──────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initStatsCounter();
  });

})();
