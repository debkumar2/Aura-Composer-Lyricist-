// ─── GSAP PLUGINS ───────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── LENIS SMOOTH SCROLL ─────────────────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if (target && target !== '#') {
            lenis.scrollTo(target, { offset: -80, duration: 1.6 });
            closeMobileMenu();
        }
    });
});

// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileOverlay = document.querySelector('.mobile-overlay');

function openMobileMenu() {
    hamburger?.classList.add('active');
    mobileOverlay?.classList.add('active');
    lenis.stop();
}
function closeMobileMenu() {
    hamburger?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    lenis.start();
}
hamburger?.addEventListener('click', () => {
    hamburger.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
});
mobileOverlay?.querySelector('.mobile-close')?.addEventListener('click', closeMobileMenu);

// ─── AMBIENT ORBS ────────────────────────────────────────────────────────────
document.querySelectorAll('.orb').forEach((orb, i) => {
    gsap.to(orb, { x: "random(-120,120)", y: "random(-120,120)", scale: "random(0.8,1.3)", duration: "random(10,18)", ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * -3 });
});

// ─── CUSTOM CURSOR + PARTICLE TRAIL ──────────────────────────────────────────
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, followerX = 0, followerY = 0;

const notes = ['♩','♪','♫','♬','𝄞','𝄢'];
let lastParticleTime = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const xOff = (e.clientX / window.innerWidth - 0.5) * 80;
    const yOff = (e.clientY / window.innerHeight - 0.5) * 80;
    gsap.to('.orb-1', { xPercent: xOff * 2, yPercent: yOff * 2, duration: 1.5, ease: "power2.out" });
    gsap.to('.orb-2', { xPercent: xOff * -1.5, yPercent: yOff * -1.5, duration: 2, ease: "power2.out" });
    gsap.to('.orb-3', { xPercent: xOff * 3, yPercent: yOff * 3, duration: 2.5, ease: "power2.out" });

    const now = Date.now();
    if (now - lastParticleTime > 120) {
        spawnNoteParticle(e.clientX, e.clientY);
        lastParticleTime = now;
    }
});

function spawnNoteParticle(x, y) {
    const p = document.createElement('div');
    p.className = 'note-particle';
    p.textContent = notes[Math.floor(Math.random() * notes.length)];
    p.style.cssText = `left:${x}px;top:${y}px;font-size:${12 + Math.random() * 14}px;`;
    document.body.appendChild(p);
    gsap.fromTo(p,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        { x: (Math.random() - 0.5) * 60, y: -60 - Math.random() * 40, opacity: 0, scale: 0.4, duration: 1.2, ease: "power2.out",
          onComplete: () => p.remove() }
    );
}

gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    gsap.set(cursor, { x: cursorX, y: cursorY });
    gsap.set(follower, { x: followerX, y: followerY });
});

document.querySelectorAll('a, button, .magnetic, .album-card, .bento-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        if (el.classList.contains('magnetic')) gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    });
});

document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const b = btn.getBoundingClientRect();
        const s = btn.dataset.strength || 20;
        gsap.to(btn, { x: ((e.clientX - b.left) / btn.offsetWidth - 0.5) * s, y: ((e.clientY - b.top) / btn.offsetHeight - 0.5) * s, duration: 0.7, ease: "power4.out" });
    });
});

// ─── SWIPER HERO ─────────────────────────────────────────────────────────────
const heroSwiper = new Swiper('.hero-swiper', {
    effect: 'creative',
    creativeEffect: { prev: { shadow: true, translate: ['-20%', 0, -1] }, next: { translate: ['100%', 0, 0] } },
    speed: 1400,
    autoplay: { delay: 5500, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    on: {
        slideChangeTransitionStart: function () {
            const chars = this.slides[this.activeIndex].querySelectorAll('.hero-title .char');
            if (chars.length) gsap.fromTo(chars, { y: 100, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.025, duration: 1.2, ease: "power4.out" });
        }
    }
});
heroSwiper.autoplay.stop();

const testimonialSwiper = new Swiper('.testimonial-swiper', {
    slidesPerView: 1, spaceBetween: 30, loop: true, speed: 800,
    autoplay: { delay: 4500, disableOnInteraction: false },
    pagination: { el: '.testimonial-pagination', clickable: true },
});

// ─── AUDIO VISUALIZER CANVAS ─────────────────────────────────────────────────
function initVisualizer() {
    const canvas = document.getElementById('visualizerCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, bars = 80, mouseInfluence = { x: 0.5, y: 0.5 };

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.parentElement.addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect();
        mouseInfluence.x = (e.clientX - r.left) / r.width;
        mouseInfluence.y = (e.clientY - r.top) / r.height;
    });

    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, w, h);
        t += 0.018;
        const barW = w / bars;
        for (let i = 0; i < bars; i++) {
            const norm = i / bars;
            const dist = Math.abs(norm - mouseInfluence.x);
            const mouseBoost = Math.max(0, 1 - dist * 3) * mouseInfluence.y * 0.6;
            const wave1 = Math.sin(norm * Math.PI * 4 + t) * 0.3;
            const wave2 = Math.sin(norm * Math.PI * 7 - t * 1.3) * 0.2;
            const wave3 = Math.cos(norm * Math.PI * 2 + t * 0.7) * 0.15;
            const raw = Math.abs(wave1 + wave2 + wave3) + mouseBoost + 0.05;
            const barH = Math.min(raw * h * 0.85, h * 0.9);

            const hue = 42 + norm * 30 + mouseInfluence.y * 20;
            const grd = ctx.createLinearGradient(0, h / 2 - barH / 2, 0, h / 2 + barH / 2);
            grd.addColorStop(0, `hsla(${hue}, 80%, 65%, 0.9)`);
            grd.addColorStop(0.5, `hsla(${hue + 15}, 90%, 55%, 1)`);
            grd.addColorStop(1, `hsla(${hue}, 80%, 65%, 0.9)`);

            ctx.fillStyle = grd;
            ctx.beginPath();
            const x = i * barW + barW * 0.15;
            const bw = barW * 0.7;
            const by = h / 2 - barH / 2;
            const r2 = Math.min(bw / 2, 4);
            ctx.roundRect(x, by, bw, barH, r2);
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ─── MINI PLAYER ─────────────────────────────────────────────────────────────
function initMiniPlayer() {
    const player = document.querySelector('.mini-player');
    const playBtn = document.querySelector('.mp-play');
    const bars = document.querySelectorAll('.mp-bar');
    if (!player || !playBtn) return;

    let playing = false;
    let animFrames = [];

    function animateBars() {
        bars.forEach((bar, i) => {
            const h = 8 + Math.random() * 24;
            bar.style.height = h + 'px';
        });
    }

    let interval;
    playBtn.addEventListener('click', () => {
        playing = !playing;
        playBtn.classList.toggle('active', playing);
        playBtn.innerHTML = playing
            ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
        if (playing) {
            interval = setInterval(animateBars, 150);
            bars.forEach(b => b.style.height = '8px');
        } else {
            clearInterval(interval);
            bars.forEach(b => b.style.height = '4px');
        }
    });

    // Reveal player after preloader
    setTimeout(() => {
        gsap.to(player, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    }, 1500);

    // Track progress bar drag
    const track = document.querySelector('.mp-progress-track');
    const fill = document.querySelector('.mp-progress-fill');
    if (track && fill) {
        let dragging = false;
        track.addEventListener('mousedown', (e) => { dragging = true; updateProgress(e); });
        document.addEventListener('mousemove', (e) => { if (dragging) updateProgress(e); });
        document.addEventListener('mouseup', () => { dragging = false; });
        function updateProgress(e) {
            const r = track.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
            fill.style.width = (pct * 100) + '%';
        }
    }
}

// ─── LYRICS MARQUEE ──────────────────────────────────────────────────────────
function initMarquee() {
    const tracks = document.querySelectorAll('.marquee-track');
    tracks.forEach((track, i) => {
        const speed = i % 2 === 0 ? 50 : -50;
        gsap.to(track, { xPercent: speed, duration: 20, ease: "none", repeat: -1, modifiers: { xPercent: gsap.utils.wrap(-100, 0) } });
    });
}

// ─── PROCESS TIMELINE ────────────────────────────────────────────────────────
function initTimeline() {
    const fill = document.querySelector('.process-line-fill');
    const track = document.querySelector('.process-line-track');
    const steps = document.querySelectorAll('.process-step');
    const dots = document.querySelectorAll('.process-dot');
    if (!fill || !track || !steps.length) return;

    // Dot positions (must match CSS top% values)
    const dotPositions = { 1: 5, 2: 25, 3: 45, 4: 65, 5: 85 };

    // Scroll-driven line fill — drives everything
    ScrollTrigger.create({
        trigger: '.process-section',
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress * 100; // 0-100%
            fill.style.height = progress + '%';

            // Activate dots when the line reaches them
            dots.forEach(dot => {
                const dotPos = dotPositions[dot.dataset.dot];
                if (progress >= dotPos) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            // Activate steps when the line reaches their corresponding dot
            steps.forEach(step => {
                const stepPos = dotPositions[step.dataset.step];
                if (progress >= stepPos) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        }
    });
}

// ─── PRELOADER ────────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    const statusTexts = ["CALIBRATING FREQUENCIES...", "WARMING UP TUBES...", "MASTERING AUDIO...", "READY."];
    let textObj = { value: 0 };
    gsap.to(textObj, { value: 3, duration: 0.5, snap: "value", ease: "none", onUpdate: () => { const el = document.getElementById('loaderText'); if(el) el.innerText = statusTexts[Math.round(textObj.value)]; } });

    let percentObj = { value: 0 };
    gsap.to(percentObj, { value: 100, duration: 0.5, ease: "power3.inOut", onUpdate: () => { const el = document.getElementById('loaderPercentage'); if(el) el.innerText = Math.round(percentObj.value) + '%'; } });

    // EQ bars animation
    const eqBars = document.querySelectorAll('.eq-bar');
    if (eqBars.length) {
        gsap.to(eqBars, { height: 'random(10, 60)', duration: 0.15, repeat: -1, yoyo: true, ease: "none", stagger: { each: 0.05, repeat: -1 } });
    }

    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(eqBars, { height: 0, opacity: 0, stagger: 0.04, duration: 0.3, ease: "power2.in" })
      .to('.preloader-content', { opacity: 0, duration: 0.4 }, "-=0.2")
      .to('.preloader-top', { y: '-100%', duration: 1.2, ease: "power4.inOut" }, "split")
      .to('.preloader-bottom', { y: '100%', duration: 1.2, ease: "power4.inOut" }, "split")
      .set('.preloader', { display: 'none' })
      .from('.hero-bg img', { scale: 1.4, duration: 2, ease: "power4.out" }, "-=1")
      .from('.navbar', { y: -80, opacity: 0, duration: 1, ease: "power3.out" }, "-=1.5");

    const splitTitles = new SplitType('.section-title, .hero-title', { types: 'chars, words' });

    const firstChars = document.querySelector('.swiper-slide-active .hero-title')?.querySelectorAll('.char');
    if (firstChars?.length) {
        tl.fromTo(firstChars, { y: 110, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.025, duration: 1.2, ease: "power4.out" }, "-=0.8");
    }
    tl.from('.scroll-indicator', { opacity: 0, duration: 1 }, "-=0.5")
      .call(() => {
          heroSwiper.autoplay.start();
          initScrollAnimations();
          initVisualizer();
          initMiniPlayer();
          initMarquee();
          initTimeline();
      });
});

// ─── SCROLL ANIMATIONS ───────────────────────────────────────────────────────
function initScrollAnimations() {
    // Section titles
    document.querySelectorAll('.section-title').forEach(title => {
        const chars = title.querySelectorAll('.char');
        gsap.from(chars, { scrollTrigger: { trigger: title, start: "top 80%" }, y: 100, opacity: 0, stagger: 0.02, duration: 1.2, ease: "power4.out" });
    });

    // Fade-ups
    document.querySelectorAll('.fade-up').forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: "top 85%" }, y: 55, opacity: 0, duration: 1, ease: "power3.out" });
    });

    // Image reveals
    document.querySelectorAll('.reveal-image').forEach(wrapper => {
        const img = wrapper.querySelector('img');
        const tl = gsap.timeline({ scrollTrigger: { trigger: wrapper, start: "top 80%" } });
        tl.to(wrapper, { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1.5, ease: "power4.inOut" })
          .from(img, { scale: 1.3, duration: 1.5, ease: "power4.inOut" }, "-=1.5")
          .from(wrapper.querySelectorAll('.bento-content, .card-info'), { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=1");
    });

    // Sticky studio cards
    document.querySelectorAll('.studio-card').forEach((card, i, arr) => {
        if (i === arr.length - 1) return;
        gsap.to(card, {
            scrollTrigger: { trigger: card, start: "top 15%", endTrigger: ".studio-cards-container", end: "bottom bottom", scrub: true },
            scale: 0.88, opacity: 0.4, ease: "none"
        });
    });

    // Award counters
    document.querySelectorAll('.counter').forEach(counter => {
        gsap.to(counter, { scrollTrigger: { trigger: counter, start: "top 85%" }, innerHTML: counter.dataset.target, duration: 2.2, snap: { innerHTML: 1 }, ease: "power2.out" });
    });

    // Bento image parallax hover
    document.querySelectorAll('.bento-item, .studio-card').forEach(item => {
        const img = item.querySelector('img');
        if (!img) return;
        const xTo = gsap.quickTo(img, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(img, "y", { duration: 0.6, ease: "power3.out" });
        item.addEventListener('mousemove', (e) => {
            const r = item.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.08);
            yTo((e.clientY - r.top - r.height / 2) * 0.08);
        });
        item.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });

    // Hero parallax
    gsap.to('.hero-bg img', {
        scrollTrigger: { trigger: '.hero', start: "top top", end: "bottom top", scrub: true },
        y: "22%", ease: "none"
    });

    // Award cards 3D tilt
    document.querySelectorAll('.award-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
            const y = ((e.clientY - r.top) / r.height - 0.5) * -20;
            gsap.to(card, { rotateY: x, rotateX: y, duration: 0.4, ease: "power2.out", transformPerspective: 600 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        });
    });

    // Kinetic lyrics section
    const lyricLines = document.querySelectorAll('.lyric-line');
    lyricLines.forEach((line, i) => {
        gsap.fromTo(line,
            { x: i % 2 === 0 ? '8%' : '-8%', opacity: 0 },
            { x: '0%', opacity: 1, duration: 1.2, ease: "power3.out",
              scrollTrigger: { trigger: line, start: 'top 85%' }
            }
        );
    });

}
