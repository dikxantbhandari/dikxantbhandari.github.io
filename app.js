const header = document.querySelector('header');

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

const smoothScroll = (e) => {
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) return;
  e.preventDefault();
  const el = document.querySelector(href);
  if (!el || !header) return;
  const top = el.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8;
  window.scrollTo({ top, behavior: 'smooth' });
  if (mobileMenu && menuBtn) {
    mobileMenu.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
};

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', smoothScroll);
});

menuBtn?.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.toggle('hidden');
  menuBtn.setAttribute('aria-expanded', String(!isHidden));
});

const ids = ['#home', '#about', '#projects', '#contact'];
const sections = ids.map(id => document.querySelector(id)).filter(Boolean);
const links = Array.from(document.querySelectorAll('a[href^="#"]'))
  .filter(a => ids.includes(a.getAttribute('href')));

if (header && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        links.forEach(l => l.removeAttribute('aria-current'));
        const active = links.find(l => l.getAttribute('href') === id);
        active?.setAttribute('aria-current', 'page');
      }
    });
  }, { rootMargin: `-${header.offsetHeight + 8}px 0px -70% 0px`, threshold: 0.25 });

  sections.forEach(s => spy.observe(s));
}

const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const ob = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => ob.observe(el));
}

const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const emailOk = /^\S+@\S+\.\S+$/.test(data.email || '');
  if (!data.name || !emailOk || !data.message) {
    if (formMsg) {
      formMsg.textContent = 'Please fill out all fields with a valid email.';
      formMsg.classList.remove('hidden');
      formMsg.style.color = 'rgb(253 164 175)';
    }
    return;
  }
  if (formMsg) {
    formMsg.textContent = 'Thanks! I’ll get back to you soon.';
    formMsg.classList.remove('hidden');
    formMsg.style.color = 'rgb(110 231 183)';
  }
  form.reset();
});

const phrases = ['UI/UX designer', 'full-stack developer'];
const typedEl = document.getElementById('typed');

const TYPE_SPEED = 70;
const ERASE_SPEED = 45;
const HOLD_AFTER_TYPE = 1200;
const HOLD_AFTER_ERASE = 350;

let phraseIndex = 0;
let charIndex = 0;
let typing = true;

function tick() {
  if (!typedEl) return;
  const curr = phrases[phraseIndex];

  if (typing) {
    typedEl.textContent = curr.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === curr.length) {
      typing = false;
      setTimeout(tick, HOLD_AFTER_TYPE);
      return;
    }
    setTimeout(tick, TYPE_SPEED);
  } else {
    typedEl.textContent = curr.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      typing = true;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(tick, HOLD_AFTER_ERASE);
      return;
    }
    setTimeout(tick, ERASE_SPEED);
  }
}

if (typedEl) tick();
