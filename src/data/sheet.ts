/**
 * ============================================================
 *  PRECIOS, OFERTAS Y FECHAS ESPECIALES DESDE GOOGLE SHEETS
 * ============================================================
 *
 *  1. Crea la hoja a partir de admin/plantilla-precios-rgmega.xlsx
 *     (pestañas: "Precios", "Ofertas", "Fechas especiales").
 *  2. Compartir → "Cualquier persona con el enlace" → Lector.
 *  3. Copia el ID de la URL de la hoja:
 *     https://docs.google.com/spreadsheets/d/  ESTE_ES_EL_ID  /edit
 *     y pégalo abajo en `sheetId`.
 *
 *  La web lee la hoja:
 *   - al compilar (los precios quedan escritos en el HTML para Google), y
 *   - en vivo en el navegador de cada visitante (los cambios se ven en
 *     unos minutos sin volver a subir la web).
 *  Si la hoja no responde, se usan los precios de vehicles.ts / site.ts.
 */
export const sheetId = '15ci4BIAbpV3NxUKtrd-QioHKiVRa55dwzitK-7Ho0TY';

export const TABS = { precios: 'Precios', ofertas: 'Ofertas', fechas: 'Fechas especiales', portada: 'Portada' } as const;
export type TabKey = keyof typeof TABS;

export const csvUrl = (tab: TabKey) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(TABS[tab])}`;

export type SeasonKey = 'baja' | 'media' | 'alta' | 'especial';
export type VehicleId = 'mileo' | 'camper';
export type Offer = { title: string; text: string; until: string; vehicle?: string; price?: number | null };
/** Precio destacado de la portada. price null = automático (el más bajo del vehículo). */
export type Hero = { vehicle: VehicleId; text: string; price: number | null };
export type LiveData = {
  prices: Partial<Record<VehicleId, Partial<Record<SeasonKey, { short: number; long: number }>>>>;
  offers: Offer[] | null;
  hero: Hero | null;
  special: { name: string; from: string; to: string }[] | null;
};

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
const seasonOf = (s: string): SeasonKey | null => {
  const n = norm(s);
  return n.includes('baja') ? 'baja' : n.includes('media') ? 'media' : n.includes('alta') ? 'alta' : n.includes('especial') ? 'especial' : null;
};
const yes = (s: string) => ['si', 'sí', 'x', '1', 'true', 'verdadero', 'yes'].includes(norm(s));

/** Texto de la etiqueta de precio de una oferta: "Camper 120 UP · desde 110 €/día" ('' si no tiene precio). */
export const offerPriceLabel = (o: { vehicle?: string; price?: number | null }) =>
  o.price ? `${o.vehicle ? o.vehicle + ' · ' : ''}desde ${o.price} €/día` : '';

/** Busca la columna cuya cabecera contiene alguna palabra de `any` y ninguna de `not`. */
function col(header: string[], any: string[], not: string[] = []) {
  return header.findIndex((h) => { const n = norm(h); return any.some((w) => n.includes(w)) && !not.some((w) => n.includes(w)); });
}
const at = (row: string[], i: number) => (i >= 0 ? row[i] ?? '' : '');

/** Convierte el CSV de cada pestaña en datos. Ignora filas incompletas. Las cabeceras (fila 1) se saltan. */
export function normalize(csv: Partial<Record<TabKey, string>>): LiveData {
  const out: LiveData = { prices: {}, offers: null, special: null, hero: null };

  if (csv.precios) {
    for (const [veh, temp, short, long] of parseCsv(csv.precios).slice(1)) {
      const v = vehicleOf(veh ?? ''), s = seasonOf(temp ?? ''), a = num(short ?? ''), b = num(long ?? '');
      if (v && s && a) (out.prices[v] ??= {})[s] = { short: a, long: b ?? a };
    }
  }
  if (csv.ofertas) {
    const [h = [], ...rows] = parseCsv(csv.ofertas);
    const c = {
      show: col(h, ['mostrar']), title: col(h, ['titulo']), text: col(h, ['texto']),
      veh: col(h, ['vehiculo', 'modelo']), price: col(h, ['precio'], ['texto']), until: col(h, ['hasta', 'valida', 'caduca']),
    };
    if (c.show >= 0 && c.title >= 0) {
      out.offers = rows
        .filter((r) => yes(at(r, c.show)) && at(r, c.title))
        .map((r) => ({
          title: at(r, c.title), text: at(r, c.text), until: toIso(at(r, c.until)) ?? '2999-12-31',
          vehicle: at(r, c.veh), price: num(at(r, c.price)),
        }));
    }
  }
  if (csv.fechas) {
    const list = parseCsv(csv.fechas).slice(1)
      .map(([name, from, to]) => ({ name, from: toIso(from ?? ''), to: toIso(to ?? '') ?? toIso(from ?? '') }))
      .filter((d): d is { name: string; from: string; to: string } => Boolean(d.name && d.from && d.to));
    out.special = list.length ? list : null; // si la pestaña está vacía, se mantienen las fechas del código
  }
  if (csv.portada) {
    const [h = [], row = []] = parseCsv(csv.portada);
    const c = { veh: col(h, ['vehiculo', 'modelo']), text: col(h, ['texto']), price: col(h, ['precio'], ['texto']) };
    // Si la pestaña no existe, Google devuelve otra: solo la aceptamos si tiene sus columnas propias.
    const v = vehicleOf(at(row, c.veh));
    if (c.veh >= 0 && c.text >= 0 && c.price >= 0 && col(h, ['temporada', 'titulo', 'mostrar']) < 0 && v) {
      out.hero = { vehicle: v, text: at(row, c.text), price: num(at(row, c.price)) };
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
