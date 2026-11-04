import React, { useState } from 'react';
import GuideModelsLab from './dev/GuideModelsLab';
import SystemModelsLab from './dev/SystemModelsLab';

/* ═══════════════════════════════════════════════════════════════════════════
   REQUIRED EXPORTS FOR HEADERBAR.JSX (DO NOT REMOVE OR RENAME)
   ═══════════════════════════════════════════════════════════════════════════ */
export const DEV_ICON_CATALOG = [
    {
        id: 'lambda08-h-chiseled-nib',
        code: 'λ-08H',
        name: 'Pluma Cincelada (Chiseled Nib)',
        category: 'Tipografía λ Minimal',
        desc: 'Trazo caligráfico técnico con cortes diagonales a 45° en todos los terminales.',
        renderSvg: (color = '#10b981', size = 22) => (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <polygon points="6.5,4 9.8,4 18.8,20 15.5,20" fill={color} />
                <polygon points="11.6,11.2 13.4,13.8 8.4,20 5.2,20" fill={color} opacity="0.88" />
                <polygon points="5.2,4 9.8,4 8.2,6.2 5.2,6.2" fill={color} opacity="0.65" />
            </svg>
        )
    }
];

export const DEV_BOX_STYLES = [
    {
        id: 'free-green',
        code: 'FREE-G',
        name: 'Símbolo Libre • Verde Esmeralda (#10b981)',
        desc: 'Sin recuadro ni fondo; glifo libre en verde institucional.',
        glyphColor: '#10b981',
        containerStyle: () => ({
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none'
        })
    }
];

const DEV_MODELS = [
    {
        id: 'GUIDE-M1',
        screen: 'GUIDE',
        title: 'Guide • Opción 1 (Estructura Vista 1: Píldoras + Tabla Izq / Ficha Der + Matriz 100% Abajo)'
    },
    {
        id: 'GUIDE-M2',
        screen: 'GUIDE',
        title: 'Guide • Opción 2 (Estructura Vista 2/3: Grilla Simétrica 2×2 por Capítulos con Sub-Pestañas)'
    },
    {
        id: 'SYS-M1',
        screen: 'SYSTEM',
        title: 'System • Opción 1 (Estructura Vista 1: 6 Píldoras + Tabla Izq / Inspector & Cuotas Der + Serie Latencia 100%)'
    },
    {
        id: 'SYS-M2',
        screen: 'SYSTEM',
        title: 'System • Opción 2 (Estructura Vista 2/3: Grilla Simétrica 2×2 NOC + Serie Latencia AreaChart 100%)'
    }
];

export default function DevLabView() {
    const [selectedModel, setSelectedModel] = useState('GUIDE-M1');
    const activeObj = DEV_MODELS.find(m => m.id === selectedModel) || DEV_MODELS[0];

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#060911',
                color: '#f8fafc',
                padding: '12px 18px 64px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}
        >
            {/* SELECTOR CENTRADO DE MODELOS PARA GUIDE Y SYSTEM */}
            <div
                style={{
                    background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(9,13,22,0.98) 100%)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
                    {DEV_MODELS.map(m => {
                        const active = m.id === selectedModel;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setSelectedModel(m.id)}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: '7px',
                                    border: active ? '1.5px solid #10b981' : '1px solid rgba(148,163,184,0.18)',
                                    background: active ? 'rgba(16,185,129,0.18)' : 'rgba(2,6,23,0.65)',
                                    color: active ? '#6ee7b7' : '#cbd5e1',
                                    fontSize: '10.5px',
                                    fontWeight: active ? 900 : 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {m.title}
                            </button>
                        );
                    })}
                </div>
            </div>

            {activeObj.screen === 'GUIDE' ? (
                <GuideModelsLab activeModel={selectedModel} />
            ) : (
                <SystemModelsLab activeModel={selectedModel} />
            )}
        </div>
    );
}
