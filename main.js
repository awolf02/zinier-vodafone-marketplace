document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initToggle();
  initLightbox();
  initVideoLightbox();
  initStickyNav();
});

/* ═══ Feature Carousel ═══ */
function initCarousel() {
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (!items.length) return;

  let currentIndex = 0;

  function showItem(index, direction) {
    // Collapse any expanded details when switching
    items[currentIndex].querySelector('.carousel-item__details')?.classList.remove('expanded');
    const toggleBtn = items[currentIndex].querySelector('.toggle-btn');
    if (toggleBtn) toggleBtn.textContent = 'Show more';

    items.forEach(item => {
      item.classList.remove('active', 'slide-left', 'slide-right');
    });

    currentIndex = ((index % items.length) + items.length) % items.length;
    const slideClass = direction === 'left' ? 'slide-left' : direction === 'right' ? 'slide-right' : '';
    items[currentIndex].classList.add('active');
    if (slideClass) items[currentIndex].classList.add(slideClass);
  }

  prevBtn?.addEventListener('click', () => showItem(currentIndex - 1, 'left'));
  nextBtn?.addEventListener('click', () => showItem(currentIndex + 1, 'right'));
}

/* ═══ Show More / Less Toggle ═══ */
function initToggle() {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const details = btn.previousElementSibling;
      if (!details) return;
      const isExpanded = details.classList.toggle('expanded');
      btn.textContent = isExpanded ? 'Show less' : 'Show more';
    });
  });
}

/* ═══ Image Lightbox ═══ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const img = lightbox.querySelector('.lightbox__img');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');

  let images = [];
  let currentIdx = 0;

  function open(imageList, startIndex) {
    images = imageList;
    currentIdx = startIndex;
    update();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function update() {
    img.src = images[currentIdx];
  }

  function prev() {
    currentIdx = (currentIdx - 1 + images.length) % images.length;
    update();
  }

  function next() {
    currentIdx = (currentIdx + 1) % images.length;
    update();
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Bind clickable elements
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const group = el.dataset.lightbox;
      const groupEls = Array.from(document.querySelectorAll(`[data-lightbox="${group}"]`));
      const imageList = groupEls.map(g => g.dataset.lightboxSrc);
      const startIndex = groupEls.indexOf(el);
      open(imageList, startIndex);
    });
  });
}

/* ═══ Video Lightbox ═══ */
function initVideoLightbox() {
  const lightbox = document.getElementById('videoLightbox');
  if (!lightbox) return;

  const iframe = document.getElementById('videoFrame');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  function open(url) {
    iframe.src = url;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    iframe.src = '';
  }

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
  });

  document.querySelectorAll('.video-card[data-video-url]').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.videoUrl;
      if (url) open(url);
    });
  });
}

/* ═══ Sticky Nav Scroll-to-Section ═══ */
function initStickyNav() {
  const nav = document.getElementById('sectionNav');
  if (!nav) return;

  const links = nav.querySelectorAll('a');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Update active link on scroll
  const sections = Array.from(links).map(link => ({
    link,
    target: document.querySelector(link.getAttribute('href'))
  })).filter(s => s.target);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = sections.find(s => s.target === entry.target);
        if (match) {
          links.forEach(l => l.classList.remove('active'));
          match.link.classList.add('active');
        }
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px' });

  sections.forEach(s => observer.observe(s.target));
}
