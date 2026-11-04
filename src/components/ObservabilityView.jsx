import React, { useState, useMemo, useEffect } from 'react';
import { evaluateEcosystemContracts, probeLiveCloudEndpoints } from '../services/observabilityService';

export default function ObservabilityView({ t }) {
  const [selectedId, setSelectedId] = useState('P-01');
  const [liveProbes, setLiveProbes] = useState({});
  const isES = t?.navWorkstation === 'Mercados';

  useEffect(() => {
    let mounted = true;
    probeLiveCloudEndpoints().then((res) => {
      if (mounted && res) setLiveProbes(res);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const { stores, projects: baseProjects } = useMemo(() => evaluateEcosystemContracts(), []);

  const projects = useMemo(() => {
    return baseProjects.map((proj) => {
      const probeKey = proj.id === 'P-04' ? 'P-08' : proj.id;
      const probe = liveProbes[probeKey];
      if (!probe || !probe.ok || !probe.payload || typeof probe.payload !== 'object') {
        return proj;
      }

      return {
        ...proj,
        state: 'OK',
        healthyText: {
          EN: `Active & Healthy • Live Cloud Run HTTP ${probe.status} OK (${probe.latencyMs}ms)`,
          ES: `Activo y Healthy • Cloud Run en vivo HTTP ${probe.status} OK (${probe.latencyMs}ms)`,
        },
      };
    });
  }, [baseProjects, liveProbes]);

  const allItems = useMemo(() => [...stores, ...projects], [stores, projects]);
  const selectedItem = useMemo(
    () => allItems.find((item) => item.id === selectedId) || null,
    [allItems, selectedId]
  );

  const okCount = projects.filter((e) => e.state === 'OK').length;
  const warnCount = allItems.filter((e) => e.state === 'WARN').length;
  const errCount = allItems.filter((e) => e.state === 'ERR').length;

  const summaryColor = errCount > 0 ? '#f43f5e' : warnCount > 0 ? '#f59e0b' : '#10b981';
  const summaryBgGradient =
    errCount > 0
      ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.14) 0%, var(--bg-panel-glass) 75%)'
      : warnCount > 0
      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, var(--bg-panel-glass) 75%)'
      : 'linear-gradient(135deg, rgba(16, 185, 129, 0.10) 0%, var(--bg-panel-glass) 75%)';

  const summaryText = isES
    ? errCount > 0
      ? `${okCount}/${projects.length} proyectos operativos • ${errCount} con error`
      : warnCount > 0
      ? `${okCount}/${projects.length} proyectos operativos • ${warnCount} para revisar`
      : `${okCount}/${projects.length} proyectos validados • 3/3 almacenes Free-Tier en cuota`
    : errCount > 0
    ? `${okCount}/${projects.length} projects operational • ${errCount} with error`
    : warnCount > 0
    ? `${okCount}/${projects.length} projects operational • ${warnCount} to review`
    : `${okCount}/${projects.length} projects validated • 3/3 Free-Tier stores within quota`;

  const getBadgeText = (item) =>
    item.badgeRight
      ? isES
        ? item.badgeRight.ES
        : item.badgeRight.EN
      : item.state === 'ERR'
      ? 'Error'
      : item.state === 'WARN'
      ? isES
        ? 'Revisar'
        : 'Review'
      : 'OK';

  const renderCompactCard = (item) => {
    const isSelected = selectedId === item.id;
    const dotColor =
      item.state === 'ERR' ? '#f43f5e' : item.state === 'WARN' ? '#f59e0b' : '#10b981';

    const cardGradient =
      item.state === 'ERR'
        ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, var(--bg-panel-glass) 82%)'
        : item.state === 'WARN'
        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, var(--bg-panel-glass) 82%)'
        : isSelected
        ? 'linear-gradient(135deg, rgba(var(--ui-accent-rgb), 0.16) 0%, var(--bg-panel-glass) 82%)'
        : 'var(--bg-panel-glass)';

    return (
      <div
        key={item.id}
        onClick={() => setSelectedId(isSelected ? null : item.id)}
        style={{
          borderRadius: '11px',
          background: cardGradient,
          backdropFilter: 'blur(12px)',
          border:
            item.state !== 'OK'
              ? `1px solid ${dotColor}`
              : isSelected
              ? '1px solid var(--ui-accent)'
              : '1px solid var(--border-light)',
          padding: '0.52rem 0.85rem',
          cursor: 'pointer',
          transition: 'all 0.14s ease',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.6rem',
          minWidth: 0,
          boxShadow: isSelected ? '0 0 14px rgba(var(--ui-accent-rgb), 0.18)' : 'none',
        }}
      >
        <span
          style={{
            fontSize: '0.77rem',
            fontWeight: isSelected ? 700 : 600,
            color: 'var(--text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.name}
        </span>

        <span
          className="mono-metric"
          style={{
            fontSize: '0.63rem',
            fontWeight: 700,
            color: dotColor,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '999px',
              backgroundColor: dotColor,
              boxShadow: `0 0 7px ${dotColor}`,
            }}
          />
          {getBadgeText(item)}
        </span>
      </div>
    );
  };

  const renderDetailCard = (item) => {
    if (!item) {
      return (
        <div
          style={{
            borderRadius: '16px',
            background: 'var(--bg-panel-glass)',
            backdropFilter: 'blur(14px)',
            border: '1px dashed var(--border-light)',
            padding: '1.5rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'var(--text-dim)',
            fontSize: '0.76rem',
            minHeight: '220px',
          }}
        >
          {isES
            ? 'Seleccioná cualquier card de la izquierda para abrir su diagnóstico completo acá.'
            : 'Click any card on the left to inspect its full diagnostic details here.'}
        </div>
      );
    }

    const dotColor =
      item.state === 'ERR' ? '#f43f5e' : item.state === 'WARN' ? '#f59e0b' : '#10b981';

    const detailGradient =
      item.state === 'ERR'
        ? 'linear-gradient(145deg, rgba(244, 63, 94, 0.14) 0%, var(--bg-panel-glass) 70%)'
        : item.state === 'WARN'
        ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.14) 0%, var(--bg-panel-glass) 70%)'
        : 'linear-gradient(145deg, rgba(16, 185, 129, 0.10) 0%, var(--bg-panel-glass) 70%)';

    const rows = [
      {
        label: isES ? 'Estado y Salud' : 'Status & Health',
        value: isES ? item.healthyText.ES : item.healthyText.EN,
        color: dotColor,
        bold: true,
      },
      {
        label: isES ? 'Última ejecución' : 'Last Run',
        value: isES ? item.lastRun.ES : item.lastRun.EN,
        color: 'var(--text-main)',
      },
      item.finopsCost && {
        label: isES ? 'Costo FinOps' : 'FinOps Spend',
        value: item.finopsCost,
        color: '#10b981',
        bold: true,
      },
      item.cloudTarget && {
        label: isES ? 'Runtime Cloud' : 'Cloud Runtime',
        value: item.cloudTarget,
        color: 'var(--text-muted)',
      },
      item.repo && {
        label: isES ? 'Repositorio' : 'Repository',
        value: `ale-camer/${item.repo}`,
        color: 'var(--text-main)',
      },
    ].filter(Boolean);

    return (
      <div
        style={{
          borderRadius: '16px',
          background: detailGradient,
          backdropFilter: 'blur(16px)',
          border: `1px solid ${dotColor}`,
          padding: '1.15rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        {/* Encabezado de la Card Abierta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '0.75rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span className="mono-metric" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 700 }}>
              {item.repo
                ? isES
                  ? `PROYECTO DEL ECOSISTEMA • ${item.id}`
                  : `ECOSYSTEM PROJECT • ${item.id}`
                : isES
                ? 'FINOPS & ALMACÉN COMPARTIDO'
                : 'FINOPS & SHARED DATA STORE'}
            </span>
            <span style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.25 }}>
              {item.name}
            </span>
          </div>

          <span
            className="mono-metric"
            style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              color: dotColor,
              padding: '0.22rem 0.6rem',
              borderRadius: '999px',
              border: `1px solid ${dotColor}`,
              backgroundColor: 'rgba(0,0,0,0.22)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.32rem',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '999px',
                backgroundColor: dotColor,
                boxShadow: `0 0 8px ${dotColor}`,
              }}
            />
            {getBadgeText(item)}
          </span>
        </div>

        {/* Filas de Diagnóstico */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.58rem' }}>
          {rows.map((r) => (
            <div
              key={r.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.14rem',
              }}
            >
              <span style={{ fontSize: '0.64rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {r.label}
              </span>
              <span
                className="mono-metric"
                style={{
                  fontSize: '0.72rem',
                  color: r.color,
                  fontWeight: r.bold ? 600 : 500,
                  lineHeight: 1.35,
                }}
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>

        {/* Bloque Destacado: Datos Esperados / Contrato Validado */}
        <div
          style={{
            marginTop: '0.15rem',
            padding: '0.75rem 0.85rem',
            borderRadius: '11px',
            backgroundColor: 'rgba(0, 0, 0, 0.22)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.28rem',
          }}
        >
          <span
            className="mono-metric"
            style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}
          >
            {isES ? 'Datos esperados / Vista de control' : 'Expected data / Validation view'}
          </span>
          <span
            className="mono-metric"
            style={{ fontSize: '0.7rem', color: 'var(--text-main)', lineHeight: 1.45 }}
          >
            {isES ? item.expectedData.ES : item.expectedData.EN}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '1220px',
        margin: '0 auto',
        width: '100%',
        paddingBottom: '1rem',
      }}
    >
      {/* 1. RESUMEN SUPERIOR COMPACTO */}
      <div
        style={{
          borderRadius: '13px',
          background: summaryBgGradient,
          backdropFilter: 'blur(14px)',
          border: `1px solid ${summaryColor}`,
          padding: '0.6rem 1.05rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '999px',
              backgroundColor: summaryColor,
              boxShadow: `0 0 8px ${summaryColor}`,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {summaryText}
          </span>
        </div>

        <span className="mono-metric" style={{ fontSize: '0.66rem', color: summaryColor, fontWeight: 700 }}>
          {isES ? 'FinOps GCP Real: ~$0.95 / $10.00 máx' : 'Real GCP FinOps: ~$0.95 / $10.00 cap'}
        </span>
      </div>

      {/* 2. LAYOUT RESPONSIVO MASTER-DETAIL */}
      <div className="utility-master-detail-grid">
        {/* IZQUIERDA: TODAS LAS CARDS VISIBLES EN 2 COLUMNAS RESPONSIVAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', minWidth: 0 }}>
          {/* FinOps & Almacenes Compartidos (4 en 2x2) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
            <span
              className="mono-metric"
              style={{ fontSize: '0.58rem', color: 'var(--text-dim)', fontWeight: 700, paddingLeft: '0.15rem' }}
            >
              {isES ? 'FINOPS & CAPA DE DATOS COMPARTIDA (4)' : 'FINOPS & SHARED DATA STORES (4)'}
            </span>
            <div className="utility-cards-2col">
              {stores.map(renderCompactCard)}
            </div>
          </div>

          {/* Los 13 Proyectos del Ecosistema (13 en 2 columnas) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
            <span
              className="mono-metric"
              style={{ fontSize: '0.58rem', color: 'var(--text-dim)', fontWeight: 700, paddingLeft: '0.15rem' }}
            >
              {isES ? 'PROYECTOS Y SERVICIOS DEL ECOSISTEMA (13)' : 'ECOSYSTEM PROJECTS & SERVICES (13)'}
            </span>
            <div className="utility-cards-2col">
              {projects.map(renderCompactCard)}
            </div>
          </div>
        </div>

        {/* DERECHA: CARD COMPLETA ABIERTA AL HACER CLIC */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem', minWidth: 0 }}>
          <span
            className="mono-metric"
            style={{ fontSize: '0.58rem', color: 'var(--text-dim)', fontWeight: 700, paddingLeft: '0.15rem' }}
          >
            {isES ? 'DETALLE DEL PROYECTO / RECURSO SELECCIONADO' : 'SELECTED PROJECT / RESOURCE DETAIL'}
          </span>
          {renderDetailCard(selectedItem)}
        </div>
      </div>
    </div>
  );
}
