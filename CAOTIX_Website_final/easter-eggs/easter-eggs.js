(() => {
  const code = String.fromCharCode(99,116,120);
  const logoSequence = [99,116,120].map(n=>String.fromCharCode(n));
  const sequenceTimeout = 5000;
  let buffer = '';
  let logoStep = 0;
  let logoTimer = 0;
  let pointerStart = null;

  const openCtx = () => {
    buffer = '';
    logoStep = 0;
    window.clearTimeout(logoTimer);
    window.location.href = [110,56,107,50,112,47,105,110,100,101,120,46,104,116,109,108].map(n=>String.fromCharCode(n)).join('');
  };

  
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const target = event.target;
    const tag = target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) return;

    if (event.key.length !== 1) return;

    buffer = (buffer + event.key.toLowerCase()).slice(-code.length);
    if (buffer !== code) return;

    openCtx();
  });

  
  
  const wrap = document.querySelector('.home-hero [data-hard-glitch]');
  const img = wrap?.querySelector('.hero-logo-original');
  if (!wrap || !img) return;

  const resetLogoSequence = () => {
    logoStep = 0;
    window.clearTimeout(logoTimer);
    logoTimer = 0;
  };

  const armSequenceTimeout = () => {
    window.clearTimeout(logoTimer);
    logoTimer = window.setTimeout(resetLogoSequence, sequenceTimeout);
  };

  const getLogoLetterAtPoint = (clientX, clientY) => {
    const rect = img.getBoundingClientRect();
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    if (!rect.width || !rect.height || !naturalWidth || !naturalHeight) return null;

    
    
    const scale = Math.min(rect.width / naturalWidth, rect.height / naturalHeight);
    const paintedWidth = naturalWidth * scale;
    const paintedHeight = naturalHeight * scale;
    const paintedLeft = rect.left;
    const paintedTop = rect.top + (rect.height - paintedHeight) / 2;

    const x = (clientX - paintedLeft) / paintedWidth;
    const y = (clientY - paintedTop) / paintedHeight;
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;

    
    
    if (x >= 0.00 && x <= 0.19 && y >= 0.16 && y <= 0.88) return 'c';
    if (x >= 0.46 && x <= 0.64 && y >= 0.18 && y <= 0.88) return 't';
    if (x >= 0.66 && x <= 1.00 && y >= 0.00 && y <= 1.00) return 'x';
    return null;
  };

  const registerLogoLetter = (letter) => {
    const expected = logoSequence[logoStep];

    if (letter === expected) {
      logoStep += 1;
      armSequenceTimeout();

      if (logoStep === logoSequence.length) openCtx();
      return;
    }

    
    if (letter === 'c') {
      logoStep = 1;
      armSequenceTimeout();
    } else {
      resetLogoSequence();
    }
  };

  wrap.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }, { passive: true });

  wrap.addEventListener('pointerup', (event) => {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;

    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;

    
    if (Math.hypot(dx, dy) > 18) return;

    const letter = getLogoLetterAtPoint(event.clientX, event.clientY);
    if (letter) registerLogoLetter(letter);
    else if (logoStep) resetLogoSequence();
  }, { passive: true });

  wrap.addEventListener('pointercancel', () => {
    pointerStart = null;
  }, { passive: true });
})();



(() => {

  const style = document.createElement('style');
  style.textContent = `
    .x4a-layer{
      position:fixed;
      inset:0;
      z-index:120;
      pointer-events:none;
      overflow:hidden;
    }
    .x4a-note{
      position:absolute;
      left:50%;
      top:50%;
      width:min(430px,78vw);
      opacity:0;
      transform:translate(-50%,-185%) rotate(-8deg);
      filter:drop-shadow(0 20px 40px rgba(0,0,0,.56));
    }
    .x4a-note img{
      display:block;
      width:100%;
      height:auto;
      pointer-events:none;
      user-select:none;
      -webkit-user-drag:none;
    }
    .x4a-layer.is-active .x4a-note{
      animation:caotixX4A 4.35s cubic-bezier(.17,.77,.19,1) forwards;
    }
    @keyframes caotixX4A{
      0%{opacity:0;transform:translate(-50%,-190%) rotate(-9deg)}
      11%{opacity:1}
      29%{opacity:1;transform:translate(-50%,-50%) rotate(-4deg)}
      72%{opacity:1;transform:translate(-50%,-50%) rotate(-3deg)}
      100%{opacity:0;transform:translate(-50%,155vh) rotate(7deg)}
    }
    @media (prefers-reduced-motion: reduce){
      .x4a-layer.is-active .x4a-note{
        animation:caotixX4AReduced 4s linear forwards;
      }
      @keyframes caotixX4AReduced{
        0%{opacity:0;transform:translate(-50%,-165%) rotate(-8deg)}
        8%{opacity:1}
        25%{opacity:1;transform:translate(-50%,-50%) rotate(-4deg)}
        72%{opacity:1;transform:translate(-50%,-50%) rotate(-4deg)}
        100%{opacity:0;transform:translate(-50%,140vh) rotate(6deg)}
      }
    }
  `;
  document.head.appendChild(style);

  const layer = document.createElement('div');
  layer.className = 'x4a-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = `
    <div class="x4a-note" role="presentation">
      <img alt="" decoding="async">
    </div>
  `;
  document.body.appendChild(layer);
  const noteImg = layer.querySelector('img');
  const ensureNoteAsset = () => {
    if (noteImg && !noteImg.hasAttribute('src')) noteImg.src = 'easter-eggs/assets/easteregg-from-above.webp';
  };

  const codeLength = 3;
  const topThreshold = 6;
  let pushes = 0;
  let resetTimer = 0;
  let isPlaying = false;

  const atTop = () => (window.scrollY || window.pageYOffset || 0) <= topThreshold;
  const resetPushes = () => {
    pushes = 0;
    if (resetTimer) {
      window.clearTimeout(resetTimer);
      resetTimer = 0;
    }
  };
  const scheduleReset = () => {
    if (resetTimer) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      pushes = 0;
      resetTimer = 0;
    }, 2400);
  };

  const triggerNote = () => {
    if (isPlaying) return;
    ensureNoteAsset();
    isPlaying = true;
    window.CAOTIXObserver?.discover('From Above', 5750);
    resetPushes();
    layer.classList.remove('is-active');
    void layer.offsetWidth;
    layer.classList.add('is-active');
    window.setTimeout(() => {
      layer.classList.remove('is-active');
      isPlaying = false;
    }, 4450);
  };

  const registerPush = () => {
    if (isPlaying || !atTop()) return;
    pushes += 1;
    if (pushes === 1) ensureNoteAsset();
    scheduleReset();
    if (pushes >= codeLength) triggerNote();
  };

  const isTypingTarget = (target) => {
    const tag = target?.tagName?.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable;
  };

  let wheelArmed = true;
  let wheelIdleTimer = 0;
  const armWheelAfterGesture = () => {
    if (wheelIdleTimer) window.clearTimeout(wheelIdleTimer);
    wheelIdleTimer = window.setTimeout(() => {
      wheelArmed = true;
      wheelIdleTimer = 0;
    }, 320);
  };

  window.addEventListener('wheel', (event) => {
    if (isPlaying) return;

    
    
    armWheelAfterGesture();

    if (!atTop()) {
      if (event.deltaY > 3) resetPushes();
      wheelArmed = false;
      return;
    }

    if (event.deltaY < -3 && wheelArmed) {
      wheelArmed = false;
      registerPush();
    } else if (event.deltaY > 3) {
      wheelArmed = false;
      resetPushes();
    }
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key !== 'ArrowUp' || event.repeat || isTypingTarget(event.target)) return;
    if (!atTop()) {
      resetPushes();
      return;
    }
    registerPush();
  });

  
  
  
  let touchStartY = 0;
  let touchStartedAtTop = false;
  let touchX4AActive = false;
  const touchPushDistance = 54;

  window.addEventListener('touchstart', (event) => {
    if (isPlaying || event.touches.length !== 1) return;
    touchStartY = event.touches[0].clientY;
    touchStartedAtTop = atTop();
    touchX4AActive = false;
  }, { passive: true });

  window.addEventListener('touchmove', (event) => {
    if (!touchStartedAtTop || isPlaying || event.touches.length !== 1) return;
    const distance = event.touches[0].clientY - touchStartY;
    if (distance > 8 && atTop()) {
      touchX4AActive = true;
      
      
      event.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('touchend', (event) => {
    if (!touchStartedAtTop || isPlaying) return;
    const endY = event.changedTouches[0]?.clientY ?? touchStartY;
    const distance = endY - touchStartY;
    if (touchX4AActive && distance >= touchPushDistance && atTop()) {
      registerPush();
    } else if (distance < -18) {
      resetPushes();
    }
    touchStartedAtTop = false;
    touchX4AActive = false;
  }, { passive: true });

  window.addEventListener('touchcancel', () => {
    touchStartedAtTop = false;
    touchX4AActive = false;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (!atTop() && pushes) resetPushes();
  }, { passive: true });
})();



(() => {
  
  const style = document.createElement('style');
  style.textContent = `
    .x7b-layer{
      position:fixed;
      inset:0;
      z-index:119;
      pointer-events:none;
      overflow:hidden;
      opacity:0;
      visibility:hidden;
      background:
        linear-gradient(180deg, rgba(0,7,12,.68) 0%, rgba(0,12,19,.82) 27%, rgba(0,3,7,.94) 100%),
        radial-gradient(circle at 50% 118%, rgba(9,72,92,.24), transparent 50%),
        radial-gradient(circle at 50% -22%, rgba(78,144,162,.12), transparent 32%);
      backdrop-filter:blur(1.8px) saturate(.56) brightness(.38) hue-rotate(166deg) contrast(1.06);
      -webkit-backdrop-filter:blur(1.8px) saturate(.56) brightness(.38) hue-rotate(166deg) contrast(1.06);
    }
    .x7b-layer::before{
      content:"";
      position:absolute;
      left:-10%;
      top:-8%;
      width:120%;
      height:24%;
      opacity:.58;
      background:
        radial-gradient(ellipse at 50% 0%, rgba(138,199,213,.24) 0 7%, rgba(71,131,148,.16) 10%, transparent 32%),
        repeating-radial-gradient(ellipse at 50% 100%, transparent 0 18px, rgba(108,175,190,.14) 19px 22px, transparent 24px 40px);
      filter:blur(5px);
      transform:translateY(-48%) scaleY(.72);
    }
    .x7b-layer::after{
      content:"";
      position:absolute;
      inset:-16%;
      opacity:.3;
      background:
        repeating-linear-gradient(176deg, transparent 0 18px, rgba(130,191,203,.11) 20px 23px, transparent 26px 48px),
        repeating-linear-gradient(8deg, transparent 0 28px, rgba(37,84,101,.13) 31px 35px, transparent 38px 62px);
      filter:blur(10px);
      transform:translate3d(0,0,0);
    }
    .x7b-layer .x7b-depth{
      position:absolute;
      inset:0;
      background:
        linear-gradient(180deg, rgba(10,59,77,.05) 0%, rgba(5,48,63,.14) 21%, rgba(0,11,19,.54) 100%),
        radial-gradient(circle at 18% 24%, rgba(106,171,185,.05), transparent 16%),
        radial-gradient(circle at 78% 14%, rgba(119,184,197,.04), transparent 14%);
      opacity:0;
    }
    .x7b-layer.is-active .x7b-depth{
      animation:x7bDepth 5.1s ease-in-out forwards;
    }
    .x7b-layer.is-active{
      visibility:visible;
      animation:x7bLayer 5.1s ease-in-out forwards;
    }
    .x7b-layer.is-active::before{
      animation:x7bSurface 5.1s ease-in-out forwards;
    }
    .x7b-layer.is-active::after{
      animation:x7bCurrent 2.1s ease-in-out infinite alternate;
    }
    .x7b-copy{
      position:absolute;
      left:50%;
      top:50%;
      width:min(92vw,900px);
      transform:translate(-50%,-50%) rotate(-1deg);
      text-align:center;
      font-family:Georgia,"Times New Roman",serif;
      font-size:clamp(34px,6.2vw,78px);
      font-weight:900;
      line-height:.82;
      letter-spacing:-.025em;
      text-transform:uppercase;
      opacity:0;
      filter:url(#x7bRoughText) drop-shadow(0 7px 8px rgba(0,0,0,.78));
    }
    .x7b-copy-line{
      position:relative;
      display:block;
      width:max-content;
      max-width:100%;
      margin:0 auto;
      padding:.05em .12em .12em;
      color:transparent;
      -webkit-text-fill-color:transparent;
      background:
        radial-gradient(circle at 16% 27%, rgba(104,134,82,.62) 0 2.8%, transparent 7%),
        radial-gradient(circle at 68% 62%, rgba(79,112,68,.55) 0 2.3%, transparent 6.2%),
        radial-gradient(circle at 45% 19%, rgba(122,150,91,.28) 0 2.1%, transparent 6%),
        radial-gradient(circle at 83% 35%, rgba(86,117,73,.22) 0 1.8%, transparent 5.4%),
        repeating-linear-gradient(101deg, rgba(255,255,255,.20) 0 2px, rgba(110,98,84,.10) 3px 6px, rgba(255,255,255,.06) 7px 10px),
        linear-gradient(180deg,#e5dccb 0%,#d4c7b2 18%,#bda992 40%,#947f69 68%,#685847 100%);
      -webkit-background-clip:text;
      background-clip:text;
      -webkit-text-stroke:1.1px rgba(34,28,24,.82);
      text-shadow:
        -1px -1px 0 rgba(35,28,23,.44),
        2px 1px 0 rgba(23,18,15,.52),
        0 2px 0 rgba(52,42,34,.54),
        0 5px 8px rgba(0,0,0,.5),
        0 0 3px rgba(103,125,87,.16);
      transform-origin:center;
    }
    .x7b-copy-line:first-child{transform:rotate(-1.1deg) scaleX(1.03)}
    .x7b-copy-line:last-child{margin-top:.11em;transform:rotate(.8deg) scaleX(.97)}
    .x7b-copy-line::before,
    .x7b-copy-line::after{
      content:attr(data-text);
      position:absolute;
      inset:.05em .12em .12em;
      pointer-events:none;
      color:transparent;
      -webkit-text-fill-color:transparent;
    }
    .x7b-copy-line::before{
      -webkit-text-stroke:1.9px rgba(48,39,31,.48);
      filter:blur(.34px);
      opacity:.44;
      transform:translate(1px,2px);
    }
    .x7b-copy-line::after{
      -webkit-text-stroke:.95px rgba(72,102,58,.30);
      text-shadow:
        -2px 5px 0 rgba(61,94,50,.12),
        2px 7px 0 rgba(37,66,39,.10),
        4px 9px 6px rgba(26,48,29,.12);
      filter:blur(.42px);
      opacity:.34;
      transform:translateY(1px);
    }
    .x7b-layer.is-active .x7b-copy{
      animation:x7bCopy 5.1s ease-in-out forwards;
    }
    .x7b-shadow{
      position:absolute;
      width:var(--w);
      height:var(--h);
      left:var(--left);
      top:var(--top);
      border-radius:50% 46% 58% 42%;
      background:radial-gradient(ellipse at 50% 50%, rgba(0,0,0,.98) 0 34%, rgba(0,0,0,.86) 49%, rgba(0,0,0,.28) 70%, transparent 81%);
      filter:blur(var(--blur));
      opacity:0;
      transform:translate3d(var(--from),0,0) rotate(var(--rot));
      mix-blend-mode:multiply;
    }
    .x7b-layer.is-active .x7b-shadow{
      animation:x7bShadow var(--dur) ease-in-out var(--delay) forwards;
    }
    .x7b-vignette{
      position:absolute;
      inset:-4%;
      opacity:0;
      background:
        radial-gradient(ellipse at 50% 43%, transparent 0 27%, rgba(0,5,9,.18) 49%, rgba(0,2,5,.72) 79%, rgba(0,0,0,.93) 100%),
        linear-gradient(180deg, rgba(0,0,0,.12), rgba(0,0,0,.42));
      mix-blend-mode:multiply;
    }
    .x7b-layer.is-active .x7b-vignette{animation:x7bVignette 5.1s ease-in-out forwards}
    .x7b-figure{
      position:absolute;
      left:68%;
      top:46%;
      width:58px;
      height:158px;
      opacity:0;
      transform:translate(-50%,-50%) scale(.72);
      filter:blur(7px);
      background:linear-gradient(180deg,rgba(0,0,0,.94),rgba(0,0,0,.98));
      border-radius:45% 45% 32% 32%;
      box-shadow:0 0 34px rgba(0,0,0,.8);
    }
    .x7b-figure::before{
      content:"";
      position:absolute;
      left:50%;
      top:-31px;
      width:45px;
      height:49px;
      transform:translateX(-50%);
      border-radius:50%;
      background:rgba(0,0,0,.98);
    }
    .x7b-figure::after{
      content:"";
      position:absolute;
      left:-34px;
      right:-34px;
      top:36px;
      height:22px;
      border-radius:50%;
      background:rgba(0,0,0,.82);
      filter:blur(5px);
    }
    .x7b-layer.is-active .x7b-figure{animation:x7bFigure 5.1s ease-in-out forwards}
    .x7b-hand{
      position:absolute;
      left:58%;
      bottom:-28%;
      width:84px;
      height:180px;
      opacity:0;
      transform:translateX(-50%) rotate(-8deg);
      filter:blur(4px);
    }
    .x7b-hand::before{
      content:"";
      position:absolute;
      left:24px;
      bottom:0;
      width:38px;
      height:112px;
      background:linear-gradient(180deg,rgba(0,0,0,.84),rgba(0,0,0,.96));
      border-radius:22px 22px 14px 14px;
      box-shadow:0 0 26px rgba(0,0,0,.52);
    }
    .x7b-hand i{
      position:absolute;
      bottom:87px;
      width:13px;
      height:72px;
      background:rgba(0,0,0,.92);
      border-radius:9px 9px 5px 5px;
      transform-origin:bottom center;
    }
    .x7b-hand i:nth-child(1){left:10px;transform:rotate(-18deg);height:58px}
    .x7b-hand i:nth-child(2){left:26px;transform:rotate(-8deg);height:72px}
    .x7b-hand i:nth-child(3){left:42px;transform:rotate(2deg);height:78px}
    .x7b-hand i:nth-child(4){left:58px;transform:rotate(12deg);height:68px}
    .x7b-layer.is-active .x7b-hand{
      animation:x7bHand 5.1s ease-in-out forwards;
    }
    .x7b-plants{
      position:absolute;
      left:-3%;
      right:-3%;
      bottom:-2%;
      height:48%;
      opacity:0;
      filter:blur(.6px);
      transform-origin:50% 100%;
      mix-blend-mode:multiply;
    }
    .x7b-plant{
      position:absolute;
      bottom:-14px;
      left:var(--x);
      width:var(--w);
      height:var(--h);
      transform-origin:50% 100%;
      transform:rotate(var(--r));
      opacity:var(--o);
    }
    .x7b-plant::before,
    .x7b-plant::after{
      content:"";
      position:absolute;
      left:50%;
      bottom:0;
      width:100%;
      height:100%;
      transform-origin:50% 100%;
      background:linear-gradient(90deg,transparent 0 30%,rgba(0,0,0,.97) 43% 58%,transparent 70% 100%);
      border-radius:58% 42% 12% 12%;
      filter:blur(var(--b));
    }
    .x7b-plant::after{
      transform:translateX(-28%) rotate(calc(var(--bend) * -1));
      opacity:.72;
    }
    .x7b-plant::before{transform:translateX(-50%) rotate(var(--bend))}
    .x7b-layer.is-active .x7b-plants{animation:x7bPlantsIn 5.1s ease-in-out forwards}
    .x7b-layer.is-active .x7b-plant::before{animation:x7bPlantSway var(--spd) ease-in-out var(--pd) infinite alternate}
    .x7b-layer.is-active .x7b-plant::after{animation:x7bPlantSwayAlt calc(var(--spd) * 1.13) ease-in-out var(--pd) infinite alternate}
    .x7b-fog-shadow{
      position:absolute;
      width:var(--fw);
      height:var(--fh);
      left:var(--fx);
      top:var(--fy);
      border-radius:50%;
      background:radial-gradient(ellipse at center,rgba(0,0,0,.96) 0 22%,rgba(0,0,0,.72) 46%,rgba(0,0,0,.12) 73%,transparent 84%);
      filter:blur(var(--fb));
      opacity:0;
      mix-blend-mode:multiply;
      transform:translate3d(var(--ffrom),0,0) scale(.92);
    }
    .x7b-layer.is-active .x7b-fog-shadow{animation:x7bFogShadow var(--fdur) ease-in-out var(--fdelay) forwards}
    .x7b-bubble{
      position:absolute;
      bottom:-52px;
      width:var(--size);
      height:var(--size);
      left:var(--left);
      border-radius:50%;
      border:1.5px solid rgba(214,248,255,.82);
      background:radial-gradient(circle at 34% 30%, rgba(255,255,255,.44) 0 18%, rgba(190,236,245,.12) 22%, rgba(181,232,244,.02) 56%, transparent 68%);
      box-shadow:inset -2px -2px 7px rgba(0,0,0,.16), inset 2px 2px 5px rgba(255,255,255,.28), 0 0 8px rgba(194,240,252,.22);
      opacity:0;
    }
    .x7b-layer.is-active .x7b-bubble{
      animation:x7bBubble var(--duration) ease-in var(--delay) forwards;
    }
    @keyframes x7bLayer{
      0%{opacity:0}
      14%{opacity:1}
      78%{opacity:1}
      100%{opacity:0}
    }
    @keyframes x7bSurface{
      0%{transform:translateY(-56%) scaleY(.66);opacity:.1}
      21%{transform:translateY(-4%) scaleY(.9);opacity:.9}
      42%{transform:translateY(4%) scaleY(.96);opacity:.96}
      75%{transform:translateY(10%) scaleY(1);opacity:.88}
      100%{transform:translateY(-34%) scaleY(.72);opacity:.06}
    }
    @keyframes x7bCurrent{
      from{transform:translate3d(-2.5%,0,0) skewY(-.75deg) scale(1.02)}
      to{transform:translate3d(2.5%,1.2%,0) skewY(.75deg) scale(1.04)}
    }
    @keyframes x7bDepth{
      0%,18%{opacity:0}
      28%{opacity:.72}
      76%{opacity:.8}
      100%{opacity:0}
    }
    @keyframes x7bCopy{
      0%,23%{opacity:0;transform:translate(-50%,-45%) rotate(-2deg) scale(.985)}
      34%{opacity:1;transform:translate(-50%,-50%) rotate(-1deg) scale(1)}
      54%{opacity:.94;transform:translate(-49.4%,-50.4%) rotate(-1.6deg) scale(1.012)}
      75%{opacity:1;transform:translate(-50.5%,-49.5%) rotate(-.6deg) scale(.998)}
      90%,100%{opacity:0;transform:translate(-50%,-56%) rotate(-1.8deg) scale(.99)}
    }
    @keyframes x7bShadow{
      0%,14%{opacity:0}
      28%{opacity:.18}
      45%{opacity:.56;transform:translate3d(0,1.5vh,0) rotate(var(--rot))}
      63%{opacity:.25}
      82%,100%{opacity:0;transform:translate3d(var(--to),4vh,0) rotate(calc(var(--rot) + 5deg))}
    }
    @keyframes x7bVignette{
      0%,14%{opacity:0}
      28%{opacity:.64}
      52%{opacity:.82}
      78%{opacity:.75}
      100%{opacity:0}
    }
    @keyframes x7bFigure{
      0%,30%{opacity:0;transform:translate(-50%,-48%) scale(.68)}
      43%{opacity:.08}
      55%{opacity:.2;transform:translate(-50%,-50%) scale(.79)}
      66%{opacity:.1}
      75%,100%{opacity:0;transform:translate(-50%,-53%) scale(.86)}
    }
    @keyframes x7bHand{
      0%,56%{opacity:0;transform:translateX(-50%) translateY(24px) rotate(-8deg)}
      66%{opacity:.34}
      72%{opacity:.58;transform:translateX(-50%) translateY(-72px) rotate(-5deg)}
      77%{opacity:.22}
      83%,100%{opacity:0;transform:translateX(-50%) translateY(-122px) rotate(2deg)}
    }
    @keyframes x7bPlantsIn{
      0%,20%{opacity:0;transform:translateY(12%) scaleY(.9)}
      34%{opacity:.5}
      58%{opacity:.86;transform:translateY(0) scaleY(1)}
      82%{opacity:.72}
      100%{opacity:0;transform:translateY(5%) scaleY(.96)}
    }
    @keyframes x7bPlantSway{
      from{transform:translateX(-50%) rotate(calc(var(--bend) - 5deg)) skewX(-2deg)}
      to{transform:translateX(-50%) rotate(calc(var(--bend) + 7deg)) skewX(3deg)}
    }
    @keyframes x7bPlantSwayAlt{
      from{transform:translateX(-28%) rotate(calc((var(--bend) * -1) - 7deg))}
      to{transform:translateX(-28%) rotate(calc((var(--bend) * -1) + 4deg))}
    }
    @keyframes x7bFogShadow{
      0%,12%{opacity:0}
      28%{opacity:.12}
      48%{opacity:.42;transform:translate3d(0,2vh,0) scale(1)}
      66%{opacity:.22}
      84%,100%{opacity:0;transform:translate3d(var(--fto),5vh,0) scale(1.08)}
    }
    @keyframes x7bBubble{
      0%{transform:translate3d(0,0,0) scale(.62);opacity:0}
      10%{opacity:.88}
      72%{opacity:.62}
      100%{transform:translate3d(var(--drift),-122vh,0) scale(1.18);opacity:0}
    }
    @media (prefers-reduced-motion:reduce){
      .x7b-layer.is-active{animation:x7bLayerReduced 4.4s linear forwards}
      .x7b-layer.is-active::before,.x7b-layer.is-active::after{animation:none}
      .x7b-layer.is-active .x7b-copy{animation:x7bCopyReduced 4.4s linear forwards}
      .x7b-layer.is-active .x7b-bubble{animation:none}
      .x7b-layer.is-active .x7b-depth{animation:none;opacity:.38}
      .x7b-layer.is-active .x7b-shadow,.x7b-layer.is-active .x7b-hand,.x7b-layer.is-active .x7b-figure,.x7b-layer.is-active .x7b-fog-shadow,.x7b-layer.is-active .x7b-plants{animation:none;opacity:0}
      .x7b-layer.is-active .x7b-vignette{animation:none;opacity:.5}
      @keyframes x7bLayerReduced{0%{opacity:0} 15%{opacity:1} 82%{opacity:1} 100%{opacity:0}}
      @keyframes x7bCopyReduced{0%,22%{opacity:0} 32%,76%{opacity:1} 90%,100%{opacity:0}}
    }
  `;
  document.head.appendChild(style);

  let layer=null;
  const ensureDrownedScene=()=>{
    if(layer) return layer;
    layer=document.createElement('div');
    layer.className='x7b-layer';
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML=`
    <svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
      <filter id="x7bRoughText" x="-12%" y="-20%" width="124%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.075 0.19" numOctaves="3" seed="41" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>
    <div class="x7b-depth"></div>
    <div class="x7b-vignette"></div>
    <div class="x7b-figure"></div>
    <i class="x7b-shadow" style="--w:38vw;--h:19vw;--left:-15vw;--top:32%;--blur:18px;--from:-18vw;--to:88vw;--rot:-9deg;--dur:4.7s;--delay:.2s"></i>
    <i class="x7b-shadow" style="--w:26vw;--h:15vw;--left:78vw;--top:57%;--blur:22px;--from:18vw;--to:-95vw;--rot:12deg;--dur:4.3s;--delay:.6s"></i>
    <i class="x7b-shadow" style="--w:18vw;--h:11vw;--left:19vw;--top:72%;--blur:16px;--from:-14vw;--to:66vw;--rot:4deg;--dur:3.8s;--delay:1.05s"></i>
    <i class="x7b-shadow" style="--w:44vw;--h:12vw;--left:-26vw;--top:18%;--blur:28px;--from:-12vw;--to:94vw;--rot:3deg;--dur:4.9s;--delay:.75s"></i>
    <i class="x7b-shadow" style="--w:32vw;--h:18vw;--left:84vw;--top:76%;--blur:26px;--from:10vw;--to:-92vw;--rot:-6deg;--dur:4.6s;--delay:1.15s"></i>
    <i class="x7b-fog-shadow" style="--fw:54vw;--fh:26vw;--fx:-18vw;--fy:46%;--fb:34px;--ffrom:-18vw;--fto:74vw;--fdur:5s;--fdelay:.1s"></i>
    <i class="x7b-fog-shadow" style="--fw:42vw;--fh:21vw;--fx:72vw;--fy:24%;--fb:30px;--ffrom:12vw;--fto:-88vw;--fdur:4.6s;--fdelay:.45s"></i>
    <i class="x7b-fog-shadow" style="--fw:30vw;--fh:17vw;--fx:38vw;--fy:64%;--fb:24px;--ffrom:-8vw;--fto:46vw;--fdur:4.2s;--fdelay:.9s"></i>
    <div class="x7b-plants">
      ${[
        ['2%','18px','40%','-8deg','.92','2.7s','.1s','1.1px','12deg'],['8%','13px','29%','7deg','.76','2.2s','.3s','1.4px','8deg'],
        ['15%','20px','46%','-4deg','.86','3.1s','.2s','1px','16deg'],['22%','12px','25%','12deg','.65','2.5s','.6s','1.6px','9deg'],
        ['31%','17px','38%','-9deg','.78','2.8s','.4s','1.3px','13deg'],['39%','14px','30%','6deg','.69','2.3s','.7s','1.5px','10deg'],
        ['48%','21px','49%','-6deg','.9','3.2s','.15s','1px','17deg'],['57%','15px','33%','11deg','.72','2.4s','.5s','1.4px','11deg'],
        ['66%','19px','44%','-7deg','.83','3s','.25s','1.1px','15deg'],['74%','11px','27%','8deg','.61','2.1s','.65s','1.7px','8deg'],
        ['82%','18px','39%','-10deg','.79','2.9s','.35s','1.2px','14deg'],['91%','14px','31%','5deg','.7','2.5s','.55s','1.5px','10deg'],
        ['97%','20px','43%','-5deg','.84','3.15s','.2s','1.1px','16deg']
      ].map(([x,w,h,r,o,spd,pd,b,bend])=>`<i class="x7b-plant" style="--x:${x};--w:${w};--h:${h};--r:${r};--o:${o};--spd:${spd};--pd:${pd};--b:${b};--bend:${bend}"></i>`).join('')}
    </div>
    <div class="x7b-hand"><i></i><i></i><i></i><i></i></div>
    <div class="x7b-copy">
      <span class="x7b-copy-line" data-text="THE WATER KEEPS">THE WATER KEEPS</span>
      <span class="x7b-copy-line" data-text="WHAT IT TAKES.">WHAT IT TAKES.</span>
    </div>
    ${[
      ['4%','10px','4.6s','.18s','18px'],['9%','18px','5.4s','.72s','-16px'],['15%','8px','4.2s','1.34s','11px'],
      ['21%','14px','5s','.4s','-10px'],['27%','11px','4.7s','1.08s','15px'],['33%','22px','5.8s','.22s','-18px'],
      ['39%','9px','4.4s','.94s','14px'],['46%','16px','5.2s','.58s','-12px'],['52%','12px','4.9s','1.22s','10px'],
      ['58%','20px','5.6s','.3s','-17px'],['64%','8px','4.1s','.86s','12px'],['70%','17px','5.1s','1.1s','-13px'],
      ['76%','10px','4.5s','.16s','9px'],['82%','24px','5.9s','.64s','-19px'],['88%','13px','4.8s','1.28s','13px'],
      ['93%','19px','5.3s','.48s','-11px']
    ].map(([left,size,duration,delay,drift])=>`<i class="x7b-bubble" style="--left:${left};--size:${size};--duration:${duration};--delay:${delay};--drift:${drift}"></i>`).join('')}
    `;
    document.body.appendChild(layer);
    return layer;
  };

  const needed=3;
  const bottomThreshold=8;
  let pushes=0;
  let resetTimer=0;
  let isPlaying=false;

  const atBottom=()=>{
    const doc=document.documentElement;
    const max=Math.max(0,doc.scrollHeight-window.innerHeight);
    return (window.scrollY || window.pageYOffset || 0) >= max-bottomThreshold;
  };
  const resetPushes=()=>{
    pushes=0;
    if(resetTimer){ window.clearTimeout(resetTimer); resetTimer=0; }
  };
  const scheduleReset=()=>{
    if(resetTimer) window.clearTimeout(resetTimer);
    resetTimer=window.setTimeout(()=>{ pushes=0; resetTimer=0; },2400);
  };
  const play=()=>{
    if(isPlaying) return;
    ensureDrownedScene();
    isPlaying=true;
    window.CAOTIXObserver?.discover('Drowned', 6600);
    resetPushes();
    layer.classList.remove('is-active');
    void layer.offsetWidth;
    layer.classList.add('is-active');
    window.setTimeout(()=>{
      layer.classList.remove('is-active');
      isPlaying=false;
    },5200);
  };
  const registerPush=()=>{
    if(isPlaying || !atBottom()) return;
    pushes+=1;
    scheduleReset();
    if(pushes>=needed) play();
  };
  const isTypingTarget=(target)=>{
    const tag=target?.tagName?.toLowerCase();
    return tag==='input'||tag==='textarea'||tag==='select'||target?.isContentEditable;
  };

  let wheelArmed=true;
  let wheelIdleTimer=0;
  const armWheelAfterGesture=()=>{
    if(wheelIdleTimer) window.clearTimeout(wheelIdleTimer);
    wheelIdleTimer=window.setTimeout(()=>{
      wheelArmed=true;
      wheelIdleTimer=0;
    },320);
  };

  window.addEventListener('wheel',(event)=>{
    if(isPlaying) return;

    
    
    armWheelAfterGesture();

    if(!atBottom()){
      if(event.deltaY < -3) resetPushes();
      wheelArmed=false;
      return;
    }

    if(event.deltaY > 3 && wheelArmed){
      wheelArmed=false;
      registerPush();
    } else if(event.deltaY < -3){
      wheelArmed=false;
      resetPushes();
    }
  },{passive:true});

  document.addEventListener('keydown',(event)=>{
    if(event.ctrlKey||event.metaKey||event.altKey) return;
    if(event.key!=='ArrowDown'||event.repeat||isTypingTarget(event.target)) return;
    if(!atBottom()){
      resetPushes();
      return;
    }
    registerPush();
  });

  
  
  let touchStartY=0;
  let touchStartedAtBottom=false;
  let touchX7BActive=false;
  const touchPushDistance=54;

  window.addEventListener('touchstart',(event)=>{
    if(isPlaying || event.touches.length!==1) return;
    touchStartY=event.touches[0].clientY;
    touchStartedAtBottom=atBottom();
    touchX7BActive=false;
  },{passive:true});

  window.addEventListener('touchmove',(event)=>{
    if(!touchStartedAtBottom || isPlaying || event.touches.length!==1) return;
    const distance=event.touches[0].clientY-touchStartY;
    if(distance < -8 && atBottom()){
      touchX7BActive=true;
      
      
      event.preventDefault();
    }
  },{passive:false});

  window.addEventListener('touchend',(event)=>{
    if(!touchStartedAtBottom || isPlaying) return;
    const endY=event.changedTouches[0]?.clientY ?? touchStartY;
    const distance=endY-touchStartY;
    if(touchX7BActive && distance <= -touchPushDistance && atBottom()){
      registerPush();
    } else if(distance > 18){
      resetPushes();
    }
    touchStartedAtBottom=false;
    touchX7BActive=false;
  },{passive:true});

  window.addEventListener('touchcancel',()=>{
    touchStartedAtBottom=false;
    touchX7BActive=false;
  },{passive:true});

  window.addEventListener('scroll',()=>{
    if(!atBottom() && pushes) resetPushes();
  },{passive:true});
})();



(() => {
  const photo = document.querySelector('.band-photo');
  if (!photo) return;

  const frame = photo.querySelector('.band-photo-frame') || photo;
  const baseImage = frame.querySelector('img:not(.scribble)');
  if (!baseImage) return;

  const style = document.createElement('style');
  style.textContent = `
    .band-photo.x9c-ready{overflow:visible;-webkit-touch-callout:none;user-select:none}
    .band-photo .band-photo-frame{position:relative;overflow:hidden}
    .band-photo .x9c-overlay,
    .band-photo .x9c-copy{
      position:absolute;
      inset:0;
      pointer-events:none;
      opacity:0;
    }
    .band-photo .x9c-overlay{
      width:100%;
      height:100%;
      object-fit:cover;
      object-position:center top;
      filter:grayscale(.08) contrast(1.16) brightness(.92);
      z-index:2;
    }
    .band-photo .x9c-copy{
      z-index:3;
      display:flex;
      align-items:flex-end;
      justify-content:center;
      padding:18px 16px 22px;
      text-align:center;
    }
    .band-photo .x9c-copy span{
      display:inline-block;
      max-width:min(84%, 440px);
      color:#f2ede3;
      text-transform:uppercase;
      font:700 clamp(18px,2vw,28px)/1.02 "Bradley Hand","Segoe Print","Comic Sans MS","Marker Felt",cursive;
      letter-spacing:.06em;
      transform:rotate(-2.4deg);
      text-shadow:
        0 1px 0 rgba(0,0,0,.84),
        0 0 10px rgba(0,0,0,.48),
        0 0 22px rgba(0,0,0,.34);
      position:relative;
      filter:drop-shadow(0 3px 10px rgba(0,0,0,.28));
    }
    .band-photo .x9c-copy span::before,
    .band-photo .x9c-copy span::after{
      content:"";
      position:absolute;
      inset:auto;
      background:rgba(10,10,10,.16);
      border-radius:999px;
      filter:blur(7px);
      pointer-events:none;
    }
    .band-photo .x9c-copy span::before{
      width:74px;height:7px;left:8%;top:8px;transform:rotate(-8deg)
    }
    .band-photo .x9c-copy span::after{
      width:92px;height:8px;right:4%;bottom:4px;transform:rotate(9deg)
    }
    .band-photo.x9c-glitching img:not(.scribble){animation:x9cBaseGlitch .32s steps(1) 2}
    .band-photo.x9c-glitching .scribble{animation:x9cScribbleGlitch .32s steps(1) 2}
    .band-photo.x9c-show .x9c-overlay{animation:x9cOverlayBlink 1.05s ease-in-out forwards}
    .band-photo.x9c-show .x9c-copy{animation:x9cCopyBlink 1.05s ease-in-out forwards}
    @keyframes x9cBaseGlitch{
      0%{filter:grayscale(.15) contrast(1.1) brightness(1);transform:translate3d(0,0,0)}
      20%{filter:grayscale(.2) contrast(1.22) brightness(.7);transform:translate3d(-2px,0,0)}
      50%{filter:grayscale(.1) contrast(1.3) brightness(.52);transform:translate3d(2px,0,0)}
      100%{filter:grayscale(.15) contrast(1.1) brightness(1);transform:translate3d(0,0,0)}
    }
    @keyframes x9cScribbleGlitch{
      0%{transform:rotate(9deg) translate3d(0,0,0)}
      50%{transform:rotate(6deg) translate3d(2px,-2px,0)}
      100%{transform:rotate(9deg) translate3d(0,0,0)}
    }
    @keyframes x9cOverlayBlink{
      0%,11%{opacity:0}
      13%,18%{opacity:.96}
      21%,26%{opacity:0}
      29%,86%{opacity:1}
      89%,93%{opacity:.35}
      96%,100%{opacity:0}
    }
    @keyframes x9cCopyBlink{
      0%,18%{opacity:0;transform:translateY(8px)}
      25%,84%{opacity:1;transform:translateY(0)}
      100%{opacity:0;transform:translateY(4px)}
    }
    @media (prefers-reduced-motion:reduce){
      .band-photo.x9c-glitching img:not(.scribble),
      .band-photo.x9c-glitching .scribble,
      .band-photo.x9c-show .x9c-overlay,
      .band-photo.x9c-show .x9c-copy{animation:none}
      .band-photo.x9c-show .x9c-overlay,
      .band-photo.x9c-show .x9c-copy{opacity:1}
    }
  `;
  document.head.appendChild(style);

  photo.classList.add('x9c-ready');
  const overlay = document.createElement('img');
  overlay.className = 'x9c-overlay';
  overlay.alt = '';
  overlay.decoding = 'async';
  const ensureOverlayAsset = () => {
    if (!overlay.hasAttribute('src')) overlay.src = 'easter-eggs/assets/easteregg-demons-inside.webp';
  };

  const copy = document.createElement('div');
  copy.className = 'x9c-copy';
  copy.setAttribute('aria-hidden', 'true');
  copy.innerHTML = '<span>THEY WERE INSIDE ALL ALONG.</span>';

  frame.appendChild(overlay);
  frame.appendChild(copy);

  let holdTimer = 0;
  let cooldownTimer = 0;
  let canTrigger = true;
  let isPlaying = false;

  const clearHold = () => {
    if (holdTimer) {
      window.clearTimeout(holdTimer);
      holdTimer = 0;
    }
  };

  const resetVisuals = () => {
    photo.classList.remove('x9c-glitching', 'x9c-show');
    isPlaying = false;
  };

  const play = () => {
    if (isPlaying || !canTrigger) return;
    isPlaying = true;
    window.CAOTIXObserver?.discover('Demons Inside', 2850);
    canTrigger = false;
    clearHold();
    photo.classList.remove('x9c-glitching', 'x9c-show');
    void photo.offsetWidth;
    photo.classList.add('x9c-glitching');
    window.setTimeout(() => {
      photo.classList.remove('x9c-glitching');
      photo.classList.add('x9c-show');
    }, 280);
    window.setTimeout(() => {
      resetVisuals();
      cooldownTimer = window.setTimeout(() => { canTrigger = true; }, 1800);
    }, 1480);
  };

  const startHold = () => {
    if (isPlaying || !canTrigger || holdTimer) return;
    ensureOverlayAsset();
    holdTimer = window.setTimeout(play, 3800);
  };

  const cancelHold = () => {
    clearHold();
  };

  photo.addEventListener('mouseenter', startHold);
  photo.addEventListener('mouseleave', cancelHold);

  let holdPointerId = null;
  let holdStartX = 0;
  let holdStartY = 0;
  const holdMoveTolerance = 18;

  photo.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    holdPointerId = event.pointerId;
    holdStartX = event.clientX;
    holdStartY = event.clientY;
    startHold();
  }, { passive: true });
  photo.addEventListener('pointermove', (event) => {
    if (holdPointerId !== event.pointerId || event.pointerType === 'mouse') return;
    const dx = event.clientX - holdStartX;
    const dy = event.clientY - holdStartY;
    if (Math.hypot(dx, dy) > holdMoveTolerance) {
      holdPointerId = null;
      cancelHold();
    }
  }, { passive: true });
  const endPointerHold = (event) => {
    if (holdPointerId !== event.pointerId) return;
    holdPointerId = null;
    cancelHold();
  };
  photo.addEventListener('pointerup', endPointerHold, { passive: true });
  photo.addEventListener('pointercancel', endPointerHold, { passive: true });
  window.addEventListener('pagehide', () => {
    clearHold();
    if (cooldownTimer) window.clearTimeout(cooldownTimer);
  });
})();

(()=>{const mark=document.querySelector('.copyright-mark');if(!mark)return;const e=document.createElement('button');e.className='u7k';e.type='button';e.tabIndex=-1;e.setAttribute('aria-label','');mark.appendChild(e);e.addEventListener('click',()=>{location.href=[113,52,109,55,118,47,105,110,100,101,120,46,104,116,109,108].map(n=>String.fromCharCode(n)).join('')})})();
/* Merch Easter egg: Decay or Grow — staged fracture build-up from hairline cracks to full rupture. */
(() => {
  const trigger = document.querySelector('[data-decay-grow-trigger]');
  if (!trigger) return;

  trigger.textContent = '';
  [...'SPREAD'].forEach((char) => {
    const span = document.createElement('span');
    span.className = `decay-letter decay-letter-${char.toLowerCase()}`;
    span.textContent = char;
    trigger.appendChild(span);
  });
  const originLetter = trigger.querySelector('.decay-letter-r');
  if (!originLetter) return;

  const material = document.createElement('div');
  material.className = 'dg-material';
  material.setAttribute('aria-hidden', 'true');
  material.dataset.stage = '0';
  document.body.appendChild(material);

  const shardReveal = document.createElement('div');
  shardReveal.className = 'dg-shard-reveal';
  shardReveal.setAttribute('aria-hidden', 'true');
  const shardImg = document.createElement('img');
  shardImg.alt = '';
  shardImg.decoding = 'async';
  shardReveal.appendChild(shardImg);
  document.body.appendChild(shardReveal);

  const states = new Map();
  const loadImage = (src, className) => {
    const img = document.createElement('img');
    img.className = className;
    img.alt = '';
    img.decoding = 'async';
    img.src = src;
    return img;
  };
  const ensureStage = (stageNumber) => {
    if (stageNumber < 1 || stageNumber > 5) return null;
    if (states.has(stageNumber)) return states.get(stageNumber);
    const node = document.createElement('div');
    node.className = 'dg-state';
    node.dataset.stage = String(stageNumber);
    node.append(
      loadImage(`easter-eggs/assets/decay-crack-energy-s${stageNumber}.webp`, 'dg-energy'),
      loadImage(`easter-eggs/assets/decay-crack-shell-s${stageNumber}.webp`, 'dg-shell'),
      loadImage(`easter-eggs/assets/decay-crack-debris-s${stageNumber}.webp`, 'dg-debris')
    );
    material.appendChild(node);
    states.set(stageNumber, node);
    return node;
  };
  const preloadNextStage = (stageNumber) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => ensureStage(stageNumber), { timeout: 700 });
    } else {
      window.setTimeout(() => ensureStage(stageNumber), 80);
    }
  };
  const ensureShardAsset = () => {
    if (!shardImg.hasAttribute('src')) shardImg.src = 'easter-eggs/assets/easteregg-decay-grow-shard.webp';
  };

  const clicksPerStage = 5;
  const maxStage = 5;
  const decayDelay = 3000;
  let stage = 0;
  let clicksInStage = 0;
  let decayTimer = 0;
  let pulseTimer = 0;
  let finalTimer = 0;
  let complete = false;

  const updateShardAnchor = () => {
    const r = trigger.getBoundingClientRect();
    const shardRect = shardReveal.getBoundingClientRect();
    const shardWidth = shardRect.width || Math.min(920, window.innerWidth * .56);
    const shardHeight = shardRect.height || shardWidth * (928 / 1664);
    const desiredCenterX = r.left + Math.min(r.width * .33 + 165, Math.max(120, window.innerWidth * .12));
    const desiredCenterY = r.top + r.height * .68;
    const margin = 18;
    const centerX = Math.max(shardWidth * .5 + margin, Math.min(window.innerWidth - shardWidth * .5 - margin, desiredCenterX));
    const centerY = Math.max(shardHeight * .5 + margin, Math.min(window.innerHeight - shardHeight * .5 - margin, desiredCenterY));
    shardReveal.style.setProperty('--dg-shard-hold-x', `${centerX - shardWidth * .5}px`);
    shardReveal.style.setProperty('--dg-shard-hold-y', `${centerY - shardHeight * .5}px`);
  };

  const updateAnchor = () => {
    const r = originLetter.getBoundingClientRect();
    const renderedWidth = material.getBoundingClientRect().width;
    if (!renderedWidth) return;
    const scale = renderedWidth / 1800;
    const x = window.scrollX + r.left + r.width * .5;
    const y = window.scrollY + r.top + r.height * .52;
    material.style.left = `${x - 460 * scale}px`;
    material.style.top = `${y - 560 * scale}px`;
    updateShardAnchor();
  };

  const render = (decaying = false) => {
    material.dataset.stage = String(stage);
    if (stage > 0) ensureStage(stage);
    states.forEach((node, stageNumber) => node.classList.toggle('is-active', stageNumber === stage));
    material.classList.toggle('is-decaying', decaying && stage > 0);
    updateAnchor();
    if (!decaying) material.classList.remove('is-decaying');
    if (!decaying && stage > 0 && stage < maxStage) preloadNextStage(stage + 1);
    if (!decaying && stage >= 4) ensureShardAsset();
  };

  const hit = () => {
    if (stage <= 0) return;
    material.classList.remove('is-hit');
    trigger.classList.remove('decay-grow-trigger-pulse');
    void material.offsetWidth;
    material.classList.add('is-hit');
    trigger.classList.add('decay-grow-trigger-pulse');
    window.clearTimeout(pulseTimer);
    pulseTimer = window.setTimeout(() => {
      material.classList.remove('is-hit');
      trigger.classList.remove('decay-grow-trigger-pulse');
    }, 360);
  };

  const scheduleDecay = () => {
    window.clearTimeout(decayTimer);
    if (complete || (stage === 0 && clicksInStage === 0)) return;
    decayTimer = window.setTimeout(() => {
      if (complete) return;
      clicksInStage = 0;
      if (stage > 0) {
        stage -= 1;
        render(true);
        window.setTimeout(() => material.classList.remove('is-decaying'), 520);
      }
      if (stage > 0) scheduleDecay();
    }, decayDelay);
  };

  const finish = () => {
    complete = true;
    ensureShardAsset();
    window.clearTimeout(decayTimer);
    hit();
    window.CAOTIXObserver?.discover('Decay or Grow', 4700);
    updateShardAnchor();
    shardReveal.classList.remove('is-flying');
    void shardReveal.offsetWidth;
    window.setTimeout(() => shardReveal.classList.add('is-flying'), 260);
    finalTimer = window.setTimeout(() => {
      material.classList.add('is-final-fade');
      window.setTimeout(() => {
        stage = 0;
        clicksInStage = 0;
        complete = false;
        shardReveal.classList.remove('is-flying');
        material.classList.remove('is-final-fade','is-decaying','is-hit');
        trigger.classList.remove('decay-grow-trigger-pulse');
        render(false);
      }, 820);
    }, 4050);
  };

  const handleClick = () => {
    if (complete) return;
    if (stage === 0 && clicksInStage === 0) ensureStage(1);
    clicksInStage += 1;
    if (clicksInStage >= clicksPerStage) {
      clicksInStage = 0;
      stage = Math.min(maxStage, stage + 1);
      render(false);
      hit();
      if (stage >= maxStage) { finish(); return; }
    } else if (stage > 0) {
      hit();
    }
    scheduleDecay();
  };

  trigger.addEventListener('click', handleClick);
  trigger.addEventListener('dblclick', event => event.preventDefault());
  window.addEventListener('resize', updateAnchor);
  window.addEventListener('load', updateAnchor);
  window.addEventListener('scroll', updateAnchor, {passive:true});
  render(false);

  window.addEventListener('pagehide', () => {
    window.clearTimeout(decayTimer);
    window.clearTimeout(pulseTimer);
    window.clearTimeout(finalTimer);
  });
})();

