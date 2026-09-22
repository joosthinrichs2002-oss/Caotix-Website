(() => {
  'use strict';

  const register = () => {
    const game = window.CAOTIX_CTX;
    if (!game?.registerBonus) return false;

    const discover = () => {
      const fire = () => window.CAOTIXObserver?.discover('The Fight', 1400);
      if (window.CAOTIXObserver) {
        fire();
        return;
      }
      if (document.querySelector('script[data-caotix-observer]')) return;
      const script = document.createElement('script');
      script.src = '../easter-eggs/observer.js';
      script.dataset.caotixObserver = '1';
      script.onload = fire;
      document.body.appendChild(script);
    };

    game.registerBonus({
      id: 'z3',
      name: 'BOXSACK',
      speaker: null,
      x: 19,
      y: 98,
      w: 13,
      h: 28,
      text: 'DER KAMPF BEGINNT GERADE ERST.',
      onClose: discover,
      draw({C, px}) {
        px(24,92,2,7,C.metalDark);
        px(20,98,11,4,C.black);
        px(19,102,13,20,'#29272c');
        px(20,104,11,16,'#343139');
        px(21,106,9,2,C.red);
        px(20,122,11,3,C.black);
        px(22,125,7,2,C.metalDark);
      }
    }, {x:18,y:99,w:15,h:28});
    return true;
  };

  if (!register()) {
    window.addEventListener('caotix:ctx-ready', register, { once: true });
  }
})();
