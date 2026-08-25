document.getElementById('year').textContent = new Date().getFullYear();

// live clock
const clockEl = document.getElementById('liveClock');
function tickClock(){
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  clockEl.textContent = h+':'+m+':'+s+' IST';
}
tickClock();
setInterval(tickClock, 1000);

// nav scroll shadow + scroll-top button
const nav = document.getElementById('nav');
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 12);
  scrollTopBtn.classList.toggle('show', y > 600);
}, {passive:true});

// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const menuIcon = document.getElementById('menuIcon');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('mobile-open');
  menuIcon.innerHTML = open ? '<use href="#i-close"/>' : '<use href="#i-menu"/>';
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('mobile-open');
  menuIcon.innerHTML = '<use href="#i-menu"/>';
}));

// scroll reveal
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, {threshold:0.12, rootMargin:'0px 0px -60px 0px'});
revealEls.forEach((el, i) => {
  el.style.transitionDelay = (i % 5) * 70 + 'ms';
  io.observe(el);
});

// animated counters
const counters = document.querySelectorAll('.stat-num[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
}, {threshold:0.5});
counters.forEach(el => countIO.observe(el));

// lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('.gal-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector('img').alt;
    lightbox.classList.add('open');
  });
});
document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });