/**
 * ============================================================
 *  PRECIOS, OFERTAS Y CONDICIONES DESDE GOOGLE SHEETS
 * ============================================================
 *  Pestañas: "Tarifas", "Tarifas especiales", "Condiciones", "Ofertas" y "Ajustes"
 *  (la pestaña "CÓMO USAR" explica cada una). Las columnas se reconocen por su título.
 *  Compartir → "Cualquier persona con el enlace" → Lector.
 *
 *  La web lee la hoja:
 *   - al compilar (los datos quedan escritos en el HTML para Google), y
 *   - en vivo en el navegador de cada visitante (los cambios se ven en
 *     unos minutos sin volver a subir la web).
 *  Si la hoja no responde, se usan los valores de rates.ts / site.ts.
 */
import type { Period, Pack, Condition, Rates, TierKey, VehicleId } from './rates';

export const sheetId = '15ci4BIAbpV3NxUKtrd-QioHKiVRa55dwzitK-7Ho0TY';

export const TABS = { tarifas: 'Tarifas', especiales: 'Tarifas especiales', condiciones: 'Condiciones', ofertas: 'Ofertas', ajustes: 'Ajustes' } as const;
export type TabKey = keyof typeof TABS;

export const csvUrl = (tab: TabKey) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(TABS[tab])}`;

export type { VehicleId };
export type Offer = { title: string; text: string; until: string; vehicle?: string; price?: number | null; antes?: number | null };
export type LiveData = {
  /** Partes de la tarifa leídas de la hoja (null = esa pestaña no respondió). */
  rates: { periods: Period[] | null; packs: Pack[] | null; conditions: Condition[] | null };
  offers: Offer[] | null;
  /** Pestaña Ajustes → "Mostrar precios desde" (SI/NO). null = sin dato. */
  showFrom: boolean | null;
};

/** Mezcla la tarifa base con lo leído de la hoja. */
export const mergeRates = (base: Rates, live: LiveData['rates'] | undefined): Rates => ({
  periods: live?.periods ?? base.periods,
  packs: live?.packs ?? base.packs,
  conditions: live?.conditions ?? base.conditions,
});

/* ---------- CSV ---------- */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.map((r) => r.map((x) => x.trim())).filter((r) => r.some(Boolean));
}

/* ---------- Normalización ---------- */
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const num = (s: string) => {
  const n = parseFloat(String(s).replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

/** Acepta 04/12/2026, 4/12/2026, 2026-12-04 y 4-12-2026. Devuelve AAAA-MM-DD. */
export function toIso(s: string): string | null {
  const t = String(s).trim();
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/);
  if (m) {
    const y = m[3].length === 2 ? '20' + m[3] : m[3];
    return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  return null;
}

const vehicleOf = (s: string): VehicleId | null => (norm(s).includes('mileo') ? 'mileo' : norm(s).includes('camper') || norm(s).includes('120') ? 'camper' : null);
const yes = (s: string) => ['si', 'sí', 'x', '1', 'true', 'verdadero', 'yes'].includes(norm(s));

/** Texto de la etiqueta de precio de una oferta: "Camper 120 UP · desde 110 €/día" ('' si no tiene precio). */
export const offerPriceLabel = (o: { vehicle?: string; price?: number | null }) =>
  o.price ? `${o.vehicle ? o.vehicle + ' · ' : ''}desde ${o.price} €/día` : '';

/**
 * Rebaja de una oferta: precio de referencia tachado y % de descuento.
 * Referencia = "Precio antes" de la hoja o, si está vacío, la tarifa habitual más baja del vehículo.
 * Solo hay rebaja si el descuento es de un 5 % o más (si no, no se muestra tachado ni %).
 */
export function offerDeal(price?: number | null, antes?: number | null, base?: number | null) {
  const ref = antes || base || 0;
  if (!price || !ref || ref <= price) return null;
  const pct = Math.round((1 - price / ref) * 100);
  return pct >= 5 ? { antes: ref, pct } : null;
}

/** "Quedan 9 días" si la oferta caduca en 30 días o menos ('' si no). */
export function offerLeft(until: string, today = new Date()) {
  if (!until || until >= '2999') return '';
  const d = Math.ceil((new Date(until + 'T23:59:59').getTime() - today.getTime()) / 86400000);
  return d < 0 || d > 30 ? '' : d <= 1 ? '¡Último día!' : `Quedan ${d} días`;
}

export const offerVehicleId = (label?: string): VehicleId => (norm(label || '').includes('mileo') ? 'mileo' : 'camper');

/** Busca la columna cuya cabecera contiene alguna palabra de `any` y ninguna de `not`. */
function col(header: string[], any: string[], not: string[] = []) {
  return header.findIndex((h) => { const n = norm(h); return any.some((w) => n.includes(w)) && !not.some((w) => n.includes(w)); });
}
const at = (row: string[], i: number) => (i >= 0 ? row[i] ?? '' : '');

/** Convierte el CSV de cada pestaña en datos. Cada pestaña se valida por sus cabeceras
 *  (si una pestaña no existe, Google devuelve la primera: así no se mezclan datos). */
export function normalize(csv: Partial<Record<TabKey, string>>): LiveData {
  const out: LiveData = { rates: { periods: null, packs: null, conditions: null }, offers: null, showFrom: null };

  if (csv.tarifas) {
    const [h = [], ...rows] = parseCsv(csv.tarifas);
    const c = { name: col(h, ['periodo']), from: col(h, ['desde']), to: col(h, ['hasta']), veh: col(h, ['vehiculo', 'modelo']) };
    const tiers: [TierKey, number][] = [
      ['d2', col(h, ['2 dias'])], ['d34', col(h, ['3–4', '3-4', '3 a 4'])],
      ['d56', col(h, ['5–6', '5-6', '5 a 6'])], ['d7', col(h, ['7 dias', '7 o mas'])],
    ];
    if (c.name >= 0 && c.veh >= 0 && c.from >= 0 && c.to >= 0) {
      const map = new Map<string, Period>();
      for (const r of rows) {
        const v = vehicleOf(at(r, c.veh)), from = toIso(at(r, c.from)), to = toIso(at(r, c.to));
        if (!v || !from || !to) continue;
        const key = `${from}|${to}`;
        const p = map.get(key) ?? { name: at(r, c.name) || 'Tarifa', from, to, rates: {} };
        p.rates[v] = Object.fromEntries(tiers.map(([k, i]) => [k, num(at(r, i))]).filter(([, n]) => n)) as Period['rates'][VehicleId];
        map.set(key, p);
      }
      out.rates.periods = [...map.values()].sort((a, b) => a.from.localeCompare(b.from));
    }
  }
  if (csv.especiales) {
    const [h = [], ...rows] = parseCsv(csv.especiales);
    const c = { name: col(h, ['nombre']), from: col(h, ['desde']), to: col(h, ['hasta']), days: col(h, ['dias']), show: col(h, ['mostrar']), camper: col(h, ['camper']), mileo: col(h, ['mileo']) };
    if (c.name >= 0 && c.days >= 0 && (c.camper >= 0 || c.mileo >= 0)) {
      out.rates.packs = rows
        .filter((r) => at(r, c.name) && (c.show < 0 || !at(r, c.show) || yes(at(r, c.show))))
        .map((r) => ({
          name: at(r, c.name), from: toIso(at(r, c.from)) ?? '', to: toIso(at(r, c.to)) ?? '', days: num(at(r, c.days)) ?? 1,
          prices: Object.fromEntries([['camper', num(at(r, c.camper))], ['mileo', num(at(r, c.mileo))]].filter(([, n]) => n)),
        }))
        .filter((p) => Object.keys(p.prices).length);
    }
  }
  if (csv.condiciones) {
    const [h = [], ...rows] = parseCsv(csv.condiciones);
    if (col(h, ['concepto']) === 0) out.rates.conditions = rows.filter((r) => r[0] && r[1]).map((r) => ({ k: r[0], v: r[1] }));
  }
  if (csv.ofertas) {
    const [h = [], ...rows] = parseCsv(csv.ofertas);
    const c = {
      show: col(h, ['mostrar']), title: col(h, ['titulo']), text: col(h, ['texto']),
      veh: col(h, ['vehiculo', 'modelo']), price: col(h, ['precio'], ['texto', 'antes']), until: col(h, ['hasta', 'valida', 'caduca']),
      antes: col(h, ['antes', 'tachado']),
    };
    if (c.show >= 0 && c.title >= 0) {
      out.offers = rows
        .filter((r) => yes(at(r, c.show)) && at(r, c.title))
        .map((r) => ({
          title: at(r, c.title), text: at(r, c.text), until: toIso(at(r, c.until)) ?? '2999-12-31',
          vehicle: at(r, c.veh), price: num(at(r, c.price)), antes: num(at(r, c.antes)),
        }));
    }
  }
  if (csv.ajustes) {
    const [h = [], ...rows] = parseCsv(csv.ajustes);
    if (col(h, ['ajuste']) === 0) {
      const row = rows.find((r) => norm(r[0] ?? '').includes('mostrar precio'));
      if (row?.[1]) out.showFrom = yes(row[1]);
    }
  }
  return out;
}

export async function fetchLive(fetcher: typeof fetch = fetch, url: (t: TabKey) => string = csvUrl): Promise<LiveData | null> {
  if (!sheetId) return null;
  const keys = Object.keys(TABS) as TabKey[];
  const res = await Promise.all(keys.map(async (k) => {
    try {
      const r = await fetcher(url(k), { cache: 'no-store' });
      const t = r.ok ? await r.text() : '';
      return [k, t.startsWith('<') ? '' : t] as const; // HTML = hoja no compartida
    } catch { return [k, ''] as const; }
  }));
  const csv = Object.fromEntries(res.filter(([, t]) => t)) as Partial<Record<TabKey, string>>;
  return Object.keys(csv).length ? normalize(csv) : null;
}
