// ══════════════════════════════════════
// KAWAT — Modern JS (ES2024+)
// View Transitions, Intersection Observer, Web Animations API
// ══════════════════════════════════════

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ─── Header scroll effect ───
const header = $('#siteHeader');
const scrollObserver = () => {
  header.classList.toggle('scrolled', scrollY > 40);
};
addEventListener('scroll', scrollObserver, { passive: true });

// ─── Mobile nav ───
const menuBtn = $('#menuBtn');
const mobileNav = $('#mobileNav');

menuBtn?.addEventListener('click', () => {
  const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!isOpen));
  mobileNav.classList.toggle('open');
  mobileNav.setAttribute('aria-hidden', String(isOpen));
});

$$('.mobile-nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
  });
});

// ─── Search ───
const searchBtn = $('#searchBtn');
const searchOverlay = $('#searchOverlay');
const searchClose = $('#searchClose');
const searchInput = $('#searchInput');

searchBtn?.addEventListener('click', () => {
  searchOverlay.hidden = false;
  searchInput.focus();
});

searchClose?.addEventListener('click', () => {
  searchOverlay.hidden = true;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !searchOverlay.hidden) {
    searchOverlay.hidden = true;
  }
});

// ─── Animated counter ───
const animateCounter = (el) => {
  const target = parseFloat(el.dataset.target);
  const isDecimal = target % 1 !== 0;
  const duration = 2000;
  const startTime = performance.now();

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - (1 - progress) ** 4; // ease-out quart
    const current = target * eased;

    el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

// ─── Intersection Observer for animations ───
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counters
        if (entry.target.matches('[data-target]')) {
          animateCounter(entry.target);
          revealObserver.unobserve(entry.target);
        }
      }
    }
  },
  { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
);

// Observe sections
$$('.service-card, .stat-item, .about-text, .about-card, .info-item').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Observe counter elements
$$('[data-target]').forEach(el => revealObserver.observe(el));

// ─── Hero stats card counter ───
const heroNum = $('.amount-num');
if (heroNum) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        animateCounter(heroNum);
        heroObserver.disconnect();
      }
    },
    { threshold: 0.5 }
  );
  heroObserver.observe(heroNum);
}

// ─── Contact form ───
$('#contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = e.target.querySelector('.submit-btn');
  const originalHTML = btn.innerHTML;

  btn.innerHTML = '<span>تم الإرسال ✓</span>';
  btn.style.background = 'var(--green-light)';

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    e.target.reset();
  }, 2500);
});

// ─── Smooth scroll with offset ───
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = $(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
    const top = target.getBoundingClientRect().top + scrollY - offset;

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        scrollTo({ top, behavior: 'smooth' });
      });
    } else {
      scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Parallax on hero (subtle) ───
const heroSection = $('.hero');
if (heroSection && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addEventListener('scroll', () => {
    const y = scrollY;
    if (y < innerHeight) {
      const card = $('.stats-card');
      if (card) {
        card.style.transform = `translateY(${y * 0.12}px)`;
      }
    }
  }, { passive: true });
}

// ─── Init ───
scrollObserver();
