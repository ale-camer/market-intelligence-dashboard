import React, { useState } from 'react';
import { Type, Check } from 'lucide-react';
import UserGuideView from '../UserGuideView';
import {
    GUIDE_TYPO_PRESETS,
    GUIDE_TYPO_STORAGE_KEY,
    getSavedGuideTypoPreset
} from '../guide/guideTypographyPresets';

export default function GuideModelsLab() {
    const [selectedPreset, setSelectedPreset] = useState(() => getSavedGuideTypoPreset());

    const handleSelectPreset = (preset) => {
        setSelectedPreset(preset);
        try {
            localStorage.setItem(GUIDE_TYPO_STORAGE_KEY, preset.id);
            window.dispatchEvent(new Event('storage'));
        } catch {
            // fallback
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                background: 'transparent'
            }}
        >
            {/* ══════════════════════════════════════════════════════════════════
                LABORATORIO DE TIPOGRAFÍA Y LECTURA EN DEV (T01 A T08)
                - Al elegir una opción, se aplica en vivo abajo y queda sincronizada
                  con la pantalla Guide (?view=guide).
               ══════════════════════════════════════════════════════════════════ */}
            <div
                style={{
                    background: 'rgba(9, 13, 22, 0.72)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Type size={14} color="var(--ui-accent, #10b981)" />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                            Laboratorio de Tipografía y Comodidad de Lectura (Guide)
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                            — {selectedPreset.shortDesc}
                        </span>
                    </div>

                    <span
                        className="mono-metric"
                        style={{
                            fontSize: '10px',
                            color: 'var(--ui-accent, #10b981)',
                            fontWeight: 700
                        }}
                    >
                        ACTIVA EN GUIDE: {selectedPreset.code} ({selectedPreset.bodySize} / LH {selectedPreset.lineHeight})
                    </span>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                        gap: '6px'
                    }}
                >
                    {GUIDE_TYPO_PRESETS.map(p => {
                        const isActive = selectedPreset.id === p.id;
                        return (
                            <button
                                key={p.id}
                                onClick={() => handleSelectPreset(p)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '6px',
                                    padding: '6px 10px',
                                    borderRadius: '7px',
                                    border: isActive
                                        ? '1px solid var(--ui-accent, #10b981)'
                                        : '1px solid rgba(148, 163, 184, 0.16)',
                                    background: isActive
                                        ? 'rgba(var(--ui-accent-rgb, 16,185,129), 0.16)'
                                        : 'rgba(15, 23, 42, 0.55)',
                                    color: isActive ? '#ffffff' : '#cbd5e1',
                                    fontFamily: p.fontFamily,
                                    fontSize: '11.5px',
                                    fontWeight: isActive ? 700 : 500,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.14s ease'
                                }}
                            >
                                <span
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    <strong style={{ color: 'var(--ui-accent, #10b981)', marginRight: '5px' }}>
                                        {p.code}
                                    </strong>
                                    {p.name}
                                </span>
                                {isActive && <Check size={13} color="var(--ui-accent, #10b981)" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* VISTA EN VIVO DE GUIDE CON LA TIPOGRAFÍA SELECCIONADA */}
            <UserGuideView typoPresetOverride={selectedPreset} compactHeight />
        </div>
    );
}
