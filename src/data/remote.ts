/**
 * Solo se ejecuta al compilar (npm run build). Lee Google Sheets y sobrescribe
 * las tarifas, ofertas y condiciones del código, para que el HTML
 * publicado (y lo que ve Google) salga ya con los datos de la hoja.
 */
import { fetchLive, mergeRates } from './sheet';
import { rates } from './rates';
import { offers, display } from './site';

const live = await fetchLive();

if (live) {
  Object.assign(rates, mergeRates(rates, live.rates));
  if (live.offers) offers.splice(0, offers.length, ...live.offers);
  if (live.showFrom !== null) display.showFrom = live.showFrom;
  console.log(`[sheet] Datos cargados de Google Sheets: ${rates.periods.length} periodos, ${rates.packs.length} tarifas especiales, ${live.offers?.length ?? '–'} ofertas, precios desde: ${display.showFrom ? 'SI' : 'NO'}.`);
} else {
  console.log('[sheet] Sin Google Sheets (o no responde): se usan las tarifas del código.');
}

export const liveAtBuild = Boolean(live);
