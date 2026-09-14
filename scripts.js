// COUNTER ANIMATION
function animateCounter() {
    let n = 0;
    const el = document.getElementById('counter');
    if (!el) return;
    const t = setInterval(() => {
        n += 3;
        if (n >= 250) {
            n = 250;
            clearInterval(t);
        }
        el.textContent = n;
    }, 20);
}

const cEl = document.getElementById('counter');
if (cEl) {
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateCounter();
            obs.disconnect();
        }
    }, { threshold: 0.3 });
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

// COUNTRIES MARQUEE STRIP
const countries = ['United Kingdom', 'United States', 'China', 'Russia', 'Canada', 'Ireland', 'Nigeria', 'Lithuania', 'Poland', 'Portugal', 'Netherlands', 'Germany'];
const ci = document.getElementById('countries-inner');
if (ci) {
    const full = [...countries, ...countries].map(c => `<span class="country-item">${c}</span><span class="country-sep">·</span>`).join('');
    ci.innerHTML = full + full;
}

// COUNTDOWN TIMER
const REG_START = new Date('2026-09-01T00:00:00');
const REG_CLOSE = new Date('2026-09-30T00:59:59');

function updateCountdown() {
    const now = new Date();
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');
    const noteEl = document.getElementById('countdown-note');
    if (!dEl) return;

    if (now < REG_START) {
        dEl.textContent = '0'; hEl.textContent = '0'; mEl.textContent = '0'; sEl.textContent = '0';
        if (noteEl) noteEl.textContent = 'Registration opens 1 September 2026 and closes 30 September 2026, 00:59 PM';
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

// CURRENCY CONVERSION SWITCHER
const RATES = { NGN: 1, USD: 1540, EUR: 1680, GBP: 1940 };
const SYMS = { NGN: '₦', USD: '$', EUR: '€', GBP: '£' };

function setCur(cur, btn) {
    document.querySelectorAll('.cur-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const sym = SYMS[cur] || '₦';

    document.querySelectorAll('.pc-price').forEach(el => {
        const ngn = parseInt(el.dataset.ngn || 0);
        const pv = el.querySelector('.pv');
        if (pv && ngn) {
            const converted = Math.round(ngn / RATES[cur]);
            pv.textContent = sym + converted.toLocaleString();
        }
    });
}

// ACCORDIONS
function toggleCurr(card) {
    const open = card.classList.contains('open');
    document.querySelectorAll('.curr-card').forEach(c => c.classList.remove('open'));
    if (!open) card.classList.add('open');
}

function toggleFaq(btn) {
    const item = btn.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
}

// COPYRIGHT YEAR
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// REVIEWS CAROUSEL & AUDIO/VIDEO SYNC
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    const slides = Array.from(track.children);
    const indicatorsContainer = document.getElementById('carouselIndicators');
    let currentIndex = 0;

    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        if (indicatorsContainer) indicatorsContainer.appendChild(dot);
    });

    const dots = indicatorsContainer ? Array.from(indicatorsContainer.children) : [];

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });

        document.querySelectorAll('video, audio').forEach(media => media.pause());
        document.querySelectorAll('.mini-v-play').forEach(btn => btn.innerText = '▶');
    }

    window.moveCarousel = function (direction) {
        currentIndex += direction;
        if (currentIndex < 0) {
            currentIndex = slides.length - 1;
        } else if (currentIndex >= slides.length) {
            currentIndex = 0;
        }
        updateCarousel();
    };

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // Touch & Swipe Logic
    const container = document.getElementById('carouselTrackContainer');
    if (!container) return;

    let startX = 0;
    let isDragging = false;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        if (Math.abs(diffX) > 10) {
            track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diffX}px))`;
        }
    });

    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX < -50) {
            moveCarousel(1);
        } else if (diffX > 50) {
            moveCarousel(-1);
        } else {
            updateCarousel();
        }
    });
});

// AUDIO PLAYER TOGGLE
function toggleAudio(audioId, btn) {
    const audio = document.getElementById(audioId);
    if (!audio) return;

    const fill = document.getElementById(`fill-${audioId}`);
    const durLabel = document.getElementById(`dur-${audioId}`);

    if (audio.paused) {
        document.querySelectorAll('audio').forEach(a => {
            if (a !== audio) {
                a.pause();
                const otherBtn = a.parentElement.querySelector('.mini-v-play');
                if (otherBtn) otherBtn.innerText = '▶';
            }
        });
        audio.play();
        btn.innerText = '❚❚';
    } else {
        audio.pause();
        btn.innerText = '▶';
    }

    audio.ontimeupdate = () => {
        if (audio.duration) {
            const pct = (audio.currentTime / audio.duration) * 100;
            if (fill) fill.style.width = `${pct}%`;

            const remainingSecs = Math.floor(audio.duration - audio.currentTime);
            const mins = Math.floor(remainingSecs / 60);
            const secs = Math.floor(remainingSecs % 60).toString().padStart(2, '0');
            if (durLabel) durLabel.innerText = `${mins}:${secs}`;
        }
    };

    audio.onended = () => {
        btn.innerText = '▶';
        if (fill) fill.style.width = '0%';
    };
}

// SLAB SWITCHER WIZARD & DEEP LINKING
function showSlab(targetId, event) {
    if (event) event.preventDefault();

    const allSlabs = document.querySelectorAll('.islab');
    allSlabs.forEach(slab => slab.classList.remove('active-slab'));

    const selectedSlab = document.getElementById(targetId);
    if (selectedSlab) {
        selectedSlab.classList.add('active-slab');
    }

    const allNavButtons = document.querySelectorAll('.slab-nav-btn');
    allNavButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('href') === `#${targetId}`) {
            btn.classList.add('active');
        }
    });

    history.pushState(null, null, `#${targetId}`);

    if (selectedSlab) {
        selectedSlab.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && document.getElementById(currentHash)) {
        showSlab(currentHash);
    } else {
        showSlab('group-1');
    }
});