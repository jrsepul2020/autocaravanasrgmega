/**
 * ============================================================
 *  CONFIGURACIÓN CENTRAL DE LA WEB — RG MEGA AUTOCARAVANAS
 *  Todo lo que el administrador puede cambiar está aquí.
 * ============================================================
 */

export const site = {
  name: 'RG MEGA Autocaravanas',
  shortName: 'RG MEGA',
  url: 'https://autocaravanasrgmega.com',
  phone: '+34663638810',
  phoneDisplay: '663 63 88 10',
  whatsapp: '34663638810',
  email: 'autocaravanasrgmega@gmail.com',
  address: {
    street: 'Polígono Empresarial Los Llanos, C/ Extremadura 133',
    city: 'Salteras',
    region: 'Sevilla',
    postalCode: '41909',
    country: 'ES',
  },
  hours: 'Lunes a domingo, de 9:00 a 22:00',
  hoursSchema: { opens: '09:00', closes: '22:00' },
  // Distancia orientativa al centro de Sevilla
  distanceToSevilla: '15 minutos del centro de Sevilla',

  /* ---------- Google Business Profile ---------- */
  // Enlace "Cómo llegar" / ficha de Google Maps
  mapsUrl: 'https://maps.app.goo.gl/cWAUWQo41G5M5MXa9',
  // Pega aquí el enlace para escribir reseña (Google Business > "Pedir reseñas")
  gbpReviewUrl: 'https://maps.app.goo.gl/cWAUWQo41G5M5MXa9',
  // Mapa embebido (búsqueda por dirección). Puedes sustituirlo por el iframe "Compartir > Insertar mapa" de tu ficha
  mapEmbed:
    'https://www.google.com/maps?q=Calle+Extremadura+133,+41909+Salteras,+Sevilla&output=embed',

  /* ---------- Redes ---------- */
  social: {
    instagram: 'https://www.instagram.com/autocaravanas_rgmega/',
    facebook: 'https://www.facebook.com/profile.php?id=61578008153036',
    tiktok: 'https://www.tiktok.com/@autocaravanas_rgmega',
    x: 'https://x.com/rgmega_caravana',
  },
  instagramHandle: '@autocaravanas_rgmega',

  /* ---------- Instagram (LightWidget) ---------- */
  // En lightwidget.com > tu widget > "Get code": copia el ID que aparece en
  // //lightwidget.com/widgets/XXXXXXXXXXXX.html  y pégalo aquí.
  lightwidgetId: '5bad89c1a8985b09af5e0aadb17032c7',

  /* ---------- Formulario ---------- */
  // Clave gratuita de https://web3forms.com (llega al email). Si se deja vacío,
  // el formulario envía la consulta por WhatsApp.
  web3formsKey: '',

  /* ---------- Calendarios de disponibilidad (Google Calendar) ---------- */
  // Clave API de Google (la misma que usaba el plugin de WordPress). Restringe la clave
  // al dominio autocaravanasrgmega.com en Google Cloud Console.
  googleApiKey: 'AIzaSyDfzlEG8xUI9I3tMpK7glS7_wZMNUSTZHM',
};

export const waLink = (text = 'Hola, quiero información sobre el alquiler de autocaravanas') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/* ============================================================
 *  TARIFAS (€/día, IVA incluido). Mínimo 3 días.
 * ============================================================ */
export type SeasonKey = 'baja' | 'media' | 'alta' | 'especial';

export const seasons: Record<SeasonKey, { label: string; when: string; color: string }> = {
  baja: {
    label: 'Temporada baja',
    when: 'De octubre a marzo (excepto Navidad, Gran Premio de Jerez, puentes y festivos)',
    color: '#4F7A64',
  },
  media: {
    label: 'Temporada media',
    when: 'Abril, mayo, del 1 al 15 de junio y del 16 al 30 de septiembre (excepto Semana Santa, Feria, Rocío, puentes y festivos)',
    color: '#FAB02C',
  },
  alta: {
    label: 'Temporada alta',
    when: 'Verano: julio y agosto (y segunda quincena de junio / primera de septiembre)',
    color: '#D62828',
  },
  especial: {
    label: 'Temporada especial',
    when: 'Navidad, Semana Santa, Feria de Sevilla, Romería de El Rocío, Gran Premio de Jerez, puentes y festivos',
    color: '#C2560F',
  },
};

export const pricing = {
  minDays: 3,
  longStayFrom: 15, // a partir de 15 días (más de 14) se aplica la tarifa larga
  km: {
    shortStay: '250 km/día (alquileres de 3 a 7 días)',
    longStay: 'Kilómetros ilimitados en alquileres de más de 7 días',
    excess: '0,40 €/km de exceso',
  },
  payment: [
    'Reserva con más de 30 días de antelación: 50 % al reservar.',
    'Reserva con menos de 30 días de antelación: 100 % al reservar.',
  ],
  cancellation: [
    'Más de 28 días antes de la salida: devolución del 100 %.',
    'Entre 28 y 15 días antes: se retiene el 50 %.',
    'Menos de 15 días antes: no hay devolución.',
  ],
};

/**
 * Fechas de temporada especial (puentes, Navidad, Semana Santa, Feria, Rocío...).
 * Formato AAAA-MM-DD, ambos días incluidos. Revísalas cada año.
 */
export const specialDates: { name: string; from: string; to: string }[] = [
  { name: 'Puente de la Constitución e Inmaculada', from: '2026-12-04', to: '2026-12-08' },
  { name: 'Navidad y Reyes', from: '2026-12-19', to: '2027-01-06' },
  { name: 'Puente de Andalucía', from: '2027-02-26', to: '2027-03-01' },
  { name: 'Semana Santa', from: '2027-03-20', to: '2027-03-28' },
  { name: 'Feria de Abril de Sevilla', from: '2027-04-10', to: '2027-04-18' },
  { name: 'Puente de mayo', from: '2027-04-30', to: '2027-05-02' },
  { name: 'Romería de El Rocío', from: '2027-05-13', to: '2027-05-17' },
  { name: 'Puente de agosto', from: '2027-08-13', to: '2027-08-16' },
  { name: 'Puente del Pilar', from: '2027-10-09', to: '2027-10-12' },
  { name: 'Puente de Todos los Santos', from: '2027-10-30', to: '2027-11-01' },
  { name: 'Puente de la Constitución e Inmaculada', from: '2027-12-04', to: '2027-12-08' },
  { name: 'Navidad y Reyes', from: '2027-12-18', to: '2028-01-06' },
];

/* ---------- Ofertas activas (déjalo vacío [] si no hay) ---------- */
// Respaldo si Google Sheets no responde. vehicle y price son opcionales (etiqueta "Camper 120 UP · desde 110 €/día").
export const offers: { title: string; text: string; until: string; vehicle?: string; price?: number | null }[] = [
  {
    title: 'Puente de diciembre y Navidad',
    text: 'Reserva ya tu autocaravana para el puente de la Constitución o las vacaciones de Navidad. Quedan pocas fechas.',
    until: '2026-12-31',
    vehicle: 'Camper 120 UP',
    price: 145,
  },
  {
    title: 'Invierno a precio de temporada baja',
    text: 'De enero a marzo, en estancias de más de 14 días. La Mileo 268, desde 140 €/día.',
    until: '2027-03-31',
    vehicle: 'Camper 120 UP',
    price: 110,
  },
];

/* ---------- Precio destacado de la portada (respaldo de la pestaña "Portada") ---------- */
// price: null = automático (el precio más bajo de ese vehículo). text vacío = "<vehículo> desde".
export const heroPrice: { vehicle: 'mileo' | 'camper'; text: string; price: number | null } = {
  vehicle: 'camper',
  text: '',
  price: null,
};

/* ---------- Aviso que acompaña a todos los precios ---------- */
export const priceDisclaimer =
  'Precios orientativos. Consulta siempre nuestras ofertas especiales y promociones vigentes.';
