import type { ImageMetadata } from 'astro';
import type { SeasonKey } from './site';

import mileoHero from '../assets/img/benimar-mileo-268-alquiler-sevilla.jpg';
import mileoLateral from '../assets/img/mileo-268-lateral.jpg';
import mileoDetalle from '../assets/img/mileo-268-exterior-detalle.jpg';
import mileoSalon from '../assets/img/mileo-268-salon-comedor.jpg';
import mileoBasculante from '../assets/img/mileo-268-cama-basculante.jpg';
import mileoCamas from '../assets/img/mileo-268-camas-gemelas.jpg';
import mileoCocina from '../assets/img/mileo-268-cocina.jpg';
import mileoBano from '../assets/img/mileo-268-bano.jpg';
import mileoDucha from '../assets/img/mileo-268-ducha.jpg';
import mileoFrigo from '../assets/img/mileo-268-frigorifico.jpg';
import mileoGaraje from '../assets/img/mileo-268-garaje.jpg';
import mileoCabina from '../assets/img/mileo-268-interior-cabina.jpg';
import mileoPanel from '../assets/img/mileo-268-panel-control.jpg';

import camperHero from '../assets/img/camper-120-up-alquiler-sevilla.jpg';
import camperExt from '../assets/img/camper-120-up-exterior.jpg';
import camperInt from '../assets/img/camper-120-up-interior.jpg';
import camperComedor from '../assets/img/camper-120-up-comedor.jpg';
import camperSalon from '../assets/img/camper-120-up-salon.jpg';
import camperCocina from '../assets/img/camper-120-up-cocina.jpg';
import camperCama from '../assets/img/camper-120-up-cama.jpg';
import camperBano from '../assets/img/camper-120-up-bano.jpg';
import camperLitera from '../assets/img/camper-120-up-litera.jpg';

export type Vehicle = {
  id: 'mileo' | 'camper';
  name: string;
  short: string;
  type: string;
  slug: string;
  /** URL propia del calendario de disponibilidad de este vehículo. */
  calSlug: string;
  tagline: string;
  idealFor: string;
  /** ID del Google Calendar de disponibilidad. Añade eventos ("Reservado") para marcar días ocupados. */
  calendarId: string;
  prices: Record<SeasonKey, { short: number; long: number }>;
  hero: ImageMetadata;
  gallery: { src: ImageMetadata; alt: string }[];
  keyFacts: { label: string; value: string }[];
  highlights: string[];
  equipment: { group: string; items: string[] }[];
};

const includedKit = [
  'Menaje de cocina y cubertería',
  'Mesa y sillas de camping',
  'Bombona de gas propano',
  'Manguera con acoples y alargadera 220 V',
  'Pastillas químicas para el WC',
  'Kit de limpieza',
  'Calzos de nivelación',
  'Extintor, botiquín, chalecos y triángulos',
  'Parasoles de cabina',
  'Manual de uso del vehículo',
];

export const vehicles: Vehicle[] = [
  {
    id: 'mileo',
    name: 'Benimar Mileo 268',
    short: 'Mileo 268',
    type: 'Autocaravana perfilada',
    slug: '/alquilar-benimar-mileo-268/',
    calSlug: '/calendario-disponibilidad/benimar-mileo-268/',
    tagline: 'Autocaravana perfilada para 4 con camas gemelas, cama basculante y gran garaje',
    idealFor: 'Familias, dos parejas o quien busca máximo confort y espacio',
    calendarId: '235592fc8ab3959379d75357f22c526540195f14ecce48755c40dd889140119a@group.calendar.google.com',
    prices: {
      baja: { short: 150, long: 140 },
      media: { short: 160, long: 150 },
      especial: { short: 175, long: 165 },
      alta: { short: 180, long: 170 },
    },
    hero: mileoHero,
    gallery: [
      { src: mileoHero, alt: 'Autocaravana Benimar Mileo 268 de alquiler en Sevilla' },
      { src: mileoSalon, alt: 'Salón comedor face to face de la Mileo 268' },
      { src: mileoCamas, alt: 'Camas gemelas traseras convertibles en cama doble' },
      { src: mileoBasculante, alt: 'Cama basculante eléctrica delantera de la Mileo 268' },
      { src: mileoCocina, alt: 'Cocina equipada de la autocaravana Mileo 268' },
      { src: mileoBano, alt: 'Baño completo de la Benimar Mileo 268' },
      { src: mileoDucha, alt: 'Ducha independiente de la Mileo 268' },
      { src: mileoFrigo, alt: 'Frigorífico de gran capacidad' },
      { src: mileoCabina, alt: 'Interior de la Mileo 268 visto hacia la cabina' },
      { src: mileoGaraje, alt: 'Garaje trasero para maletas, bicis o sillas' },
      { src: mileoPanel, alt: 'Panel de control y calefacción Truma' },
      { src: mileoLateral, alt: 'Vista lateral de la Benimar Mileo 268' },
      { src: mileoDetalle, alt: 'Detalle exterior de la Benimar Mileo' },
    ],
    keyFacts: [
      { label: 'Plazas viaje', value: '4' },
      { label: 'Plazas dormir', value: '4' },
      { label: 'Motor', value: 'Fiat 2.2 · 140 CV' },
      { label: 'Cambio', value: 'Manual 6 vel.' },
      { label: 'Carnet', value: 'B (turismo)' },
      { label: 'Altura', value: '≈ 3 m' },
    ],
    highlights: [
      'Camas gemelas traseras convertibles en cama doble de 170 × 210 cm',
      'Cama basculante eléctrica delantera (≈ 140 × 191 cm)',
      'Salón face to face para 4-5 comensales y techo panorámico',
      'Baño completo con ducha independiente y agua caliente',
      'Calefacción Truma Combi y depósito de aguas sucias de 105 L',
      'Gran garaje trasero: bicis, sillas, maletas…',
    ],
    equipment: [
      {
        group: 'Conducción y seguridad',
        items: [
          'Cámara de marcha atrás y sensor de aparcamiento',
          'Control de crucero con limitador',
          'Asistente de mantenimiento de carril y frenada de emergencia',
          'Reconocimiento de señales y detector de fatiga',
          'ABS, ESP y Tracción Plus',
          'Radio DAB Pioneer 9" con pantalla',
        ],
      },
      {
        group: 'Vivienda',
        items: [
          'Cocina con fogones, fregadero y frigorífico',
          'Calefacción Truma (gas / 230 V) y agua caliente',
          'TV y tomas de 230 V',
          'Techo panorámico practicable y claraboyas',
          'Mosquiteras y oscurecedores',
        ],
      },
      { group: 'Incluido en el alquiler', items: includedKit },
    ],
  },
  {
    id: 'camper',
    name: 'Benimar Camper 120 UP',
    short: 'Camper 120 UP',
    type: 'Furgoneta camper',
    slug: '/alquilar-camper-120-up/',
    calSlug: '/calendario-disponibilidad/camper-120-up/',
    tagline: 'Camper compacta de 6 m, fácil de conducir y aparcar, con baño, ducha y placa solar',
    idealFor: 'Parejas, escapadas de fin de semana y rutas por pueblos y ciudad',
    calendarId: 'f6f9f6470262a216a4f427c88590f67ea14e2085f12bb1443ce7095eec59d732@group.calendar.google.com',
    prices: {
      baja: { short: 120, long: 110 },
      media: { short: 130, long: 120 },
      especial: { short: 145, long: 130 },
      alta: { short: 150, long: 135 },
    },
    hero: camperHero,
    gallery: [
      { src: camperHero, alt: 'Camper Benimar 120 UP de alquiler en Sevilla recorriendo un pueblo andaluz' },
      { src: camperExt, alt: 'Furgoneta camper 120 UP aparcada en el campo' },
      { src: camperInt, alt: 'Interior de la camper 120 UP con comedor' },
      { src: camperComedor, alt: 'Comedor con asientos de cabina giratorios' },
      { src: camperSalon, alt: 'Salón trasero de la camper convertible en cama' },
      { src: camperCocina, alt: 'Cocina monobloc con fregadero y fogones' },
      { src: camperCama, alt: 'Cama doble de la camper Benimar 120 UP' },
      { src: camperLitera, alt: 'Litera trasera desmontable' },
      { src: camperBano, alt: 'Baño con ducha de la camper 120 UP' },
    ],
    keyFacts: [
      { label: 'Plazas viaje', value: '4' },
      { label: 'Plazas dormir', value: '2 / 4' },
      { label: 'Longitud', value: '≈ 6 m' },
      { label: 'Motor', value: 'Fiat 2.2 · 140 CV' },
      { label: 'Cambio', value: 'Manual 6 vel.' },
      { label: 'Carnet', value: 'B (turismo)' },
    ],
    highlights: [
      'Solo 6 metros: entra en cualquier aparcamiento de turismo largo',
      'Cama doble + litera trasera desmontable (hasta 4 personas)',
      'Baño con ventana, ducha y agua caliente',
      'Frigorífico de compresor de 138 L',
      'Placa solar de 120 W: autonomía sin enchufe',
      'Claraboya 70 × 50 cm, toldo lateral y mosquitera',
    ],
    equipment: [
      {
        group: 'Conducción y seguridad',
        items: [
          'Cámara de marcha atrás',
          'Control de crucero',
          'ABS, ESP y airbags',
          'Radio DAB Pioneer 9"',
          'Chasis Fiat Ducato 3.500 kg',
        ],
      },
      {
        group: 'Vivienda',
        items: [
          'Cocina monobloc con 2 fuegos y fregadero',
          'Frigorífico de compresor 138 L',
          'Calefacción Truma y agua caliente',
          'Ventanas de doble vidrio e iluminación LED',
          'Toma de 230 V y placa solar 120 W',
          'Toldo lateral y mosquitera plisada',
        ],
      },
      { group: 'Incluido en el alquiler', items: includedKit },
    ],
  },
];

export const getVehicle = (id: Vehicle['id']) => vehicles.find((v) => v.id === id)!;
export const fromPrice = (v: Vehicle) => Math.min(...Object.values(v.prices).map((p) => p.long));

/**
 * Sustituye marcadores de precio en textos (títulos, descripciones, FAQ…)
 * por los precios actuales (los de Google Sheets si están configurados):
 *   {camper.desde} {mileo.desde} {all.desde}      precio "desde" (el más bajo)
 *   {camper.max} {all.max}                         precio/día más alto
 *   {camper.min}                                   precio/día más bajo de 3-14 días
 *   {mileo.media.short} {camper.baja.long}         precio de una temporada
 *   {camper.baja.x3} {mileo.media.x7} {mileo.alta.long.x15}   totales por días
 */
export function px(text: string): string {
  const eur = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return text.replace(/\{(mileo|camper|all)\.([a-z]+)(?:\.([a-z]+))?(?:\.?x(\d+))?\}/g, (m, id, a, b, times) => {
    const list = id === 'all' ? vehicles : [getVehicle(id)];
    const shorts = list.flatMap((v) => Object.values(v.prices).map((p) => p.short));
    let n: number | undefined;
    if (a === 'desde') n = Math.min(...list.map(fromPrice));
    else if (a === 'max') n = Math.max(...shorts);
    else if (a === 'min') n = Math.min(...shorts);
    else if (id !== 'all') {
      const p = (getVehicle(id).prices as any)[a];
      const kind = b === 'long' ? 'long' : 'short';
      if (p) n = p[kind];
      if (n && times) n *= Number(times);
    }
    return n ? eur(n) : m;
  });
}
