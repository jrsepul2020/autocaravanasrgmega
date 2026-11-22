/**
 * En el navegador: lee Google Sheets y actualiza tarifas, ofertas y condiciones
 * sin volver a publicar la web. Marcas en el HTML:
 *   data-from="mileo" | "camper" | "all"  → precio "desde" (tramo 3–4 días)
 *   [data-rates-table] (data-only)        → tabla de tarifas por tramos
 *   [data-packs] (data-only)              → tarifas especiales
 *   [data-conditions]                     → condiciones (km, mínimo, fianza…)
 *   data-cond="kilómetros"                → texto de una condición
 *   [data-offers] + <template>            → lista de ofertas activas
 * Lanza el evento "rg:live" para el calendario y el formulario.
 */
import { fetchLive, sheetId, mergeRates, offerDeal, offerLeft, offerVehicleId, type LiveData } from '../data/sheet';
import { fromRate, ratesTableHtml, packsHtml, conditionsHtml, condition, type VehicleId } from '../data/rates';
import { baseRates } from './rates-client';

const KEY = 'rg-live-v2';
const TTL = 5 * 60 * 1000;

async function load(): Promise<LiveData | null> {
  try {
    const c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (c && Date.now() - c.t < TTL) return c.d;
  } catch {}
  const d = await fetchLive();
  try { if (d) sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d })); } catch {}
  return d;
}

function fill(tpl: HTMLTemplateElement, values: Record<string, string>) {
  const node = tpl.content.cloneNode(true) as DocumentFragment;
  node.querySelectorAll<HTMLElement>('[data-f]').forEach((el) => { el.textContent = values[el.dataset.f!] ?? ''; el.hidden = !el.textContent; });
  return node;
}

export function apply(d: LiveData) {
  const r = mergeRates(baseRates(), d.rates);
  (window as any).__rgRates = r;
  const only = (el: HTMLElement) => (el.dataset.only || undefined) as VehicleId | undefined;

  document.querySelectorAll<HTMLElement>('[data-from]').forEach((el) => {
    const v = el.dataset.from!;
    const list = (v === 'all' ? ['mileo', 'camper'] : [v]).map((x) => fromRate(r, x as VehicleId)).filter((n): n is number => !!n);
    if (list.length) el.textContent = String(Math.min(...list));
  });
  document.querySelectorAll<HTMLElement>('[data-rates-table]').forEach((el) => { el.innerHTML = ratesTableHtml(r, only(el)); });
  document.querySelectorAll<HTMLElement>('[data-packs]').forEach((el) => { el.innerHTML = packsHtml(r, only(el)); el.closest<HTMLElement>('[data-packs-wrap]')?.toggleAttribute('hidden', !el.innerHTML.trim()); });
  document.querySelectorAll<HTMLElement>('[data-conditions]').forEach((el) => { el.innerHTML = conditionsHtml(r); });
  document.querySelectorAll<HTMLElement>('[data-cond]').forEach((el) => { const t = condition(r, el.dataset.cond!); if (t) el.textContent = t; });

  const today = new Date().toISOString().slice(0, 10);
  if (d.offers) {
    const active = d.offers.filter((o) => o.until >= today);
    document.querySelectorAll<HTMLElement>('[data-offers]').forEach((box) => {
      const tpl = box.querySelector('template'); if (!tpl) return;
      box.querySelectorAll(':scope > :not(template)').forEach((n) => n.remove());
      active.forEach((o) => {
        const vid = offerVehicleId(o.vehicle);
        const deal = offerDeal(o.price, o.antes, fromRate(r, vid));
        const frag = fill(tpl, {
          title: o.title, text: o.text, vehicle: o.vehicle || '', amount: o.price ? String(o.price) : '',
          antes: deal ? `${deal.antes} €` : '', wasLabel: deal ? (o.antes ? 'Antes' : 'Tarifa habitual') : '',
          pct: deal ? `-${deal.pct}%` : '', left: offerLeft(o.until),
          until: o.until && o.until < '2999' ? `Válida hasta el ${new Date(o.until + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}` : '',
        });
        const card = frag.querySelector<HTMLElement>('[data-vehicle]');
        if (card) card.dataset.vehicle = vid;
        box.append(frag);
      });
      const wrap = box.closest<HTMLElement>('[data-offers-wrap]') ?? box;
      wrap.hidden = active.length === 0;
    });
  }
  // Interruptor "Mostrar precios desde" de la pestaña Ajustes
  if (d.showFrom !== null && d.showFrom !== undefined) document.documentElement.classList.toggle('no-from', !d.showFrom);
  (window as any).__rgLive = d;
  window.dispatchEvent(new CustomEvent('rg:live', { detail: r }));
}

if (sheetId) load().then((d) => d && apply(d));
