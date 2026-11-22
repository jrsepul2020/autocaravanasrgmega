export type Ruta = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  days: string;
  km: string;
  ideal: string;
  vehicle: 'mileo' | 'camper';
  intro: string;
  stages: { name: string; text: string }[];
  tips: string[];
};

export const rutas: Ruta[] = [
  {
    slug: 'costa-de-cadiz-en-autocaravana',
    title: 'Ruta por la costa de Cádiz en autocaravana desde Sevilla',
    metaTitle: 'Ruta en Autocaravana por la Costa de Cádiz desde Sevilla (4-5 días)',
    description: 'Ruta en autocaravana o camper desde Sevilla por la costa de Cádiz: Sanlúcar, El Puerto, Conil, Zahara, Bolonia y Tarifa. Etapas, áreas y consejos.',
    days: '4-5 días',
    km: '≈ 450 km',
    ideal: 'Playa, surf y atardeceres',
    vehicle: 'camper',
    intro: 'La costa de Cádiz es la escapada estrella desde Sevilla: en hora y media estás frente al Atlántico, con playas salvajes, pueblos blancos y algunas de las mejores puestas de sol de Europa.',
    stages: [
      { name: 'Sevilla → Sanlúcar de Barrameda (1 h)', text: 'Langostinos en Bajo de Guía, manzanilla y vistas a Doñana desde la desembocadura del Guadalquivir.' },
      { name: 'Sanlúcar → El Puerto de Santa María → Cádiz (45 min)', text: 'Paseo por el casco antiguo de Cádiz y la playa de La Caleta al atardecer.' },
      { name: 'Cádiz → Conil de la Frontera (40 min)', text: 'Playas de La Fontanilla y El Palmar, el pueblo blanco y su ambiente veraniego.' },
      { name: 'Conil → Zahara de los Atunes → Bolonia (45 min)', text: 'Las ruinas romanas de Baelo Claudia y la gran duna de Bolonia, imprescindibles.' },
      { name: 'Bolonia → Tarifa → regreso a Sevilla (2 h 15)', text: 'El punto más al sur de Europa, kitesurf en Valdevaqueros y vuelta por la A-381.' },
    ],
    tips: [
      'En verano, muchos municipios de la costa prohíben pernoctar en primera línea: usa campings o áreas de autocaravanas.',
      'La Camper 120 UP es ideal para esta ruta: cabe en los aparcamientos de playa y en las calles estrechas.',
      'Fuera del verano tendrás las playas casi para ti.',
    ],
  },
  {
    slug: 'huelva-donana-sierra-de-aracena',
    title: 'Ruta por Doñana, la costa de Huelva y la Sierra de Aracena',
    metaTitle: 'Ruta en Autocaravana por Huelva: Doñana y Sierra de Aracena desde Sevilla',
    description: 'Ruta circular en autocaravana desde Sevilla: El Rocío, Doñana, Matalascañas, Mazagón, Huelva y Sierra de Aracena. Naturaleza, playa y gastronomía en 4-6 días.',
    days: '4-6 días',
    km: '≈ 400 km',
    ideal: 'Naturaleza y gastronomía',
    vehicle: 'mileo',
    intro: 'Una ruta circular que combina el Parque Nacional de Doñana, las playas vírgenes de Huelva y los pueblos de montaña de la Sierra de Aracena. Perfecta en primavera y otoño.',
    stages: [
      { name: 'Sevilla → El Rocío (1 h)', text: 'Calles de arena, la ermita y las marismas llenas de flamencos al amanecer.' },
      { name: 'El Rocío → Matalascañas → Mazagón (45 min)', text: 'Kilómetros de playa salvaje bajo acantilados de arena y pinares.' },
      { name: 'Mazagón → Huelva → Minas de Riotinto (1 h 15)', text: 'El paisaje marciano del río Tinto y el parque minero.' },
      { name: 'Riotinto → Aracena → Alájar (1 h)', text: 'Gruta de las Maravillas, jamón ibérico y senderos entre castaños.' },
      { name: 'Sierra de Aracena → Sevilla (1 h 15)', text: 'Regreso por la N-433, con parada en Santa Olalla del Cala.' },
    ],
    tips: [
      'Evita la semana de la Romería de El Rocío si buscas tranquilidad (o resérvala con mucha antelación si vas a la romería).',
      'En otoño e invierno la calefacción Truma de la Mileo 268 te mantendrá caliente en la sierra.',
      'Hay áreas de autocaravanas en Aracena y Mazagón.',
    ],
  },
  {
    slug: 'algarve-portugal-en-autocaravana',
    title: 'Ruta al Algarve (Portugal) en autocaravana desde Sevilla',
    metaTitle: 'Ruta en Autocaravana al Algarve desde Sevilla (5-7 días)',
    description: 'Viaja en autocaravana de Sevilla al Algarve portugués: Tavira, Faro, Benagil, Lagos y Sagres. Etapas, peajes y consejos para tu ruta en camper.',
    days: '5-7 días',
    km: '≈ 650 km',
    ideal: 'Calas, acantilados y pueblos marineros',
    vehicle: 'mileo',
    intro: 'En poco más de dos horas cruzas a Portugal y llegas a uno de los destinos favoritos de los autocaravanistas europeos: el Algarve, con calas de roca dorada, pueblos marineros y una enorme red de áreas de servicio.',
    stages: [
      { name: 'Sevilla → Ayamonte → Tavira (1 h 45)', text: 'Cruza el Guadiana y descubre la Tavira de tejados a cuatro aguas y la Ilha de Tavira.' },
      { name: 'Tavira → Faro → Ria Formosa (40 min)', text: 'Casco amurallado de Faro y paseo en barco por la laguna.' },
      { name: 'Faro → Benagil → Carvoeiro (50 min)', text: 'La famosa cueva de Benagil (en kayak) y el sendero de los Siete Valles Colgantes.' },
      { name: 'Carvoeiro → Lagos → Ponta da Piedade (40 min)', text: 'Los acantilados más fotografiados del Algarve.' },
      { name: 'Lagos → Sagres → Sevilla (3 h 45)', text: 'El cabo de São Vicente al atardecer y vuelta por la A22 / A-49.' },
    ],
    tips: [
      'La autopista A22 tiene peaje electrónico: activa el sistema de pago para matrículas extranjeras al cruzar la frontera.',
      'Si quieres alargar hasta el Alentejo, cuéntanos la ruta: lo tenemos en cuenta en el kilometraje.',
      'En Portugal la pernocta fuera de áreas y campings está regulada: respeta las señales.',
    ],
  },
];
