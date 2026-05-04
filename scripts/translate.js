#!/usr/bin/env node
/**
 * Auto-translate script using MyMemory (free, no API key required)
 *
 * Usage:
 *   npm run translate          # translate to Indonesian (id)
 *   node scripts/translate.js  # same
 *
 * To add more target languages in the future, add them to TARGET_LANGUAGES below.
 * English (src/locales/en.json) is always the source of truth.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const LOCALES   = join(ROOT, 'src', 'locales');

// ── Target languages ──────────────────────────────────────────────────────────
// Add more here if needed, e.g. { es: 'Spanish' }
const TARGET_LANGUAGES = {
  id: 'Indonesian',
};

// Exact values that should never be translated (library/package names)
const SKIP_VALUES = new Set(['bad-words', '@2toad/profanity', 'obscenity']);

// Skip translating only true technical identifiers:
//   - starts with @ (e.g. @2toad/profanity)
//   - hyphenated-lowercase-only (e.g. bad-words, react-use)
//   - pure punctuation / symbols only
const SKIP_PATTERN = /^@\S+$|^[a-z]+(-[a-z0-9]+)+$|^[^a-zA-Z]+$/;

const DELAY_MS = 500; // be polite to the free API

// ── Flatten / unflatten ───────────────────────────────────────────────────────
function flatten(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flatten(val, path));
    } else {
      acc[path] = val;
    }
    return acc;
  }, {});
}

function unflatten(flat) {
  const result = {};
  for (const [key, val] of Object.entries(flat)) {
    const parts = key.split('.');
    let cur = result;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] ??= {};
      cur = cur[parts[i]];
    }
    cur[parts.at(-1)] = val;
  }
  return result;
}

// ── MyMemory API ──────────────────────────────────────────────────────────────
async function translateText(text, targetLang) {
  if (!text?.trim() || SKIP_VALUES.has(text) || SKIP_PATTERN.test(text)) return text;

  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', `en|${targetLang}`);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  if (data.responseStatus !== 200) {
    throw new Error(data.responseMessage || 'Unknown error');
  }

  return data.responseData.translatedText;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args    = process.argv.slice(2);
  const targets = args.length
    ? Object.fromEntries(args.filter(l => TARGET_LANGUAGES[l]).map(l => [l, TARGET_LANGUAGES[l]]))
    : TARGET_LANGUAGES;

  if (!Object.keys(targets).length) {
    console.error('❌ No valid language codes. Available:', Object.keys(TARGET_LANGUAGES).join(', '));
    process.exit(1);
  }

  const enSource = JSON.parse(readFileSync(join(LOCALES, 'en.json'), 'utf8'));
  const flatEn   = flatten(enSource);
  const keys     = Object.keys(flatEn);

  console.log(`\n🌍 Auto-Translation via MyMemory`);
  console.log(`   Strings  : ${keys.length}`);
  console.log(`   Languages: ${Object.keys(targets).join(', ')}\n`);

  mkdirSync(LOCALES, { recursive: true });

  for (const [lang, langName] of Object.entries(targets)) {
    console.log(`── Translating → ${lang} (${langName})`);
    const flatOut = {};
    let done = 0, failed = 0;

    for (const [key, value] of Object.entries(flatEn)) {
      try {
        flatOut[key] = await translateText(value, lang);
        done++;
        process.stdout.write(`\r   ${done + failed}/${keys.length} | ✓ ${done} translated, ✗ ${failed} skipped/failed`);
        await sleep(DELAY_MS);
      } catch (err) {
        console.warn(`\n   ⚠ "${key}": ${err.message} — keeping English`);
        flatOut[key] = value;
        failed++;
      }
    }

    const outPath = join(LOCALES, `${lang}.json`);
    writeFileSync(outPath, JSON.stringify(unflatten(flatOut), null, 2) + '\n', 'utf8');
    console.log(`\n   ✅ Saved → src/locales/${lang}.json  (${done} translated, ${failed} fallback)\n`);
  }

  console.log('✨ Done! Restart dev server to see changes.\n');
}

main().catch(err => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});
