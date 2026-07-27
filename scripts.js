// COUNTER
function animateCounter() {
    let n = 0; const el = document.getElementById('counter');
    const t = setInterval(() => { n += 3; if (n >= 250) { n = 250; clearInterval(t) } el.textContent = n }, 20);
}
const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { animateCounter(); obs.disconnect() } }, { threshold: .3 });
const cEl = document.getElementById('counter'); if (cEl) obs.observe(cEl);

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

// COUNTDOWN — registration closes 12 August 2026, 11:59:59 PM
const REG_CLOSE = new Date('2026-08-12T23:59:59');
function updateCountdown() {
    const now = new Date();
    const diff = REG_CLOSE - now;
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const noteEl = document.getElementById('countdown-note');
    if (!dEl) return;
    if (diff <= 0) {
        dEl.textContent = '0'; hEl.textContent = '0'; mEl.textContent = '0';
        if (noteEl) noteEl.textContent = 'Registration is now closed';
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    dEl.textContent = days;
    hEl.textContent = hours;
    mEl.textContent = mins;
}
updateCountdown();
setInterval(updateCountdown, 60000);

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

// MODAL HANDLING
const payModalEl = document.getElementById('pay-modal');
const payModal = new bootstrap.Modal(payModalEl);
function openPayModal(label, price) {
    document.getElementById('m-sum').textContent = label;
    document.getElementById('m-price-val').textContent = price;
    payModal.show();
}
function handlePay() {
    const n = document.getElementById('pf-name').value.trim();
    const e = document.getElementById('pf-email').value.trim();
    const p = document.getElementById('pf-phone').value.trim();
    if (!n || !e || !p) { alert('Please fill in all fields.'); return; }
    alert('Redirecting to secure payment...\n\nReplace this with your Paystack or Flutterwave payment link.');
}