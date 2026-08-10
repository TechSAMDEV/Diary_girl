// COUNTER
function animateCounter() {
    let n = 0; const el = document.getElementById('counter');
    if (!el) return;
    const t = setInterval(() => { n += 3; if (n >= 250) { n = 250; clearInterval(t) } el.textContent = n }, 20);
}
const cEl = document.getElementById('counter');
if (cEl) {
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { animateCounter(); obs.disconnect() } }, { threshold: .3 });
    obs.observe(cEl);
}

// FADE-IN OBSERVER
const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-section').forEach(section => {
    fadeInObserver.observe(section);
});

// COUNTRIES
const countries = ['United Kingdom', 'United States', 'China', 'Russia', 'Canada', 'Ireland', 'Nigeria', 'Lithuania', 'Poland', 'Portugal', 'Netherlands', 'Germany'];
const ci = document.getElementById('countries-inner');
if (ci) {
    const full = [...countries, ...countries].map(c => `<span class="country-item">${c}</span><span class="country-sep">·</span>`).join('');
    ci.innerHTML = full + full;
}

// COUNTDOWN — runs from 1 August 2026, 00:00:00 to 1 September 2026, 00:59:59
const REG_START = new Date('2026-08-01T00:00:00');
const REG_CLOSE = new Date('2026-09-01T00:59:59');

function updateCountdown() {
    const now = new Date();
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');
    const noteEl = document.getElementById('countdown-note');
    if (!dEl) return;

    // Check if it hasn't started yet
    if (now < REG_START) {
        dEl.textContent = '0'; hEl.textContent = '0'; mEl.textContent = '0'; sEl.textContent = '0';
        if (noteEl) noteEl.textContent = 'Registration opens 1 August 2026 and closes 1 September 2026, 00:59 AM';
        return;
    }

    const diff = REG_CLOSE - now;
    if (diff <= 0) {
        dEl.textContent = '0'; hEl.textContent = '0'; mEl.textContent = '0'; sEl.textContent = '0';
        if (noteEl) noteEl.textContent = 'Registration is now closed';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    dEl.textContent = days;
    hEl.textContent = hours;
    mEl.textContent = mins;
    sEl.textContent = secs;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// CURRENCY
const RATES = { NGN: 1, USD: 1540, EUR: 1680, GBP: 1940 };
const SYMS = { NGN: '₦', USD: '$', EUR: '€', GBP: '£' };
let ACR = 'NGN';
function setCur(cur, btn) {
    ACR = cur;
    document.querySelectorAll('.cur-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const sym = SYMS[cur];
    document.querySelectorAll('.pc-price').forEach(el => {
        const ngn = parseInt(el.dataset.ngn || 0);
        const disc = parseInt(el.dataset.disc || 0);
        const n = parseInt(el.dataset.n || 0);
        const pv = el.querySelector('.pv');
        if (pv) pv.textContent = sym + Math.round((n > 0 ? disc : ngn) / RATES[cur]).toLocaleString();
    });
}

// CURRICULUM ACCORDION
function toggleCurr(card) {
    const open = card.classList.contains('open');
    document.querySelectorAll('.curr-card').forEach(c => c.classList.remove('open'));
    if (!open) card.classList.add('open');
}

// FAQ ACCORDION
function toggleFaq(btn) {
    const item = btn.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
}

// Automatically update copyright year
document.getElementById('current-year').textContent = new Date().getFullYear();


function scrollToCard(targetId) {
    const el = document.getElementById(targetId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}