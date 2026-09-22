#!/usr/bin/env node
/* Synchronisiert statische SEO-/Sharing-Metatags der normalen Hauptseiten mit content.js.
   Keine Abhängigkeiten, kein Build-Prozess. Unterordner werden grundsätzlich nicht bearbeitet. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const contentCode = fs.readFileSync(path.join(root, 'content.js'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(contentCode, sandbox, { filename: 'content.js' });
const C = sandbox.window.CAOTIX_CONTENT || {};
const site = C.site || {};
const meta = C.meta || {};
const pages = meta.pages || {};
const base = String(site.baseUrl || '').replace(/\/$/, '');
const abs = (value) => /^https?:\/\//i.test(value || '') ? value : `${base}/${String(value || '').replace(/^\//, '')}`;
const esc = (value) => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function replaceOrInsert(html, regex, replacement, before='</head>') {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace(before, `${replacement}${before}`);
}
function sync(name, cfg) {
  if (!/^[a-z0-9_-]+$/i.test(name)) return;
  const filename = name === 'index' ? 'index.html' : `${name}.html`;
  const file = path.join(root, filename);
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');
  const title = cfg.title || meta.siteName || 'CAOTIX';
  const desc = cfg.description || '';
  const canonical = abs(cfg.path || (name === 'index' ? '/' : `/${filename}`));
  const image = abs(cfg.image || site.socialImage || 'assets/caotix-social.jpg');
  const imageAlt = cfg.imageAlt || site.socialImageAlt || 'CAOTIX';

  html = replaceOrInsert(html, /<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);
  html = replaceOrInsert(html, /<meta\s+content="[^"]*"\s+name="description"\s*\/>/i, `<meta content="${esc(desc)}" name="description"/>`);
  html = replaceOrInsert(html, /<link\s+href="[^"]*"\s+rel="canonical"\s*\/>/i, `<link href="${esc(canonical)}" rel="canonical"/>`);
  const pairs = [
    ['property','og:locale', meta.locale || 'de_DE'],
    ['property','og:site_name', meta.siteName || 'CAOTIX'],
    ['property','og:title', title],
    ['property','og:description', desc],
    ['property','og:url', canonical],
    ['property','og:image', image],
    ['property','og:image:alt', imageAlt],
    ['name','twitter:title', title],
    ['name','twitter:description', desc],
    ['name','twitter:image', image]
  ];
  for (const [attr,key,val] of pairs) {
    const re = new RegExp(`<meta\\s+content="[^"]*"\\s+${attr}="${key.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}"\\s*\\/>`, 'i');
    html = replaceOrInsert(html, re, `<meta content="${esc(val)}" ${attr}="${key}"/>`);
  }

  if (name === 'index') {
    const schemaRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i;
    const match = html.match(schemaRe);
    if (match) {
      try {
        const schema = JSON.parse(match[1]);
        schema.url = base ? `${base}/` : schema.url;
        schema.image = abs(site.socialImage || 'assets/caotix-social.jpg');
        schema.email = site.email || schema.email;
        schema.sameAs = [site.instagram, site.tiktok, site.youtube, site.spotify].filter(Boolean);
        html = html.replace(schemaRe, `<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
      } catch (_) {
        console.warn('! JSON-LD auf index.html konnte nicht gelesen werden.');
      }
    }
  }
  fs.writeFileSync(file, html);
  console.log(`✓ ${filename}`);
}
Object.entries(pages).forEach(([name,cfg]) => sync(name,cfg || {}));
console.log('Meta-/Sharing-Daten synchronisiert.');
