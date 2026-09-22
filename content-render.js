/* CAOTIX content renderer — normalerweise nicht bearbeiten. */
(() => {
  const C = window.CAOTIX_CONTENT || {};
  const currentYear = new Date().getFullYear();
  const dynamicText = value => String(value ?? '').replace(/\{YEAR\}/g, String(currentYear));
  const text = (el, value) => { if (el && value !== undefined && value !== null) el.textContent = dynamicText(value); };
  const htmlLines = value => dynamicText(value).replace(/\n/g, '<br>');
  const q = (sel) => document.querySelector(sel);
  const mailto = (email, subject = '', body = '') => {
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    return `mailto:${email}${params.length ? `?${params.join('&')}` : ''}`;
  };
  const fillTemplate = (value, replacements = {}) => Object.entries(replacements).reduce(
    (out, [key, replacement]) => String(out ?? '').replaceAll(`{${key}}`, replacement ?? ''),
    String(value ?? '')
  );
  const formatReleaseDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return String(value || '');
    const [year, month, day] = value.split('-');
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  // Global contact / social links
  const site = C.site || {};
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    const subject = a.href.includes('?') ? '?' + a.href.split('?')[1] : '';
    a.href = `mailto:${site.email || 'caotixband@gmail.com'}${subject}`;
  });
  document.querySelectorAll('.contact-mail').forEach(a => {
    a.href = `mailto:${site.email || 'caotixband@gmail.com'}`;
    a.textContent = `${site.email || 'caotixband@gmail.com'} ↗`;
  });
  document.querySelectorAll('.footer-copy').forEach(el => {
    const mark = el.querySelector('.copyright-mark');
    if (!mark) return;
    [...el.childNodes].filter(n => n !== mark).forEach(n => n.remove());
    el.append(document.createTextNode(` ${currentYear} ${site.footerText || 'CAOTIX'}`));
  });
  const setSocial = (label, url) => {
    let el = document.querySelector(`.footer-icon[aria-label="${label}"], .footer-icon[aria-label="${label} coming soon"]`);
    if (!el) return;

    if (url) {
      if (el.tagName !== 'A') {
        const a = document.createElement('a');
        a.className = el.className;
        a.innerHTML = el.innerHTML;
        el.replaceWith(a);
        el = a;
      }
      el.setAttribute('aria-label', label);
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener';
      el.removeAttribute('title');
    } else {
      if (el.tagName === 'A') {
        const span = document.createElement('span');
        span.className = el.className;
        span.innerHTML = el.innerHTML;
        el.replaceWith(span);
        el = span;
      }
      el.setAttribute('aria-label', `${label} coming soon`);
      el.setAttribute('title', `${label} coming soon`);
      el.removeAttribute('href');
      el.removeAttribute('target');
      el.removeAttribute('rel');
    }
  };
  setSocial('Instagram', site.instagram);
  setSocial('TikTok', site.tiktok);
  setSocial('YouTube', site.youtube);
  setSocial('Spotify', site.spotify);

  // Zentrale Meta-/Sharing-Daten im Browser anwenden.
  // Statische HTML-Fallbacks für Social-Crawler können über tools/sync-meta.js synchronisiert werden.
  const pageKey = (() => {
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return file === '' || file === 'index.html' ? 'index' : file.replace(/\.html$/, '');
  })();
  const meta = C.meta || {};
  const pageMeta = meta.pages?.[pageKey];
  const absoluteUrl = value => {
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    const base = String(site.baseUrl || '').replace(/\/$/, '');
    return `${base}/${String(value).replace(/^\//, '')}`;
  };
  const setMeta = (selector, attr, value) => {
    if (!value) return;
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  if (pageMeta) {
    if (pageMeta.title) document.title = pageMeta.title;
    setMeta('meta[name="description"]', 'content', pageMeta.description);
    setMeta('meta[property="og:title"]', 'content', pageMeta.title);
    setMeta('meta[property="og:description"]', 'content', pageMeta.description);
    setMeta('meta[name="twitter:title"]', 'content', pageMeta.title);
    setMeta('meta[name="twitter:description"]', 'content', pageMeta.description);
    setMeta('meta[property="og:site_name"]', 'content', meta.siteName || 'CAOTIX');
    setMeta('meta[property="og:locale"]', 'content', meta.locale || 'de_DE');
    const canonical = absoluteUrl(pageMeta.path || location.pathname);
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl && canonical) canonicalEl.href = canonical;
    setMeta('meta[property="og:url"]', 'content', canonical);
    const image = absoluteUrl(pageMeta.image || site.socialImage);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[name="twitter:image"]', 'content', image);
    setMeta('meta[property="og:image:alt"]', 'content', pageMeta.imageAlt || site.socialImageAlt);
  }

  // Home
  if (document.body && q('.home-hero')) {
    const H = C.home || {};
    text(q('.hero-kicker'), H.kicker);
    text(q('.hero-left .pink-tape'), H.tape);
    text(q('.hero-left > p'), H.intro);
    const buttons=q('.hero-cta')?.querySelectorAll('a');
    if(buttons?.[0] && H.primaryButton){ text(buttons[0],H.primaryButton.label); buttons[0].href=H.primaryButton.href; }
    if(buttons?.[1] && H.secondaryButton){ text(buttons[1],H.secondaryButton.label); buttons[1].href=H.secondaryButton.href; }
    // Release-Hero: nächster kommender Release, sonst zuletzt veröffentlichter Release.
    const releases = Array.isArray(C.music?.releases) ? C.music.releases.filter(r => r && r.title) : [];
    const releaseHero = H.releaseHero || {};
    const datedReleases = releases.map((r, index) => {
      const stamp = /^\d{4}-\d{2}-\d{2}$/.test(r.date || '') ? new Date(`${r.date}T00:00:00`) : null;
      return { release: r, stamp, index };
    });
    // Wenn bereits ein kommender Release eingetragen ist, wird immer der NÄCHSTE
    // kommende Release beworben. Gibt es keinen kommenden mehr, erscheint der
    // zuletzt veröffentlichte. So kann die ganze Release-Planung vorab eingetragen werden.
    const today = new Date(); today.setHours(0,0,0,0);
    const upcomingReleases = datedReleases
      .filter(x => x.release?.status === 'upcoming' || (x.stamp && x.stamp > today))
      .sort((a,b) => (a.stamp || Number.MAX_SAFE_INTEGER) - (b.stamp || Number.MAX_SAFE_INTEGER));
    const releasedReleases = datedReleases
      .filter(x => x.release?.status !== 'upcoming' && x.stamp && x.stamp <= today)
      .sort((a,b) => b.stamp - a.stamp);
    const undatedReleases = datedReleases
      .filter(x => x.release?.status !== 'upcoming' && !x.stamp)
      .sort((a,b) => b.index - a.index);
    const latestRelease = (upcomingReleases[0] || releasedReleases[0] || undatedReleases[0])?.release || null;
    const heroImg = q('.hero-x-card img');
    const heroCard = q('.hero-x-card');
    const heroSticker = q('.hero-sticker');
    const secondary = buttons?.[1];
    const formatShortDate = value => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return '';
      const [y,m,d] = value.split('-');
      return `${d}.${m}.${y}`;
    };
    const isUpcomingRelease = r => r?.status === 'upcoming' || (/^\d{4}-\d{2}-\d{2}$/.test(r?.date || '') && new Date(`${r.date}T00:00:00`) > today);
    const releaseLink = r => {
      if (r?.heroLink) return r.heroLink;
      const preferred = Array.isArray(releaseHero.preferredLinks) ? releaseHero.preferredLinks : ['presave','spotify','youtube','apple'];
      for (const key of preferred) if (r?.links?.[key]) return r.links[key];
      const first = Object.values(r?.links || {}).find(Boolean);
      return first || releaseHero.fallbackHref || 'music.html';
    };

    if (releaseHero.enabled !== false && latestRelease) {
      const upcoming = isUpcomingRelease(latestRelease);
      if (heroImg) {
        heroImg.src = latestRelease.cover || releaseHero.preReleaseImage || 'assets/xmark.webp';
        heroImg.alt = latestRelease.cover ? `${latestRelease.title} – CAOTIX` : (releaseHero.preReleaseAlt || 'CAOTIX X');
      }
      heroCard?.classList.toggle('has-release', !!latestRelease.cover);
      q('.hero-right')?.classList.toggle('has-release', !!latestRelease.cover);
      if (heroCard) {
        const coverTarget = releaseLink(latestRelease);
        heroCard.href = coverTarget;
        heroCard.setAttribute('aria-label', `${latestRelease.title || 'CAOTIX'} – Release details`);
        if (/^https?:\/\//i.test(coverTarget)) {
          heroCard.target = '_blank';
          heroCard.rel = 'noopener';
        } else {
          heroCard.removeAttribute('target');
          heroCard.removeAttribute('rel');
        }
      }
      if (heroSticker) {
        const hasReleaseDate = /^\d{4}-\d{2}-\d{2}$/.test(latestRelease.date || '');
        const tpl = upcoming
          ? (hasReleaseDate
              ? (releaseHero.upcomingSticker || 'COMING {DATE}\n{TITLE}')
              : (releaseHero.upcomingUndatedSticker || 'COMING SOON\n{TITLE}'))
          : (releaseHero.releasedSticker || 'OUT NOW\n{TITLE}');
        heroSticker.innerHTML = htmlLines(fillTemplate(tpl, {
          TITLE: latestRelease.title || '',
          DATE: hasReleaseDate ? formatShortDate(latestRelease.date) : ''
        }));
      }
      if (secondary) {
        text(secondary, latestRelease.heroButton || (upcoming ? releaseHero.upcomingButton : releaseHero.releasedButton) || releaseHero.fallbackButton || 'Music');
        const targetLink = releaseLink(latestRelease);
        secondary.href = targetLink;
        if (/^https?:\/\//i.test(targetLink)) { secondary.target='_blank'; secondary.rel='noopener'; }
        else { secondary.removeAttribute('target'); secondary.removeAttribute('rel'); }
      }

      // Auch die Music-Karte der Startseite nicht auf "currently recording" stehen lassen.
      const musicCard = q('.scrap.music');
      if (musicCard) {
        const data = H.cards?.music || {};
        text(musicCard.querySelector('.smallcaps, .pink-tape, .sticker'), upcoming ? 'NEXT RELEASE' : 'LATEST RELEASE');
        const titleEl = musicCard.querySelector('h3,.bigline');
        if (titleEl) titleEl.innerHTML = htmlLines(latestRelease.title || data.title || 'MUSIC');
        text(musicCard.querySelector('p'), latestRelease.description || `${latestRelease.type || 'Release'}${latestRelease.date ? ` · ${formatShortDate(latestRelease.date)}` : ''}`);
      }
    } else {
      if (heroImg) { heroImg.src = releaseHero.preReleaseImage || 'assets/xmark.webp'; heroImg.alt = releaseHero.preReleaseAlt || 'CAOTIX X'; }
      heroCard?.classList.remove('has-release');
      q('.hero-right')?.classList.remove('has-release');
      if (heroCard) {
        heroCard.href = 'music.html';
        heroCard.setAttribute('aria-label', 'CAOTIX Music');
        heroCard.removeAttribute('target');
        heroCard.removeAttribute('rel');
      }
      if (heroSticker) heroSticker.innerHTML = htmlLines(releaseHero.preReleaseSticker || H.sticker);
    }

    const items=Array.isArray(H.chaosStrip)?H.chaosStrip:[];
    if(items.length && q('.chaos-track')) q('.chaos-track').innerHTML=[...items,...items].map(x=>`<span>${dynamicText(x)}</span>`).join('');
    text(q('.section .black-tape'),H.sectionTape);
    const h2=q('.section h2'); if(h2){ h2.innerHTML=`${H.sectionHeadline || ''}<br><span class="pink">${H.sectionHeadlinePink || ''}</span>`; }
    const cards=H.cards||{};
    const setCard=(sel,data)=>{ const el=q(sel); if(!el||!data)return; text(el.querySelector('.smallcaps, .pink-tape, .sticker'),data.kicker||data.sticker); const h=el.querySelector('h3,.bigline'); if(h){ h.innerHTML=htmlLines(data.title); if(data.titlePink) h.innerHTML += `<span class=\"pink\">${data.titlePink}</span>`; } text(el.querySelector('p'),data.text); };
    setCard('.scrap.band',cards.band); setCard('.scrap.live',cards.live); if (!latestRelease || releaseHero.enabled === false) setCard('.scrap.music',cards.music); setCard('.scrap.members',cards.members); setCard('.scrap.merch',cards.merch); setCard('.scrap.contact-home',cards.contact);
  }

  // Band page
  if (q('.band-editorial')) {
    const B=C.band||{};
    text(q('.page-hero .pink-tape'),B.heroTape); text(q('.page-hero .page-tagline'),B.tagline);
    text(q('.bio-sheet .cutout'),B.introLabel);
    const bio=q('.bio-sheet'); if(bio){
      bio.querySelectorAll(':scope > p').forEach(x=>x.remove());
      const quote=bio.querySelector('.quote');
      (B.introParagraphs||[]).forEach(p=>{const e=document.createElement('p');e.textContent=p;bio.insertBefore(e,quote);});
      if(quote) quote.innerHTML=htmlLines(B.introQuote);
    }
    text(q('.story-section .black-tape'),B.storyTape);
    const h2=q('.story-section h2'); if(h2)h2.innerHTML=`${B.storyHeadline||''}<br><span class="pink">${B.storyHeadlinePink||''}</span>`;
    const root=q('.story-collage'); if(root && Array.isArray(B.stories)){
      root.innerHTML='';
      B.stories.forEach((s,i)=>{
        const a=document.createElement('article'); a.className=`story-scrap story-${['one','two','three','four'][i]||'one'}`;
        const title=document.createElement('h3'); title.className='story-title'; title.textContent=s.title||'';
        const p=document.createElement('p');
        if(s.boldStart && (s.text||'').startsWith(s.boldStart)){
          const strong=document.createElement('strong');strong.textContent=s.boldStart;p.append(strong,document.createTextNode((s.text||'').slice(s.boldStart.length)));
        } else p.textContent=s.text||'';
        a.append(title,p);
        if(s.stamp){const st=document.createElement('div');st.className='story-stamp';st.innerHTML=htmlLines(s.stamp);a.append(st);}
        root.append(a);
      });
    }
  }

  // Members page
  if (q('[data-members-root]')) {
    const M=C.membersPage||{}; text(q('.page-hero .pink-tape'),M.heroTape); text(q('.page-hero .page-tagline'),M.tagline);
    const root=q('[data-members-root]'); root.innerHTML='';
    (C.members||[]).forEach(m=>{
      const a=document.createElement('article');a.className=`member ${m.id||''}`;a.dataset.member=m.id;
      a.innerHTML=`<img src="${m.image}" alt="${m.name}" loading="lazy" decoding="async"><div class="member-label"><h3></h3><span></span></div>`;
      text(a.querySelector('h3'),m.name);text(a.querySelector('span'),m.role);root.append(a);
    });
    window.CAOTIX_MEMBER_PROFILES=Object.fromEntries((C.members||[]).map(m=>[m.id,{name:m.name,role:m.role,img:m.image,modalImg:m.modalImage||m.image,modalFit:m.modalFit||"cover",placeholder:!!m.placeholder,bio:m.bio,facts:m.facts||[]}]))
  }

  // Live labels
  if (q('[data-upcoming-shows]')) {
    const L=C.livePage||{};text(q('.page-hero .pink-tape'),L.heroTape);text(q('.page-hero .page-tagline'),L.tagline);
    const labels=document.querySelectorAll('.show-group-label');
    if(labels[0]){text(labels[0].querySelector('span'),L.upcomingLabel);text(labels[0].querySelector('small'),L.upcomingSmall)}
    if(labels[1]){text(labels[1].querySelector('span'),L.pastLabel);text(labels[1].querySelector('small'),L.pastSmall)}
  }

  // Music page
  if (q('[data-music-root]')) {
    const M=C.music||{};text(q('.page-hero .pink-tape'),M.heroTape);text(q('.page-hero .page-tagline'),M.tagline);
    const root=q('[data-music-root]');
    if(Array.isArray(M.releases) && M.releases.length){
      const releases=M.releases.filter(r=>r&&r.title);
      const now=new Date(); now.setHours(0,0,0,0);
      const parseReleaseDate=(value)=>{
        if(!value) return null;
        const d=new Date(`${value}T00:00:00`);
        return Number.isNaN(d.getTime())?null:d;
      };
      const isUpcoming=(r)=>{
        const d=parseReleaseDate(r.date);
        return r.status==='upcoming' || (!!d && d>now);
      };
      const upcoming=releases.filter(isUpcoming).sort((a,b)=>{
        const ad=parseReleaseDate(a.date),bd=parseReleaseDate(b.date);
        if(ad&&bd)return ad-bd;
        if(ad)return -1;if(bd)return 1;return 0;
      });
      const released=releases.filter(r=>!isUpcoming(r)).sort((a,b)=>{
        const ad=parseReleaseDate(a.date),bd=parseReleaseDate(b.date);
        if(ad&&bd)return bd-ad;
        if(ad)return -1;if(bd)return 1;return 0;
      });
      const nextUpcoming=upcoming[0]||null;
      const latestReleased=released[0]||null;
      const getBadge=(r)=>{
        if(r===nextUpcoming){
          if(r.dateLabel) return r.dateLabel;
          return r.date?`COMING ${formatReleaseDate(r.date)}`:'COMING SOON';
        }
        if(r===latestReleased) return 'OUT NOW';
        return '';
      };

      root.className='wrap release-wall'; root.innerHTML='';
      releases.forEach((r,index)=>{
        const card=document.createElement('article');card.className='release-tile';card.dataset.release=String(index);
        const badge=getBadge(r);
        const cover=r.cover||'assets/xmark.webp';
        card.innerHTML=`<img class="release-tile-cover" src="${cover}" alt="${r.title||'CAOTIX Release'}" loading="lazy" decoding="async"><div class="release-tile-shade"></div>${badge?`<span class="release-status">${badge}</span>`:''}<div class="release-tile-label"><span>${r.type||'RELEASE'}</span><h2>${r.title||''}</h2></div>`;
        root.append(card);
      });

      window.CAOTIX_RELEASE_PROFILES=Object.fromEntries(releases.map((r,index)=>[String(index),{
        title:r.title||'',type:r.type||'RELEASE',cover:r.cover||'assets/xmark.webp',description:r.description||'',
        date:r.date||'',dateLabel:r.dateLabel||'',tracks:Array.isArray(r.tracks)?r.tracks:[],links:r.links||{},badge:getBadge(r)
      }]));
    } else {
      root.className='wrap music-board';
      root.innerHTML=`<div class="music-art"><img alt="CAOTIX X" src="assets/xmark.webp" loading="lazy" decoding="async"></div><div class="music-sheet"><div class="cutout"></div><div class="big"></div></div>`;
      text(root.querySelector('.cutout'),M.recordingLabel);root.querySelector('.big').innerHTML=htmlLines(M.recordingHeadline);
      const sheet=root.querySelector('.music-sheet');(M.recordingParagraphs||[]).forEach(t=>{const p=document.createElement('p');p.textContent=t;sheet.append(p);});
    }
  }

  // Merch page
  if (q('[data-merch-show-notice]')) {
    const P=C.merchPage||{};
    text(q('.page-hero .pink-tape'),P.heroTape);
    text(q('.page-hero .page-tagline'),P.tagline);
    const mh=q('.merch-headline');
    if(mh){
      const headline=dynamicText(P.headline||'');
      const headlinePink=dynamicText(P.headlinePink||'');
      const spreadMatch=headline.match(/^(SPREAD)(\s+.*)?$/i);
      if(spreadMatch){
        const rest=spreadMatch[2]||'';
        mh.innerHTML=`<span class="decay-grow-trigger" data-decay-grow-trigger>${spreadMatch[1]}</span>${rest} <span class="pink">${headlinePink}</span>`;
      } else {
        mh.innerHTML=`${headline} <span class="pink">${headlinePink}</span>`;
      }
    }
    text(q('.merch-sub'),P.subline);

    const N=P.showNotice||{};
    const box=q('[data-merch-show-notice]');
    text(box.querySelector('.merch-order-label'),N.label);
    text(box.querySelector('.merch-order-headline'),N.headline);
    text(box.querySelector('.merch-order-text'),N.text);
    text(box.querySelector('.merch-show-note'),N.note);
    text(box.querySelector('.merch-order-button'),N.button||'LIVE-TERMINE');
  }

  // Contact page
  if (q('.contact-wrap')) {
    const K=C.contact||{};
    text(q('.page-hero .pink-tape'),K.heroTape);
    text(q('.page-hero .page-tagline'),K.tagline);
    text(q('.contact-sheet .black-tape'),K.label);
    const big=q('.contact-sheet .big');if(big)big.innerHTML=htmlLines(K.headline);
    text(q('.contact-intro'),K.intro);

    const B=K.booking||{};
    const booking=q('.booking-panel');
    if(booking){
      text(booking.querySelector('.contact-resource-kicker'),B.label||'BOOKING');
      text(booking.querySelector('h2'),B.headline);
      text(booking.querySelector('p'),B.text);
      const button=booking.querySelector('.booking-mail');
      if(button){
        button.textContent=B.button||'BOOKING ANFRAGE ↗';
        button.href=mailto(site.email||'caotixband@gmail.com',B.subject||'',B.body||'');
      }
    }

    const P=K.production||{};
    const production=q('.production-panel');
    if(production){
      text(production.querySelector('.contact-resource-kicker'),P.label);
      text(production.querySelector('h2'),P.headline);
      text(production.querySelector('p'),P.text);
      text(production.querySelector('.contact-resource-note'),P.note);
      const downloads=production.querySelector('.contact-downloads');
      if(downloads){
        const items=(P.downloads||[]).filter(item=>item&&item.href);
        downloads.innerHTML=items.map(item=>`<a class="contact-download" href="${item.href}" download><span class="contact-download-title">${item.label||'DOWNLOAD ↓'}</span><span class="contact-download-meta">${item.meta||''}</span></a>`).join('');
        downloads.hidden=!items.length;
      }
    }

    const R=K.press||{};
    const press=q('.press-panel');
    if(press){
      text(press.querySelector('.contact-resource-kicker'),R.label);
      text(press.querySelector('h2'),R.headline);
      text(press.querySelector('p'),R.text);
      const pressMail=press.querySelector('.press-mail');
      if(pressMail){
        pressMail.textContent=R.button||'PRESS ANFRAGE ↗';
        pressMail.href=mailto(site.email||'caotixband@gmail.com',R.subject||'',R.body||'');
      }
      const downloads=press.querySelector('.press-downloads');
      const items=(R.downloads||[]).filter(Boolean);
      if(downloads){
        downloads.innerHTML=items.map(item=>{
          if(item.href) return `<a class="contact-download${item.featured ? ' is-featured' : ''}" href="${item.href}" download><span class="contact-download-title">${item.label||'DOWNLOAD ↓'}</span><span class="contact-download-meta">${item.meta||''}</span></a>`;
          if(item.pending) return `<div class="press-pending-card" aria-disabled="true"><span class="contact-download-title">${item.label||'COMING SOON'}</span><span class="contact-download-meta">${item.meta||''}</span><span class="press-pending-mark">…</span></div>`;
          return '';
        }).join('');
        downloads.hidden=!items.length;
      }
      const pending=press.querySelector('.press-status');
      if(pending) text(pending,R.pendingText);
    }

    text(q('.general-contact .contact-resource-kicker'),K.generalLabel||'GENERAL CONTACT');
    const mail=q('.contact-mail');
    if(mail){
      mail.href=mailto(site.email||'caotixband@gmail.com',K.mailSubject||'',K.mailBody||'');
      mail.textContent=`${site.email||'caotixband@gmail.com'} ↗`;
    }
    const aside=q('.contact-aside .note');if(aside)aside.innerHTML=htmlLines(K.asideNote);
    text(q('.contact-aside > p'),K.asideText);
  }
})();
