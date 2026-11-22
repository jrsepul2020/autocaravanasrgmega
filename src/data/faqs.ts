import { display } from './site';

export type Faq = { q: string; a: string; tags: string[] };

export const faqs: Faq[] = [
  {
    q: '¿Cuánto cuesta alquilar una autocaravana en Sevilla?',
    // Única respuesta con cifras de precio en las preguntas frecuentes. Con el interruptor "Mostrar precios desde" en NO, sin cifras.
    get a() {
      return display.showFrom
        ? 'En RG MEGA la Camper 120 UP cuesta desde {camper.desde} €/día y la Benimar Mileo 268 desde {mileo.desde} €/día en alquileres de 3–4 días; cuantos más días, más barato sale el día. Puentes, Navidad y Fin de Año tienen tarifa especial. El seguro, la asistencia 24 h y el equipamiento están incluidos. Son precios orientativos: llámanos o pregúntanos por tus fechas o casos concretos.'
        : 'Depende del modelo y de los días de alquiler: cuantos más días, más barato sale el día, y la Camper 120 UP es la opción más económica. El seguro, la asistencia 24 h y el equipamiento están incluidos. Son precios orientativos: llámanos o pregúntanos por tus fechas o casos concretos.';
    },
    tags: ['precio', 'home', 'barata'],
  },
  {
    q: '¿Cuál es el alquiler mínimo?',
    a: 'El alquiler mínimo es de 3 días. Lo más habitual es un fin de semana largo, un puente o una semana; para escapadas más cortas tenemos tarifa de fin de semana (viernes a domingo). Para eventos especiales (un partido del Sevilla o del Betis, ver al Real Madrid en el Bernabéu, un concierto…) consúltanos: nos adaptamos.',
    tags: ['precio', 'finde', 'puente', 'home'],
  },
  {
    q: '¿Puedo alquilar una autocaravana para ir al fútbol o a un evento?',
    a: 'Sí. Es un plan cada vez más habitual: partidos del Sevilla FC o del Real Betis fuera de casa, un fin de semana para ver al Real Madrid en el Santiago Bernabéu, conciertos, el Gran Premio de Jerez o El Rocío. El mínimo general es de 3 días, pero para un partido o un evento concreto llámanos y lo vemos.',
    tags: ['home', 'finde', 'eventos'],
  },
  {
    q: '¿Dónde se recoge y se devuelve la autocaravana?',
    a: 'En nuestras instalaciones del Polígono Empresarial Los Llanos, C/ Extremadura 133, Salteras (Sevilla), a unos 15 minutos del centro de Sevilla por la A-66. La recogida y la devolución son siempre en el mismo punto.',
    tags: ['home', 'recogida', 'finde'],
  },
  {
    q: '¿Puedo dejar mi coche mientras viajo?',
    a: 'Sí. Puedes dejar tu coche en nuestro parking cerrado y cubierto sin ningún coste durante todo el alquiler.',
    tags: ['home', 'recogida', 'finde'],
  },
  {
    q: '¿Qué carnet necesito para conducir la autocaravana?',
    a: 'Basta con el carnet B de turismo. Ambos vehículos tienen un peso máximo de 3.500 kg. El conductor debe tener más de 25 años y al menos 5 años de antigüedad de carnet.',
    tags: ['home', 'requisitos', 'camper'],
  },
  {
    q: '¿Qué incluye el precio del alquiler?',
    a: 'Seguro del vehículo, asistencia en carretera 24 h, menaje de cocina, cubertería, mesa y sillas de camping, manguera y alargadera, bombona de gas, pastillas para el WC y kit de limpieza. Solo tienes que traer ropa de cama y toallas.',
    tags: ['home', 'precio', 'barata'],
  },
  {
    q: '¿Cuántos kilómetros están incluidos?',
    a: 'El alquiler incluye hasta 250 km de viaje; a partir de ahí, el exceso se cobra a 0,40 €/km. Si tienes pensada una ruta larga, cuéntanosla y lo ajustamos.',
    tags: ['precio', 'finde', 'puente'],
  },
  {
    q: '¿Puedo viajar con mi perro?',
    a: 'Sí, las mascotas viajan gratis. Solo te pedimos que te hagas responsable de cualquier desperfecto que pudieran causar.',
    tags: ['home', 'finde', 'camper'],
  },
  {
    q: '¿Puedo recoger o devolver la autocaravana en fin de semana o festivo?',
    a: 'Nuestro horario de oficina es de lunes a viernes, de 9:00 a 18:00. Si necesitas recoger o devolver la autocaravana en fin de semana, festivo o fuera de ese horario, consúltanos y pactamos contigo la hora.',
    tags: ['finde', 'puente', 'recogida'],
  },
  {
    q: '¿Cómo reservo y cómo se paga?',
    a: 'Consulta la disponibilidad en el calendario y escríbenos por WhatsApp, teléfono o el formulario. Si reservas con más de 30 días de antelación abonas el 50 %; con menos de 30 días, el 100 %.',
    tags: ['home', 'precio'],
  },
  {
    q: '¿Qué pasa si tengo que cancelar?',
    a: 'Si cancelas con más de 28 días de antelación te devolvemos el 100 %. Entre 28 y 15 días se retiene el 50 %, y con menos de 15 días no hay devolución.',
    tags: ['precio', 'puente'],
  },
  {
    q: '¿Es difícil conducir una autocaravana si es la primera vez?',
    a: 'No. Se conduce como una furgoneta grande, con cámara trasera y ayudas a la conducción. Antes de salir te explicamos con calma el funcionamiento de todo (agua, gas, electricidad, calefacción) y estamos disponibles por teléfono durante todo el viaje.',
    tags: ['home', 'camper', 'finde'],
  },
  {
    q: '¿Dónde puedo dormir y aparcar con la autocaravana?',
    a: 'Puedes aparcar donde aparca un turismo salvo prohibición expresa. Para pernoctar te recomendamos áreas de autocaravanas y campings; la app Park4night es muy útil. Sacar toldo, mesas o sillas solo está permitido en zonas de acampada.',
    tags: ['rutas', 'finde'],
  },
  {
    q: '¿Cada cuánto hay que vaciar y llenar los depósitos?',
    a: 'Las autocaravanas tienen tres depósitos: agua limpia, aguas grises y aguas negras (WC químico). Normalmente hay que vaciarlos y rellenar agua cada 2-4 días en un área de servicio.',
    tags: ['rutas'],
  },
  {
    q: '¿Alquiláis autocaravanas por meses o a largo plazo?',
    a: 'Sí. A partir de 7 días se aplica nuestra tarifa más baja por día, y para alquileres de un mes o más te hacemos un presupuesto personalizado.',
    tags: ['precio', 'barata'],
  },
  {
    q: '¿Se puede fumar dentro?',
    a: 'No, está prohibido fumar en el interior de los vehículos.',
    tags: ['requisitos'],
  },
];

export const faqsBy = (tag: string, max = 8) => faqs.filter((f) => f.tags.includes(tag)).slice(0, max);
