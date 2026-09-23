
const menu=document.querySelector('.menu'),nav=document.querySelector('.main-nav');
const setMenuState=(open)=>{nav?.classList.toggle('open',open);menu?.setAttribute('aria-expanded',String(open));menu?.setAttribute('aria-label',open?'Menü schließen':'Menü');};
menu?.addEventListener('click',()=>setMenuState(!nav?.classList.contains('open')));
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>setMenuState(false)));
document.addEventListener('click',(e)=>{
  if(!nav?.classList.contains('open')) return;
  if(menu?.contains(e.target) || nav.contains(e.target)) return;
  setMenuState(false);
});
document.addEventListener('keydown',(e)=>{
  if(e.key==='Escape' && nav?.classList.contains('open')){
    setMenuState(false);
    menu?.focus();
  }
});



const modal = document.querySelector('.member-modal');
if (modal) {
  const modalImg = modal.querySelector('.member-modal-photo img');
  const modalPhoto = modal.querySelector('.member-modal-photo');
  const modalName = modal.querySelector('.member-modal-copy .name');
  const modalRole = modal.querySelector('.member-modal-copy .role');
  const modalText = modal.querySelector('.member-modal-copy .bio');
  const facts = modal.querySelector('.member-facts');
  const placeholderNote = modal.querySelector('.member-placeholder-note');
  const modalCard = modal.querySelector('.member-modal-card');
  const closeButton = modal.querySelector('.modal-close');
  let memberTrigger = null;

  const profiles = window.CAOTIX_MEMBER_PROFILES || {};
  const focusableInModal = () => [...modalCard.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.hasAttribute('hidden') && el.getClientRects().length);

  function openMember(key, trigger){
    const p = profiles[key];
    if(!p) return;
    memberTrigger = trigger || document.activeElement;
    modalImg.src = p.modalImg || p.img;
    modalImg.alt = p.name;
    if(modalPhoto) modalPhoto.classList.toggle('is-contain', p.modalFit === 'contain');
    modalName.textContent = p.name;
    modalRole.textContent = p.role;
    modalText.textContent = p.bio;
    facts.innerHTML = p.facts.map(([a,b]) => `<li><strong>${a}</strong><span>${b}</span></li>`).join('');
    if (placeholderNote) placeholderNote.hidden = !p.placeholder;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    modal.setAttribute('aria-hidden','false');
    closeButton?.focus();
  }

  function closeMember(){
    if(!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    modal.setAttribute('aria-hidden','true');
    if(memberTrigger instanceof HTMLElement && memberTrigger.isConnected) memberTrigger.focus();
    memberTrigger = null;
  }

  document.querySelectorAll('.member[data-member]').forEach(card => {
    card.setAttribute('tabindex','0');
    card.setAttribute('role','button');
    card.addEventListener('click',()=>openMember(card.dataset.member,card));
    card.addEventListener('keydown',(e)=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openMember(card.dataset.member,card); }
    });
  });

  closeButton?.addEventListener('click',closeMember);
  modal.addEventListener('click',(e)=>{ if(e.target===modal) closeMember(); });
  document.addEventListener('keydown',(e)=>{
    if(!modal.classList.contains('open')) return;
    if(e.key==='Escape'){ e.preventDefault(); closeMember(); return; }
    if(e.key!=='Tab') return;
    const focusable = focusableInModal();
    if(!focusable.length){ e.preventDefault(); modalCard.focus(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
  });
}


const releaseModal = document.querySelector('.release-modal');
if (releaseModal) {
  const modalCard = releaseModal.querySelector('.release-modal-card');
  const modalImg = releaseModal.querySelector('.release-modal-art img');
  const modalName = releaseModal.querySelector('.release-modal-name');
  const modalType = releaseModal.querySelector('.release-modal-type');
  const modalDate = releaseModal.querySelector('.release-modal-date');
  const modalDescription = releaseModal.querySelector('.release-modal-description');
  const modalTracks = releaseModal.querySelector('.release-modal-tracks');
  const modalLinks = releaseModal.querySelector('.release-modal-links');
  const closeButton = releaseModal.querySelector('.modal-close');
  let releaseTrigger = null;

  const profiles = window.CAOTIX_RELEASE_PROFILES || {};
  const focusableInModal = () => [...modalCard.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.hasAttribute('hidden') && el.getClientRects().length);
  const prettyDate = (value) => {
    if(!value) return '';
    const d = new Date(`${value}T00:00:00`);
    if(Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}).format(d);
  };

  function openRelease(key, trigger){
    const p = profiles[key];
    if(!p) return;
    releaseTrigger = trigger || document.activeElement;
    modalImg.src = p.cover;
    modalImg.alt = `${p.title} Cover`;
    modalName.textContent = p.title;
    modalType.textContent = p.type;
    modalDate.textContent = p.date ? prettyDate(p.date) : (p.dateLabel || p.badge || '');
    modalDate.hidden = !modalDate.textContent;
    modalDescription.textContent = p.description;
    modalDescription.hidden = !p.description;

    const showTracks = p.tracks.length > 1 || (p.type||'').toUpperCase()!=='SINGLE';
    modalTracks.innerHTML = showTracks ? p.tracks.map(t=>`<li>${t}</li>`).join('') : '';
    modalTracks.hidden = !showTracks || !p.tracks.length;

    const labels={presave:'PRE-SAVE',spotify:'SPOTIFY',youtube:'YOUTUBE',apple:'APPLE MUSIC',bandcamp:'BANDCAMP'};
    modalLinks.innerHTML = Object.entries(p.links||{}).filter(([,url])=>url).map(([key,url])=>`<a class="btn" href="${url}" target="_blank" rel="noopener">${labels[key]||key.toUpperCase()} ↗</a>`).join('');
    modalLinks.hidden = !modalLinks.innerHTML;

    releaseModal.classList.add('open');
    document.body.classList.add('modal-open');
    releaseModal.setAttribute('aria-hidden','false');
    closeButton?.focus();
  }

  function closeRelease(){
    if(!releaseModal.classList.contains('open')) return;
    releaseModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    releaseModal.setAttribute('aria-hidden','true');
    if(releaseTrigger instanceof HTMLElement && releaseTrigger.isConnected) releaseTrigger.focus();
    releaseTrigger = null;
  }

  document.querySelectorAll('.release-tile[data-release]').forEach(card => {
    card.setAttribute('tabindex','0');
    card.setAttribute('role','button');
    card.setAttribute('aria-label',`${card.querySelector('h2')?.textContent||'Release'} – Details öffnen`);
    card.addEventListener('click',()=>openRelease(card.dataset.release,card));
    card.addEventListener('keydown',(e)=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openRelease(card.dataset.release,card); }
    });
  });

  closeButton?.addEventListener('click',closeRelease);
  releaseModal.addEventListener('click',(e)=>{ if(e.target===releaseModal) closeRelease(); });
  document.addEventListener('keydown',(e)=>{
    if(!releaseModal.classList.contains('open')) return;
    if(e.key==='Escape'){ e.preventDefault(); closeRelease(); return; }
    if(e.key!=='Tab') return;
    const focusable=focusableInModal();
    if(!focusable.length){ e.preventDefault(); modalCard.focus(); return; }
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
  });
}


(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('motion-ready');

  
  const progress = document.createElement('div');
  progress.className = 'motion-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  const header = document.querySelector('.site-header');
  let ticking = false;
  const paintScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    header?.classList.toggle('is-scrolled', window.scrollY > 18);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(paintScroll); ticking = true; }
  }, {passive:true});
  paintScroll();

  if (reduced) return;

  
  const groups = [
    ['.section > .wrap > .black-tape, .section > .wrap > h2, .merch-headline, .merch-sub', 0],
    ['.scrap, .member, .story-scrap, .merch-card, .show', 70],
    ['.band-photo, .bio-sheet, .music-art, .music-sheet, .contact-sheet, .contact-aside, .live-board, .booking-note', 95],
    ['.next-show-inner > *', 65]
  ];

  const seen = new Set();
  groups.forEach(([selector, stagger]) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add('motion-reveal');
      const direction = i % 3;
      el.style.setProperty('--motion-x', direction === 0 ? '-18px' : direction === 2 ? '18px' : '0px');
      el.style.setProperty('--motion-y', direction === 1 ? '24px' : '16px');
      el.style.setProperty('--motion-rot', direction === 0 ? '-.45deg' : direction === 2 ? '.45deg' : '0deg');
      el.style.setProperty('--motion-delay', `${Math.min((i % 6) * stagger, 320)}ms`);
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -5% 0px'});
  seen.forEach(el => observer.observe(el));

  
  const hero = document.querySelector('.home-hero');
  const xCard = document.querySelector('.hero-right');
  if (hero && xCard && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width - .5) * 8;
      const dy = ((e.clientY - r.top) / r.height - .5) * 6;
      xCard.style.translate = `${dx}px ${dy}px`;
    }, {passive:true});
    hero.addEventListener('pointerleave', () => { xCard.style.translate = ''; });
  }

  
  document.querySelectorAll('a.btn, .footer-icon').forEach(el => {
    el.addEventListener('pointerdown', () => {
      el.animate([
        {transform:'translate(0,0)'},
        {transform:'translate(2px,-1px)'},
        {transform:'translate(-1px,1px)'}
      ], {duration:90, easing:'steps(2,end)'});
    });
  });
})();



(() => {
  const wrap = document.querySelector('[data-hard-glitch]');
  const img = wrap?.querySelector('.hero-logo-original');
  const canvas = wrap?.querySelector('.hero-logo-glitch-canvas');
  if (!wrap || !img || !canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const tintCanvas = document.createElement('canvas');
  const tintCtx = tintCanvas.getContext('2d', { alpha: true });
  if (!tintCtx) return;

  const rnd = (min, max) => min + Math.random() * (max - min);
  const rndi = (min, max) => Math.floor(rnd(min, max + 1));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let geometry = null;

  function syncCanvas() {
    const rect = img.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      tintCanvas.width = w;
      tintCanvas.height = h;
      geometry = null;
    }
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    return true;
  }

  function getGeometry() {
    if (geometry) return geometry;
    if (!syncCanvas()) return null;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1;
    const ih = img.naturalHeight || 1;
    const scale = Math.min(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = 0;
    const dy = (ch - dh) / 2;
    geometry = { cw, ch, dx, dy, dw, dh, iw, ih };
    return geometry;
  }

  function drawOriginal(g) {
    ctx.drawImage(img, 0, 0, g.iw, g.ih, g.dx, g.dy, g.dw, g.dh);
  }

  function sourceRect(g, x, y, w, h) {
    return {
      sx: ((x - g.dx) / g.dw) * g.iw,
      sy: ((y - g.dy) / g.dh) * g.ih,
      sw: (w / g.dw) * g.iw,
      sh: (h / g.dh) * g.ih,
    };
  }

  function drawLogoRegion(g, x, y, w, h, dx, dy) {
    const s = sourceRect(g, x, y, w, h);
    ctx.drawImage(img, s.sx, s.sy, s.sw, s.sh, dx, dy, w, h);
  }

  function buildTint(g, color) {
    tintCtx.clearRect(0, 0, tintCanvas.width, tintCanvas.height);
    tintCtx.globalCompositeOperation = 'source-over';
    tintCtx.drawImage(img, 0, 0, g.iw, g.ih, g.dx, g.dy, g.dw, g.dh);
    tintCtx.globalCompositeOperation = 'source-in';
    tintCtx.fillStyle = color;
    tintCtx.fillRect(g.dx, g.dy, g.dw, g.dh);
    tintCtx.globalCompositeOperation = 'source-over';
  }

  function drawTintRegion(g, color, x, y, w, h, dx, dy, alpha) {
    buildTint(g, color);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(tintCanvas, dx - x, dy - y);
    ctx.restore();
  }

  function drawGlitchFrame(strength = 1, phase = 0) {
    const g = getGeometry();
    if (!g) return;
    ctx.clearRect(0, 0, g.cw, g.ch);
    drawOriginal(g);

    const maxShift = g.dw * 0.05 * strength; 
    const colorOffset = (phase % 2 === 0 ? 4.5 : 3.5) * dpr;

    
    const slices = rndi(3, 4);
    for (let i = 0; i < slices; i++) {
      const sh = Math.max(5 * dpr, rnd(g.dh * 0.11, g.dh * 0.24));
      const sy = rnd(g.dy, Math.max(g.dy, g.dy + g.dh - sh));
      let shift = rnd(-maxShift, maxShift);
      if (Math.abs(shift) < 5 * dpr) shift = (shift < 0 ? -1 : 1) * rnd(5, Math.max(6, maxShift));

      ctx.clearRect(g.dx, sy, g.dw, sh);

      
      drawTintRegion(g, '#ff0a8a', g.dx, sy, g.dw, sh,
        g.dx + shift - colorOffset, sy, 0.58);
      drawTintRegion(g, '#42d9ff', g.dx, sy, g.dw, sh,
        g.dx + shift + colorOffset, sy, 0.52);

      
      ctx.save();
      ctx.beginPath();
      ctx.rect(g.dx, sy, g.dw, sh);
      ctx.clip();
      drawLogoRegion(g, g.dx, sy, g.dw, sh, g.dx + shift, sy);
      ctx.restore();
    }

    
    const tears = rndi(2, 3);
    for (let i = 0; i < tears; i++) {
      const sw = rnd(g.dw * 0.07, g.dw * 0.14);
      const sh = rnd(g.dh * 0.06, g.dh * 0.12);
      const sx = rnd(g.dx, Math.max(g.dx, g.dx + g.dw - sw));
      const sy = rnd(g.dy, Math.max(g.dy, g.dy + g.dh - sh));
      const shiftX = rnd(-maxShift * 0.58, maxShift * 0.58);
      const shiftY = rnd(-2.5, 2.5) * dpr;

      ctx.clearRect(sx, sy, sw, sh);
      drawTintRegion(g, '#ff0a8a', sx, sy, sw, sh,
        sx + shiftX - colorOffset * 0.8, sy + shiftY, 0.62);
      drawTintRegion(g, '#42d9ff', sx, sy, sw, sh,
        sx + shiftX + colorOffset * 0.8, sy + shiftY, 0.56);

      ctx.save();
      ctx.beginPath();
      ctx.rect(sx, sy, sw, sh);
      ctx.clip();
      drawLogoRegion(g, sx, sy, sw, sh, sx + shiftX, sy + shiftY);
      ctx.restore();
    }

    
    const dropouts = rndi(1, 2);
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < dropouts; i++) {
      const y = rnd(g.dy + g.dh * 0.08, g.dy + g.dh * 0.9);
      const hh = rnd(1.8, 4.0) * dpr;
      const x = rnd(g.dx, g.dx + g.dw * 0.2);
      const ww = rnd(g.dw * 0.38, g.dw * 0.72);
      ctx.fillRect(x, y, ww, hh);
    }
    ctx.restore();
  }

  let running = false;
  function burst() {
    if (running || document.hidden) return;
    running = true;
    wrap.classList.add('is-hard-glitching');

    const frames = [
      {t: 0,   s: 0.94},
      {t: 48,  s: 1.00},
      {t: 96,  s: 0.96},
      {t: 144, s: 1.00},
      {t: 190, s: 0.90}
    ];
    frames.forEach(({t, s}, i) => setTimeout(() => drawGlitchFrame(s, i), t));

    setTimeout(() => {
      wrap.classList.remove('is-hard-glitching');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      running = false;
    }, 235);
  }

  function loop() {
    const delay = rndi(3300, 6800);
    setTimeout(() => { burst(); loop(); }, delay);
  }

  const start = () => {
    syncCanvas();
    geometry = null;
    getGeometry();
    setTimeout(burst, 1300);
    loop();
  };

  if (img.complete && img.naturalWidth) start();
  else img.addEventListener('load', start, { once: true });

  window.addEventListener('resize', () => {
    syncCanvas();
    geometry = null;
    getGeometry();
  }, { passive: true });
})();

/* ===== CAOTIX EP EASTER-EGG CAMPAIGN LOADER =====
   Nach Kampagnenende diesen kompletten Block entfernen und anschließend
   /easter-eggs/ und /q4m7v/ löschen. /n8k2p/ (CTX) bleibt dauerhaft bestehen. */
(() => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'easter-eggs/easter-eggs.css';
  document.head.appendChild(css);

  const observer = document.createElement('script');
  observer.src = 'easter-eggs/observer.js';
  observer.onload = () => {
    const eggs = document.createElement('script');
    eggs.src = 'easter-eggs/easter-eggs.js';
    document.body.appendChild(eggs);
  };
  document.body.appendChild(observer);
})();
/* ===== END CAOTIX EP EASTER-EGG CAMPAIGN LOADER ===== */
