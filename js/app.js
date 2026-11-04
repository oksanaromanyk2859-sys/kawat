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

// ─── Watch Carousel ───
const bannerWatch = $('#bannerWatch');
const carouselMover = $('#carouselMover');

if (carouselMover && bannerWatch) {
  // Click to show in banner
  carouselMover.addEventListener('click', (e) => {
    const item = e.target.closest('.carousel-item');
    if (!item) return;
    const src = item.dataset.src;
    if (!src) return;

    $$('.carousel-item').forEach(el => el.classList.remove('active'));
    $$(`[data-src="${src}"]`).forEach(el => el.classList.add('active'));

    bannerWatch.classList.add('switching');
    setTimeout(() => {
      bannerWatch.src = src;
      bannerWatch.classList.remove('switching');
    }, 300);

    $('#hero').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

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
