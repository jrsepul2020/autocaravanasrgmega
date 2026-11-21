/**
 * Solo se ejecuta al compilar (npm run build). Lee Google Sheets y sobrescribe
 * los precios, ofertas y fechas especiales del código, para que el HTML
 * publicado (y lo que ve Google) salga ya con los datos de la hoja.
 */
import { fetchLive } from './sheet';
import { vehicles } from './vehicles';
import { offers, specialDates, heroPrice } from './site';

const live = await fetchLive();

if (live) {
  for (const v of vehicles) {
    const p = live.prices[v.id as 'mileo' | 'camper'];
    if (p) Object.assign(v.prices, p);
  }
  if (live.offers) offers.splice(0, offers.length, ...live.offers);
  if (live.special) specialDates.splice(0, specialDates.length, ...live.special);
  if (live.hero) Object.assign(heroPrice, live.hero);
  console.log(`[sheet] Datos cargados de Google Sheets: ${Object.keys(live.prices).length} vehículos, ${live.offers?.length ?? '–'} ofertas, ${live.special?.length ?? '–'} fechas especiales.`);
} else {
  console.log('[sheet] Sin Google Sheets (o no responde): se usan los precios del código.');
}

export const liveAtBuild = Boolean(live);
