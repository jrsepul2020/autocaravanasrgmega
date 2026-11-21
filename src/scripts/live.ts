/**
 * En el navegador: lee Google Sheets y actualiza precios, ofertas y fechas
 * especiales sin volver a publicar la web. Marcas en el HTML:
 *   data-p="mileo.baja.short"   → precio/día de esa temporada
 *   data-p3="camper.baja"       → precio de 3 días (tarifa 3-14 días)
 *   data-from="mileo" | "all"   → precio "desde" (el más bajo)
 *   [data-offers] + <template>  → lista de ofertas activas
 *   [data-special] + <template> → lista de fechas de temporada especial
 * Lanza el evento "rg:live" (detail = datos) para el calculador del formulario.
 */
import { fetchLive, sheetId, offerPriceLabel, type LiveData } from '../data/sheet';

const KEY = 'rg-live-v1';
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

const fmtDate = (s: string) => new Date(s + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

function fill(tpl: HTMLTemplateElement, values: Record<string, string>) {
  const node = tpl.content.cloneNode(true) as DocumentFragment;
  node.querySelectorAll<HTMLElement>('[data-f]').forEach((el) => { el.textContent = values[el.dataset.f!] ?? ''; el.hidden = !el.textContent; });
  return node;
}

export function apply(d: LiveData) {
  const price = (path: string) => {
    const [v, s, k] = path.split('.') as any;
    return (d.prices as any)[v]?.[s]?.[k] as number | undefined;
  };
  document.querySelectorAll<HTMLElement>('[data-p]').forEach((el) => {
    const n = price(el.dataset.p!); if (n) el.textContent = String(n);
  });
  document.querySelectorAll<HTMLElement>('[data-p3]').forEach((el) => {
    const n = price(el.dataset.p3 + '.short'); if (n) el.textContent = String(n * 3).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  });
  const minOf = (v: string) => {
    const p = (d.prices as any)[v]; if (!p) return undefined;
    const all = Object.values(p).map((x: any) => x.long).filter(Boolean) as number[];
    return all.length === 4 ? Math.min(...all) : undefined; // solo si la tabla del vehículo está completa
  };
  document.querySelectorAll<HTMLElement>('[data-from]').forEach((el) => {
    const v = el.dataset.from!;
    const n = v === 'all' ? Math.min(...['mileo', 'camper'].map(minOf).filter(Boolean) as number[]) : minOf(v);
    if (n && Number.isFinite(n)) el.textContent = String(n);
  });

  if (d.hero) {
    const names: Record<string, string> = { mileo: 'Mileo 268', camper: 'Camper 120 UP' };
    const n = d.hero.price ?? minOf(d.hero.vehicle);
    document.querySelectorAll<HTMLElement>('[data-hero-text]').forEach((el) => { el.textContent = d.hero!.text || `${names[d.hero!.vehicle]} desde`; });
    if (n) document.querySelectorAll<HTMLElement>('[data-hero-price]').forEach((el) => { el.textContent = String(n); });
  } else {
    // Sin pestaña "Portada": precio automático del vehículo indicado en la página
    document.querySelectorAll<HTMLElement>('[data-hero-price][data-auto]').forEach((el) => { const n = minOf(el.dataset.auto!); if (n) el.textContent = String(n); });
  }

  const today = new Date().toISOString().slice(0, 10);
  if (d.offers) {
    const active = d.offers.filter((o) => o.until >= today);
    document.querySelectorAll<HTMLElement>('[data-offers]').forEach((box) => {
      const tpl = box.querySelector('template'); if (!tpl) return;
      box.querySelectorAll(':scope > :not(template)').forEach((n) => n.remove());
      active.forEach((o) => {
        const frag = fill(tpl, {
          title: o.title, text: o.text, price: offerPriceLabel(o),
          vehicle: o.vehicle || '', amount: o.price ? String(o.price) : '',
          until: o.until && o.until < '2999' ? `Válida hasta el ${new Date(o.until + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}` : '',
        });
        const card = frag.querySelector('.offer') as HTMLElement | null;
        if (card) card.dataset.vehicle = /mileo/i.test(o.vehicle || '') ? 'mileo' : 'camper';
        box.append(frag);
      });
      const wrap = box.closest<HTMLElement>('[data-offers-wrap]') ?? box;
      wrap.hidden = active.length === 0;
    });
    document.querySelectorAll<HTMLElement>('[data-offers-marquee]').forEach((box) => {
      const track = box.querySelector('.marquee__track'); if (!track) return;
      const sample = track.querySelector('.marquee__item'); if (!sample) return;
      const labels = active.length
        ? active.map((o) => (o.price ? `${o.title} · desde ${o.price} €/día` : o.title))
        : ['Consulta nuestras ofertas especiales de alquiler'];
      const items = [...labels, ...labels].map((label) => {
        const node = sample.cloneNode(true) as HTMLElement;
        const text = node.querySelector('span');
        if (text) text.textContent = label;
        return node;
      });
      track.replaceChildren(...items);
    });
  }
  if (d.special) {
    const upcoming = d.special.filter((x) => x.to >= today);
    document.querySelectorAll<HTMLElement>('[data-special]').forEach((box) => {
      const tpl = box.querySelector('template'); if (!tpl) return;
      box.querySelectorAll(':scope > :not(template)').forEach((n) => n.remove());
      upcoming.forEach((x) => box.append(fill(tpl, { name: x.name, from: fmtDate(x.from), to: fmtDate(x.to) })));
    });
  }
  (window as any).__rgLive = d;
  window.dispatchEvent(new CustomEvent('rg:live', { detail: d }));
}

if (sheetId) load().then((d) => d && apply(d));
