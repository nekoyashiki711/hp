/**
 * 背景の猫の動き。
 * - CSS のスクロール連動アニメーション（animation-timeline: view()）が使えるブラウザは CSS に任せる
 * - 使えないブラウザ（Firefox・古い Safari）は、ここで同じ動きを requestAnimationFrame で再現する
 * - 「のぞく」猫は、どちらの場合も IntersectionObserver で1回だけ動かす
 * - prefers-reduced-motion: reduce のときは何も動かさない（定位置に静止）
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const supportsTimeline = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

// のぞく猫（1回だけ）
const peeks = document.querySelectorAll<HTMLElement>('[data-cat="peek"]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.2 },
  );
  peeks.forEach((el) => io.observe(el));
} else {
  peeks.forEach((el) => el.classList.add('is-in'));
}

// スクロール連動（CSS 非対応ブラウザ向けの代替）
if (!supportsTimeline) {
  type Item = { el: HTMLElement; img: HTMLElement; mover?: HTMLElement; kind: string; visible: boolean };
  const items: Item[] = [];
  document.querySelectorAll<HTMLElement>('[data-cat="drift"], [data-cat="walk"]').forEach((el) => {
    const img = el.querySelector<HTMLElement>('.cat__img');
    if (!img) return;
    items.push({ el, img, mover: el.querySelector<HTMLElement>('.cat__mover') ?? undefined, kind: el.dataset.cat!, visible: false });
  });

  const num = (el: HTMLElement, name: string) => parseFloat(getComputedStyle(el).getPropertyValue(name)) || 0;
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  let ticking = false;

  const update = () => {
    ticking = false;
    if (reduce.matches) return;
    const vh = window.innerHeight;
    const amp = matchMedia('(max-width: 767px)').matches ? 0.6 : 1;
    for (const it of items) {
      if (!it.visible) continue;
      // 位置は動かさない外枠（.cat）で測るので、猫自身の transform の影響を受けない
      const r = it.el.getBoundingClientRect();
      if (it.kind === 'drift') {
        // cover 0%→100%：画面の下端に入った時 0、上端から出た時 1。中央で 0.5（移動量 0）
        const p = clamp((vh - r.top) / (vh + r.height));
        const d = num(it.el, '--d') * amp;
        const r0 = num(it.el, '--r0');
        const r1 = num(it.el, '--r1');
        it.img.style.transform = `translate3d(0, ${(d * (1 - 2 * p)).toFixed(1)}px, 0) rotate(${(r0 + (r1 - r0) * p).toFixed(2)}deg)`;
      } else if (it.mover) {
        // contain 0%→100%：全体が画面に入ってから、上端に届くまで
        const span = Math.max(1, vh - r.height);
        const p = clamp((vh - r.height - r.top) / span);
        it.mover.style.transform = `translate3d(${(p * 100).toFixed(2)}%, 0, 0)`;
        it.img.style.transform = `translate3d(0, ${(-2 * Math.abs(Math.sin(p * Math.PI * 8))).toFixed(2)}px, 0)`;
      }
    }
  };
  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const it = items.find((i) => i.el === e.target);
          if (it) it.visible = e.isIntersecting;
        });
        request();
      },
      { rootMargin: '20% 0px 20% 0px' },
    );
    items.forEach((it) => vio.observe(it.el));
  } else {
    items.forEach((it) => (it.visible = true));
  }

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  reduce.addEventListener('change', () => {
    if (reduce.matches) items.forEach((it) => { it.img.style.transform = ''; if (it.mover) it.mover.style.transform = ''; });
    else request();
  });
  request();
}
