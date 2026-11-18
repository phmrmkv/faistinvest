// Gera favicon.svg, favicon.ico, apple-touch-icon e og-image a partir do logo provisório.
// Uso: node scripts/icones.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const INK = '#17161D';
const CLARO = '#ECECF1';
const AMARELO = '#F7D54A';

const marca = (fundo, letra) => `<rect width="64" height="64" rx="14" fill="${fundo}"/>
<rect x="19" y="11" width="8" height="35" fill="${letra}"/>
<rect x="19" y="11" width="27" height="8" fill="${letra}"/>
<rect x="19" y="26" width="19" height="7" fill="${letra}"/>
<rect x="15" y="50" width="34" height="5" rx="2.5" fill="${AMARELO}"/>`;

const svgIcone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${marca(INK, '#fff')}</svg>`;
writeFileSync('public/favicon.svg', svgIcone);

const base = Buffer.from(svgIcone);
await sharp(base).resize(180, 180).png().toFile('public/apple-touch-icon.png');
const png48 = await sharp(base).resize(48, 48).png().toBuffer();
// ICO com um PNG de 48x48 dentro
const cab = Buffer.alloc(22);
cab.writeUInt16LE(0, 0); cab.writeUInt16LE(1, 2); cab.writeUInt16LE(1, 4);
cab[6] = 48; cab[7] = 48; cab.writeUInt16LE(1, 10); cab.writeUInt16LE(32, 12);
cab.writeUInt32LE(png48.length, 14); cab.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([cab, png48]));

const fonte = 'font-family="Segoe UI, Arial, Helvetica, sans-serif"';

// Mede a largura (pixels com tinta) de um trecho do nome para posicionar o realce do "ai".
async function extremos(txt) {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="120"><text x="20" y="90" ${fonte} font-size="64" font-weight="700" letter-spacing="-1.5" fill="#000">${txt}</text></svg>`;
  const { data, info } = await sharp(Buffer.from(s)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let max = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 40 && x > max) max = x;
  }
  return max - 20;
}
const fim1 = await extremos('F');
const fim3 = await extremos('Fai');
const x0 = 180 + fim1 + 1;
const x1 = 180 + fim3 + 8;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#121116"/>
<rect x="0" y="618" width="1200" height="12" fill="${AMARELO}"/>
<g transform="translate(80 80) scale(1.5)">${marca(CLARO, INK)}</g>
<rect x="${x0}" y="112" width="${x1 - x0}" height="62" rx="6" fill="${AMARELO}"/>
<text x="180" y="160" ${fonte} font-size="64" font-weight="700" fill="${CLARO}" letter-spacing="-1.5">F<tspan fill="${INK}">ai</tspan>stInvest</text>
<text x="80" y="330" ${fonte} font-size="76" font-weight="700" fill="${CLARO}" letter-spacing="-2">Seus investimentos,</text>
<text x="80" y="418" ${fonte} font-size="76" font-weight="700" fill="${CLARO}" letter-spacing="-2">explicados em português.</text>
<text x="80" y="490" ${fonte} font-size="30" fill="#A9A8B4">Assistente com IA para acompanhar a carteira.</text>
<text x="80" y="535" ${fonte} font-size="30" fill="#A9A8B4">Não é recomendação de investimento.</text>
<text x="80" y="585" ${fonte} font-size="24" fill="#A9A8B4">Projeto em desenvolvimento. Esta página é uma demonstração.</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-image.png');
console.log('ok');
