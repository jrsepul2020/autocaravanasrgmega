/**
 * Datos clave del negocio en frases cortas y citables.
 * Los usan el bloque "Datos clave" de la web y /llms.txt (pensados para buscadores con IA).
 * Se calculan al compilar, con los precios de Google Sheets si están disponibles.
 */
import { site, display } from './site';
import { rates, condition } from './rates';
import { getVehicle, fromPrice } from './vehicles';

export function keyFacts() {
  const c = getVehicle('camper'), m = getVehicle('mileo');
  return [
    { k: 'Qué', v: `Alquiler de autocaravanas y campers en Sevilla. Empresa local con dos vehículos Benimar: ${m.name} (${m.type.toLowerCase()}, 4 plazas) y ${c.name} (${c.type.toLowerCase()}, 4 plazas).` },
    { k: 'Dónde', v: `Recogida y devolución en ${site.address.street}, ${site.address.postalCode} ${site.address.city} (Sevilla), a ${site.distanceToSevilla}. Polígono cerrado y protegido, al lado de Santiponce y muy cerca de Itálica.` },
    { k: 'Precio', v: display.showFrom && fromPrice(c) && fromPrice(m)
      ? `${c.short} desde ${fromPrice(c)} €/día y ${m.short} desde ${fromPrice(m)} €/día (alquiler de 3–4 días); el precio por día baja cuantos más días alquilas. Orientativos, con IVA: llámanos o pregúntanos por tus fechas o casos concretos.`
      : 'Según el modelo y los días de alquiler, con IVA. Son orientativos: llámanos o pregúntanos por tus fechas o casos concretos.' },
    { k: 'Mínimo', v: condition(rates, 'minimo') || 'Consúltanos' },
    { k: 'Kilómetros', v: [condition(rates, 'kilometros'), condition(rates, 'exceso') && `exceso ${condition(rates, 'exceso')}`].filter(Boolean).join('; ') },
    { k: 'Incluido', v: 'Seguro, asistencia en carretera 24 h, menaje, mesa y sillas, gas y kit de limpieza. Mascotas y parking para tu coche gratis.' },
    { k: 'Requisitos', v: 'Carnet B de coche con 5 años de antigüedad y 25 años de edad mínima.' },
    { k: 'Horario', v: `${site.hours}. Entrega y devolución fuera de horario, a convenir.` },
    { k: 'Contacto', v: `Teléfono y WhatsApp ${site.phoneDisplay} · ${site.email}` },
  ];
}
