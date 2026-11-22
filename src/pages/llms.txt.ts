/**
 * /llms.txt — resumen de la web para buscadores y asistentes con IA (ChatGPT, Perplexity, Gemini…).
 * Se genera al compilar con los datos actuales (precios de Google Sheets incluidos).
 * Formato: https://llmstxt.org
 */
import type { APIRoute } from 'astro';
import '../data/remote';
import { site, pricing, offers } from '../data/site';
import { rates, TIERS, visiblePeriods, visiblePacks } from '../data/rates';
import { vehicles, fromPrice } from '../data/vehicles';
import { faqs } from '../data/faqs';
import { rutas } from '../data/rutas';
import { px } from '../data/vehicles';
import { keyFacts } from '../data/facts';

export const GET: APIRoute = () => {
  const u = (p: string) => new URL(p, site.url).href;
  const today = new Date().toISOString().slice(0, 10);
  const activeOffers = offers.filter((o) => o.until >= today);

  const lines: string[] = [
    `# ${site.gbp.name} — Alquiler de autocaravanas en Sevilla`,
    '',
    `> Empresa local de alquiler de autocaravanas y campers con recogida y devolución en Salteras (Sevilla), a ${site.distanceToSevilla}. Dos vehículos Benimar: Mileo 268 y Camper 120 UP. Alquiler con seguro, asistencia 24 h, mascotas y parking gratis.`,
    '',
    `Última actualización: ${today}. Precios orientativos con IVA; para fechas o casos concretos, consultar por teléfono o WhatsApp.`,
    '',
    '## Datos clave',
    ...keyFacts().map((f) => `- **${f.k}:** ${f.v}`),
    '',
    '## Autocaravanas',
    ...vehicles.flatMap((v) => [
      `### ${v.name} (${v.type})`,
      `- Ficha: ${u(v.slug)}`,
      `- Disponibilidad y precio por día: ${u(v.calSlug)}`,
      `- ${v.tagline}. Ideal para: ${v.idealFor}.`,
      `- ${v.keyFacts.map((f) => `${f.label}: ${f.value}`).join(' · ')}`,
      '',
    ]),
    '## Tarifas (orientativas, precio por día con IVA; los días se cuentan por noches)',
    ...visiblePeriods(rates).flatMap((p) => [
      `### ${p.name} (${p.from} a ${p.to})`,
      ...vehicles.map((v) => `- ${v.short}: ${TIERS.map((t) => `${t.label} ${p.rates[v.id]?.[t.key] ?? 'consultar'} €`).join(' · ')}`),
    ]),
    ...(visiblePacks(rates).length ? ['### Tarifas especiales (precio total)', ...visiblePacks(rates).map((p) => `- ${p.name} (${p.days} días${p.from ? `, ${p.from} a ${p.to}` : ''}): ${vehicles.filter((v) => p.prices[v.id]).map((v) => `${v.short} ${p.prices[v.id]} €`).join(' · ')}`)] : []),
    '',
    '## Condiciones',
    ...rates.conditions.map((c) => `- ${c.k}: ${c.v.replace(/\.$/, "")}.`),
    ...pricing.payment.map((p) => `- Pago: ${p}`),
    ...pricing.cancellation.map((p) => `- Cancelación: ${p}`),
    '- Requisitos: carnet B con 5 años de antigüedad y 25 años de edad mínima.',
    `- Horario de oficina: ${site.hours}.`,
    `- Condiciones completas: ${u('/requisitos-condiciones-de-uso-y-terminos/')}`,
    `- Tarifas: ${u('/tarifas/')}`,
    '',
    ...(activeOffers.length ? ['## Ofertas activas', ...activeOffers.map((o) => `- ${o.title}${o.price ? ` (${o.vehicle ? o.vehicle + ', ' : ''}desde ${o.price} €/día)` : ''}: ${o.text} Válida hasta ${o.until}.`), `- Todas las ofertas: ${u('/ofertas-alquiler-autocaravana-sevilla/')}`, ''] : []),
    '## Planes y escapadas desde Sevilla',
    `- Fin de semana: ${u('/alquiler-autocaravana-fin-de-semana-sevilla/')}`,
    `- Puentes y festivos: ${u('/alquiler-autocaravana-puente-sevilla/')}`,
    `- Fútbol y eventos (Sevilla FC, Real Betis, Bernabéu, conciertos): ${u('/alquiler-autocaravana-eventos-futbol-sevilla/')}`,
    `- Alquiler de camper en Sevilla: ${u('/alquiler-camper-sevilla/')}`,
    ...rutas.map((r) => `- Ruta: ${r.title} (${r.days}, ${r.km}): ${u(`/rutas/${r.slug}/`)}`),
    '',
    '## Preguntas frecuentes',
    ...faqs.flatMap((f) => [`### ${px(f.q)}`, px(f.a), '']),
    '## Contacto y reservas',
    `- Teléfono y WhatsApp: ${site.phoneDisplay} (${site.phone})`,
    `- Email: ${site.email}`,
    `- Dirección: ${site.address.street}, ${site.address.postalCode} ${site.address.city} (Sevilla)`,
    `- Google Maps: ${site.mapsUrl}`,
    `- Disponibilidad en tiempo real: ${u('/calendario-disponibilidad/')}`,
    `- Contacto: ${u('/contacto/')}`,
    `- Instagram: ${site.social.instagram}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
