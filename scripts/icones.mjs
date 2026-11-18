// Gera favicon.svg, favicon.ico, apple-touch-icon, icon-512 e og-image a partir do logo provisório.
// Uso: node scripts/icones.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const marca = `<rect width="64" height="64" rx="14" fill="#0B5560"/>
<rect x="19" y="11" width="8" height="35" fill="#fff"/>
<rect x="19" y="11" width="27" height="8" fill="#fff"/>
<rect x="19" y="26" width="19" height="7" fill="#fff"/>
<rect x="15" y="50" width="34" height="5" rx="2.5" fill="#F7D54A"/>`;

const svg = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${marca}</svg>`;
writeFileSync('public/favicon.svg', svg());

const base = Buffer.from(svg());
await sharp(base).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(base).resize(512, 512).png().toFile('public/icon-512.png');
const png48 = await sharp(base).resize(48, 48).png().toBuffer();
// ICO com um PNG de 48x48 dentro
const cab = Buffer.alloc(22);
cab.writeUInt16LE(0, 0); cab.writeUInt16LE(1, 2); cab.writeUInt16LE(1, 4);
cab[6] = 48; cab[7] = 48; cab.writeUInt16LE(1, 10); cab.writeUInt16LE(32, 12);
cab.writeUInt32LE(png48.length, 14); cab.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([cab, png48]));

const fonte = `font-family="Segoe UI, Arial, Helvetica, sans-serif"`;
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#0B151B"/>
<rect x="0" y="618" width="1200" height="12" fill="#F7D54A"/>
<g transform="translate(80 80) scale(1.5)">${marca}</g>
<rect x="214" y="114" width="70" height="60" rx="6" fill="#F7D54A"/>
<text x="180" y="160" ${fonte} font-size="64" font-weight="700" fill="#E7EEF1" letter-spacing="-1.5">F<tspan fill="#11202A">ai</tspan>stInvest</text>
<text x="80" y="330" ${fonte} font-size="76" font-weight="700" fill="#E7EEF1" letter-spacing="-2">Seus investimentos,</text>
<text x="80" y="418" ${fonte} font-size="76" font-weight="700" fill="#E7EEF1" letter-spacing="-2">explicados em português.</text>
<text x="80" y="490" ${fonte} font-size="30" fill="#9FB0BA">Assistente com IA para acompanhar a carteira.</text>
<text x="80" y="535" ${fonte} font-size="30" fill="#9FB0BA">Não é recomendação de investimento.</text>
<text x="80" y="585" ${fonte} font-size="24" fill="#9FB0BA">Projeto em desenvolvimento. Esta página é uma demonstração.</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-image.png');
console.log('ok');
