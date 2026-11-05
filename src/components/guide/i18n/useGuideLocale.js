import { useState, useEffect, useMemo } from 'react';
import { DEFAULT_GUIDE_LOCALES } from './defaultLocales';

/* ═══════════════════════════════════════════════════════════════════════════
   SERVICIO Y HOOK MODULAR DE LOCALIZACIÓN DE GUIDE (56 IDIOMAS)
   - ES y EN están pre-cargados en memoria para renderizado instantáneo.
   - Los 54 idiomas restantes se cargan bajo demanda desde archivos JSON
     independientes en /guide/locales/{lang}.json y se guardan en caché.
   ═══════════════════════════════════════════════════════════════════════════ */

const LOCALE_CACHE = {
    ES: DEFAULT_GUIDE_LOCALES.ES,
    EN: DEFAULT_GUIDE_LOCALES.EN
};

function hydrateGuideLocalePayload(rawPayload) {
    const payload = rawPayload || DEFAULT_GUIDE_LOCALES.EN;
    const treePages = JSON.parse(JSON.stringify(payload.treePages || []));
    const modalsBySection = payload.modalsBySection || {};
    const ui = payload.ui || DEFAULT_GUIDE_LOCALES.EN.ui;

    const allPages = [];
    treePages.forEach(node => {
        if (node.isPage) {
            allPages.push(node);
        } else if (Array.isArray(node.children)) {
            node.children.forEach(child => {
                child.groupLabel = node.label;
                allPages.push(child);
            });
        }
    });

    allPages.forEach(page => {
        page.sections?.forEach(sec => {
            if (modalsBySection[sec.id]) {
                sec.modalTabs = modalsBySection[sec.id];
            }
        });
    });

    return {
        ui,
        treePages,
        allPages,
        modalsBySection
    };
}

export function useGuideLocale(langCode = 'EN') {
    const normalizedCode = (langCode || 'EN').toUpperCase();
    const [loadedPayloads, setLoadedPayloads] = useState(() => ({ ...LOCALE_CACHE }));

    useEffect(() => {
        if (LOCALE_CACHE[normalizedCode]) {
            return undefined;
        }
        let cancelled = false;
        fetch(`/guide/locales/${normalizedCode.toLowerCase()}.json`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                LOCALE_CACHE[normalizedCode] = data;
                if (!cancelled) {
                    setLoadedPayloads(prev => ({ ...prev, [normalizedCode]: data }));
                }
            })
            .catch(() => {
                // Fallback limpio a EN si algún archivo local no estuviera disponible
            });
        return () => {
            cancelled = true;
        };
    }, [normalizedCode]);

    const activeRaw = loadedPayloads[normalizedCode] || LOCALE_CACHE[normalizedCode] || DEFAULT_GUIDE_LOCALES.EN;

    return useMemo(() => hydrateGuideLocalePayload(activeRaw), [activeRaw]);
}

