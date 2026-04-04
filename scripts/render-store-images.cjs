'use strict';
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const iconPath = path.join(root, 'assets', 'icon-store.svg');

async function gradientPng(w, h) {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8fafc"/>
      <stop offset="0.55" stop-color="#f1f5f9"/>
      <stop offset="1" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function renderPair(w, h, relOut) {
  const pad = 0.72;
  const target = Math.round(Math.min(w, h) * pad);
  const iconBuf = await sharp(iconPath)
    .resize({ width: target, height: target, fit: 'inside' })
    .png()
    .toBuffer();
  const im = await sharp(iconBuf).metadata();
  const base = await gradientPng(w, h);
  const left = Math.round((w - im.width) / 2);
  const top = Math.round((h - im.height) / 2);
  const outPath = path.join(root, relOut);
  await sharp(base)
    .composite([{ input: iconBuf, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log('wrote', relOut);
}

(async () => {
  await renderPair(250, 175, path.join('assets', 'images', 'small.png'));
  await renderPair(500, 350, path.join('assets', 'images', 'large.png'));
  await renderPair(1000, 700, path.join('assets', 'images', 'xlarge.png'));
})();
