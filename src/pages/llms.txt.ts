/**
 * /llms.txt — resumen de la web para buscadores y asistentes con IA (ChatGPT, Perplexity, Gemini…).
 * Se genera al compilar con los datos actuales (precios de Google Sheets incluidos).
 * Formato: https://llmstxt.org
 */
import type { APIRoute } from 'astro';
import '../data/remote';
import { site, pricing, offers, specialDates } from '../data/site';
import { vehicles, fromPrice } from '../data/vehicles';
import { faqs } from '../data/faqs';
import { rutas } from '../data/rutas';
import { px } from '../data/vehicles';
import { keyFacts } from '../data/facts';

export const GET: APIRoute = () => {
  const u = (p: string) => new URL(p, site.url).href;
  const today = new Date().toISOString().slice(0, 10);
  const seasonName: Record<string, string> = { baja: 'Temporada baja', media: 'Temporada media', alta: 'Temporada alta', especial: 'Temporada especial (puentes, Navidad, Semana Santa, Feria, Rocío)' };
  const activeOffers = offers.filter((o) => o.until >= today);

  const lines: string[] = [
    `# ${site.gbp.name} — Alquiler de autocaravanas en Sevilla`,
    '',
    `> Empresa local de alquiler de autocaravanas y campers con recogida y devolución en Salteras (Sevilla), a ${site.distanceToSevilla}. Dos vehículos Benimar: Mileo 268 y Camper 120 UP. Alquiler desde ${Math.min(...vehicles.map(fromPrice))} €/día con seguro, asistencia 24 h, mascotas y parking gratis.`,
    '',
    `Última actualización: ${today}. Precios orientativos con IVA; consulta siempre ofertas y disponibilidad.`,
    '',
    '## Datos clave',
    ...keyFacts().map((f) => `- **${f.k}:** ${f.v}`),
    '',
    '## Autocaravanas',
    ...vehicles.flatMap((v) => [
      `### ${v.name} (${v.type})`,
      `- Ficha: ${u(v.slug)}`,
      `- ${v.tagline}. Ideal para: ${v.idealFor}.`,
      `- ${v.keyFacts.map((f) => `${f.label}: ${f.value}`).join(' · ')}`,
      `- Precio por día (3-14 días / 15 días o más):`,
      ...(['baja', 'media', 'alta', 'especial'] as const).map((k) => `  - ${seasonName[k]}: ${v.prices[k].short} € / ${v.prices[k].long} €`),
      '',
    ]),
    '## Condiciones',
    `- Alquiler mínimo: ${pricing.minDays} días.`,
    `- Kilometraje: ${pricing.km.shortStay}. ${pricing.km.longStay}. Exceso: ${pricing.km.excess}.`,
    ...pricing.payment.map((p) => `- Pago: ${p}`),
    ...pricing.cancellation.map((p) => `- Cancelación: ${p}`),
    '- Requisitos: carnet B con 5 años de antigüedad y 25 años de edad mínima.',
    `- Horario de oficina: ${site.hours}.`,
    `- Condiciones completas: ${u('/requisitos-condiciones-de-uso-y-terminos/')}`,
    `- Tarifas: ${u('/tarifas/')}`,
    '',
    ...(specialDates.length ? ['## Fechas de temporada especial', ...specialDates.filter((d) => d.to >= today).map((d) => `- ${d.name}: ${d.from} a ${d.to}`), ''] : []),
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
