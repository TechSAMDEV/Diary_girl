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
        const yOffset = -50; // Negative moves it down; positive moves it up
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

        el.scrollIntoView({ behavior: 'smooth', block: 'start', top: "y"});
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);
  const indicatorsContainer = document.getElementById('carouselIndicators');
  let currentIndex = 0;

  // Touch / Drag variables
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;

  // Render Carousel Dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    indicatorsContainer.appendChild(dot);
  });

  const dots = Array.from(indicatorsContainer.children);

  function updateCarousel() {
    // Translate the track position
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active dot
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Pause all playing media when changing slides
    document.querySelectorAll('video, audio').forEach(media => media.pause());
    document.querySelectorAll('.mini-v-play').forEach(btn => btn.innerText = '▶');
  }

  window.moveCarousel = function(direction) {
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

  // --- Touch & Swipe Gesture Logic ---
  const container = document.getElementById('carouselTrackContainer');

  container.addEventListener('touchstart', touchStart);
  container.addEventListener('touchend', touchEnd);
  container.addEventListener('touchmove', touchMove);

  function touchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  }

  function touchMove(e) {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    
    // Slight drag feedback resistance
    if (Math.abs(diffX) > 10) {
      track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diffX}px))`;
    }
  }

  function touchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (diffX < -50) {
      moveCarousel(1); // Swipe left -> Next slide
    } else if (diffX > 50) {
      moveCarousel(-1); // Swipe right -> Prev slide
    } else {
      updateCarousel(); // Reset position if swipe threshold was not met
    }
  }
});

// --- Audio Player Toggle & Real-time Progress Fill ---
function toggleAudio(audioId, btn) {
  const audio = document.getElementById(audioId);
  const fill = document.getElementById(`fill-${audioId}`);
  const durLabel = document.getElementById(`dur-${audioId}`);

  if (audio.paused) {
    // Pause any other active audio
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

  // Sync progress bar fill dynamically
  audio.ontimeupdate = () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      if (fill) fill.style.width = `${pct}%`;
      
      // Update time display countdown
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