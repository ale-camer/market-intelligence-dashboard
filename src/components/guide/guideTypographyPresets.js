/* ═══════════════════════════════════════════════════════════════════════════
   PRESETS TIPOGRÁFICOS Y DE ERGONOMÍA VISUAL PARA GUIDE (T01 A T08)
   - Probables en DEV (?view=dev → Guide) y sincronizados automáticamente
     con la pantalla Guide (?view=guide) mediante localStorage.
   ═══════════════════════════════════════════════════════════════════════════ */

export const GUIDE_TYPO_STORAGE_KEY = 'mid_guide_typo_v1';

export const GUIDE_TYPO_PRESETS = [
    {
        id: 'T01',
        code: 'T01',
        name: 'Inter Optical (Docker / Stripe Docs)',
        shortDesc: 'Sans-serif neutra de alta abertura óptica, tracking relajado y contraste suave anti-encandilamiento.',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        headingFontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        bodySize: '15.5px',
        bulletSize: '15px',
        lineHeight: 1.78,
        letterSpacing: '-0.006em',
        h1Size: '30px',
        h2Size: '21px',
        bodyColor: 'var(--text-body, #d6e0ec)',
        headingColor: 'var(--text-main, #f8fafc)',
        boldColor: 'var(--text-main, #ffffff)',
        fontSmoothing: 'antialiased'
    },
    {
        id: 'T02',
        code: 'T02',
        name: 'Source Sans 3 (Humanista Editorial)',
        shortDesc: 'Diseñada por Adobe específicamente para lectura prolongada en pantalla; trazos abiertos y muy descansada.',
        fontFamily: "'Source Sans 3', -apple-system, sans-serif",
        headingFontFamily: "'Source Sans 3', -apple-system, sans-serif",
        bodySize: '16.5px',
        bulletSize: '16px',
        lineHeight: 1.8,
        letterSpacing: '0.004em',
        h1Size: '31px',
        h2Size: '22px',
        bodyColor: 'var(--text-body, #d8e2ee)',
        headingColor: 'var(--text-main, #f8fafc)',
        boldColor: 'var(--text-main, #ffffff)',
        fontSmoothing: 'antialiased'
    },
    {
        id: 'T03',
        code: 'T03',
        name: 'Atkinson Hyperlegible ( Cero Fatiga Visual )',
        shortDesc: 'Creada para máxima claridad ocular: diferencia cada letra con precisión y elimina el cansancio al leer.',
        fontFamily: "'Atkinson Hyperlegible', sans-serif",
        headingFontFamily: "'Atkinson Hyperlegible', sans-serif",
        bodySize: '15.5px',
        bulletSize: '15px',
        lineHeight: 1.82,
        letterSpacing: '0.01em',
        h1Size: '29px',
        h2Size: '21px',
        bodyColor: 'var(--text-body, #dce5f0)',
        headingColor: 'var(--text-main, #ffffff)',
        boldColor: 'var(--text-main, #ffffff)',
        fontSmoothing: 'antialiased'
    },
    {
        id: 'T04',
        code: 'T04',
        name: 'IBM Plex Sans (GitBook / Carbon Docs)',
        shortDesc: 'Equilibrio técnico-humanista con gran altura de x y excelente ritmo horizontal.',
        fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
        headingFontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
        bodySize: '15.5px',
        bulletSize: '15px',
        lineHeight: 1.76,
        letterSpacing: '0.005em',
        h1Size: '29px',
        h2Size: '21px',
        bodyColor: 'var(--text-body, #d5dfeb)',
        headingColor: 'var(--text-main, #f8fafc)',
        boldColor: 'var(--text-main, #ffffff)',
        fontSmoothing: 'antialiased'
    },
    {
        id: 'T05',
        code: 'T05',
        name: 'Lora Editorial Serif (Estilo Libro / Substack)',
        shortDesc: 'Cuerpo con serifa cálida de lectura literaria y títulos en Inter limpio para guiar el ojo por cada renglón.',
        fontFamily: "'Lora', Georgia, serif",
        headingFontFamily: "'Inter', -apple-system, sans-serif",
        bodySize: '16px',
        bulletSize: '15.5px',
        lineHeight: 1.85,
        letterSpacing: '0.005em',
        h1Size: '30px',
        h2Size: '21px',
        bodyColor: 'var(--text-body, #dedcd6)',
        headingColor: 'var(--text-main, #f8fafc)',
        boldColor: 'var(--text-main, #ffffff)',
        fontSmoothing: 'antialiased'
    },
    {
        id: 'T06',
        code: 'T06',
        name: 'Inter Warm Parchment (Tono Cálido Nocturno)',
        shortDesc: 'Tipografía Inter con tinte cálido marfil que reduce el brillo azul sobre fondos oscuros.',
        fontFamily: "'Inter', -apple-system, sans-serif",
        headingFontFamily: "'Inter', -apple-system, sans-serif",
        bodySize: '16px',
        bulletSize: '15.5px',
        lineHeight: 1.82,
        letterSpacing: '0.004em',
        h1Size: '30px',
        h2Size: '21.5px',
        bodyColor: 'var(--text-body, #e4dfd7)',
        headingColor: 'var(--text-main, #f7f4ef)',
        boldColor: 'var(--text-main, #ffffff)',
        fontSmoothing: 'antialiased'
    },
    {
        id: 'T07',
        code: 'T07',
        name: 'Nativa del Sistema (System UI / Ubuntu / SF)',
        shortDesc: 'Usa el motor de renderizado de fuentes nativo de tu sistema operativo con suavizado subpíxel.',
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, sans-serif",
        headingFontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, sans-serif",
        bodySize: '15.5px',
        bulletSize: '15px',
        lineHeight: 1.76,
        letterSpacing: '0.004em',
        h1Size: '29px',
        h2Size: '21px',
        bodyColor: 'var(--text-body, #d8e1ed)',
        headingColor: 'var(--text-main, #f8fafc)',
        boldColor: 'var(--text-main, #ffffff)',
        fontSmoothing: 'auto'
    },
    {
        id: 'T08',
        code: 'T08',
        name: 'Large Comfort 17px (Lectura Amplia)',
        shortDesc: 'Cuerpo de 17px e interlineado generoso de 1.86 para leer a mayor distancia del monitor sin esfuerzo.',
        fontFamily: "'Inter', -apple-system, sans-serif",
        headingFontFamily: "'Inter', -apple-system, sans-serif",
        bodySize: '17px',
        bulletSize: '16.5px',
        lineHeight: 1.86,
        letterSpacing: '0.002em',
        h1Size: '32px',
        h2Size: '23px',
        bodyColor: 'var(--text-body, #dbe4f0)',
        headingColor: 'var(--text-main, #ffffff)',
        boldColor: 'var(--text-main, #ffffff)',
        fontSmoothing: 'antialiased'
    }
];

export function getSavedGuideTypoPreset() {
    try {
        const savedId = localStorage.getItem(GUIDE_TYPO_STORAGE_KEY);
        if (savedId) {
            const match = GUIDE_TYPO_PRESETS.find(p => p.id === savedId);
            if (match) return match;
        }
    } catch {
        // fallback
    }
    return GUIDE_TYPO_PRESETS[0];
}

