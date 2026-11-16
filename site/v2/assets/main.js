(() => {
  document.documentElement.classList.add('js');
  const burger = document.querySelector('.burger'), nav = document.getElementById('nav');
  const set = (o) => { nav.classList.toggle('open', o); burger.setAttribute('aria-expanded', String(o)); burger.setAttribute('aria-label', o ? 'Закрыть меню' : 'Открыть меню'); };
  burger.addEventListener('click', () => set(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  const els = document.querySelectorAll('.fade');
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
  els.forEach((el) => io.observe(el));
})();
