import { useState, useEffect } from 'react';

const LOCALE_CACHE = {};
const IN_FLIGHT = {};
const LISTENERS = new Set();

let activeViewLang = 'EN';
let globalTick = 0;

function notifyListeners() {
  globalTick += 1;
  LISTENERS.forEach((fn) => {
    try {
      fn(globalTick);
    } catch {
      // ignore listener errors
    }
  });
}

export function preloadViewLocale(langCode) {
  const code = (langCode || 'EN').toUpperCase();
  if (code === 'EN' || code === 'ES') return Promise.resolve(null);
  if (LOCALE_CACHE[code]) return Promise.resolve(LOCALE_CACHE[code]);
  if (IN_FLIGHT[code]) return IN_FLIGHT[code];

  const url = `/locales/views/${code.toLowerCase()}.json`;
  IN_FLIGHT[code] = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      LOCALE_CACHE[code] = data || {};
      delete IN_FLIGHT[code];
      notifyListeners();
      return LOCALE_CACHE[code];
    })
    .catch(() => {
      delete IN_FLIGHT[code];
      return null;
    });

  return IN_FLIGHT[code];
}

export function setActiveViewLang(langCode) {
  const code = (langCode || 'EN').toUpperCase();
  activeViewLang = code;
  if (code !== 'EN' && code !== 'ES' && !LOCALE_CACHE[code]) {
    preloadViewLocale(code);
  }
}

export function getActiveViewLang() {
  return activeViewLang;
}

export function useViewLocale(langCode) {
  const code = (langCode || activeViewLang || 'EN').toUpperCase();
  setActiveViewLang(code);
  const [tick, setTick] = useState(globalTick);

  useEffect(() => {
    const listener = (nextTick) => setTick(nextTick);
    LISTENERS.add(listener);
    if (code !== 'EN' && code !== 'ES' && !LOCALE_CACHE[code]) {
      preloadViewLocale(code);
    }
    return () => {
      LISTENERS.delete(listener);
    };
  }, [code]);

  return {
    langCode: code,
    isES: code === 'ES',
    localeReady: code === 'EN' || code === 'ES' || Boolean(LOCALE_CACHE[code]),
    localeTick: tick,
  };
}

export function tx(esText, enText, explicitLang) {
  const code = (explicitLang || activeViewLang || 'EN').toUpperCase();
  if (code === 'ES') return esText;
  if (code === 'EN') return enText;
  const dict = LOCALE_CACHE[code];
  if (dict && typeof dict[enText] === 'string' && dict[enText].length > 0) {
    return dict[enText];
  }
  return enText;
}

export function txList(esArr, enArr, explicitLang) {
  const code = (explicitLang || activeViewLang || 'EN').toUpperCase();
  if (code === 'ES') return esArr;
  if (code === 'EN') return enArr;
  return enArr.map((enItem, idx) => tx(esArr[idx] ?? enItem, enItem, code));
}

function formatPlaceholders(tpl, args) {
  if (typeof tpl !== 'string') return '';
  return tpl.replace(/\{(\d+)\}/g, (match, numStr) => {
    const idx = Number(numStr);
    return idx >= 0 && idx < args.length && args[idx] !== undefined && args[idx] !== null
      ? String(args[idx])
      : match;
  });
}

export function txTpl(esTpl, esArgs = [], enTpl, enArgs = [], explicitLang) {
  const code = (explicitLang || activeViewLang || 'EN').toUpperCase();
  if (code === 'ES') return formatPlaceholders(esTpl, esArgs);
  if (code === 'EN') return formatPlaceholders(enTpl, enArgs);
  const translatedTpl = tx(esTpl, enTpl, code);
  return formatPlaceholders(translatedTpl, enArgs);
}

export function bilingual(enText, esText) {
  const base = { EN: enText, ES: esText };
  return new Proxy(base, {
    get(target, prop) {
      if (prop === 'ES') return target.ES;
      if (prop === 'EN') {
        const code = activeViewLang;
        if (code && code !== 'EN' && code !== 'ES') {
          return tx(target.ES, target.EN, code);
        }
        return target.EN;
      }
      if (typeof prop === 'string' && prop.length >= 2 && prop.length <= 4) {
        return tx(target.ES, target.EN, prop);
      }
      return target[prop];
    },
  });
}

