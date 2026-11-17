// Motion-система Snow Time: одна точка входа для всех страниц.
// Всё построено на transform/opacity/clip-path, чтобы не вызывать пересчёт вёрстки.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 760px)').matches;
const ease = 'expo.out';

function header() {
  const el = document.querySelector('[data-header]');
  if (!el) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    el.classList.toggle('is-solid', y > 40);
    el.classList.toggle('is-hidden', y > 500 && y > last && !document.documentElement.classList.contains('menu-open'));
    last = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const btn = document.querySelector('[data-menu-btn]');
  const nav = document.querySelector('[data-menu]');
  if (btn && nav) {
    const close = () => { document.documentElement.classList.remove('menu-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      const open = document.documentElement.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); btn.focus(); } });
  }
}

function hero() {
  const root = document.querySelector('[data-hero]');
  if (!root) return;
  const img = root.querySelector('[data-hero-img]');
  const lines = root.querySelectorAll('.split-line > span');
  const rest = root.querySelectorAll('[data-hero-rise]');
  const tl = gsap.timeline({ defaults: { ease } });
  if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 2.6, ease: 'power3.out' }, 0);
  tl.to(lines, { y: 0, duration: 1.4, stagger: 0.12 }, 0.25);
  tl.fromTo(rest, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.09 }, 0.9);

  // Глубина: фон уходит медленнее текста, сцена затемняется при выходе.
  if (img) gsap.to(img, { yPercent: mobile ? 8 : 16, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
  const inner = root.querySelector('[data-hero-inner]');
  if (inner && !mobile) gsap.to(inner, { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
}

function reveals() {
  // Заголовки по строкам
  document.querySelectorAll('[data-split]').forEach((block) => {
    if (block.closest('[data-hero]')) return;
    gsap.to(block.querySelectorAll('.split-line > span'), {
      y: 0, duration: 1.2, ease, stagger: 0.1,
      scrollTrigger: { trigger: block, start: 'top 85%', once: true },
    });
  });
  // Группы элементов
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease, stagger: 0.08 }),
  });
  // Масочное раскрытие фото
  document.querySelectorAll('.reveal-img').forEach((box) => {
    const img = box.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: box, start: 'top 82%', once: true } });
    tl.to(box, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.inOut' }, 0);
    if (img) tl.to(img, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.1);
  });
  // Параллакс
  if (!mobile) {
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const k = parseFloat(el.dataset.parallax) || 0.1;
      gsap.fromTo(el, { yPercent: k * 100 }, { yPercent: -k * 100, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }
}

function words() {
  // Редакционная сцена: текст «проявляется» по словам по мере прокрутки.
  document.querySelectorAll('[data-words]').forEach((el) => {
    const parts = el.textContent.trim().split(/\s+/);
    const full = el.textContent.trim();
    el.innerHTML = `<span class="sr-only">${full}</span>` + parts.map((w) => `<span aria-hidden="true" class="w">${w}</span>`).join(' ');
    gsap.fromTo(el.querySelectorAll('.w'), { opacity: 0.2 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 55%', scrub: true },
    });
  });
}

function counters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = parseFloat(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: to, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v); },
    });
  });
}

function route() {
  const root = document.querySelector('[data-route]');
  if (!root) return;
  const bar = root.querySelector('[data-route-bar]');
  const stops = root.querySelectorAll('[data-route-stop]');
  const st = { trigger: root, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 };
  if (bar) gsap.fromTo(bar, { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: st });
  stops.forEach((s, i) => {
    ScrollTrigger.create({
      trigger: root, start: () => `top+=${(i / stops.length) * root.offsetHeight * 0.6} 70%`,
      onEnter: () => s.classList.add('is-on'), onLeaveBack: () => s.classList.remove('is-on'),
    });
  });
}

function showAll() {
  document.querySelectorAll('[data-route-stop]').forEach((s) => s.classList.add('is-on'));
}

header();
if (reduced) {
  showAll();
} else {
  hero();
  reveals();
  words();
  counters();
  route();
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
