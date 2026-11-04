import React from 'react';
import DesignAlignmentLab from './dev/DesignAlignmentLab';

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

export default function DevLabView() {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'transparent',
                color: '#f8fafc',
                padding: '10px 18px 64px'
            }}
        >
            <DesignAlignmentLab />
        </div>
    );
}
