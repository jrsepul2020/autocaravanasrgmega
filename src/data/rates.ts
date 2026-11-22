/**
 * ============================================================
 *  TARIFAS POR TRAMOS DE DÍAS (se usan en servidor y navegador)
 * ============================================================
 *  Vienen de la hoja de Google (pestañas Tarifas, Tarifas especiales
 *  y Condiciones). Estos valores son el respaldo si la hoja no responde.
 *
 *  - Los días se cuentan por noches: viernes a domingo = 2 días.
 *  - Precio = tarifa por día del tramo × días, según el periodo en el que
 *    empieza el alquiler. Si las fechas coinciden justo con una tarifa
 *    especial con fechas, se usa su precio cerrado.
 *  - Si la fecha no está en ningún periodo, no hay precio: "consúltanos".
 */
export type VehicleId = 'mileo' | 'camper';

export const TIERS = [
  { key: 'd1', label: '1 día', min: 1, max: 1 },
  { key: 'd2', label: '2 días', min: 2, max: 2 },
  { key: 'd34', label: '3–4 días', min: 3, max: 4 },
  { key: 'd56', label: '5–6 días', min: 5, max: 6 },
  { key: 'd7', label: '7 días o más', min: 7, max: 9999 },
] as const;
export type TierKey = (typeof TIERS)[number]['key'];
export type Tiers = Partial<Record<TierKey, number>>;
export type Period = { name: string; from: string; to: string; rates: Partial<Record<VehicleId, Tiers>> };
export type Pack = { name: string; from: string; to: string; days: number; prices: Partial<Record<VehicleId, number>> };
export type Condition = { k: string; v: string };
export type Rates = { periods: Period[]; packs: Pack[]; conditions: Condition[] };

/** Tramo que se usa para el precio "desde" (lo que anunciáis: 3–4 días). */
export const FROM_TIER: TierKey = 'd34';

export const rates: Rates = {
  periods: [
    {
      name: 'Noviembre y diciembre 2026', from: '2026-11-01', to: '2026-12-31',
      rates: {
        camper: { d1: 99, d2: 89, d34: 79, d56: 75, d7: 69 },
        mileo: { d1: 119, d2: 109, d34: 99, d56: 95, d7: 89 },
      },
    },
  ],
  packs: [
    { name: 'Puente de diciembre', from: '2026-12-05', to: '2026-12-09', days: 4, prices: { camper: 396, mileo: 476 } },
    { name: 'Navidad', from: '2026-12-24', to: '2026-12-27', days: 3, prices: { camper: 327, mileo: 387 } },
    { name: 'Fin de Año', from: '2026-12-30', to: '2027-01-02', days: 3, prices: { camper: 327, mileo: 387 } },
    { name: 'Fin de semana: viernes a domingo', from: '', to: '', days: 2, prices: { camper: 178, mileo: 218 } },
    { name: 'Fin de semana largo: viernes a lunes', from: '', to: '', days: 3, prices: { camper: 237, mileo: 297 } },
  ],
  conditions: [
    { k: 'Kilómetros', v: 'Hasta 250 km de viaje incluidos' },
    { k: 'Exceso de kilómetros', v: '0,40 €/km' },
    { k: 'Alquiler mínimo', v: '1 día (sujeto a disponibilidad)' },
    { k: 'Precios', v: 'Orientativos, con IVA incluido. Todo es negociable: pregúntanos.' },
    { k: 'Fianza', v: 'A confirmar' },
    { k: 'Entrega y devolución', v: 'Horario a convenir' },
  ],
};

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

export const tierFor = (days: number): TierKey => TIERS.find((t) => days >= t.min && days <= t.max)!.key;
export const tierLabel = (k: TierKey) => TIERS.find((t) => t.key === k)!.label;

/** Días de alquiler = noches entre recogida y devolución (mínimo 1). */
export function nights(from: string, to: string) {
  const a = Date.UTC(+from.slice(0, 4), +from.slice(5, 7) - 1, +from.slice(8, 10));
  const b = Date.UTC(+to.slice(0, 4), +to.slice(5, 7) - 1, +to.slice(8, 10));
  return Math.max(1, Math.round((b - a) / 86400000));
}

export const periodFor = (r: Rates, iso: string) => r.periods.find((p) => iso >= p.from && iso <= p.to);

/** Precio por día de referencia de una fecha (tramo 3–4 días), para el calendario. */
export const dayRate = (r: Rates, v: VehicleId, iso: string) => periodFor(r, iso)?.rates[v]?.[FROM_TIER];

/** Tarifas especiales con fechas que incluyen ese día. */
export const packsOn = (r: Rates, iso: string) => r.packs.filter((p) => p.from && iso >= p.from && iso <= p.to);

export type Quote =
  | { ok: true; days: number; total: number; perDay: number; tier: TierKey; period?: Period; pack?: Pack; overlapsPack?: Pack }
  | { ok: false; days: number };

/** Precio orientativo de un alquiler. */
export function quote(r: Rates, v: VehicleId, from: string, to: string): Quote {
  const days = nights(from, to);
  const exact = r.packs.find((p) => p.from === from && p.to === to && p.prices[v]);
  if (exact) return { ok: true, days, total: exact.prices[v]!, perDay: Math.round(exact.prices[v]! / days), tier: tierFor(days), pack: exact };
  const period = periodFor(r, from);
  const tier = tierFor(days);
  const perDay = period?.rates[v]?.[tier];
  if (!perDay) return { ok: false, days };
  const overlapsPack = r.packs.find((p) => p.from && p.from <= to && p.to >= from && p.prices[v]);
  return { ok: true, days, total: perDay * days, perDay, tier, period, overlapsPack };
}

/** Precio "desde" (tramo 3–4 días) de los periodos vigentes; si no hay vigentes, de todos. */
export function fromRate(r: Rates, v: VehicleId): number | undefined {
  const today = todayIso();
  const pick = (ps: Period[]) => ps.map((p) => p.rates[v]?.[FROM_TIER]).filter((n): n is number => !!n);
  const list = pick(r.periods.filter((p) => p.to >= today));
  const all = list.length ? list : pick(r.periods);
  return all.length ? Math.min(...all) : undefined;
}

/** Texto de una condición por su concepto ("kilómetros", "mínimo"…). */
export function condition(r: Rates, key: string) {
  const k = norm(key);
  return r.conditions.find((c) => norm(c.k).includes(k))?.v ?? '';
}

export const visiblePeriods = (r: Rates) => { const t = todayIso(); return r.periods.filter((p) => p.to >= t); };
export const visiblePacks = (r: Rates) => { const t = todayIso(); return r.packs.filter((p) => !p.to || p.to >= t); };

/* ---------- HTML compartido (servidor y navegador) ---------- */
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const fmtDate = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
const names: Record<VehicleId, string> = { camper: 'Camper 120 UP', mileo: 'Mileo 268' };

/** Tabla de tarifas por tramos (una por periodo vigente). */
export function ratesTableHtml(r: Rates, only?: VehicleId) {
  const ids = (only ? [only] : (['camper', 'mileo'] as VehicleId[]));
  const ps = visiblePeriods(r);
  if (!ps.length) return '<p class="rt-empty">Estamos actualizando las tarifas. Escríbenos y te damos precio para tus fechas.</p>';
  return ps.map((p) => `
    <div class="rt-period">
      <p class="rt-title"><strong>${esc(p.name)}</strong> <span>${fmtDate(p.from)} – ${fmtDate(p.to)}</span></p>
      <div class="rt-scroll"><table class="rt">
        <caption class="visually-hidden">Precio por día del alquiler en ${esc(p.name)}</caption>
        <thead><tr><th scope="col">Días de alquiler</th>${ids.map((v) => `<th scope="col">${names[v]}</th>`).join('')}</tr></thead>
        <tbody>${TIERS.map((t) => `<tr><th scope="row">${t.label}</th>${ids.map((v) => { const n = p.rates[v]?.[t.key]; return `<td>${n ? `<b>${n} €</b><small>/día</small>` : '<span class="rt-ask">Consultar</span>'}</td>`; }).join('')}</tr>`).join('')}</tbody>
      </table></div>
    </div>`).join('');
}

/** Lista de tarifas especiales (precio cerrado). */
export function packsHtml(r: Rates, only?: VehicleId) {
  const ids = (only ? [only] : (['camper', 'mileo'] as VehicleId[]));
  const list = visiblePacks(r).filter((p) => ids.some((v) => p.prices[v]));
  if (!list.length) return '';
  return `<ul class="rt-packs">${list.map((p) => `
    <li><span class="rt-pack-name"><strong>${esc(p.name)}</strong> <small>${p.days} ${p.days === 1 ? 'día' : 'días'}${p.from ? ` · ${fmtDate(p.from)} – ${fmtDate(p.to)}` : ''}</small></span>
    <span class="rt-pack-prices">${ids.filter((v) => p.prices[v]).map((v) => `<span>${names[v]} <b>${p.prices[v]} €</b></span>`).join('')}</span></li>`).join('')}</ul>`;
}

/** Condiciones (kilómetros, mínimo, fianza…). */
export const conditionsHtml = (r: Rates) => `<dl class="rt-cond">${r.conditions.map((c) => `<div><dt>${esc(c.k)}</dt><dd>${esc(c.v)}</dd></div>`).join('')}</dl>`;
