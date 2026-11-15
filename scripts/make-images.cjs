// ファビコンPNG（32/180/512）と OGP 画像（1200×630）を public/ に書き出す
// 使い方: node scripts/make-images.cjs
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const pub = path.join(__dirname, '..', 'public');
const fav = fs.readFileSync(path.join(pub, 'favicon.svg'), 'utf8');
const mark = fs.readFileSync(path.join(pub, 'assets/logo/logo-mark.svg'), 'utf8');

(async () => {
  const browser = await chromium.launch();
  for (const [size, name] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png'], [512, 'icon-512.png']]) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<html><body style="margin:0;background:transparent">${fav.replace('<svg ', `<svg style="display:block;width:${size}px;height:${size}px" `)}</body></html>`);
    await page.screenshot({ path: path.join(pub, name), omitBackground: true });
    await page.close();
  }
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await og.setContent(`<!doctype html><html lang="ja"><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700&display=swap">
<style>
body{margin:0;width:1200px;height:630px;background:#fff;font-family:'Zen Maru Gothic',sans-serif;color:#545454;display:flex;flex-direction:column}
.main{flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 96px;gap:28px}
.logo{display:flex;align-items:center;gap:20px}
.logo svg{width:84px;height:84px}
.type{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:500;font-size:26px;letter-spacing:.32em;display:flex;align-items:center}
.o{display:inline-block;width:.66em;height:.66em;border-radius:50%;background:#05AF6C;margin:0 .32em 0 .04em}
h1{margin:0;font-size:84px;line-height:1.3;color:#333;font-weight:700}
p{margin:0;font-size:28px}
.band{background:#8DCDB4;height:72px;display:flex;align-items:center;padding:0 96px;font-size:24px;color:#333}
</style></head><body>
<div class="main"><div class="logo">${mark}<span class="type">NEK<span class="o"></span>YASHIKI</span></div>
<h1>紙の仕事を、てのひらへ。</h1><p>宮城の仕事と暮らしに、IT・デザイン・発信を</p></div>
<div class="band">地域経済活性化のベストパートナー｜宮城県仙台市</div></body></html>`, { waitUntil: 'networkidle' });
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: path.join(pub, 'og.png') });
  await browser.close();
})();
