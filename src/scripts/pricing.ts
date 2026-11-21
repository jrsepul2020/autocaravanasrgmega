import { specialDates, pricing, type SeasonKey } from '../data/site';

let special = specialDates;
/** Permite actualizar las fechas especiales con los datos de Google Sheets. */
export const setSpecialDates = (list: { from: string; to: string }[] | null | undefined) => { if (list?.length) special = list as typeof specialDates; };

export type PriceTable = Record<SeasonKey, { short: number; long: number }>;

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function seasonFor(d: Date): SeasonKey {
  const s = iso(d);
  if (special.some((x) => s >= x.from && s <= x.to)) return 'especial';
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (m === 7 || m === 8) return 'alta';
  if ((m === 6 && day >= 16) || (m === 9 && day <= 15)) return 'alta';
  if (m === 4 || m === 5 || m === 6 || m === 9) return 'media';
  return 'baja';
}

/** Días de alquiler contando el día de recogida y el de devolución. */
export function rentalDays(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / 86400000) + 1;
}

export function estimate(prices: PriceTable, from: Date, to: Date) {
  const days = rentalDays(from, to);
  if (!(days > 0)) return null;
  const long = days >= pricing.longStayFrom;
  const breakdown: Partial<Record<SeasonKey, { days: number; rate: number }>> = {};
  let total = 0;
  const d = new Date(from);
  for (let i = 0; i < days; i++) {
    const s = seasonFor(d);
    const rate = long ? prices[s].long : prices[s].short;
    total += rate;
    breakdown[s] = { days: (breakdown[s]?.days ?? 0) + 1, rate };
    d.setDate(d.getDate() + 1);
  }
  return { days, total, breakdown, unlimitedKm: days > 7, belowMin: days < pricing.minDays };
}

export const parseDate = (v: string) => {
  const [y, m, d] = v.split('-').map(Number);
  return y ? new Date(y, m - 1, d) : null;
};
