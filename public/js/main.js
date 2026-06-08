document.addEventListener('DOMContentLoaded', () => {

  // ===== MOBILE DRAWER — Body-level (moved to body to avoid ancestor containing-block issues) =====
  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileContactBar = document.getElementById('mobileContactBar');

  if (mobileDrawer && mobileDrawer.parentElement !== document.body) {
    document.body.appendChild(mobileDrawer);
  }
  if (mobileDrawerOverlay && mobileDrawerOverlay.parentElement !== document.body) {
    document.body.appendChild(mobileDrawerOverlay);
  }
  if (mobileContactBar && mobileContactBar.parentElement !== document.body) {
    document.body.appendChild(mobileContactBar);
  }

  function openMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.add('active');
      mobileDrawerOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
    document.body.classList.add('mobile-menu-open');
    if (navToggle) {
      navToggle.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
    }
    if (mobileDrawerClose) mobileDrawerClose.focus();
  }

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.remove('active');
      mobileDrawerOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    document.body.classList.remove('mobile-menu-open');
    if (navToggle) {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  }

  if (navToggle) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileDrawer);
  }

  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeMobileDrawer();
    }
  });

  if (mobileDrawer) {
    mobileDrawer.querySelectorAll('.mobile-drawer-links > li > a:not(.mobile-drawer-sub-toggle), .mobile-drawer-sub a, .mobile-drawer-cta a, .mobile-drawer-phone, .mobile-drawer-social-link').forEach(link => {
      link.addEventListener('click', closeMobileDrawer);
    });
  }

  // Dropdown toggle for Hizmetler sub-menu
  if (mobileDrawer) {
    mobileDrawer.querySelectorAll('.mobile-drawer-sub-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = toggle.closest('.mobile-drawer-has-sub');
        if (parent) {
          parent.classList.toggle('open');
          const chevron = toggle.querySelector('.mobile-drawer-chevron');
          if (chevron) {
            chevron.style.transform = parent.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
          }
        }
      });
    });
  }

  // ===== HERO SLIDER — Modern Premium =====
  const heroSlider = document.getElementById('heroSlider');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const sliderProgress = document.getElementById('sliderProgressBar');
  const counterCurrent = document.getElementById('sliderCounterCurrent');
  const pauseIndicator = document.getElementById('sliderPausedIndicator');
  let currentSlide = 0;
  let slideInterval;
  let progressInterval;
  let isPaused = false;
  let slideDuration = 6000;
  let progressStart;
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateCounter(index) {
    if (counterCurrent) {
      counterCurrent.textContent = String(index + 1).padStart(2, '0');
    }
  }

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
    updateCounter(index);
    if (!isPaused) resetProgress();
  }

  function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
  function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }

  function startProgress() {
    if (prefersReduced || !sliderProgress) return;
    progressStart = performance.now();
    const tick = () => {
      if (isPaused) return;
      const elapsed = performance.now() - progressStart;
      const pct = Math.min(elapsed / slideDuration * 100, 100);
      sliderProgress.style.width = pct + '%';
      if (pct < 100) {
        progressInterval = requestAnimationFrame(tick);
      }
    };
    cancelAnimationFrame(progressInterval);
    sliderProgress.style.width = '0%';
    progressInterval = requestAnimationFrame(tick);
  }
  function resetProgress() {
    if (sliderProgress) {
      sliderProgress.style.width = '0%';
    }
    cancelAnimationFrame(progressInterval);
    if (!isPaused) startProgress();
  }

  function startSlideTimer() { slideInterval = setInterval(nextSlide, slideDuration); }
  function resetSlideTimer() { clearInterval(slideInterval); resetProgress(); startSlideTimer(); }

  function setPaused(paused) {
    isPaused = paused;
    if (paused) {
      clearInterval(slideInterval);
      cancelAnimationFrame(progressInterval);
      if (pauseIndicator) pauseIndicator.classList.add('show');
    } else {
      progressStart = performance.now() - (sliderProgress ? parseFloat(sliderProgress.style.width || '0') / 100 * slideDuration : 0);
      startSlideTimer();
      if (sliderProgress) startProgress();
      if (pauseIndicator) pauseIndicator.classList.remove('show');
    }
  }

  // Touch / swipe support
  function handleTouchStart(e) {
    touchStartX = e.changedTouches ? e.changedTouches[0].screenX : e.screenX;
    isDragging = true;
  }
  function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    touchEndX = e.changedTouches ? e.changedTouches[0].screenX : e.screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { nextSlide(); resetSlideTimer(); }
      else { prevSlide(); resetSlideTimer(); }
    }
  }
  function handleTouchMove(e) {
    if (!isDragging) return;
    const currentX = e.changedTouches ? e.changedTouches[0].screenX : e.screenX;
    const diff = touchStartX - currentX;
    if (Math.abs(diff) > 10) {
      e.preventDefault();
    }
  }

  // Mouse drag support
  function handleMouseDown(e) {
    if (e.button !== 0) return;
    handleTouchStart(e);
  }
  function handleMouseUp(e) {
    handleTouchEnd(e);
  }
  function handleMouseMove(e) {
    if (!isDragging) return;
    handleTouchMove(e);
  }

  // Keyboard navigation
  function handleSliderKeydown(e) {
    if (document.activeElement && !heroSlider.contains(document.activeElement)) return;
    if (e.key === 'ArrowLeft') { prevSlide(); resetSlideTimer(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { nextSlide(); resetSlideTimer(); e.preventDefault(); }
  }

  if (slides.length > 1) {
    startSlideTimer();
    startProgress();
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetSlideTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetSlideTimer(); });
    dots.forEach(dot => {
      dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.index)); resetSlideTimer(); });
    });

    // Touch events
    heroSlider.addEventListener('touchstart', handleTouchStart, { passive: true });
    heroSlider.addEventListener('touchend', handleTouchEnd, { passive: true });
    heroSlider.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Mouse drag
    heroSlider.addEventListener('mousedown', handleMouseDown);
    heroSlider.addEventListener('mouseup', handleMouseUp);
    heroSlider.addEventListener('mousemove', handleMouseMove);
    heroSlider.addEventListener('mouseleave', () => { if (isDragging) { isDragging = false; } });

    // Hover pause
    heroSlider.addEventListener('mouseenter', () => { if (!prefersReduced) setPaused(true); });
    heroSlider.addEventListener('mouseleave', () => { if (!prefersReduced) setPaused(false); });

    // Keyboard
    document.addEventListener('keydown', handleSliderKeydown);
  } else if (slides.length === 1) {
    goToSlide(0);
  }

  // ===== SCROLL PROGRESS BAR =====
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progressBar.style.width = (scrollTop / scrollHeight) * 100 + '%';
    });
  }

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    navbar.classList.toggle('scrolled', currentScroll > 100);

    if (header) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        header.style.transform = '';
      } else {
        if (currentScroll > 150 && currentScroll > lastScroll) {
          header.style.transform = 'translateY(-36px)';
        } else {
          header.style.transform = 'translateY(0)';
        }
      }
    }
    lastScroll = currentScroll;
  });

  window.addEventListener('resize', () => {
    if (header && window.innerWidth <= 768) {
      header.style.transform = '';
    }
    if (window.innerWidth > 768) {
      document.body.classList.remove('mobile-menu-open');
      document.body.style.overflow = '';
      if (mobileDrawer) {
        mobileDrawer.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      }
      if (mobileDrawerOverlay) {
        mobileDrawerOverlay.classList.remove('active');
        mobileDrawerOverlay.setAttribute('aria-hidden', 'true');
      }
      if (navToggle) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // ===== SCROLL TO TOP =====
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== ACTIVE NAV LINK =====
  const navLinks = document.querySelectorAll('.nav-menu a:not(.nav-cta)');
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (currentPath === '/' && link.getAttribute('href') === '/') link.classList.add('active');
    else if (currentPath !== '/' && link.getAttribute('href') === currentPath) link.classList.add('active');
  });

  // ===== SMOOTH SCROLL FOR ANCHORS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
      }
    });
  });

  // ===== PREFERS REDUCED MOTION CHECK =====
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealCards = document.querySelectorAll('.service-card, .blog-card, .process-card, .stat-item');

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('revealed'));
    revealCards.forEach(el => el.style.opacity = '1');
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.06}s`;
      revealObserver.observe(el);
    });

    revealCards.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transitionDelay = `${i * 0.08}s`;
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            cardObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      cardObserver.observe(el);
    });
  }

  // ===== COUNTER ANIMATION =====
  const counterItems = document.querySelectorAll('.stat-number[data-target], .hsc-number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        if (isNaN(target)) return;
        let current = 0;
        const step = Math.ceil(target / 40);
        const duration = 1500;
        const interval = duration / (target / step);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
            const suffix = el.textContent.replace(/[0-9]/g, '');
            el.textContent = target + suffix;
          } else {
            const suffix = el.textContent.replace(/[0-9]/g, '');
            el.textContent = current + suffix;
          }
        }, interval);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterItems.forEach(el => counterObserver.observe(el));

  // ===== 3D TILT EFFECT ON SERVICE CARDS =====
  if (!prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  }

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ===== TOAST AUTO-DISMISS =====
  const toast = document.getElementById('formSuccess');
  if (toast) {
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 5000);
  }

  // ===== FORM PHONE FORMATTING =====
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', () => {
      let val = input.value.replace(/[^0-9]/g, '');
      if (val.length > 10) val = val.slice(0, 10);
      let formatted = '';
      for (let i = 0; i < val.length; i++) {
        if (i === 0) formatted += '(';
        if (i === 3) formatted += ') ';
        if (i === 6) formatted += ' ';
        if (i === 8) formatted += ' ';
        formatted += val[i];
      }
      input.value = formatted;
    });
  });

  // ===== PARALLAX ON CTA BANNER =====
  const ctaBanner = document.getElementById('ctaBanner');
  if (ctaBanner) {
    window.addEventListener('scroll', () => {
      const rect = ctaBanner.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.3;
        const offset = (window.innerHeight - rect.top) * speed;
        ctaBanner.style.backgroundPosition = `center ${offset}px`;
      }
    });
  }

});
