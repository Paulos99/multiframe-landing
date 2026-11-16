(() => {
  document.documentElement.classList.add('js');
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  const setOpen = (open) => { nav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); };
  burger.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  // появление со сдвигом: соседние элементы стартуют с шагом ~110 мс
  const items = [...document.querySelectorAll('.reveal')];
  const groups = new Map();
  items.forEach((el) => {
    const p = el.parentElement; const i = groups.get(p) || 0; groups.set(p, i + 1);
    el.style.setProperty('--d', `${Math.min(i, 5) * 110}ms`);
  });
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach((el) => io.observe(el));
})();
